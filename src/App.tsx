import { m } from "motion/react";
import { useRef } from "react";
import {
  AccessibleAccordion,
  AccessibleTabs,
  ActiveSectionNav,
  CeremonialGate,
  DepthPlane,
  DepthScene,
  HorizontalStoryTrack,
  InkRevealText,
  MotionProvider,
  PageProgress,
  Reveal,
  TriggeredPassage,
} from "./framework";

const navItems = [
  { id: "arrival", label: "Arrival" },
  { id: "passage", label: "Passage" },
  { id: "workflow", label: "Workflow" },
  { id: "field-notes", label: "Field notes" },
];

const configSnippet = `{
  "chapters": [
    { "id": "arrival", "motionMode": "reveal" },
    { "id": "workflow", "motionMode": "static" }
  ],
  "motion": {
    "nativeScrolling": true,
    "globalScene": false,
    "maxLocalScrollStories": 1
  }
}`;

function LeafPassage() {
  return (
    <TriggeredPassage className="demo-leaves">
      {(playing, reducedMotion) => playing && !reducedMotion && Array.from({ length: 5 }, (_, index) => (
        <m.i
          key={index}
          data-leaf={index}
          initial={{ opacity: 0, x: "-12vw", y: `${-16 + index * 7}vh`, rotateX: -55, rotateY: index % 2 ? 70 : -70, rotateZ: -18, scale: 0.7 }}
          animate={{ opacity: [0, 0.86, 0.82, 0], x: ["-12vw", "22vw", "58vw", "108vw"], y: [`${-16 + index * 7}vh`, `${22 + index * 4}vh`, `${56 + index * 5}vh`, `${112 + index * 2}vh`], rotateX: [-55, 35, 135, 235], rotateY: [index % 2 ? 70 : -70, 0, index % 2 ? -105 : 105, index % 2 ? -210 : 210], rotateZ: [-18, 24, 78, 132], scale: [0.7, 0.9, 1.04, 0.82] }}
          transition={{ duration: 5.2, delay: index * 0.32, ease: "linear", times: [0, 0.3, 0.64, 1] }}
        />
      ))}
    </TriggeredPassage>
  );
}

function Experience({ cycle, replay }: { cycle: number; replay: () => void }) {
  const storyRef = useRef<HTMLElement>(null);

  return (
    <>
      <PageProgress />
      <header className="site-header">
        <a className="site-mark" href="#arrival" aria-label="Cinematic Web Framework home">CW</a>
        <ActiveSectionNav items={navItems} />
      </header>

      <main>
        <section className="demo-hero" id="arrival" aria-labelledby="arrival-title">
          <DepthScene className="hero-world">
            <DepthPlane className="sun-plane"><span /></DepthPlane>
            <DepthPlane className="ridge-plane ridge-back"><span /></DepthPlane>
            <DepthPlane className="ridge-plane ridge-front"><span /></DepthPlane>
            <DepthPlane className="river-plane"><span /></DepthPlane>
          </DepthScene>
          <div className="hero-copy">
            <p className="eyebrow">A motion-first field guide</p>
            <InkRevealText as="h1" className="hero-title" cycle={cycle} duration={7} lines={["Make the", "story move"]} />
            <p>Build responsive editorial experiences with cinematic depth, native scrolling, and accessibility that survives the spectacle.</p>
            <a className="text-link" href="#passage">Follow the current <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section className="story-section" id="passage" ref={storyRef} aria-labelledby="passage-title">
          <div className="story-sticky">
            <HorizontalStoryTrack targetRef={storyRef}>
              <article className="story-panel panel-dawn">
                <Reveal><p className="eyebrow">01 · Compose</p><h2 id="passage-title">Give every chapter one clear job.</h2><p>Start with hierarchy and reading order. Add depth only when it clarifies arrival, transition, or emphasis.</p></Reveal>
              </article>
              <article className="story-panel panel-day">
                <div><p className="eyebrow">02 · Choreograph</p><h2>Let motion belong to the section.</h2><p>Finite entrances and local scroll stories stay responsive because the entire page is never one expensive scene.</p></div>
              </article>
              <article className="story-panel panel-dusk">
                <div><p className="eyebrow">03 · Settle</p><h2>Finish where interaction matters.</h2><p>Forms and decisions stay still. Reduced-motion visitors receive the complete composition without waiting.</p></div>
              </article>
            </HorizontalStoryTrack>
          </div>
        </section>

        <section className="workflow-section" id="workflow" aria-labelledby="workflow-title">
          <div className="workflow-orbit" aria-hidden="true"><i /><i /><i /></div>
          <Reveal className="workflow-intro">
            <p className="eyebrow">Agent development protocol</p>
            <h2 id="workflow-title">Context before choreography.</h2>
            <p>LLM collaborators move quickly. The framework gives them a durable contract so speed does not erase intent, mobile composition, or engineering judgment.</p>
          </Reveal>
          <ol className="workflow-steps" aria-label="Agent workflow">
            <li><span>01</span><strong>Context</strong><p>Separate verified truth from assumptions and define the first-viewport promise.</p></li>
            <li><span>02</span><strong>Compose</strong><p>Give every chapter one job, one mobile strategy, and one motion mode.</p></li>
            <li><span>03</span><strong>Choreograph</strong><p>Add bounded Motion only after semantics, controls, and fallbacks work.</p></li>
            <li><span>04</span><strong>Validate</strong><p>Run structural, accessibility, responsive, performance, and privacy gates.</p></li>
          </ol>
          <Reveal className="config-example" delay={0.12}>
            <div>
              <p className="eyebrow">Machine-readable contract</p>
              <h3>One config agents and CI can share.</h3>
              <p>Budgets and exceptions stay reviewable. The deployed experience contains no model SDK or prompt API.</p>
            </div>
            <pre aria-label="Example cinematic configuration"><code>{configSnippet}</code></pre>
          </Reveal>
        </section>

        <section className="notes-section" id="field-notes" aria-labelledby="notes-title">
          <LeafPassage />
          <Reveal className="notes-heading">
            <p className="eyebrow">Field notes</p>
            <h2 id="notes-title">A strong system makes restraint repeatable.</h2>
            <p>The framework includes accessible disclosure patterns, performance guardrails, and durable planning templates—not just animation snippets.</p>
          </Reveal>
          <div className="notes-grid">
            <Reveal className="paper-panel" delay={0.08}>
              <AccessibleTabs label="Framework principles" items={[
                { id: "motion", label: "Motion", content: "Use transform and opacity for finite, section-local choreography. Keep native scrolling authoritative." },
                { id: "mobile", label: "Mobile", content: "Art-direct the small screen as its own composition. Reduce depth and traffic, not meaning." },
                { id: "access", label: "Access", content: "Every interaction needs semantic content, keyboard operation, visible focus, and a reduced-motion result." },
              ]} />
            </Reveal>
            <Reveal className="paper-panel" delay={0.16}>
              <AccessibleAccordion items={[
                { title: "Why no global cinematic scene?", content: "It couples every chapter to scroll position, increases paint cost, and makes mobile tuning brittle." },
                { title: "Can this connect to a backend?", content: "Yes. Keep persistence and email behind adapters so animated presentation never owns transaction state." },
                { title: "What should load first?", content: "Only first-viewport essentials. Reserve dimensions, lazy-load later visuals, and measure the built output." },
              ]} />
            </Reveal>
          </div>
        </section>

        <section className="quiet-form" id="quiet-zone" aria-labelledby="form-title">
          <div>
            <p className="eyebrow">The quiet zone</p>
            <h2 id="form-title">Let the interface settle when the user acts.</h2>
            <p>This static form demonstrates the adapter boundary. Connect submission to your own API without coupling data state to decorative motion.</p>
          </div>
          <form onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com" />
            <label htmlFor="note">What are you making?</label>
            <textarea id="note" rows={3} />
            <button type="submit">Save locally</button>
          </form>
        </section>
      </main>

      <footer>
        <p>Cinematic Web Framework · React + Motion</p>
        <div><a href="https://github.com/evoltriet/cinematic-web-starter">View source</a><button type="button" onClick={replay}>Replay opening</button></div>
      </footer>
    </>
  );
}

export default function App() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  return (
    <MotionProvider>
      <CeremonialGate focusTargetRef={titleRef} enterLabel="Open the field guide" recipient="A small study in depth">
        {({ cycle, replay, revealed }) => <div ref={(node) => { if (node) titleRef.current = node.querySelector("h1"); }}>{revealed ? <Experience cycle={cycle} replay={replay} /> : null}</div>}
      </CeremonialGate>
    </MotionProvider>
  );
}
