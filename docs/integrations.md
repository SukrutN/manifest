# The interfaces each layer meets

This stack speaks two protocols today: its own wire (switchyard) and
Modbus TCP (linehost to fluxline). A real building speaks more. This is
the map: what each interface is, when it is the right tool, and where it
lands in this stack. None of the five repositories implements these yet —
the map is the point, because knowing where each one lands is the
difference between an integration plan and a wish.

## Southbound: from the floor

**MODBUS TCP — what the line speaks today.** fluxline's host command
block is a register surface: the linehost writes release requests, the
line writes back verdicts and state, and the routing law keeps the last
word. It is the right tool for one line and one host: simple, polled,
deterministic. It is the wrong tool for an estate of heterogeneous
devices — everything must know every register.

**OPC UA — the device estate.** When a line's PLCs, drives, scanners,
and dimensioners expose typed, browsable address spaces (with companion
specifications for robotics and machinery), the WCS-facing edge gains
typed subscriptions with structure instead of polled registers that
everyone must agree on by hand. In this stack it lands in the
**linehost's seat**: the bridge between switchyard's lanes and the floor
gains a second dialect, and the lanes never change — that is the point
of keeping the broker's contract frozen.

**MQTT with Sparkplug B — the fleet's telemetry.** Birth and death
certificates per device, metric state-of-health, and a topic namespace a
broker can actually enforce. For a hundred robots reporting position,
battery, and fault state, Sparkplug is the disciplined answer. In this
stack it lands as an **adapter beside the lanes**: switchyard's charter
already separates subjects from transport, so a Sparkplug edge can
publish into `fleet.*` without the planners knowing it exists.

## Northbound: to the business

**X12 940 — the warehouse shipping order.** How a customer tells the
warehouse what to pick. It lands as an order document on `orders.*`: the
seam northspan's ticket files already shape (a house, lines, faces,
quantities). An 940-to-lane adapter is a parser and a publish — nothing
downstream changes.

**X12 945 — the warehouse shipping advice.** How the warehouse answers
what actually shipped, with the discrepancies. It is the closed ledger's
northbound echo: `ledger.*.closed` is the claim; the 945 is its envelope.

**856 ASN — the advance ship notice.** What the customer's receiving
dock expects to be told, carton by carton. It leaves from the same
ledger, one step later in the day.

**GS1-128 — the label.** The application identifiers (01 GTIN, 10 lot,
21 serial) that make a carton readable by every scanner between here and
the customer's dock. fluxline's stations are the geometry — a photo-eye,
a height profile, an inductive probe, a load cell — and the barcode is
the identity that geometry reads. The label's data model belongs at the
scan points, which in this stack means fluxline's register map grows an
identity field, and the verdict journal carries it.

## Where each lands

| Interface | Layer | Lands in | Why there |
|---|---|---|---|
| Modbus TCP | floor ↔ host | fluxline + linehost (today) | one line, one host, deterministic |
| OPC UA | floor ↔ host | linehost, second dialect | typed device estate without new lanes |
| MQTT / Sparkplug B | devices ↔ broker | an adapter beside the lanes | fleet telemetry with state-of-health |
| X12 940 | business ↔ warehouse | a parser onto `orders.*` | the inbound order, unchanged downstream |
| X12 945 / 856 | warehouse ↔ business | an envelope over `ledger.*` | the outbound answer and its notice |
| GS1-128 | the carton itself | fluxline's scan points + the verdict journal | identity at the geometry that reads it |

The pattern in every row: **new interfaces land at the edges and speak
into the lanes; the five engines never learn a new protocol.** That is
what the broker's frozen contract buys, and it is the difference between
adding an interface and touching five systems to add one.
