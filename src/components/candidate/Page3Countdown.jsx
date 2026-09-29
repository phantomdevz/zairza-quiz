import React, { useState, useEffect } from "react";
import { useQuiz } from "../../context/QuizContext";
import { CheckCircle2, Clock, Calendar, Shield, AlertTriangle, ArrowRight, Laptop, Smartphone } from "lucide-react";

export const Page3Countdown = () => {
  const { activeCandidate, setCurrentView, startQuiz } = useQuiz();

  // Simulated OA status
  // 24-hr OA Window: 29th Sept 8 PM to 30th Sept 8 PM
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 37 });
  const [isLive, setIsLive] = useState(true); // Can toggle or test live mode immediately

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const candidateRoll = activeCandidate ? activeCandidate.rollNumber : "2401106042";
  const candidateName = activeCandidate ? activeCandidate.fullName : "Candidate";
  const candidateWing = activeCandidate ? activeCandidate.preferredWing : "Software";

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "800px" }}>
      {/* Registration Success Badge */}
      <div className="glass-panel" style={{ padding: "28px", textAlign: "center", marginBottom: "30px", borderTop: "3px solid var(--accent-emerald)" }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          color: "var(--accent-emerald)"
        }}>
          <CheckCircle2 size={32} />
        </div>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "6px" }}>Registration Successful</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Welcome aboard, <strong>{candidateName}</strong>! Your application has been logged for Induction 2026.
        </p>

        {/* Candidate Identifier Chip */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "16px",
          marginTop: "16px",
          padding: "10px 20px",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)"
        }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>OUTR Roll Number</div>
            <div className="mono" style={{ fontWeight: "700", color: "var(--accent-cyan)", fontSize: "1.05rem" }}>
              {candidateRoll}
            </div>
          </div>
          <div style={{ width: "1px", height: "30px", background: "var(--border-subtle)" }} />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Preferred Wing</div>
            <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{candidateWing}</div>
          </div>
        </div>
      </div>

      {/* Countdown Clock HUD */}
      <div className="glass-panel glass-panel-glow" style={{ padding: "35px", textAlign: "center", marginBottom: "30px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          {isLive ? (
            <span className="badge badge-emerald">
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-emerald)", display: "inline-block", animation: "pulseGlow 1.5s infinite" }} />
              ASSESSMENT IS CURRENTLY LIVE
            </span>
          ) : (
            <span className="badge badge-amber">
              <Clock size={13} /> ASSESSMENT STARTS IN
            </span>
          )}
        </div>

        {/* Big Digital Clock */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "14px",
          margin: "20px 0 25px"
        }}>
          {[
            { val: String(timeLeft.hours).padStart(2, "0"), label: "HOURS" },
            { val: String(timeLeft.minutes).padStart(2, "0"), label: "MINUTES" },
            { val: String(timeLeft.seconds).padStart(2, "0"), label: "SECONDS" }
          ].map((item, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <div
                className="mono"
                style={{
                  background: "rgba(13, 18, 29, 0.9)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: "800",
                  minWidth: "90px",
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)"
                }}
              >
                {item.val}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "6px", letterSpacing: "0.08em" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "25px" }}>
          <strong>Window:</strong> 29th Sept 8:00 PM – 30th Sept 8:00 PM • <strong>Total Duration:</strong> 30 Minutes
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
          <button
            onClick={() => setCurrentView("page4_precheck")}
            className="btn btn-primary pulse-glow"
            style={{ padding: "14px 34px", fontSize: "1.05rem" }}
          >
            <span>Proceed to System Diagnostics</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Rules & Requirements Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h4 style={{ fontSize: "1.1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-cyan)" }}>
            <Laptop size={18} />
            <span>Device Requirements</span>
          </h4>
          <ul style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.7", paddingLeft: "18px" }}>
            <li>Compatible with Chrome, Edge, Firefox, Brave, and Safari.</li>
            <li>Mobile and laptop both supported with adaptive HUD.</li>
            <li>Stable internet connection required for server auto-save.</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: "24px" }}>
          <h4 style={{ fontSize: "1.1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-rose)" }}>
            <AlertTriangle size={18} />
            <span>Anti-Cheat Notice</span>
          </h4>
          <ul style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.7", paddingLeft: "18px" }}>
            <li>Switching tabs or minimizing the browser triggers violations.</li>
            <li>Exceeding 3 recorded infractions triggers auto-submission.</li>
            <li>Your Roll Number is watermarked dynamically across the viewport.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
