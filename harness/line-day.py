"""The line answers: two cartons through fluxline's scan-exact host block.

box-42 rides a tall piece and asks for L02 (the steel loop); the floor
measures it at the load cell, the law wins, and the piece takes L03 -
vetoed, the seeded bench's own veto walkthrough. box-43 is released per
law and takes L01 - accepted.

Drives sim/hostblock.py, the scan-exact reference model of the ST host
command block - the same model the seeded bench (hostbench.py) drives to
produce the figures the fluxline site locks. Prints one receipt per
carton, in linehost's journal shape, and exits non-zero if the floor
does not answer the way the model's law says it must.

    python line-day.py FLUXLINE_REPO
"""

import json
import os
import sys

fluxline = sys.argv[1]
sys.path.insert(0, os.path.join(fluxline, "engine", "sim"))

from hostblock import HostBlock, OVERRIDE, PER_LAW  # noqa: E402

SCAN_S = 0.1
PITCH = 18          # scans between pieces (1.8 s), the bench's cadence
LC_TRAVEL = 217     # scans from the photo-eye to the load cell
EXIT_TRAVEL = 300   # scans from the photo-eye to the belt end

# The two cartons on the belt: box-42 is tall, box-43 is standard.
pieces = [
    {"id": "box-42", "kind": "tall", "law_class": 3,
     "pe": 0, "lc": LC_TRAVEL, "exit": EXIT_TRAVEL},
    {"id": "box-43", "kind": "standard", "law_class": 1,
     "pe": PITCH, "lc": PITCH + LC_TRAVEL, "exit": PITCH + EXIT_TRAVEL},
]

# The host's two asks: an override toward L02 for the tall piece (the law
# will veto it to L03), and a plain release-per-law for the standard one.
releases = [
    {"seq": 1, "piece": 0, "code": OVERRIDE, "gate": 2, "cls": 0,
     "cmd": LC_TRAVEL - 16, "lc": LC_TRAVEL},
    {"seq": 2, "piece": 1, "code": PER_LAW, "gate": 1, "cls": 0,
     "cmd": PITCH + LC_TRAVEL - 16, "lc": PITCH + LC_TRAVEL},
]

# The same sanity the seeded bench asserts: one release in flight at a
# time, each lead under one pitch, so a bad script fails loudly.
prev = None
for r in releases:
    if prev is not None:
        assert r["cmd"] > prev, \
            "release %d would be refused - still armed" % r["seq"]
    assert r["lc"] - r["cmd"] < PITCH, \
        "release %d would grab the piece before its target" % r["seq"]
    prev = r["lc"]

m = HostBlock(watchdog_s=5.0, scan_s=SCAN_S)
events = []
end = pieces[-1]["exit"]
for t in range(1, end + 1):
    kw = {
        "hb": (t % 32000) + 1,
        "state": 2,   # RUN for the whole shift
        "in_flight": sum(1 for p in pieces if p["pe"] <= t < p["exit"]),
    }
    for r in releases:
        if t == r["cmd"]:
            kw.update(seq=r["seq"], code=r["code"], gate=r["gate"], cls=r["cls"])
    for p in pieces:
        if t == p["lc"]:
            kw["lc_class"] = p["law_class"]
    for e in m.scan(**kw):
        events.append(dict(e, t_s=round(t * SCAN_S, 1)))

receipts = []
for r in releases:
    p = pieces[r["piece"]]
    ev = next(e for e in events
              if e["seq"] == r["seq"] and e["event"] in ("accepted", "vetoed"))
    receipts.append({
        "id": p["id"],
        "seq": r["seq"],
        "state": ev["event"],
        "gate": ev["gate"],
        "class": p["law_class"],
        "latency_ms": round((r["lc"] - r["cmd"]) * SCAN_S * 1000.0, 1),
    })

# The law's own expectations: the tall ask is vetoed to L03, the per-law
# release is accepted to L01. The floor decides; this only asserts what
# the model's law already says, so a drift in either place fails loudly.
assert receipts[0]["state"] == "vetoed" and receipts[0]["gate"] == 3, receipts[0]
assert receipts[1]["state"] == "accepted" and receipts[1]["gate"] == 1, receipts[1]

for receipt in receipts:
    print(json.dumps(receipt, separators=(",", ":")))
