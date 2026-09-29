import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";

export const Page1Landing = () => {
  const { setCurrentView, activeCandidate } = useQuiz();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Do I need to know coding already?",
      a: "No. The induction is designed for beginners. Curiosity matters more than experience."
    },
    {
      q: "Who can register?",
      a: "1st and 2nd year students from any branch of OUTR Bhubaneswar."
    },
    {
      q: "How does the 24-hour OA window work?",
      a: "The test opens at 8:00 PM on 29th September and closes at 8:00 PM on 30th September. Once you initiate your test, you receive 30 minutes to solve 30 questions across Logical Reasoning, Tech Knowledge, and HR."
    },
    {
      q: "Can I take the quiz on a phone or laptop?",
      a: "Both are supported! The interface adapts smoothly to mobile devices with a touch-friendly bottom sheet question drawer."
    },
    {
      q: "When does registration close?",
      a: "Registration strictly closes at 12:00 PM (Noon) on 30th September. No new registrations will be accepted after that."
    }
  ];

  return (
    <div className="wrap" style={{ paddingTop: "40px", paddingBottom: "80px" }}>
      {/* Retro Cyber Window (Hero) */}
      <div className="win">
        <div className="bar">
          <span>fresher.exe · initializing...</span>
          <span>▁ ▢ ✕</span>
        </div>
        <div className="body">
          <h1 style={{
            margin: 0,
            fontWeight: 800,
            fontSize: "clamp(3.4rem, 15vw, 9.5rem)",
            lineHeight: 0.88,
            letterSpacing: "-.045em",
            textShadow: "-3px 0 var(--blue)"
          }}>
            ZAIRZA
          </h1>
          <p style={{
            margin: ".35em 0 0",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 7vw, 4.4rem)",
            letterSpacing: "-.03em",
            lineHeight: 1
          }}>
            CLUB <em style={{ fontStyle: "normal", color: "var(--coral)" }}>INDUCTIONS 2026</em>
          </p>
          <p style={{ margin: "22px 0 0", font: "400 .95rem var(--mono)", color: "var(--mut)" }}>
            Found 1 recommended fix for high entropy &amp; chaos.
          </p>
          <p style={{ margin: "26px 0 0", font: "600 1rem var(--mono)", letterSpacing: ".08em", color: "var(--coral)" }}>
            WONDER • THINK • CREATE
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "38px" }}>
            {activeCandidate ? (
              <button
                onClick={() => setCurrentView("page9_dashboard")}
                className="btn"
              >
                [ Go to Candidate Dashboard → ]
              </button>
            ) : (
              <button
                onClick={() => setCurrentView("page2_register")}
                className="btn"
              >
                [ Register for Induction → ]
              </button>
            )}
            <button
              onClick={() => setCurrentView("page4_precheck")}
              className="btn ghost"
            >
              [ System Diagnostic Check ]
            </button>
          </div>
        </div>
      </div>

      {/* Section: ~/about */}
      <section id="about" style={{ paddingTop: "76px" }}>
        <div className="path">~/about</div>
        <h2 style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", lineHeight: 1, letterSpacing: "-.03em", margin: "0 0 10px", fontWeight: 800 }}>
          A system update for 1st &amp; 2nd years.
        </h2>
        <p className="lead">
          Zairza is the tech and design club of our campus, where students learn by building real things. If you feel behind, unsure what to pick, or just curious, this is where you start.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
          <div className="card">
            <h3>What we do</h3>
            <p>We run workshops, build projects in teams, hold skill sprints, and pair newcomers with seniors. You learn by shipping, not by watching tutorials alone.</p>
          </div>
          <div className="crash">
            Traceback (most recent call last):<br />
            &nbsp; File "semester1.py", line 1<br />
            &nbsp; &nbsp; plan = figure_it_out()<br />
            RuntimeError: too many options<br /><br />
            &gt; fix available: join Zairza
          </div>
        </div>
      </section>

      {/* Section: ~/wings */}
      <section id="wings" style={{ paddingTop: "76px" }}>
        <div className="path">~/wings</div>
        <h2 style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", lineHeight: 1, letterSpacing: "-.03em", margin: "0 0 10px", fontWeight: 800 }}>
          Three wings. Pick your lane.
        </h2>
        <p className="lead">You don't need to know your path yet. Each wing welcomes complete beginners.</p>
        <div className="wings">
          <div className="card wing">
            <h3>Software</h3>
            <p>Web, apps, DSA, and ML. Write code that people use.</p>
            <span className="mono">DSA / DEV / ML</span>
          </div>
          <div className="card wing">
            <h3>Robotics &amp; IoT</h3>
            <p>Microcontrollers, sensors, and robots you can hold in your hand.</p>
            <span className="mono">MCU / SENSORS / ARMS</span>
          </div>
          <div className="card wing">
            <h3>Design</h3>
            <p>UI, UX, and visual identity. Make things that look and feel right.</p>
            <span className="mono">UI / UX / BRAND</span>
          </div>
        </div>
      </section>

      {/* Section: ~/why-join */}
      <section id="why" style={{ paddingTop: "76px" }}>
        <div className="path">~/why-join</div>
        <h2 style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", lineHeight: 1, letterSpacing: "-.03em", margin: "0 0 10px", fontWeight: 800 }}>
          Patch notes: v1.0 → you, stable.
        </h2>
        <p className="lead">Here is what you get when you install the update.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px 32px", marginBottom: "34px", fontFamily: "var(--mono)", fontWeight: 700, fontSize: "1.1rem" }}>
          <div><span style={{ color: "var(--blue)" }}>+ </span>Tech workshops</div>
          <div><span style={{ color: "var(--blue)" }}>+ </span>Mentorship from seniors</div>
          <div><span style={{ color: "var(--blue)" }}>+ </span>Hackathons &amp; Events</div>
          <div><span style={{ color: "var(--blue)" }}>+ </span>Hardware Lab &amp; Drones</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
          <div className="card">
            <h3>What you can learn</h3>
            <p>Python and DSA basics, full-stack web development, ROS and autonomous drones, PCB design, 3D modelling in Blender, and Figma UI/UX prototyping.</p>
          </div>
          <div className="card">
            <h3>What you can build</h3>
            <p>Production web and mobile apps, smart IoT gadgets, robotic rovers, ML computer vision models, and verified project portfolios.</p>
          </div>
        </div>
      </section>

      {/* Section: ~/process */}
      <section id="process" style={{ paddingTop: "76px" }}>
        <div className="path">~/process</div>
        <h2 style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", lineHeight: 1, letterSpacing: "-.03em", margin: "0 0 10px", fontWeight: 800 }}>
          How induction works
        </h2>
        <p className="lead">Four steps from curious to inducted.</p>
        <ol className="steps">
          <li>
            <b>1. Register</b>
            <span>Fill in the induction form with your details, OUTR Roll Number, and preferred wing before 30th Sept 12:00 PM.</span>
          </li>
          <li>
            <b>2. Attend the Online Assessment (OA)</b>
            <span>A 30-minute proctored test across 3 parts: Logical Reasoning, Tech Knowledge, and HR. Open from 29th Sept 8 PM to 30th Sept 8 PM.</span>
          </li>
          <li>
            <b>3. Get shortlisted</b>
            <span>Interview shortlists announced based on sectional thresholds and domain strengths.</span>
          </li>
          <li>
            <b>4. Get inducted</b>
            <span>Join your wing, meet your mentors, and start your first project sprint in the club lab.</span>
          </li>
        </ol>
      </section>

      {/* Section: ~/quiz */}
      <section id="quiz" style={{ paddingTop: "76px" }}>
        <div className="path">~/quiz</div>
        <h2 style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", lineHeight: 1, letterSpacing: "-.03em", margin: "0 0 10px", fontWeight: 800 }}>
          Online Assessment details
        </h2>
        <div className="specs">
          <div className="spec">
            <small>OA WINDOW</small>
            <strong>29th 8 PM – 30th 8 PM</strong>
          </div>
          <div className="spec">
            <small>REGISTRATION CLOSE</small>
            <strong>30th Sept, 12:00 PM</strong>
          </div>
          <div className="spec">
            <small>DURATION &amp; FORMAT</small>
            <strong>30 Mins · 30 Questions</strong>
          </div>
        </div>

        <div className="card">
          <h3>Assessment &amp; Anti-Cheat Rules</h3>
          <ul style={{ margin: "14px 0 0", paddingLeft: "1.2em", color: "#c5c9d4", lineHeight: "1.8" }}>
            <li>Candidates must enter with a verified university OUTR Roll Number.</li>
            <li>3 Distinct Sections: Logical Reasoning (10 Qs), Tech Knowledge (15 Qs), HR &amp; Cultural Fit (5 Qs).</li>
            <li>Full screen and focus monitoring active. Tab switching triggers violation warnings.</li>
            <li>Exceeding 3 infractions causes automated attempt submission.</li>
            <li>Mobile and laptop both supported with dynamic watermark matrix.</li>
          </ul>
        </div>
      </section>

      {/* Section: ~/faq */}
      <section id="faq" style={{ paddingTop: "76px" }}>
        <div className="path">~/faq</div>
        <h2 style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", lineHeight: 1, letterSpacing: "-.03em", margin: "0 0 10px", fontWeight: 800 }}>
          Questions
        </h2>
        <div style={{ marginTop: "20px" }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="card"
              onClick={() => toggleFaq(idx)}
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "16px 20px",
                border: activeFaq === idx ? "1px solid var(--red)" : "1px solid var(--line)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700 }}>
                <span>{faq.q}</span>
                <span className="mono" style={{ color: "var(--red)", fontSize: "1.2rem" }}>
                  {activeFaq === idx ? "–" : "+"}
                </span>
              </div>
              {activeFaq === idx && (
                <p style={{ marginTop: "12px", borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Window */}
      <div className="win" style={{ marginTop: "76px", boxShadow: "12px 12px 0 var(--blue)", transform: "rotate(0.5deg)" }}>
        <div className="bar">
          <span>~/register · final_call</span>
          <span>● ● ●</span>
        </div>
        <div className="body">
          <h2 style={{ fontSize: "clamp(2rem, 6vw, 3.8rem)", marginBottom: "10px" }}>
            Install the update.
          </h2>
          <p className="lead" style={{ marginBottom: "26px" }}>
            Stop panicking. Register for Zairza Induction 2026 and get your first fix for chaos.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
            <button
              onClick={() => setCurrentView("page2_register")}
              className="btn"
            >
              [ Register for Induction → ]
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "28px" }}>
            {["Email", "Instagram", "LinkedIn", "GitHub", "Discord"].map((link) => (
              <span key={link} className="chip" style={{ cursor: "pointer", fontSize: "0.8rem" }}>
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
