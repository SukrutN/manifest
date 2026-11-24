import { DayReplay } from "@/components/day-replay";
import { Preloader } from "@/components/preloader";
import { Reveal } from "@/components/reveal";
import {
  CHAPTERS,
  ORDER,
  PLAN,
  SEAMS,
  SEATS,
  SYSTEMS,
  VERDICTS,
  WALK,
} from "@/lib/day";

const BAND_TEXT =
  "MR-204 · MERROW CHANDLERY · COUNTER REFILL, SHIP FRIDAY · FIVE LOCATIONS · TWO CARTONS · ONE VETO · ONE HONOR · ONE LEDGER ";

function Band() {
  return (
    <div className="band" aria-hidden="true">
      <div className="band__track">
        <span>{BAND_TEXT}</span>
        <span>{BAND_TEXT}</span>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Preloader />

      <header className="site-head">
        <div className="wrap">
          <a className="wordmark" href="#top">
            MANIFEST<em>*</em>
          </a>
          <nav className="site-nav">
            <a className="nav-link" href="#stack">
              the stack
            </a>
            <a className="nav-link" href="#day">
              the day
            </a>
            <a className="nav-link" href="#harness">
              the harness
            </a>
            <a
              href="https://github.com/SukrutN/manifest"
              target="_blank"
              rel="noreferrer"
            >
              github ↗
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <p className="eyebrow">
              five systems <span className="sep">·</span> one order{" "}
              <span className="sep">·</span> one ledger
            </p>
            <div className="hero__grid">
              <div>
                <h1>
                  <span className="mask">
                    <span className="mask__inner">one order</span>
                  </span>
                  <span className="mask">
                    <span className="mask__inner">
                      walks the <span className="stamp">stack.</span>
                    </span>
                  </span>
                </h1>
              </div>
              <div className="hero__side">
                <p>
                  The architecture that connects five material-handling
                  systems — and the harness that runs a single order through
                  all of them, from the lane it lands on to the verdicts the
                  floor journals back.
                </p>
                <p className="eyebrow">
                  every figure on this page <span className="sep">·</span>{" "}
                  from a real run
                </p>
              </div>
            </div>
            <div className="hero__ctas">
              <a className="btn btn--solid" href="#day">
                run the day <span aria-hidden="true">↓</span>
              </a>
              <a className="btn btn--ghost" href="#stack">
                the stack
              </a>
            </div>
          </div>
        </section>

        <Band />

        <section className="section" id="stack">
          <div className="wrap">
            <div className="section__head">
              <h2>five systems, one discipline.</h2>
              <p className="eyebrow">01 — the stack</p>
            </div>
            <div>
              {SYSTEMS.map((s, i) => (
                <Reveal key={s.name} delay={i * 60}>
                  <div className="stack-row">
                    <p className="stack-row__index">{s.index}</p>
                    <div>
                      <p className="stack-row__name">{s.name}</p>
                      <span className="stack-row__layer">{s.layer}</span>
                    </div>
                    <p className="stack-row__desc">{s.line}</p>
                    <div className="stack-row__links">
                      <a href={s.repo} target="_blank" rel="noreferrer">
                        repo ↗
                      </a>
                      <a href={s.demo} target="_blank" rel="noreferrer">
                        demo ↗
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Band />

        <section className="section" id="day">
          <div className="wrap">
            <div className="section__head">
              <h2>mr-204 walks the day.</h2>
              <p className="eyebrow">02 — one order&apos;s day</p>
            </div>
            <div className="day__grid">
              <div className="day__rail">
                {CHAPTERS.map((c) => (
                  <p key={c.n}>
                    <b>{c.n}</b>
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
                    <div className="card">
                      <p className="card__subject">
                        lane orders <em>·</em> {ORDER.subject}
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
                    <div className="card">
                      <p className="card__subject">
                        lane slotting <em>·</em> {SEATS.subject}
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
                    <div className="card">
                      <p className="card__subject">
                        lane picking <em>·</em> {WALK.subject}
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
                    <div className="card">
                      <p className="card__subject">
                        lane fleet <em>·</em> {PLAN.subject}
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
                            {v.state === "vetoed" ? "asked L02" : "per law"}
                          </p>
                          <span
                            className={`chip chip--${v.state === "vetoed" ? "veto" : "ok"}`}
                          >
                            {v.state} · gate {v.gate}
                          </span>
                          <p className="verdict__line">
                            class {v.class} measured at the load cell
                            <br />
                            receipt journaled before the lane ack
                            <br />
                            latency {v.latency_ms.toFixed(1)} ms
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
                    <p className="closing-line">
                      THE DAY CLOSED CLEAN: every claim on the lanes, every
                      verdict journaled, nothing invented, nothing lost. exit 0
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>

            <Reveal>
              <DayReplay />
            </Reveal>
          </div>
        </section>

        <Band />

        <section className="section" id="seams">
          <div className="wrap">
            <div className="section__head">
              <h2>three rules hold it together.</h2>
              <p className="eyebrow">03 — the seams</p>
            </div>
            <div className="seams">
              {SEAMS.map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="seam">
                    <b>{s.n}</b>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    <a href={s.proof} target="_blank" rel="noreferrer">
                      proven in the repo ↗
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="harness">
          <div className="wrap">
            <div className="section__head">
              <h2>run it yourself.</h2>
              <p className="eyebrow">04 — the harness</p>
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
                every figure on this page comes from that run — the locks in
                src/lib/day.test.ts hold the site to it
              </p>
            </Reveal>
          </div>
        </section>

        <section className="cta">
          <div className="wrap">
            <h2>one repo, the whole day.</h2>
            <p>
              The architecture, the order&apos;s walkthrough, the
              real-world interfaces each layer meets, and the harness that
              runs it — all in one repository.
            </p>
            <a
              className="btn btn--solid"
              href="https://github.com/SukrutN/manifest"
              target="_blank"
              rel="noreferrer"
            >
              clone the manifest <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <p className="foot-mark">MANIFEST</p>
          <div className="foot-grid">
            <div>
              <h4>the systems</h4>
              {SYSTEMS.map((s) => (
                <a key={s.name} href={s.repo} target="_blank" rel="noreferrer">
                  {s.name} · {s.layer}
                </a>
              ))}
            </div>
            <div>
              <h4>the demos</h4>
              {SYSTEMS.map((s) => (
                <a key={s.name} href={s.demo} target="_blank" rel="noreferrer">
                  sukrutn.github.io/{s.name}
                </a>
              ))}
            </div>
            <div>
              <h4>the repo</h4>
              <a
                href="https://github.com/SukrutN/manifest"
                target="_blank"
                rel="noreferrer"
              >
                github.com/SukrutN/manifest
              </a>
              <p>the architecture, the day, the harness</p>
              <p>figures from a real harness run</p>
            </div>
          </div>
          <div className="foot-legal">
            <span>© 2026 Sukrut Nadigotti — MIT</span>
            <span>paper · ink · one stamp</span>
          </div>
        </div>
      </footer>
    </>
  );
}
