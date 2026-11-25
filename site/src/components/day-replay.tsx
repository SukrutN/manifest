"use client";

import { useEffect, useRef, useState } from "react";
import { CLOSING, LANE_ROWS } from "@/lib/day";

/**
 * The replay: the eight rows a real run put on the five lanes, printed
 * into a terminal in journal order, the two verdicts tinted as they
 * land, and the closing line last. Under reduced motion the whole
 * journal prints at once.
 */
export function DayReplay() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = termRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count, done]);

  const run = () => {
    if (running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(LANE_ROWS.length);
      setDone(true);
      return;
    }
    setRunning(true);
    setCount(0);
    setDone(false);
    let i = 0;
    const step = () => {
      i += 1;
      setCount(i);
      if (i < LANE_ROWS.length) {
        window.setTimeout(step, 300);
      } else {
        window.setTimeout(() => {
          setDone(true);
          setRunning(false);
        }, 480);
      }
    };
    window.setTimeout(step, 300);
  };

  return (
    <div className="replay">
      <div className="replay__bar">
        <p className="replay__hint">
          {done
            ? "the whole day, lane by lane - replay it any time"
            : "watch the order fill all five lanes"}
        </p>
        <button className="replay__run" onClick={run} disabled={running}>
          {running ? "running ..." : done ? "run the day again" : "run the day"}
          <span aria-hidden="true"> →</span>
        </button>
      </div>
      <div className="term" ref={termRef}>
        {count === 0 && !done ? (
          <p className="term__idle">
            [five lanes waiting for one run]
          </p>
        ) : (
          <>
            {LANE_ROWS.slice(0, count).map((row) => (
              <p key={`${row.lane}-${row.seq}`} className={`term__row${row.kind ? ` term__row--${row.kind}` : ""}`}>
                <span className="term__meta">[lane {row.lane} #{row.seq}]</span>{" "}
                <span className="term__subject">{row.subject}</span>{" "}
                <span className="term__payload">{row.payload}</span>
              </p>
            ))}
            {done ? <p className="term__closing">{CLOSING}</p> : null}
          </>
        )}
      </div>
    </div>
  );
}
