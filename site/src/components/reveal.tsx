"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Position-driven reveals, never one-shot observers: an element reveals
 * when its top passes the viewport bottom, however fast it got there.
 * A flick, a Page-down, or an anchor jump all count, because the check
 * reads the element's own position on every scroll frame - an element
 * that skipped past the viewport without ever intersecting it still
 * reveals. Under reduced motion everything renders settled.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(id);
    }
    let raf = 0;
    const check = () => {
      raf = 0;
      if (done.current) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        done.current = true;
        setInView(true);
      }
    };
    const onScroll = () => {
      if (raf === 0 && !done.current) raf = window.requestAnimationFrame(check);
    };
    raf = window.requestAnimationFrame(check);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== 0) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${inView ? " is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
