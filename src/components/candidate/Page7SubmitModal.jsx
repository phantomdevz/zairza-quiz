import React from "react";
import { useQuiz } from "../../context/QuizContext";
import { Send, AlertCircle, CheckCircle, Bookmark, Clock, X } from "lucide-react";

export const Page7SubmitModal = () => {
  const {
    showSubmitModal,
    setShowSubmitModal,
    handleFinalSubmit,
    questions,
    answers,
    markedForReview,
    timeRemaining,
    quizConfig
  } = useQuiz();

  if (!showSubmitModal) return null;

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "560px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <Send size={20} color="var(--accent-cyan)" />
            <span>Confirm Final Submission</span>
          </h3>
          <button
            onClick={() => setShowSubmitModal(false)}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "20px" }}>
          Please review your test attempt summary before finalizing. Once submitted, your response will be locked permanently.
        </p>

        {/* Metric Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
          <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", textAlign: "center" }}>
            <div className="mono" style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--accent-emerald)" }}>
              {answeredCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Answered</div>
          </div>

          <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
            <div className="mono" style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--text-secondary)" }}>
              {unansweredCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Unanswered</div>
          </div>

          <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.3)", textAlign: "center" }}>
            <div className="mono" style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--accent-purple)" }}>
              {markedCount}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Review</div>
          </div>
        </div>

        {/* Section Breakdown Mini Table */}
        <div style={{ background: "rgba(0, 0, 0, 0.3)", borderRadius: "10px", padding: "14px", marginBottom: "20px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
            Sectional Completion:
          </div>
          {quizConfig.sections.map((sec) => {
            const secAns = questions.filter((q) => q.section === sec.id && answers[q.id] !== undefined).length;
            return (
              <div key={sec.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", padding: "4px 0" }}>
                <span style={{ color: "var(--text-secondary)" }}>{sec.name}</span>
                <span className="mono" style={{ fontWeight: "700", color: secAns === sec.total ? "var(--accent-emerald)" : "var(--accent-cyan)" }}>
                  {secAns} / {sec.total}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-amber)", fontSize: "0.88rem", marginBottom: "24px" }}>
          <Clock size={16} />
          <span>You still have <strong>{formatTime(timeRemaining)}</strong> remaining.</span>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            onClick={() => setShowSubmitModal(false)}
            className="btn btn-secondary"
            style={{ padding: "10px 18px", fontSize: "0.9rem" }}
          >
            Return to Questions
          </button>

          <button
            onClick={() => handleFinalSubmit("MANUAL_CONFIRMED")}
            className="btn btn-primary"
            style={{ padding: "10px 24px", fontSize: "0.9rem" }}
          >
            <span>Yes, Submit Final Responses</span>
            <CheckCircle size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
