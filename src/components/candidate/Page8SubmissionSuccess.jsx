import React, { useEffect } from "react";
import { useQuiz } from "../../context/QuizContext";
import confetti from "canvas-confetti";
import { CheckCircle2, Calendar, Clock, Award, ArrowRight, Home } from "lucide-react";

export const Page8SubmissionSuccess = () => {
  const { activeCandidate, setCurrentView } = useQuiz();

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
          Assessment Submitted Successfully
        </h1>

        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto 30px" }}>
          Thank you, <strong>{name}</strong>! Your 30 responses across all three parts have been securely recorded and locked in the Zairza induction database.
        </p>

        {/* Candidate Receipt Card */}
        <div style={{
          background: "rgba(13, 18, 29, 0.8)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "14px",
          padding: "20px 24px",
          textAlign: "left",
          marginBottom: "30px"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>OUTR Roll Number</div>
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
              <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>24-Hr Online Assessment</div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Integrity Status</div>
              <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--accent-emerald)" }}>Verified Clean Attempt</div>
            </div>
          </div>
        </div>

        {/* Notice on Results */}
        <div style={{
          padding: "16px",
          borderRadius: "10px",
          background: "rgba(6, 182, 212, 0.08)",
          border: "1px solid rgba(6, 182, 212, 0.25)",
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
          lineHeight: "1.5",
          marginBottom: "30px"
        }}>
          <strong>Results Announcement:</strong> Assessment evaluations are kept confidential while the 24-hour OA window remains open. Final shortlists for the Technical & HR interview rounds will be declared on the candidate portal.
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px" }}>
          <button
            onClick={() => setCurrentView("page9_dashboard")}
            className="btn btn-primary"
            style={{ padding: "12px 28px" }}
          >
            <span>Candidate Dashboard</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => setCurrentView("page10_results")}
            className="btn btn-secondary"
            style={{ padding: "12px 24px" }}
          >
            <Award size={16} color="var(--accent-cyan)" />
            <span>Preview Performance Scorecard</span>
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
