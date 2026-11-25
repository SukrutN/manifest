import { BarFill } from "@/components/bar-fill";
import { Cursor } from "@/components/cursor";
import { DayReplay } from "@/components/day-replay";
import { IntroWords } from "@/components/intro-words";
import { Preloader } from "@/components/preloader";
import { Reveal } from "@/components/reveal";
import { SiteHead } from "@/components/site-head";
import { CHAPTERS, SEAMS, SYSTEMS } from "@/lib/day";

const MARQUEE_TEXT =
  "one order walks the whole floor and every system answers ".repeat(2);

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
                href={system.demo}
                target="_blank"
                rel="noreferrer"
              >
                open {system.name}{" "}
                <span className="btn__arrow" aria-hidden="true">↗</span>
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
            <IntroWords text="Manifest shows how five warehouse systems run one order together: the order takes its seat, gets its walk priced, rides the fleet plan, and meets the line that has the final word." />
            <div className="text-center">
              <a className="btn btn--mt" href="#flow">
                see the flow <span className="btn__arrow" aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section className="section section--flush-end" id="stack">
          <div className="wrap">
            <div className="section__head">
              <p className="section__intro">
                Five products, in the order an order meets them. Each card
                opens the system&apos;s own page.
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

        <section className="section" id="flow">
          <div className="wrap">
            <div className="section__head">
              <p className="section__intro">
                One order walks all five, and each system hands the next
                exactly what it needs.
              </p>
              <h2 className="titolo-sezione">The flow</h2>
            </div>
            <div className="flow__grid">
              <div className="flow__rail">
                {CHAPTERS.map((c) => (
                  <p key={c.n}>
                    <span className="rail-dot" aria-hidden="true">{c.n}</span>
                    {c.title}
                  </p>
                ))}
              </div>
              <div className="flow__chapters">
                {CHAPTERS.map((c, i) => (
                  <Reveal
                    key={c.n}
                    delay={i * 60}
                    className={i === CHAPTERS.length - 1 ? "chapter-wrap--last" : ""}
                  >
                    <div className="chapter">
                      <div className="chapter__title">
                        <b>{c.n}</b>
                        <h3>{c.title}</h3>
                      </div>
                      <p className="chapter__note">{c.note}</p>
                    </div>
                  </Reveal>
                ))}
                <Reveal delay={80}>
                  <DayReplay />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <Marquee />

        <section className="section" id="seams">
          <div className="wrap">
            <div className="section__head">
              <p className="section__intro">
                Three rules hold the flow together, and each one is the
                systems&apos; own behavior, not a promise on a page.
              </p>
              <h2 className="titolo-sezione">The seams</h2>
            </div>
            <div className="seams">
              {SEAMS.map((s, i) => (
                <Reveal key={s.n} delay={i * 80} className="seam">
                  <span className="seam__dot" aria-hidden="true" />
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="harness">
          <div className="wrap">
            <div className="section__head">
              <p className="section__intro">
                Two commands build the five systems and run the whole day
                on your own machine, the same day you just read.
              </p>
              <h2 className="titolo-sezione">Run it yourself</h2>
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
                      "== 7 : the line answers, and the floor has the last word"
                    }
                  </span>
                  {"\n"}
                  <span className="o">
                    {
                      "   ok: the tall carton is vetoed, exactly as the routing law says"
                    }
                  </span>
                  {"\n"}
                  <span className="o">
                    {
                      "   ok: the second carton is accepted, exactly as the routing law says"
                    }
                  </span>
                  {"\n\n"}
                  THE DAY CLOSED CLEAN — exit 0
                </pre>
              </div>
              <p className="harness__note">
                every figure on this page comes from a run like this one
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer-card">
        <div className="footer__top">
          <Reveal className="footer__top__text">
            <h3>Five products, one flow.</h3>
            <p>
              One order walks all five, from the lane it lands on to the
              clean close.
            </p>
          </Reveal>
          <Reveal className="footer__top__cta" delay={80}>
            <a className="btn btn--dark" href="#flow">
              see the flow again{" "}
              <span className="btn__arrow" aria-hidden="true">↑</span>
            </a>
          </Reveal>
        </div>
        <div className="footer__bottom">
          <span>© 2026 Sukrut Nadigotti</span>
          <a
            href="https://github.com/SukrutN/manifest"
            target="_blank"
            rel="noreferrer"
          >
            github.com/SukrutN/manifest
          </a>
          <span>MIT license</span>
        </div>
        <p className="foot-mark" aria-hidden="true">MANIFEST</p>
      </footer>
    </>
  );
}
