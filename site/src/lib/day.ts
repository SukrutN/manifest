// One order's day, as a real harness run recorded it.
//
// Every figure below comes from `harness/run-day.ps1` executed against
// the five systems: the order's bytes on the journal, the engines' own
// locked readings, and the line's two receipts. The test beside this
// file holds the site to them - a number that moves here fails the
// build, the same characterization contract every repo in the stack
// carries.

export interface SystemRow {
  index: string;
  name: string;
  layer: string;
  line: string;
  repo: string;
  demo: string;
}

export const SYSTEMS: SystemRow[] = [
  {
    index: "01",
    name: "fluxline",
    layer: "the line",
    line: "A sortation program written to IEC 61131-3, the industrial-control standard, with its digital twin and a supervisory host that can only request.",
    repo: "https://github.com/SukrutN/fluxline",
    demo: "https://sukrutn.github.io/fluxline/",
  },
  {
    index: "02",
    name: "switchyard",
    layer: "integration",
    line: "A Go message broker: durable journaled lanes, key-value state, and a wire protocol that never moves a number.",
    repo: "https://github.com/SukrutN/switchyard",
    demo: "https://sukrutn.github.io/switchyard/",
  },
  {
    index: "03",
    name: "quay",
    layer: "slotting",
    line: "Where every carton should stand: the kinship-reach score, anchors in the golden band, one deterministic pass.",
    repo: "https://github.com/SukrutN/quay",
    demo: "https://sukrutn.github.io/quay/",
  },
  {
    index: "04",
    name: "northspan",
    layer: "picking & labor",
    line: "The picker's route, and the labor standard that prices it against the sweep, in minutes.",
    repo: "https://github.com/SukrutN/northspan",
    demo: "https://sukrutn.github.io/northspan/",
  },
  {
    index: "05",
    name: "hearthlane",
    layer: "fleet",
    line: "Conflict-based search and its improved variant over a painted floor: joint plans, deadlines, congestion, a release gate.",
    repo: "https://github.com/SukrutN/hearthlane",
    demo: "https://sukrutn.github.io/hearthlane/",
  },
];

export const SEAMS = [
  {
    n: "01",
    title: "The host can only request.",
    body: "fluxline's host command block carries release requests to the line's Modbus surface, and the routing law keeps the last word: a tall piece asked for lane 2 rides to lane 3 anyway. The floor decides; everything above it proposes.",
  },
  {
    n: "02",
    title: "A crash replays the work.",
    body: "switchyard's linehost journals every verdict before the lane acknowledges, so a crash replays the work instead of losing the receipt. Nothing in the chain invents or loses a box.",
  },
  {
    n: "03",
    title: "All five must agree.",
    body: "Each system journals its own claims as the order passes through, and the day only closes when every lane agrees. Nothing is invented on the way in, and nothing is lost on the way out.",
  },
];

export const ORDER = {
  subject: "orders.merrow.204.received",
  bytes: 293,
  payload: `{
  "id": "MR-204",
  "house": "Merrow Chandlery",
  "note": "Counter refill, ship Friday",
  "locations": [
    "CIN-06-W",
    "LOA-01-E",
    "FLI-06-E",
    "REE-01-W",
    "COB-06-W"
  ],
  "line": [
    { "id": "box-42", "gate": 2, "class": 0 },
    { "id": "box-43", "law": true }
  ]
}`,
};

export const SEATS = {
  subject: "slotting.merrow.204.proposal",
  readingBytes: 30496,
  dayName: "Harbor & Lane day 07",
  policies: ["velocity", "affinity", "random"],
  digest:
    '{"dayId":"putaway-day","dayName":"Harbor \\u0026 Lane day 07","policies":["velocity","affinity","random"],"readingBytes":30496,"source":"quay putaway engine\\\\fixtures\\\\putaway-day.json --json"}',
};

export const WALK = {
  subject: "picking.merrow.204.standard",
  distanceM: 110.0,
  sweepM: 150.8,
  savedM: 40.8,
  planned: "1 min 36 sec",
  text: `Kiln Annex: MR-204 Merrow Chandlery
Counter refill, ship Friday

#   Location    Run         Metres  Via
1   LOA-01-E    Loam          12.2  apron
2   REE-01-W    Reed          16.1  apron
3   COB-06-W    Cobalt        22.6  apron
4   FLI-06-E    Flint         20.2  rear
5   CIN-06-W    Cinder        20.2  rear

5 stops
Planned   110.0 m   1 min 36 sec
Sweep     150.8 m   before improvement
Shorter   40.8 m   27%`,
};

export const PLAN = {
  subject: "fleet.merrow.204.plan",
  cost: 69,
  gap: 0,
  icbsExpanded: 23,
  head: `Ferro & Lume casting hall — casting-hall

Ladder
  CBS         sum 69  gap 0  expanded 34  solved
  ICBS        sum 69  gap 0  expanded 23  solved
  prioritized sum —  gap —  expanded 72  unsolved: AMR-3 cannot reach its goal under the traffic booked ahead of it.`,
};

export type VerdictState = "accepted" | "vetoed" | "refused" | "expired";

export interface Receipt {
  id: string;
  seq: number;
  state: VerdictState;
  gate: number;
  class: number;
  latency_ms: number;
}

export const RELEASES = [
  { subject: "fluxline.release", payload: '{"id":"box-42","gate":2,"class":0}' },
  { subject: "fluxline.release", payload: '{"id":"box-43","law":true}' },
];

export const VERDICTS: Receipt[] = [
  { id: "box-42", seq: 1, state: "vetoed", gate: 3, class: 3, latency_ms: 1600.0 },
  { id: "box-43", seq: 2, state: "accepted", gate: 1, class: 1, latency_ms: 1600.0 },
];

export const CLOSING =
  "THE DAY CLOSED CLEAN: every claim on the lanes, every verdict journaled, nothing invented, nothing lost. exit 0";

export interface LaneRow {
  lane: string;
  seq: number;
  subject: string;
  payload: string;
  kind?: "veto" | "ok";
}

// The eight rows the lanes held when the day closed, in journal order.
export const LANE_ROWS: LaneRow[] = [
  { lane: "orders", seq: 1, subject: ORDER.subject, payload: ORDER.payload },
  { lane: "slotting", seq: 1, subject: SEATS.subject, payload: SEATS.digest },
  { lane: "picking", seq: 1, subject: WALK.subject, payload: WALK.text },
  { lane: "fleet", seq: 1, subject: PLAN.subject, payload: PLAN.head },
  { lane: "fluxline", seq: 1, subject: RELEASES[0].subject, payload: RELEASES[0].payload },
  { lane: "fluxline", seq: 2, subject: RELEASES[1].subject, payload: RELEASES[1].payload },
  {
    lane: "fluxline",
    seq: 3,
    subject: "fluxline.verdict",
    payload: '{"id":"box-42","seq":1,"state":"vetoed","gate":3,"class":3,"latency_ms":1600.0}',
    kind: "veto",
  },
  {
    lane: "fluxline",
    seq: 4,
    subject: "fluxline.verdict",
    payload: '{"id":"box-43","seq":2,"state":"accepted","gate":1,"class":1,"latency_ms":1600.0}',
    kind: "ok",
  },
];

export const CHAPTERS = [
  {
    n: "01",
    title: "The order lands",
    note: "An order arrives as one small message on the broker's journal, and the broker only acknowledges what is already on disk, so a crash loses nothing.",
  },
  {
    n: "02",
    title: "Cartons get seated",
    note: "The slotting engine seats every carton in one deterministic pass, scoring each location by how fast it moves and which goods belong beside it.",
  },
  {
    n: "03",
    title: "The walk gets priced",
    note: "The picking engine routes the walk at 110.0 m where a full sweep would cost 150.8 m, a quarter less walking for the picker.",
  },
  {
    n: "04",
    title: "The fleet gets planned",
    note: "The fleet planner moves every robot as one joint plan: 69 ticks of travel with nothing cheaper in existence, proven in 23 search steps.",
  },
  {
    n: "05",
    title: "The line answers",
    note: "The line keeps the last word. It measures each carton at the load cell, honors the ones the routing law allows, and vetoes the rest, each answer back in 1.6 seconds.",
  },
  {
    n: "06",
    title: "The ledger closes",
    note: "The day closes clean: every claim on its lane and every verdict journaled, nothing invented, nothing lost.",
  },
];
