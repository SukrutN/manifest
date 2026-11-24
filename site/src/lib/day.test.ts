import assert from "node:assert/strict";
import { ORDER, SEATS, WALK, PLAN, RELEASES, VERDICTS, LANE_ROWS, CLOSING } from "./day.ts";

// The site replays a real harness run; these locks are the run's own
// figures. If a number moves here or in day.ts, the build fails.

assert.equal(ORDER.bytes, 293);
assert.ok(ORDER.payload.includes('"id": "MR-204"'));
assert.ok(ORDER.payload.includes('"house": "Merrow Chandlery"'));
assert.equal((ORDER.payload.match(/CIN-06-W/g) ?? []).length, 1);

assert.equal(SEATS.readingBytes, 30496);
assert.equal(SEATS.dayName, "Harbor & Lane day 07");
assert.deepEqual(SEATS.policies, ["velocity", "affinity", "random"]);
assert.ok(SEATS.digest.includes('"readingBytes":30496'));

assert.equal(WALK.distanceM, 110.0);
assert.equal(WALK.sweepM, 150.8);
assert.equal(WALK.savedM, 40.8);
assert.ok(WALK.text.includes("Planned   110.0 m   1 min 36 sec"));
assert.ok(WALK.text.includes("5   CIN-06-W    Cinder        20.2  rear"));

assert.equal(PLAN.cost, 69);
assert.equal(PLAN.gap, 0);
assert.equal(PLAN.icbsExpanded, 23);
assert.ok(PLAN.head.includes("ICBS        sum 69  gap 0  expanded 23  solved"));
assert.ok(PLAN.head.includes("prioritized sum —  gap —  expanded 72"));

assert.equal(RELEASES.length, 2);
assert.ok(RELEASES[0].payload.includes('"gate":2'));
assert.ok(RELEASES[1].payload.includes('"law":true'));

assert.equal(VERDICTS.length, 2);
assert.equal(VERDICTS[0].state, "vetoed");
assert.equal(VERDICTS[0].gate, 3);
assert.equal(VERDICTS[0].class, 3);
assert.equal(VERDICTS[1].state, "accepted");
assert.equal(VERDICTS[1].gate, 1);
assert.equal(VERDICTS[1].class, 1);
for (const v of VERDICTS) {
  assert.equal(v.latency_ms, 1600.0);
  assert.ok(["accepted", "vetoed", "refused", "expired"].includes(v.state));
}

assert.equal(LANE_ROWS.length, 8);
assert.equal(LANE_ROWS.filter((r) => r.lane === "fluxline").length, 4);
assert.equal(LANE_ROWS.filter((r) => r.lane === "fluxline" && r.kind === "veto").length, 1);
assert.equal(LANE_ROWS.filter((r) => r.lane === "fluxline" && r.kind === "ok").length, 1);
assert.ok(LANE_ROWS[6].payload.includes('"state":"vetoed","gate":3'));
assert.ok(LANE_ROWS[7].payload.includes('"state":"accepted","gate":1'));

assert.ok(CLOSING.includes("exit 0"));

console.log("day tests passed - the run's figures hold");
