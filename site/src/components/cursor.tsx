"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The ring and the dot, blended in difference so they read on dark
 * and light surfaces alike. They never take a pointer event, they
 * stay off touch screens and out of reduced motion, and without
 * JavaScript the browser cursor is simply the cursor.
 */
export function Cursor() {
  const [live, setLive] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;
    const id = window.setTimeout(() => setLive(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!live) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add("cursor-live");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let shown = false;
    let raf = 0;

    const show = () => {
      if (!shown) {
        shown = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      show();
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const hit = target?.closest(
        "a, button, input, label, [role='button']",
      );
      ring.classList.toggle("hover", Boolean(hit));
      dot.classList.toggle("hover", Boolean(hit));
    };

    const onDown = () => {
      ring.classList.add("click");
    };

    const onUp = () => {
      ring.classList.remove("click");
    };

    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        shown = false;
        ring.style.opacity = "0";
        dot.style.opacity = "0";
      }
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) translate(-50%, -50%)`;
      raf = window.requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseout", onOut);
    raf = window.requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("cursor-live");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseout", onOut);
      window.cancelAnimationFrame(raf);
    };
  }, [live]);

  if (!live) return null;

  return (
    <>
      <div ref={ringRef} className="cursor" aria-hidden="true" />
      <div ref={dotRef} className="cursor2" aria-hidden="true" />
    </>
  );
}
