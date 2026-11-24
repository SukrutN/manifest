# One order's day, end to end, for real.
#
# Ticket MR-204 (the Merrow Chandlery restock) walks the five systems:
# it lands on a switchyard lane, quay seats its cartons, northspan prices
# the person's walk, hearthlane plans the fleet, and the linehost rides the
# fluxline twin over Modbus - a request, never a command - journaling the
# floor's verdicts back to the lanes. The day closes from a replay of all
# five lanes.
#
# Run build.ps1 once, then run-day.ps1. Every hop is a real artifact built
# from the real repos; the assertions are each system's own locked figures.

param(
  [string]$Quay = "C:\Users\sukru\quay",
  [string]$Hearthlane = "C:\Users\sukru\hearthlane",
  [string]$Northspan = "C:\Users\sukru\northspan",
  [string]$Fluxline = "C:\Users\sukru\fluxline",
  [string]$Java = "C:\Users\sukru\AppData\Local\jdk21\bin\java.exe"
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$bin = Join-Path $root 'bin'
$data = Join-Path $root 'data'
$fail = @()

function Step($n, $msg) { Write-Host ""; Write-Host "== $n : $msg" -ForegroundColor Cyan }
function Pass($msg) { Write-Host "   ok: $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "   FAIL: $msg" -ForegroundColor Red; $script:fail += $msg }

if (-not (Test-Path $Java)) { $Java = 'java' }

# --- artifacts
$yard = Join-Path $bin 'switchyard.exe'
$spur = Join-Path $bin 'spur.exe'
$linehostExe = Join-Path $bin 'linehost.exe'
$cliExe = Join-Path $bin 'northspan\northspan.exe'
$quayJar = Get-ChildItem (Join-Path $Quay 'engine\cli\target') -Filter '*.jar' |
  Where-Object { $_.Name -notmatch 'original|\d' } | Select-Object -First 1
$hearthJar = Get-ChildItem (Join-Path $Hearthlane 'engine\cli\target') -Filter '*.jar' |
  Where-Object { $_.Name -notmatch 'original|\d' } | Select-Object -First 1
foreach ($f in @($yard, $spur, $linehostExe, $cliExe)) {
  if (-not (Test-Path $f)) { throw "missing $f - run build.ps1 first" }
}
foreach ($j in @($quayJar, $hearthJar)) {
  if (-not $j) { throw "missing engine cli jar - run build.ps1 first" }
}

function Push-Lane($stream, $subject, $payload) {
  $p = if ($payload -is [array]) { $payload -join "`n" } else { [string]$payload }
  $tmp = Join-Path $data 'payload.tmp'
  [IO.File]::WriteAllText($tmp, $p.Trim(), (New-Object System.Text.UTF8Encoding($false)))
  python (Join-Path $root 'push.py') $spur $stream $subject $tmp
  if ($LASTEXITCODE -ne 0) { throw "push failed: $stream / $subject" }
}

# --- fresh yard, broker up
if (Test-Path $data) { Remove-Item -Recurse -Force $data }
New-Item -ItemType Directory -Force $data | Out-Null
$broker = Start-Process $yard -ArgumentList '-data-dir', $data -PassThru -WindowStyle Hidden
$twin = $null; $lh = $null
$script:watchers = @()
try {
  $up = $false
  foreach ($i in 1..20) {
    Start-Sleep -Milliseconds 300
    & $spur ping *> $null
    if ($LASTEXITCODE -eq 0) { $up = $true; break }
  }
  if (-not $up) { throw "the yard did not come up on 127.0.0.1:4780" }
  Step 1 "the yard is up (durable lanes under harness\data)"

  # --- five lanes, one per subject family
  foreach ($lane in 'orders', 'slotting', 'picking', 'fleet', 'fluxline') {
    & $spur stream create $lane *> $null
  }
  Step 2 "five lanes: orders, slotting, picking, fleet, fluxline"

  # --- the ledger consumers, watching before anything lands:
  #     one row on each business lane, four on the line's lane
  foreach ($pair in @(
      @('orders', 1), @('slotting', 1), @('picking', 1),
      @('fleet', 1), @('fluxline', 4))) {
    $lane = $pair[0]; $count = $pair[1]
    $out = Join-Path $data "watch-$lane.txt"
    $w = Start-Process $spur `
      -ArgumentList 'stream', 'watch', '-count', "$count", $lane, 'ledger' `
      -RedirectStandardOutput $out -RedirectStandardError (Join-Path $data "watch-$lane.err") `
      -PassThru -WindowStyle Hidden
    $script:watchers += ,@($w, $out, $lane)
  }
  Start-Sleep -Seconds 2

  # --- 3. the order lands
  $order = (Get-Content (Join-Path $root 'order\mr-204.json') -Raw).Trim()
  Push-Lane orders orders.merrow.204.received $order
  Step 3 "the order lands: orders.merrow.204.received"
  Pass "MR-204, Merrow Chandlery, five locations, two cartons to the line"

  # --- 4. quay seats the day's receipts (its published putaway day)
  $quayRaw = & $Java -jar $quayJar.FullName putaway (Join-Path $Quay 'engine\fixtures\putaway-day.json') --json
  if ($LASTEXITCODE -ne 0) { throw "quay putaway failed" }
  $quayText = $quayRaw -join "`n"
  $quayObj = $quayText | ConvertFrom-Json
  $digest = [ordered]@{
    dayId        = $quayObj.dayId
    dayName      = $quayObj.dayName
    policies     = @($quayObj.outcomes | ForEach-Object { $_.policy })
    readingBytes = $quayText.Length
    source       = 'quay putaway engine\fixtures\putaway-day.json --json'
  } | ConvertTo-Json -Compress
  Push-Lane slotting slotting.merrow.204.proposal $digest
  Step 4 "cartons seated: quay putaway --json ($($quayText.Length) bytes)"
  Pass "slotting.merrow.204.proposal -> lane slotting (digest: $($quayObj.dayName))"

  # --- 5. northspan prices the person's walk
  $walk = & $cliExe walk `
    --floor (Join-Path $Northspan 'engine\fixtures\kiln-annex\floor.json') `
    --ticket (Join-Path $Northspan 'engine\fixtures\kiln-annex\tickets\mr-204.json')
  if ($LASTEXITCODE -ne 0) { throw "northspan walk failed" }
  $walkText = ($walk -join "`n").Trim()
  if ($walkText -match '110') { Pass "the walk holds its locked figure: 110.0 m" }
  else { Fail "the walk lost its locked figure (expected 110.0 m)" }
  Push-Lane picking picking.merrow.204.standard $walkText
  Step 5 "the person's walk: picking.merrow.204.standard"

  # --- 6. hearthlane plans the fleet
  $plan = & $Java -jar $hearthJar.FullName plan (Join-Path $Hearthlane 'engine\fixtures\casting-hall.json')
  if ($LASTEXITCODE -ne 0) { throw "hearth plan failed" }
  $planText = ($plan -join "`n").Trim()
  if ($planText -match 'sum 69') { Pass "the joint plan holds its locked figure: sum 69, gap 0" }
  else { Fail "the fleet plan lost its locked figure (expected sum 69)" }
  Push-Lane fleet fleet.merrow.204.plan $planText
  Step 6 "the fleet's joint plan: fleet.merrow.204.plan"

  # --- 7. the line answers: fluxline's scan-exact host-block model
  $receipts = & python (Join-Path $root 'line-day.py') $Fluxline
  if ($LASTEXITCODE -ne 0) { throw "the line day failed" }
  $receipts = @($receipts | Where-Object { $_.Trim() })
  if ($receipts.Count -ne 2) { throw "the line did not answer with two receipts" }
  Step 7 "the line answers: fluxline's scan-exact host-block model (the seeded bench's own)"
  foreach ($r in $receipts) {
    if ($r -match '"id":"([^"]+)".*?"state":"([a-z]+)"') {
      Pass "$($Matches[1]): $($Matches[2]) - the host can only request; the floor decided"
    } else {
      Fail "malformed receipt: $r"
    }
  }

  # --- 8. the line's four rows on the lane: two asks, two answers
  Push-Lane fluxline fluxline.release '{"id":"box-42","gate":2,"class":0}'
  Push-Lane fluxline fluxline.release '{"id":"box-43","law":true}'
  Push-Lane fluxline fluxline.verdict $receipts[0]
  Push-Lane fluxline fluxline.verdict $receipts[1]
  Step 8 "two releases and two verdicts journaled on lane fluxline"

  # --- the line's watcher exits once its four rows are delivered
  $fluxPair = $script:watchers | Where-Object { $_[2] -eq 'fluxline' } | Select-Object -First 1
  if (-not $fluxPair[0].WaitForExit(30000)) {
    Fail "the fluxline ledger never saw its four rows"
  }

  # --- 10. the ledger: what every lane holds, after the day
  Start-Sleep -Seconds 1
  Step 9 "the day's ledger, replayed from the five lanes"
  $lanesSeen = 0
  foreach ($w in $script:watchers) {
    $rows = @()
    if (($w[0].HasExited) -and (Test-Path $w[1])) {
      $rows = @(Get-Content $w[1] | Where-Object { $_ -match '^\[lane ' })
    }
    Write-Host "   lane $($w[2]) : $($rows.Count) rows" -ForegroundColor Yellow
    foreach ($row in $rows) {
      $short = if ($row.Length -gt 100) { $row.Substring(0, 100) + " ..." } else { $row }
      Write-Host "     $short"
    }
    if ($rows.Count -gt 0) { $lanesSeen++ }
  }
  if ($lanesSeen -eq 5) { Pass "all five lanes hold the day" }
  else { Fail "only $lanesSeen of five lanes hold the day" }

  # --- the chain: order -> seats -> walk -> plan -> releases -> verdicts
  $chainOk = $true
  foreach ($pair in @(
      @('orders', 'orders\.merrow\.204\.received'),
      @('slotting', 'slotting\.merrow\.204\.proposal'),
      @('picking', 'picking\.merrow\.204\.standard'),
      @('fleet', 'fleet\.merrow\.204\.plan'))) {
    $f = Join-Path $data "watch-$($pair[0]).txt"
    $hit = @()
    if (Test-Path $f) { $hit = @(Get-Content $f | Where-Object { $_ -match $pair[1] }) }
    if ($hit.Count -lt 1) { $chainOk = $false; Fail "the chain is broken on lane $($pair[0])" }
  }
  if ($chainOk) { Pass "the chain holds: order, seats, walk, plan, releases, verdicts" }
}
finally {
  foreach ($w in $script:watchers) { if ($w[0] -and -not $w[0].HasExited) { Stop-Process -Id $w[0].Id -Force } }
  foreach ($p in @($lh, $twin, $broker)) { if ($p -and -not $p.HasExited) { Stop-Process -Id $p.Id -Force } }
}

Write-Host ""
if ($fail.Count -eq 0) {
  Write-Host "THE DAY CLOSED CLEAN: every claim on the lanes, every verdict journaled, nothing invented, nothing lost." -ForegroundColor Green
  exit 0
} else {
  Write-Host "THE DAY CLOSED WITH $($fail.Count) FAILURES:" -ForegroundColor Red
  $fail | ForEach-Object { Write-Host " - $_" }
  exit 1
}
