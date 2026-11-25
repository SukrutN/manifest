"use client";

import { useEffect, useRef, useState } from "react";

const MENU = [
  { label: "The stack", href: "#stack" },
  { label: "The flow", href: "#flow" },
  { label: "The seams", href: "#seams" },
  { label: "Run it yourself", href: "#harness" },
];

/**
 * The fixed bar: the wordmark on the left, the one-line claim in the
 * middle, and the burger that opens the menu panel. The bar fades on
 * the way down and returns on the way up; the panel carries the four
 * section anchors plus github, giant and uppercase, with the backdrop
 * blur the reference uses. Without JavaScript the anchors still work as
 * plain links, so nothing on the page is behind the menu.
 */
export function SiteHead() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        queued = false;
        const y = window.scrollY;
        if (y > 140 && y > lastY + 4) setHidden(true);
        else if (y < lastY - 4 || y < 140) setHidden(false);
        lastY = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const burger = burgerRef.current;
    const focusId = window.setTimeout(
      () => closeRef.current?.focus(),
      80,
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusId);
      window.removeEventListener("keydown", onKey);
      burger?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        className={`site-head${hidden ? " site-head--hidden" : ""}`}
      >
        <div className="site-head__row">
          <a
            className="site-head__wordmark hero-anim hero-anim--1"
            href="#top"
          >
            MANIFEST<em>*</em>
          </a>
          <span className="site-head__claim hero-anim hero-anim--2">
            how five systems run one order together
          </span>
          <button
            ref={burgerRef}
            className="burger hero-anim hero-anim--3"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close the menu" : "Open the menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="burger__items" aria-hidden="true">
              <span className="burger__item burger__item--1" />
              <span className="burger__item burger__item--2" />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`modal__backdrop${open ? " modal__backdrop--show" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <nav
        id="site-menu"
        className={`modal-menu${open ? " modal-menu--show" : ""}`}
        aria-hidden={!open}
        aria-label="Site menu"
      >
        <button
          ref={closeRef}
          className="modal-menu__close"
          aria-label="Close the menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <line
              x1="6"
              y1="6"
              x2="26"
              y2="26"
              stroke="#0e0e0e"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="26"
              y1="6"
              x2="6"
              y2="26"
              stroke="#0e0e0e"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <ul className="modal-menu__list">
          {MENU.map((m) => (
            <li key={m.href}>
              <a
                href={m.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                {m.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/SukrutN/manifest"
              target="_blank"
              rel="noreferrer"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              github ↗
            </a>
          </li>
        </ul>
        <div className="modal-menu__copyright">
          <span>© 2026</span>
          <span>Manifest</span>
        </div>
      </nav>
    </>
  );
}
