// The scrub driver: one registry, one rAF gate, no observers.
//
// Every entrance on the page is scrubbed to the scroll position and
// reverses on the way back. The driver writes only its own two style
// properties, opacity and transform, so React-managed inline styles
// survive it; the static export ships settled, because no from-state
// lives in the CSS and the driver writes nothing at all under
// reduced motion.

type Mode = "rise" | "fill" | "word";

interface Entry {
  el: HTMLElement;
  mode: Mode;
  lag: number;
}

const entries = new Set<Entry>();
let listening = false;
let queued = false;

function reduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function apply(): void {
  queued = false;
  const vh = window.innerHeight;
  for (const entry of entries) {
    const rect = entry.el.getBoundingClientRect();
    // Skip only what no viewport can see: long-settled work far above,
    // and work more than four viewports down, dimmed before it can
    // ever scroll into sight.
    if (rect.bottom < -vh || rect.top > vh * 4) continue;
    let p: number;
    if (entry.mode === "word") {
      p = clamp01((vh * 0.9 - (rect.top + rect.height / 2)) / (vh * 0.5));
    } else if (entry.mode === "fill") {
      // The bar fills as its card covers the viewport, and stays full
      // while the card is stuck, because a stuck card's top never
      // moves off zero.
      const track = entry.el.closest(".stack-card");
      const tr = track ? track.getBoundingClientRect() : rect;
      if (tr.bottom < -vh || tr.top > vh * 4) continue;
      p = clamp01((vh - tr.top) / vh);
    } else {
      p = clamp01((vh - rect.top) / (vh * 0.62) - entry.lag);
    }
    const t = 1 - Math.pow(1 - p, 3);
    if (entry.mode === "rise") {
      entry.el.style.opacity = String(t);
      entry.el.style.transform =
        t < 1 ? `translateY(${((1 - t) * 24).toFixed(2)}px)` : "";
    } else if (entry.mode === "fill") {
      entry.el.style.transform = `scaleX(${t.toFixed(4)})`;
    } else {
      entry.el.style.opacity = (0.3 + 0.7 * t).toFixed(4);
    }
  }
}

function tick(): void {
  if (!queued) {
    queued = true;
    window.requestAnimationFrame(apply);
  }
}

function ensureListening(): void {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
}

export function registerScrub(
  el: HTMLElement,
  mode: Mode,
  lag = 0,
): () => void {
  if (reduced()) return () => {};
  const entry: Entry = { el, mode, lag };
  entries.add(entry);
  ensureListening();
  tick();
  return () => {
    entries.delete(entry);
  };
}
