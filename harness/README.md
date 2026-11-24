# The harness

Runs one order's day through the five systems, end to end, with real
artifacts. Nothing is mocked: the broker is switchyard, the line is
fluxline's twin serving Modbus on :1502, the talker is linehost, the
engines are quay's and hearthlane's jars and northspan's CLI, and every
hop's reading lands on a durable lane exactly as
[docs/orders-day.md](../docs/orders-day.md) describes.

## Prerequisites

- Go 1.25+ (switchyard, spur, linehost)
- JDK 21 (default location `C:\Users\sukru\AppData\Local\jdk21`)
- Maven 3.9+ (default `C:\Users\sukru\tools\apache-maven-3.9.9`)
- .NET SDK 10 (northspan)
- Python 3 (fluxline's host-block model; `pymodbus` only for the next
  increment, the live twin pairing)
- The five repos, at their default locations or passed as parameters

## Run it

```powershell
.\build.ps1      # once: builds every artifact from the real repos
.\run-day.ps1    # the day
```

## What the day proves

1. **The order lands** — `orders.merrow.204.received` on the `orders`
   lane, acked only once its bytes are on disk.
2. **The cartons get seated** — quay's CLI prints the engine's published
   putaway reading; it rides the `slotting` lane.
3. **The walk gets priced** — northspan prices MR-204's route against
   the sweep; the harness asserts the locked figure (110.0 m) before
   publishing.
4. **The fleet gets planned** — hearthlane's joint plan for the
   casting hall, on the `fleet` lane.
5. **The line answers** — the harness drives fluxline's scan-exact
   host-block model (`hostblock.py`, the same model the seeded bench
   drives) with the two cartons: a tall piece asked for L02 is vetoed to
   L03 by the law, and a per-law release is accepted to L01. The
   receipts journal in linehost's exact shape **before** the lane ack.
   The talker and the twin pair live over Modbus (proven to the armed
   command); the controller-in-the-loop round trip is the harness's
   next increment.
6. **The ledger closes** — the script replays all five lanes through
   durable consumers and checks the chain end to end.

Exit code 0 means every claim was on its lane and every figure held.

## Notes

- Each run wipes `harness\data` and brings up a fresh yard, so the day
  is repeatable.
- The watchers under `data\watch-*.txt` are the raw lane replays, kept
  for inspection after the run.
