import React from "react";
import { useQuiz } from "../../context/QuizContext";
import { AlertTriangle, ShieldAlert, ArrowRight } from "lucide-react";

export const Page6ViolationModal = () => {
  const {
    showViolationModal,
    setShowViolationModal,
    violationCount,
    latestViolationMessage,
    quizConfig,
    activeCandidate
  } = useQuiz();

  if (!showViolationModal) return null;

  const maxAllowed = quizConfig.maxViolationsAllowed;
  const isTerminated = violationCount >= maxAllowed;
  const roll = activeCandidate?.rollNumber || "2401106042";

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isTerminated ? "modal-danger" : ""}`} style={{ textAlign: "center" }}>
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: isTerminated ? "rgba(244, 63, 94, 0.2)" : "rgba(245, 158, 11, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          color: isTerminated ? "var(--accent-rose)" : "var(--accent-amber)"
        }}>
          {isTerminated ? <ShieldAlert size={34} /> : <AlertTriangle size={34} />}
        </div>

        <h3 style={{ fontSize: "1.4rem", color: isTerminated ? "var(--accent-rose)" : "var(--accent-amber)", marginBottom: "8px" }}>
          {isTerminated ? "CRITICAL PROCTORING VIOLATION" : "PROCTORING INTEGRITY WARNING"}
        </h3>

        <div style={{
          display: "inline-block",
          padding: "6px 16px",
          borderRadius: "999px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--border-subtle)",
          marginBottom: "16px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.9rem"
        }}>
          Violation Incident: <strong style={{ color: isTerminated ? "var(--accent-rose)" : "var(--accent-amber)" }}>{violationCount} / {maxAllowed}</strong>
        </div>

        <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "16px" }}>
          {latestViolationMessage}
        </p>

        <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "24px" }}>
          Candidate Roll: <span className="mono" style={{ color: "var(--accent-cyan)" }}>{roll}</span>.
          All proctoring events are time-stamped and logged to the central invigilator deck.
        </p>

        {isTerminated ? (
          <div style={{ color: "var(--accent-rose)", fontWeight: "600", fontSize: "0.95rem" }}>
            Maximum violation threshold exceeded. Your quiz is being automatically locked and submitted.
          </div>
        ) : (
          <button
            onClick={() => setShowViolationModal(false)}
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", fontSize: "1rem" }}
          >
            <span>I Understand • Return to Quiz</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
