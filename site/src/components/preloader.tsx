"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The counter: the day's figures count in while the page settles behind
 * the curtain, then the curtain lifts. Under reduced motion the page
 * never hides - everything renders settled.
 */
export function Preloader() {
  const [pct, setPct] = useState(0);
  const [lifting, setLifting] = useState(false);
  const [gone, setGone] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setGone(true), 0);
      return () => window.clearTimeout(id);
    }
    document.body.style.overflow = "hidden";
    const t0 = performance.now();
    const DUR = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / DUR);
      setPct(Math.round(p * 100));
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setLifting(true);
        window.setTimeout(() => {
          setGone(true);
          document.body.style.overflow = "";
        }, 1000);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`preloader${lifting ? " preloader--lift" : ""}`} aria-hidden="true">
      <p className="preloader__label">MANIFEST · ONE ORDER&apos;S DAY</p>
      <p className="preloader__count">{pct}</p>
      <div className="preloader__bar">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
