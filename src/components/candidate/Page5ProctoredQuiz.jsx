import React from "react";
import { useQuiz } from "../../context/QuizContext";
import {
  Clock,
  Shield,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  Send,
  Grid,
  X
} from "lucide-react";

export const Page5ProctoredQuiz = () => {
  const {
    questions,
    quizConfig,
    activeCandidate,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentSectionId,
    setCurrentSectionId,
    answers,
    selectOption,
    markedForReview,
    toggleMarkForReview,
    clearAnswer,
    timeRemaining,
    violationCount,
    setShowSubmitModal,
    mobilePaletteOpen,
    setMobilePaletteOpen
  } = useQuiz();

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const roll = activeCandidate?.rollNumber || "2401106042";

  // Format timer MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;
  const isMarked = markedForReview[currentQ.id];
  const isAnswered = answers[currentQ.id] !== undefined;

  // Jump to specific question
  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    const targetQ = questions[index];
    if (targetQ && targetQ.section !== currentSectionId) {
      setCurrentSectionId(targetQ.section);
    }
    setMobilePaletteOpen(false);
  };

  // Switch section tabs
  const handleSectionTabClick = (sectionId) => {
    setCurrentSectionId(sectionId);
    const targetSection = quizConfig.sections.find((s) => s.id === sectionId);
    if (targetSection) {
      setCurrentQuestionIndex(targetSection.startQ - 1);
    }
  };

  // Calculate answered count for a section
  const getSectionAnsweredCount = (sectionId) => {
    return questions
      .filter((q) => q.section === sectionId)
      .filter((q) => answers[q.id] !== undefined).length;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
      {/* Quiz Top HUD */}
      <div style={{
        height: "64px",
        background: "rgba(13, 18, 29, 0.95)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 500
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="badge badge-cyan mono" style={{ fontSize: "0.85rem", padding: "6px 12px" }}>
            ROLL: {roll}
          </div>
          <div className="badge badge-emerald" style={{ display: "none", md: "inline-flex" }}>
            <Wifi size={13} /> ONLINE
          </div>
          <div className={`badge ${violationCount > 0 ? "badge-amber" : "badge-cyan"}`}>
            <Shield size={13} /> {violationCount} / {quizConfig.maxViolationsAllowed} VIOLATIONS
          </div>
        </div>

        {/* Center Countdown Clock */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: timeRemaining < 300 ? "rgba(244, 63, 94, 0.2)" : "rgba(255, 255, 255, 0.04)",
          border: timeRemaining < 300 ? "1px solid var(--accent-rose)" : "1px solid var(--border-subtle)",
          padding: "6px 16px",
          borderRadius: "10px"
        }}>
          <Clock size={16} color={timeRemaining < 300 ? "var(--accent-rose)" : "var(--accent-cyan)"} />
          <span
            className="mono"
            style={{
              fontWeight: "800",
              fontSize: "1.15rem",
              color: timeRemaining < 300 ? "var(--accent-rose)" : "var(--text-main)"
            }}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Right Action / Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            Answered: <strong style={{ color: "var(--accent-cyan)" }}>{answeredCount}</strong> / {quizConfig.totalQuestions}
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn btn-primary"
            style={{ padding: "8px 18px", fontSize: "0.88rem", minHeight: "38px" }}
          >
            <Send size={15} />
            <span>Finish & Submit</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="container" style={{ flex: 1, padding: "24px 20px 80px", maxWidth: "1280px" }}>
        {/* Section Switcher Bar */}
        <div className="section-tabs">
          {quizConfig.sections.map((sec) => {
            const isActive = currentSectionId === sec.id;
            const count = getSectionAnsweredCount(sec.id);
            return (
              <button
                key={sec.id}
                onClick={() => handleSectionTabClick(sec.id)}
                className={`section-tab-btn ${isActive ? "active" : ""}`}
              >
                <span>{sec.icon}</span>
                <span>{sec.name}</span>
                <span
                  className="mono"
                  style={{
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background: isActive ? "rgba(6, 182, 212, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    color: isActive ? "var(--accent-cyan)" : "var(--text-muted)"
                  }}
                >
                  {count}/{sec.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Desktop Grid / 1-Column Mobile Grid */}
        <div
          className="quiz-layout-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "24px",
            alignItems: "start"
          }}
        >
          {/* Left Column: Active Question Stage */}
          <div className="glass-panel" style={{ padding: "30px", minHeight: "480px", display: "flex", flexDirection: "column" }}>
            {/* Question Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="badge badge-cyan mono">Q{currentQ.id} of {quizConfig.totalQuestions}</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{currentQ.sectionTitle}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge badge-emerald">+1.0 Mark</span>
                <span className="badge badge-rose">-0.25 Mark</span>
              </div>
            </div>

            {/* Question Prompt */}
            <h2 style={{ fontSize: "1.25rem", lineHeight: "1.6", fontWeight: "600", marginBottom: "26px" }}>
              {currentQ.prompt}
            </h2>

            {/* Options List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === opt.id;
                const letter = String.fromCharCode(65 + idx); // A, B, C, D
                return (
                  <div
                    key={opt.id}
                    onClick={() => selectOption(currentQ.id, opt.id)}
                    className={`option-card ${isSelected ? "selected" : ""}`}
                  >
                    <div className="option-marker">{letter}</div>
                    <div style={{ fontSize: "0.95rem", lineHeight: "1.5", flex: 1 }}>{opt.text}</div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons Row */}
            <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "20px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => clearAnswer(currentQ.id)}
                  disabled={!isAnswered}
                  className="btn btn-secondary"
                  style={{ padding: "10px 16px", fontSize: "0.85rem", minHeight: "42px" }}
                >
                  <RotateCcw size={15} />
                  <span>Clear Selection</span>
                </button>

                <button
                  onClick={() => toggleMarkForReview(currentQ.id)}
                  className={`btn ${isMarked ? "btn-primary" : "btn-secondary"}`}
                  style={{ padding: "10px 16px", fontSize: "0.85rem", minHeight: "42px" }}
                >
                  <Bookmark size={15} />
                  <span>{isMarked ? "Marked for Review" : "Mark for Review"}</span>
                </button>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleJumpToQuestion(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="btn btn-secondary"
                  style={{ padding: "10px 16px", minHeight: "42px" }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => handleJumpToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="btn btn-primary"
                  style={{ padding: "10px 20px", minHeight: "42px" }}
                >
                  <span>Next Question</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Desktop Sticky Question Palette */}
          <div className="glass-panel desktop-sidebar" style={{ padding: "22px", position: "sticky", top: "84px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h4 style={{ fontSize: "1rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <Grid size={16} color="var(--accent-cyan)" />
                <span>Question Palette</span>
              </h4>
              <span className="mono" style={{ fontSize: "0.8rem", color: "var(--accent-cyan)" }}>
                {answeredCount}/30
              </span>
            </div>

            {/* Legend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.75rem", marginBottom: "16px", color: "var(--text-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(16, 185, 129, 0.4)", border: "1px solid var(--accent-emerald)" }} />
                <span>Answered</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-subtle)" }} />
                <span>Unanswered</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(139, 92, 246, 0.4)", border: "1px solid var(--accent-purple)" }} />
                <span>Review</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(245, 158, 11, 0.4)", border: "1px solid var(--accent-amber)" }} />
                <span>Answered + Rev</span>
              </div>
            </div>

            {/* Part 1 */}
            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-cyan)", marginBottom: "8px" }}>
              PART 1: LOGICAL (Q1–Q10)
            </div>
            <div className="palette-grid" style={{ marginBottom: "16px" }}>
              {questions.slice(0, 10).map((q, idx) => {
                const ans = answers[q.id] !== undefined;
                const rev = markedForReview[q.id];
                const isCurr = currentQuestionIndex === idx;

                let cls = "palette-btn";
                if (isCurr) cls += " current";
                if (ans && rev) cls += " marked-answered";
                else if (ans) cls += " answered";
                else if (rev) cls += " marked";

                return (
                  <button key={q.id} onClick={() => handleJumpToQuestion(idx)} className={cls}>
                    {q.id}
                  </button>
                );
              })}
            </div>

            {/* Part 2 */}
            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-purple)", marginBottom: "8px" }}>
              PART 2: TECH KNOWLEDGE (Q11–Q25)
            </div>
            <div className="palette-grid" style={{ marginBottom: "16px" }}>
              {questions.slice(10, 25).map((q, idx) => {
                const actualIdx = 10 + idx;
                const ans = answers[q.id] !== undefined;
                const rev = markedForReview[q.id];
                const isCurr = currentQuestionIndex === actualIdx;

                let cls = "palette-btn";
                if (isCurr) cls += " current";
                if (ans && rev) cls += " marked-answered";
                else if (ans) cls += " answered";
                else if (rev) cls += " marked";

                return (
                  <button key={q.id} onClick={() => handleJumpToQuestion(actualIdx)} className={cls}>
                    {q.id}
                  </button>
                );
              })}
            </div>

            {/* Part 3 */}
            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-emerald)", marginBottom: "8px" }}>
              PART 3: HR & CULTURE (Q26–Q30)
            </div>
            <div className="palette-grid">
              {questions.slice(25, 30).map((q, idx) => {
                const actualIdx = 25 + idx;
                const ans = answers[q.id] !== undefined;
                const rev = markedForReview[q.id];
                const isCurr = currentQuestionIndex === actualIdx;

                let cls = "palette-btn";
                if (isCurr) cls += " current";
                if (ans && rev) cls += " marked-answered";
                else if (ans) cls += " answered";
                else if (rev) cls += " marked";

                return (
                  <button key={q.id} onClick={() => handleJumpToQuestion(actualIdx)} className={cls}>
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="mobile-action-bar">
        <button
          onClick={() => setMobilePaletteOpen(true)}
          className="btn btn-secondary"
          style={{ padding: "8px 12px", minHeight: "44px", flex: "0 0 auto" }}
        >
          <Grid size={18} />
          <span className="mono">{answeredCount}/30</span>
        </button>

        <button
          onClick={() => toggleMarkForReview(currentQ.id)}
          className={`btn ${isMarked ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "8px 12px", minHeight: "44px", flex: "1 1 auto", fontSize: "0.85rem" }}
        >
          <Bookmark size={15} />
          <span>{isMarked ? "Marked" : "Review"}</span>
        </button>

        <button
          onClick={() => handleJumpToQuestion(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary"
          style={{ minHeight: "44px", padding: "8px 14px" }}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => handleJumpToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
          disabled={currentQuestionIndex === questions.length - 1}
          className="btn btn-primary"
          style={{ minHeight: "44px", padding: "8px 14px" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Mobile Bottom Sheet Drawer for Palette */}
      <div className={`mobile-bottom-sheet ${mobilePaletteOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h4 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <Grid size={18} color="var(--accent-cyan)" />
            <span>Question Palette ({answeredCount}/30)</span>
          </h4>
          <button
            onClick={() => setMobilePaletteOpen(false)}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={22} />
          </button>
        </div>

        {/* All 30 Questions in Grid */}
        <div className="palette-grid" style={{ gridTemplateColumns: "repeat(6, 1fr)", gap: "10px", marginBottom: "20px" }}>
          {questions.map((q, idx) => {
            const ans = answers[q.id] !== undefined;
            const rev = markedForReview[q.id];
            const isCurr = currentQuestionIndex === idx;

            let cls = "palette-btn";
            if (isCurr) cls += " current";
            if (ans && rev) cls += " marked-answered";
            else if (ans) cls += " answered";
            else if (rev) cls += " marked";

            return (
              <button key={q.id} onClick={() => handleJumpToQuestion(idx)} className={cls} style={{ minHeight: "44px" }}>
                {q.id}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setMobilePaletteOpen(false);
            setShowSubmitModal(true);
          }}
          className="btn btn-primary"
          style={{ width: "100%", padding: "12px" }}
        >
          <span>Submit Assessment</span>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
