"use client";

import { Fragment, useEffect, useRef } from "react";
import { registerScrub } from "@/lib/scrub";

/**
 * The introduction reads word by word: each word brightens as it
 * crosses the reading line, scrubbed to position and reversing on
 * the way back, the way the reference does it. The words ship at
 * full opacity in the static bytes; only the running driver dims
 * the ones still below the line.
 */
export function IntroWords({ text }: { text: string }) {
  const rootRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const offs = Array.from(
      root.querySelectorAll<HTMLElement>(".intro__word"),
    ).map((el) => registerScrub(el, "word"));
    return () => {
      for (const off of offs) off();
    };
  }, []);

  const words = text.split(" ");

  return (
    <p ref={rootRef} className="intro__text text-balance text-center">
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="intro__word">{word}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
