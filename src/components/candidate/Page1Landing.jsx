import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import {
  Code,
  Cpu,
  Palette,
  ArrowRight,
  Clock,
  Calendar,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Zap,
  Users,
  Award
} from "lucide-react";

export const Page1Landing = () => {
  const { setCurrentView, activeCandidate } = useQuiz();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Who is eligible to apply for Zairza Induction 2026?",
      a: "All 1st year and 2nd year B.Tech, MCA, and Integrated M.Tech students of OUTR Bhubaneswar across all branches are welcome to apply."
    },
    {
      q: "Can I choose more than one wing during registration?",
      a: "You select your primary preferred wing (Software, Robotics & IoT, or Design) plus up to 3 technical interests. During induction workshops, cross-wing collaboration is actively encouraged."
    },
    {
      q: "How does the Online Assessment (OA) work?",
      a: "The test is conducted within an open 24-hour window from Sept 29th (8:00 PM) to Sept 30th (8:00 PM). Once you begin, you have exactly 30 minutes to complete 30 questions across 3 parts (Logical Reasoning, Tech Knowledge, and HR)."
    },
    {
      q: "Can I take the assessment on my smartphone?",
      a: "Yes! The platform is fully optimized for both laptops/desktops and mobile phones. However, background app-switching and screen splitting are strictly monitored by the anti-cheat system."
    },
    {
      q: "What is the marking scheme for the test?",
      a: "Each correct answer carries +1.0 mark. Incorrect answers incur -0.25 negative marking. Unanswered questions carry 0 marks."
    }
  ];

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Background Glows */}
      <div style={{
        position: "absolute",
        top: "-150px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "800px",
        height: "500px",
        background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Hero Section */}
      <section style={{ padding: "80px 0 60px", textAlign: "center", position: "relative" }}>
        <div className="container">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <span className="badge badge-cyan">
              <Sparkles size={13} /> INDUCTION 2026 IS LIVE
            </span>
            <span className="badge badge-emerald">
              <Clock size={13} /> 24-HR OA WINDOW
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
            fontWeight: "900",
            marginBottom: "16px",
            letterSpacing: "-0.02em"
          }}>
            Wonder • Think • <span className="text-gradient">Create</span>
          </h1>

          <p style={{
            maxWidth: "760px",
            margin: "0 auto 32px",
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            color: "var(--text-secondary)",
            lineHeight: "1.7"
          }}>
            Welcome to the flagship induction platform of <strong>Zairza</strong> — The Technical Society of OUTR Bhubaneswar.
            Join an elite fraternity of roboticists, software engineers, and designers building tomorrow's breakthrough tech.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
            {activeCandidate ? (
              <button
                onClick={() => setCurrentView("page9_dashboard")}
                className="btn btn-primary"
                style={{ padding: "14px 32px", fontSize: "1.05rem" }}
              >
                <span>Go to Candidate Dashboard</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => setCurrentView("page2_register")}
                className="btn btn-primary pulse-glow"
                style={{ padding: "14px 32px", fontSize: "1.05rem" }}
              >
                <span>Register for Induction</span>
                <ArrowRight size={18} />
              </button>
            )}

            <button
              onClick={() => setCurrentView("page4_precheck")}
              className="btn btn-secondary"
              style={{ padding: "14px 28px", fontSize: "1.05rem" }}
            >
              <ShieldCheck size={18} color="var(--accent-cyan)" />
              <span>System Compatibility Check</span>
            </button>
          </div>

          {/* Quick Info Matrix */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            maxWidth: "960px",
            margin: "50px auto 0"
          }}>
            <div className="glass-panel" style={{ padding: "20px" }}>
              <Calendar size={22} color="var(--accent-cyan)" style={{ marginBottom: "8px" }} />
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>OA Window</div>
              <div style={{ fontWeight: "700", fontSize: "1rem" }}>29th Sept 8 PM – 30th Sept 8 PM</div>
            </div>

            <div className="glass-panel" style={{ padding: "20px" }}>
              <Clock size={22} color="var(--accent-amber)" style={{ marginBottom: "8px" }} />
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Registration Closes</div>
              <div style={{ fontWeight: "700", fontSize: "1rem" }}>30th Sept, 12:00 PM (Noon)</div>
            </div>

            <div className="glass-panel" style={{ padding: "20px" }}>
              <Zap size={22} color="var(--accent-purple)" style={{ marginBottom: "8px" }} />
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Test Structure</div>
              <div style={{ fontWeight: "700", fontSize: "1rem" }}>30 Questions • 30 Minutes</div>
            </div>

            <div className="glass-panel" style={{ padding: "20px" }}>
              <ShieldCheck size={22} color="var(--accent-emerald)" style={{ marginBottom: "8px" }} />
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Proctoring</div>
              <div style={{ fontWeight: "700", fontSize: "1rem" }}>AI-Telemetry & Tab Guard</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Wings */}
      <section style={{ padding: "60px 0", background: "rgba(13, 18, 29, 0.4)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "45px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "10px" }}>WINGS OF ZAIRZA</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
              Find Your Creative Gravity
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "10px auto 0" }}>
              Zairza thrives at the intersection of bits, circuits, and visual aesthetics.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {/* Wing 1: Software */}
            <div className="glass-panel" style={{ padding: "30px", borderTop: "3px solid var(--accent-cyan)" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(6, 182, 212, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                color: "var(--accent-cyan)"
              }}>
                <Code size={26} />
              </div>
              <h3 style={{ fontSize: "1.4rem", marginBottom: "12px" }}>Software Wing</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
                Architect scalable web applications, dive into systems programming, train machine learning models, and master cloud devops.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <span className="badge badge-cyan">Full-Stack</span>
                <span className="badge badge-cyan">AI / ML</span>
                <span className="badge badge-cyan">App Dev</span>
                <span className="badge badge-cyan">Cybersecurity</span>
              </div>
            </div>

            {/* Wing 2: Robotics & IoT */}
            <div className="glass-panel" style={{ padding: "30px", borderTop: "3px solid var(--accent-purple)" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(139, 92, 246, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                color: "var(--accent-purple)"
              }}>
                <Cpu size={26} />
              </div>
              <h3 style={{ fontSize: "1.4rem", marginBottom: "12px" }}>Robotics & IoT Wing</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
                Bring machines to life. Build autonomous rovers, race drones, program microcontrollers (ESP32/STM32), and deploy ROS nodes.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <span className="badge badge-purple">Drones</span>
                <span className="badge badge-purple">ROS & Slam</span>
                <span className="badge badge-purple">Embedded C</span>
                <span className="badge badge-purple">PCB Design</span>
              </div>
            </div>

            {/* Wing 3: Design */}
            <div className="glass-panel" style={{ padding: "30px", borderTop: "3px solid #ec4899" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(236, 72, 153, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                color: "#ec4899"
              }}>
                <Palette size={26} />
              </div>
              <h3 style={{ fontSize: "1.4rem", marginBottom: "12px" }}>Design Wing</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
                Shape the visual identity of innovation. Create sleek UI/UX prototypes, render 3D assets in Blender, and direct motion graphics.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <span className="badge" style={{ background: "rgba(236, 72, 153, 0.12)", color: "#ec4899", border: "1px solid rgba(236, 72, 153, 0.3)" }}>UI / UX</span>
                <span className="badge" style={{ background: "rgba(236, 72, 153, 0.12)", color: "#ec4899", border: "1px solid rgba(236, 72, 153, 0.3)" }}>3D Blender</span>
                <span className="badge" style={{ background: "rgba(236, 72, 153, 0.12)", color: "#ec4899", border: "1px solid rgba(236, 72, 153, 0.3)" }}>Motion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Induction Process Timeline */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "45px" }}>
            <span className="badge badge-emerald" style={{ marginBottom: "10px" }}>YOUR ROADMAP</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
              The 4-Step Induction Pipeline
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {[
              { step: "01", title: "Registration", desc: "Submit your academic details and OUTR Roll Number before 30th Sept 12:00 PM." },
              { step: "02", title: "Online Assessment (OA)", desc: "Take the 30-minute proctored test anytime during the 24-hr open window." },
              { step: "03", title: "Technical & HR Round", desc: "Shortlisted candidates are invited for peer interviews and domain discussions." },
              { step: "04", title: "Society Onboarding", desc: "Welcome to the family. Receive your workspace access, mentors, and projects." }
            ].map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: "26px", position: "relative" }}>
                <div style={{
                  fontSize: "2.2rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: "900",
                  color: "var(--accent-cyan)",
                  opacity: 0.3,
                  marginBottom: "8px"
                }}>
                  {item.step}
                </div>
                <h4 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>{item.title}</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section style={{ padding: "60px 0 80px", background: "rgba(13, 18, 29, 0.3)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="badge badge-cyan" style={{ marginBottom: "10px" }}>CLARIFICATIONS</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-panel"
                onClick={() => toggleFaq(idx)}
                style={{ padding: "18px 24px", cursor: "pointer", transition: "all 0.2s ease" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                  <div style={{ fontWeight: "600", fontSize: "1.05rem", color: activeFaq === idx ? "var(--accent-cyan)" : "var(--text-main)" }}>
                    {faq.q}
                  </div>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: activeFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                      color: "var(--text-muted)"
                    }}
                  />
                </div>
                {activeFaq === idx && (
                  <div style={{ marginTop: "14px", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA Box */}
          <div className="glass-panel glass-panel-glow" style={{ marginTop: "50px", padding: "35px", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.6rem", marginBottom: "10px" }}>Ready to Make Your Mark?</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
              Induction registrations close strictly at 12:00 PM on 30th September.
            </p>
            <button
              onClick={() => setCurrentView("page2_register")}
              className="btn btn-primary"
              style={{ padding: "12px 30px" }}
            >
              <span>Begin Registration Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
