"use client";

import { useEffect, useRef } from "react";
import { registerScrub } from "@/lib/scrub";

/**
 * Position-driven reveals, never timed and never one-shot: the
 * driver writes only opacity and transform, scrubbed to the scroll
 * position, settling about 62 percent of the way up the viewport
 * and reversing on the way back. An element a flick skips past still
 * settles, because the check reads positions every frame. Under
 * reduced motion, and without JavaScript, everything renders settled.
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerScrub(el, "rise", delay / 600);
  }, [delay]);

  return (
    <div ref={ref} className={`scrub-rise ${className}`}>
      {children}
    </div>
  );
}
