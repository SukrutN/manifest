"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The counter and the curtain: the word rises once, the day counts
 * in, and the curtain splits to uncover the page, which hands its
 * entrance to the hero. The overlay renders only once the client is
 * alive, so a visitor without JavaScript never meets a curtain; one
 * visit per session is enough; under reduced motion the page never
 * hides and the hero never waits.
 */
export function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"count" | "open" | "gone">("count");
  const raf = useRef(0);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const revisit = window.sessionStorage.getItem("manifest-visited") === "1";
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      revisit
    ) {
      const id = window.setTimeout(() => setPhase("gone"), 0);
      return () => window.clearTimeout(id);
    }
    document.body.style.overflow = "hidden";
    const t0 = performance.now();
    const DUR = 1500;
    const finish = () => {
      setPhase("open");
      window.sessionStorage.setItem("manifest-visited", "1");
      document.documentElement.classList.add("anim--start");
      window.setTimeout(() => {
        setPhase("gone");
        document.body.style.overflow = "";
      }, 950);
    };
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / DUR);
      setPct(Math.round(p * 100));
      if (p < 1) {
        raf.current = window.requestAnimationFrame(step);
      } else {
        finish();
      }
    };
    raf.current = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(raf.current);
      document.body.style.overflow = "";
    };
  }, [mounted]);

  if (!mounted || phase === "gone") return null;

  return (
    <div
      className={`preloader${phase === "open" ? " preloader--open" : ""}`}
      aria-hidden="true"
    >
      <div className="preloader__half preloader__half--l" />
      <div className="preloader__half preloader__half--r" />
      <div className="preloader__core">
        <p className="preloader__word">
          <span>MANIFEST</span>
        </p>
        <p className="preloader__pct">{pct}%</p>
      </div>
    </div>
  );
}
