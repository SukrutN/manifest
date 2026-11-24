# Builds every artifact the day needs, from the five repos, unmodified.
param(
  [string]$JavaHome = "C:\Users\sukru\AppData\Local\jdk21",
  [string]$Maven = "C:\Users\sukru\tools\apache-maven-3.9.9\bin\mvn.cmd",
  [string]$Quay = "C:\Users\sukru\quay",
  [string]$Hearthlane = "C:\Users\sukru\hearthlane",
  [string]$Northspan = "C:\Users\sukru\northspan",
  [string]$Switchyard = "C:\Users\sukru\switchyard"
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$bin = Join-Path $root 'bin'
New-Item -ItemType Directory -Force $bin | Out-Null

$env:JAVA_HOME = $JavaHome

Write-Host "== quay engine (maven)"
& $Maven -B -f (Join-Path $Quay 'engine') package -DskipTests -q
if ($LASTEXITCODE -ne 0) { throw "quay build failed" }

Write-Host "== hearthlane engine (maven)"
& $Maven -B -f (Join-Path $Hearthlane 'engine') package -DskipTests -q
if ($LASTEXITCODE -ne 0) { throw "hearthlane build failed" }

Write-Host "== northspan cli (dotnet)"
dotnet build (Join-Path $Northspan 'engine\src\Northspan.Cli') -o (Join-Path $bin 'northspan') -v q
if ($LASTEXITCODE -ne 0) { throw "northspan cli build failed" }

Write-Host "== switchyard: broker, spur, linehost (go)"
Push-Location $Switchyard
go build -o "$bin\" .\cmd\switchyard .\cmd\spur .\cmd\linehost
if ($LASTEXITCODE -ne 0) { throw "switchyard build failed" }
Pop-Location

Write-Host "== fluxline twin deps (python)"
pip install "pymodbus>=3.6,<3.7" --quiet --disable-pip-version-check
if ($LASTEXITCODE -ne 0) { throw "twin deps failed" }

Write-Host ""
Write-Host "built: broker, spur, linehost, northspan cli, quay jar, hearthlane jar, twin deps"
