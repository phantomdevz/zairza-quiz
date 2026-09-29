import React, { useEffect } from "react";
import { useQuiz } from "../../context/QuizContext";
import confetti from "canvas-confetti";
import { CheckCircle2, Calendar, Clock, Award, ArrowRight, Home, Lock, ShieldCheck, ShieldAlert } from "lucide-react";

export const Page8SubmissionSuccess = () => {
  const { activeCandidate, setCurrentView, isEvaluationUnlocked, getUnlockRemainingSeconds } = useQuiz();

  useEffect(() => {
    // Launch celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }
  }, []);

  const roll = activeCandidate?.rollNumber || "2401106042";
  const name = activeCandidate?.fullName || "Aarav Mohapatra";
  const submittedAt = activeCandidate?.submittedAt || new Date().toLocaleTimeString();

  const isUnlocked = isEvaluationUnlocked(activeCandidate);
  const remainingSeconds = getUnlockRemainingSeconds(activeCandidate);

  const formatRemaining = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="container" style={{ padding: "60px 20px 80px", maxWidth: "680px", textAlign: "center" }}>
      <div className="glass-panel glass-panel-glow" style={{ padding: "45px 30px" }}>
        {/* Animated Check Icon */}
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          color: "var(--accent-emerald)"
        }}>
          <CheckCircle2 size={42} />
        </div>

        <span className="badge badge-emerald" style={{ marginBottom: "12px" }}>
          STATUS: COMPLETED ✓
        </span>

        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", marginBottom: "10px" }}>
          Induction Quiz Submitted Successfully
        </h1>

        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6", maxWidth: "520px", margin: "0 auto 30px" }}>
          Thank you, <strong>{name}</strong>! Your 30 responses across all three parts have been securely recorded in the Zairza induction database.
        </p>

        {/* Candidate Receipt Card */}
        <div style={{
          background: "rgba(13, 18, 29, 0.8)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "14px",
          padding: "20px 24px",
          textAlign: "left",
          marginBottom: "24px"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Registration Number</div>
              <div className="mono" style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--accent-cyan)" }}>
                {roll}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Submission Time</div>
              <div className="mono" style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
                {submittedAt}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Assessment Mode</div>
              <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>24-Hr Induction Quiz</div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Integrity Status</div>
              <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--accent-emerald)" }}>Verified Clean Attempt</div>
            </div>
          </div>
        </div>

        {/* 15-Minute Security Review Window Banner */}
        {!isUnlocked ? (
          <div style={{
            padding: "22px",
            borderRadius: "12px",
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            textAlign: "left",
            marginBottom: "30px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-amber)", fontWeight: "800", fontSize: "0.95rem" }}>
                <Lock size={18} />
                <span>15-MINUTE SECURITY REVIEW PROTOCOL ACTIVE</span>
              </div>
              <div className="mono" style={{
                background: "rgba(0, 0, 0, 0.6)",
                border: "1px solid rgba(245, 158, 11, 0.5)",
                padding: "4px 12px",
                borderRadius: "6px",
                color: "var(--accent-amber)",
                fontWeight: "700",
                fontSize: "1.05rem"
              }}>
                Unlocks in {formatRemaining(remainingSeconds)}
              </div>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.6", margin: "0 0 12px" }}>
              To ensure 100% exam integrity during the 24-hr quiz window, correct answers and detailed scorecards are locked for <strong>15 minutes</strong>. Both your <strong>Performance Scorecard</strong> and the <strong>Ideathon Problem Statements (PS)</strong> will unlock automatically when the countdown completes.
            </p>

            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              🗓️ <strong>Next Stage:</strong> Ideathon presentation &amp; Personal Interviews (PI) run from <strong>1st October to 3rd October</strong>, followed by the announcement of the <strong>Final Inductees List</strong>.
            </div>
          </div>
        ) : (
          <div style={{
            padding: "20px",
            borderRadius: "12px",
            background: "rgba(47, 91, 255, 0.08)",
            border: "1px solid rgba(47, 91, 255, 0.35)",
            textAlign: "left",
            marginBottom: "30px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--blue)", fontWeight: "800", fontSize: "1rem", marginBottom: "8px" }}>
              <ShieldCheck size={18} />
              <span>⚡ NEXT STAGE UNLOCKED: IDEATHON PROBLEM STATEMENTS (PS)</span>
            </div>
            <p style={{ color: "#dbe3f5", fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 12px" }}>
              Your 15-minute review window is complete! You now have direct access to your verified scorecard and all 4 domain <strong>Ideathon Problem Statements</strong> on your dashboard.
            </p>
            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              🗓️ <strong>Timeline:</strong> Ideathon presentation &amp; Personal Interviews (PI) run from <strong>1st October to 3rd October</strong>. Following this, the <strong>Final Inductees List</strong> will be released.
            </div>
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px" }}>
          <button
            onClick={() => setCurrentView("page9_dashboard")}
            className="btn btn-primary"
            style={{ padding: "12px 28px" }}
          >
            <span>Go to Candidate Dashboard</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => setCurrentView("page10_results")}
            className="btn btn-secondary"
            style={{ padding: "12px 24px" }}
          >
            <Award size={16} color="var(--accent-cyan)" />
            <span>{!isUnlocked ? `View Scorecard Status (${formatRemaining(remainingSeconds)})` : "View Verified Scorecard"}</span>
          </button>

          <button
            onClick={() => setCurrentView("page1_landing")}
            className="btn btn-secondary"
            style={{ padding: "12px 20px" }}
          >
            <Home size={16} />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
