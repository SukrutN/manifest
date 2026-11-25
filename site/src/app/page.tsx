import { BarFill } from "@/components/bar-fill";
import { Cursor } from "@/components/cursor";
import { DayReplay } from "@/components/day-replay";
import { IntroWords } from "@/components/intro-words";
import { Preloader } from "@/components/preloader";
import { Reveal } from "@/components/reveal";
import { SiteHead } from "@/components/site-head";
import {
  CHAPTERS,
  CLOSING,
  ORDER,
  PLAN,
  SEAMS,
  SEATS,
  SYSTEMS,
  VERDICTS,
  WALK,
} from "@/lib/day";

const MARQUEE_TEXT =
  "MR-204 · MERROW CHANDLERY · COUNTER REFILL, SHIP FRIDAY · FIVE LOCATIONS · TWO CARTONS · ONE VETO · ONE HONOR · ONE LEDGER ";

function Marquee() {
  return (
    <div aria-hidden="true">
      <div className="wrap">
        <div className="marquee">
          <div className="marquee__track">
            <span>{MARQUEE_TEXT}</span>
            <span>{MARQUEE_TEXT}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackCard({
  system,
  i,
}: {
  system: (typeof SYSTEMS)[number];
  i: number;
}) {
  const light = i % 2 === 1;
  return (
    <div className={`stack-card${light ? " stack-card--light" : " stack-card--dark"}`}>
      <div className="stack-card__inner">
        <Reveal className="stack-card__top">
          <p className="stack-card__num">{system.index}</p>
          <p className="stack-card__layer">{system.layer}</p>
        </Reveal>
        <div className="stack-card__mid">
          <Reveal delay={40}>
            <h3 className="stack-card__name">{system.name}</h3>
          </Reveal>
          <Reveal delay={120}>
            <p className="stack-card__desc">{system.line}</p>
          </Reveal>
          <Reveal delay={200}>
            <div className="stack-card__links">
              <a
                className={`btn btn--sm${light ? " btn--dark" : ""}`}
                href={system.repo}
                target="_blank"
                rel="noreferrer"
              >
                the repo <span className="btn__arrow" aria-hidden="true">↗</span>
              </a>
              <a
                className={`btn btn--sm${light ? " btn--dark" : ""}`}
                href={system.demo}
                target="_blank"
                rel="noreferrer"
              >
                the demo <span className="btn__arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal className="stack-card__footing" delay={260}>
          <div className="bar">
            <BarFill />
          </div>
          <span className="stack-card__count">{system.index} / 05</span>
        </Reveal>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Preloader />
      <SiteHead />
      <Cursor />

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <h1 className="hero__mark hero-anim hero-anim--4">MANIFEST</h1>
            <div className="hero__words hero-anim hero-anim--5">
              {SYSTEMS.map((s) => (
                <span key={s.name}>{s.name}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="intro">
          <div className="wrap--half">
            <IntroWords text="Manifest gives you one order's whole day through five systems: the lane it lands on, the seat each carton takes, the walk it is priced against, the plan that moves the fleet, and the verdicts the floor journals back. Every figure comes from a real run, and the harness that produced it ships with the repo." />
            <div className="text-center">
              <a className="btn btn--mt" href="#day">
                run the day <span className="btn__arrow" aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section className="section section--flush-end" id="stack">
          <div className="wrap">
            <div className="section__head">
              <p className="section__intro">
                Five systems, in the order an order meets them. Each card
                opens the system&apos;s own repo and demo.
              </p>
              <h2 className="titolo-sezione">The stack</h2>
            </div>
          </div>
          <div className="stack-cards">
            {SYSTEMS.map((s, i) => (
              <StackCard key={s.name} system={s} i={i} />
            ))}
          </div>
        </section>

        <section className="section" id="day">
          <div className="wrap">
            <div className="section__head">
              <p className="section__intro">
                One real order, MR-204 from Merrow Chandlery, walks the
                stack in six steps. Every card below is that system&apos;s
                own output from the run, not a mockup.
              </p>
              <h2 className="titolo-sezione">The day</h2>
            </div>
            <div className="day__grid">
              <div className="day__rail">
                {CHAPTERS.map((c) => (
                  <p key={c.n}>
                    <span className="rail-dot" aria-hidden="true">{c.n}</span>
                    {c.title}
                  </p>
                ))}
              </div>
              <div className="day__chapters">
                <Reveal>
                  <div className="chapter">
                    <div className="chapter__title">
                      <b>{CHAPTERS[0].n}</b>
                      <h3>{CHAPTERS[0].title}</h3>
                    </div>
                    <p className="chapter__note">{CHAPTERS[0].note}</p>
                    <div className="data-card">
                      <p className="data-card__subject">
                        lane orders · {ORDER.subject}
                      </p>
                      <pre>{ORDER.payload}</pre>
                    </div>
                  </div>
                </Reveal>

                <Reveal>
                  <div className="chapter">
                    <div className="chapter__title">
                      <b>{CHAPTERS[1].n}</b>
                      <h3>{CHAPTERS[1].title}</h3>
                    </div>
                    <p className="chapter__note">{CHAPTERS[1].note}</p>
                    <div className="data-card">
                      <p className="data-card__subject">
                        lane slotting · {SEATS.subject}
                      </p>
                      <pre>{SEATS.digest}</pre>
                    </div>
                  </div>
                </Reveal>

                <Reveal>
                  <div className="chapter">
                    <div className="chapter__title">
                      <b>{CHAPTERS[2].n}</b>
                      <h3>{CHAPTERS[2].title}</h3>
                    </div>
                    <p className="chapter__note">{CHAPTERS[2].note}</p>
                    <div className="data-card">
                      <p className="data-card__subject">
                        lane picking · {WALK.subject}
                      </p>
                      <pre>{WALK.text}</pre>
                    </div>
                  </div>
                </Reveal>

                <Reveal>
                  <div className="chapter">
                    <div className="chapter__title">
                      <b>{CHAPTERS[3].n}</b>
                      <h3>{CHAPTERS[3].title}</h3>
                    </div>
                    <p className="chapter__note">{CHAPTERS[3].note}</p>
                    <div className="data-card">
                      <p className="data-card__subject">
                        lane fleet · {PLAN.subject}
                      </p>
                      <pre>{PLAN.head}</pre>
                    </div>
                  </div>
                </Reveal>

                <Reveal>
                  <div className="chapter">
                    <div className="chapter__title">
                      <b>{CHAPTERS[4].n}</b>
                      <h3>{CHAPTERS[4].title}</h3>
                    </div>
                    <p className="chapter__note">{CHAPTERS[4].note}</p>
                    <div className="verdicts">
                      {VERDICTS.map((v) => (
                        <div className="verdict" key={v.id}>
                          <p className="verdict__id">
                            {v.id} <span aria-hidden="true">→</span>{" "}
                            {v.state === "vetoed"
                              ? "asked for lane 2"
                              : "released under law"}
                          </p>
                          <span
                            className={`chip chip--${v.state === "vetoed" ? "veto" : "ok"}`}
                          >
                            {v.state === "vetoed"
                              ? `vetoed · rides to lane ${v.gate}`
                              : `accepted · lane ${v.gate}`}
                          </span>
                          <p className="verdict__line">
                            class {v.class} measured at the load cell
                            <br />
                            receipt journaled before the lane acknowledges
                            <br />
                            answered in {(v.latency_ms / 1000).toFixed(1)}{" "}
                            seconds
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                <Reveal>
                  <div className="chapter">
                    <div className="chapter__title">
                      <b>{CHAPTERS[5].n}</b>
                      <h3>{CHAPTERS[5].title}</h3>
                    </div>
                    <p className="chapter__note">{CHAPTERS[5].note}</p>
                    <p className="closing-line">{CLOSING}</p>
                  </div>
                </Reveal>
              </div>
            </div>

            <Reveal>
              <DayReplay />
            </Reveal>
          </div>
        </section>

        <Marquee />

        <section className="section" id="seams">
          <div className="wrap">
            <div className="section__head">
              <p className="section__intro">
                Three rules hold the stack together, and each is proven
                inside a repo rather than asserted here.
              </p>
              <h2 className="titolo-sezione">The seams</h2>
            </div>
            <div className="seams">
              {SEAMS.map((s, i) => (
                <Reveal key={s.n} delay={i * 80} className="seam">
                  <span className="seam__dot" aria-hidden="true" />
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <a
                    className="btn btn--sm"
                    href={s.proof}
                    target="_blank"
                    rel="noreferrer"
                  >
                    proven in the repo{" "}
                    <span className="btn__arrow" aria-hidden="true">↗</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="harness">
          <div className="wrap">
            <div className="section__head">
              <p className="section__intro">
                Two commands run the whole day on your own machine: build
                the five systems once, then run the day as many times as
                you like.
              </p>
              <h2 className="titolo-sezione">The harness</h2>
            </div>
            <Reveal>
              <div className="codecard">
                <pre>
                  <span className="p">$</span> powershell harness\build.ps1{"      "}
                  <span className="c">
                    {"# broker, spur, linehost, the engines, the model's deps"}
                  </span>
                  {"\n"}
                  <span className="p">$</span> powershell harness\run-day.ps1{"    "}
                  <span className="c">{"# the day"}</span>
                  {"\n\n"}
                  <span className="o">
                    {
                      "== 7 : the line answers: fluxline's scan-exact host-block model (the seeded bench's own)"
                    }
                  </span>
                  {"\n"}
                  <span className="o">
                    {
                      "   ok: box-42: vetoed - the host can only request; the floor decided"
                    }
                  </span>
                  {"\n"}
                  <span className="o">
                    {
                      "   ok: box-43: accepted - the host can only request; the floor decided"
                    }
                  </span>
                  {"\n\n"}
                  THE DAY CLOSED CLEAN — exit 0
                </pre>
              </div>
              <p className="harness__note">
                every figure on this page comes from that run, and the
                locks in src/lib/day.test.ts hold the site to it
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer-card">
        <div className="footer__top">
          <Reveal className="footer__top__text">
            <h3>Run the day on your floor.</h3>
            <p>
              Clone the repo and the harness comes with it: the same order
              you just read runs on your own machine.
            </p>
          </Reveal>
          <Reveal className="footer__top__cta" delay={80}>
            <a
              className="btn btn--solid-dark"
              href="https://github.com/SukrutN/manifest"
              target="_blank"
              rel="noreferrer"
            >
              clone the repo{" "}
              <span className="btn__arrow" aria-hidden="true">↗</span>
            </a>
            <a
              className="btn btn--dark"
              href="https://github.com/SukrutN/manifest/blob/main/docs/orders-day.md"
              target="_blank"
              rel="noreferrer"
            >
              the walkthrough{" "}
              <span className="btn__arrow" aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Sukrut Nadigotti · MIT</span>
          <a
            href="https://github.com/SukrutN/manifest"
            target="_blank"
            rel="noreferrer"
          >
            github.com/SukrutN/manifest
          </a>
          <span>five systems · one order · one ledger</span>
        </div>
        <p className="foot-mark" aria-hidden="true">MANIFEST</p>
      </footer>
    </>
  );
}
