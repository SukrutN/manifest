"use client";

import { useEffect, useRef } from "react";
import { registerScrub } from "@/lib/scrub";

/**
 * The progress line under each stack card: the same scroll scrub
 * writing one property, a horizontal scale that fills as the card
 * settles and empties again on the way back up. The static bytes
 * ship the bar full.
 */
export function BarFill() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerScrub(el, "fill");
  }, []);

  return <span ref={ref} className="bar__fill" aria-hidden="true" />;
}
