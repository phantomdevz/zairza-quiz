import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Plus, Trash2, CheckCircle, Search, ShieldCheck, Check, Sparkles, HelpCircle, Save } from "lucide-react";

export const Page16QuestionBank = () => {
  const { questions, setQuestions, answerKeys, updateAnswerKey } = useQuiz();

  const [selectedSection, setSelectedSection] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExplanationId, setEditingExplanationId] = useState(null);
  const [tempExplanation, setTempExplanation] = useState("");

  // New question form state
  const [newQ, setNewQ] = useState({
    section: "tech",
    prompt: "",
    optA: "",
    optB: "",
    optC: "",
    optD: "",
    correctOpt: "opt_1",
    explanation: ""
  });

  const filteredQuestions = questions.filter((q) => {
    const matchSec = selectedSection === "ALL" || q.section === selectedSection;
    const matchSearch = q.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSec && matchSearch;
  });

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQ.prompt.trim()) return;

    const nextId = questions.length + 1;
    const createdQuestion = {
      id: nextId,
      section: newQ.section,
      sectionTitle:
        newQ.section === "logical"
          ? "Part 1: Logical Reasoning"
          : newQ.section === "tech"
          ? "Part 2: Tech Knowledge"
          : "Part 3: HR & Cultural Alignment",
      prompt: newQ.prompt,
      options: [
        { id: "opt_1", text: newQ.optA || "Option A" },
        { id: "opt_2", text: newQ.optB || "Option B" },
        { id: "opt_3", text: newQ.optC || "Option C" },
        { id: "opt_4", text: newQ.optD || "Option D" }
      ]
    };

    // Save sanitized question to questions list
    setQuestions([...questions, createdQuestion]);

    // Save isolated answer key and explanation into answerKeys table
    updateAnswerKey(
      nextId,
      newQ.correctOpt,
      newQ.explanation || "Standard society evaluation criteria."
    );

    setShowAddModal(false);
    setNewQ({
      section: "tech",
      prompt: "",
      optA: "",
      optB: "",
      optC: "",
      optD: "",
      correctOpt: "opt_1",
      explanation: ""
    });
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete question Q${id}?`)) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleOptionClick = (questionId, optionId) => {
    updateAnswerKey(questionId, optionId);
  };

  const startEditExplanation = (qId, currentExp) => {
    setEditingExplanationId(qId);
    setTempExplanation(currentExp || "");
  };

  const saveExplanation = (qId) => {
    const currentKey = answerKeys[qId]?.correctOptionId || answerKeys[String(qId)]?.correctOptionId || "opt_1";
    updateAnswerKey(qId, currentKey, tempExplanation);
    setEditingExplanationId(null);
  };

  // Count how many questions have answers configured
  const configuredKeysCount = questions.filter(
    (q) => Boolean(answerKeys[q.id]?.correctOptionId || answerKeys[String(q.id)]?.correctOptionId)
  ).length;

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "1240px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: "6px" }}>CURRICULUM REPOSITORY</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Question Bank Studio</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
            Total pool: <strong>{questions.length} Questions</strong> • Solution Keys Configured:{" "}
            <strong className="mono" style={{ color: "var(--accent-emerald)" }}>{configuredKeysCount} / {questions.length}</strong>
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
          style={{ padding: "10px 20px" }}
        >
          <Plus size={16} />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Security Architecture Information Card */}
      <div style={{
        background: "rgba(16, 185, 129, 0.06)",
        border: "1px solid rgba(16, 185, 129, 0.25)",
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px"
      }}>
        <div style={{ color: "var(--accent-emerald)", marginTop: "2px" }}>
          <ShieldCheck size={22} />
        </div>
        <div style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
          <div style={{ fontWeight: "700", color: "var(--accent-emerald)", marginBottom: "2px" }}>
            Isolated Solution Keys Architecture Active
          </div>
          <div style={{ color: "var(--text-secondary)" }}>
            Correct answers and explanations are stored separately in the secure <code className="mono">quiz_answer_keys</code> table and never bundled with questions sent to student browsers.
            <strong> Click any option card below to directly mark or reassign it as the official answer key.</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: "20px", marginBottom: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          <div>
            <input
              type="text"
              className="form-input"
              placeholder="Search questions by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <select
              className="form-select"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="ALL">All Sections (Logical, Tech, HR)</option>
              <option value="logical">Part 1: Logical Reasoning ({questions.filter((q) => q.section === "logical").length})</option>
              <option value="tech">Part 2: Tech Knowledge ({questions.filter((q) => q.section === "tech").length})</option>
              <option value="hr">Part 3: HR &amp; Culture ({questions.filter((q) => q.section === "hr").length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {filteredQuestions.map((q) => {
          const keyData = answerKeys[q.id] || answerKeys[String(q.id)] || {};
          const currentCorrectId = keyData.correctOptionId;
          const explanation = keyData.explanation;

          return (
            <div key={q.id} className="glass-panel" style={{ padding: "26px", border: "1px solid var(--border-subtle)" }}>
              {/* Question Card Top Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="badge badge-cyan mono">Q{q.id}</span>
                  <span className="badge badge-purple">{q.section.toUpperCase()}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{q.sectionTitle}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Click option to mark answer
                  </span>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="btn btn-secondary"
                    style={{ padding: "6px 10px", fontSize: "0.8rem", color: "var(--accent-rose)", minHeight: "32px" }}
                    title="Delete Question"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Question Prompt */}
              <h4 style={{ fontSize: "1.08rem", fontWeight: "600", lineHeight: "1.6", marginBottom: "18px", color: "var(--text-main)" }}>
                {q.prompt}
              </h4>

              {/* Options Grid (Click to Mark as Correct) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginBottom: "18px" }}>
                {q.options.map((opt, i) => {
                  const isCorrect = opt.id === currentCorrectId;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleOptionClick(q.id, opt.id)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "10px",
                        background: isCorrect ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.02)",
                        border: isCorrect ? "2px solid var(--accent-emerald)" : "1px solid var(--border-subtle)",
                        fontSize: "0.9rem",
                        color: isCorrect ? "#ecfdf5" : "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%",
                        transition: "all 0.15s ease",
                        position: "relative"
                      }}
                      onMouseEnter={(e) => {
                        if (!isCorrect) {
                          e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.5)";
                          e.currentTarget.style.background = "rgba(6, 182, 212, 0.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCorrect) {
                          e.currentTarget.style.borderColor = "var(--border-subtle)";
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                        }
                      }}
                      title={isCorrect ? "Official Answer Key" : "Click to set as Correct Answer"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span className="mono" style={{
                          fontWeight: "700",
                          color: isCorrect ? "var(--accent-emerald)" : "var(--text-muted)",
                          fontSize: "0.95rem"
                        }}>
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {isCorrect ? (
                        <span className="badge badge-emerald" style={{ fontSize: "0.72rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Check size={12} />
                          <span>KEY ✓</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", opacity: 0.5 }}>
                          Set Key
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Section */}
              <div style={{
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "8px",
                padding: "12px 16px"
              }}>
                {editingExplanationId === q.id ? (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--accent-cyan)" }}>
                        Edit Explanation (Saved to quiz_answer_keys)
                      </span>
                    </div>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={tempExplanation}
                      onChange={(e) => setTempExplanation(e.target.value)}
                      placeholder="Enter explanation for candidate review after 15m..."
                      style={{ fontSize: "0.85rem", marginBottom: "10px" }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => setEditingExplanationId(null)}
                        className="btn btn-secondary"
                        style={{ padding: "4px 12px", fontSize: "0.8rem", minHeight: "28px" }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveExplanation(q.id)}
                        className="btn btn-primary"
                        style={{ padding: "4px 12px", fontSize: "0.8rem", minHeight: "28px" }}
                      >
                        <Save size={12} />
                        <span>Save Explanation</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                      <strong style={{ color: "var(--text-main)" }}>Explanation: </strong>
                      {explanation ? explanation : <em style={{ color: "var(--text-muted)" }}>No explanation recorded yet.</em>}
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditExplanation(q.id, explanation)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "6px",
                        color: "var(--accent-cyan)",
                        padding: "3px 8px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap"
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "640px" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "18px" }}>Add Question to Assessment Pool</h3>
            <form onSubmit={handleAddQuestion}>
              <div className="form-group">
                <label className="form-label">Target Section</label>
                <select
                  className="form-select"
                  value={newQ.section}
                  onChange={(e) => setNewQ({ ...newQ, section: e.target.value })}
                >
                  <option value="logical">Part 1: Logical Reasoning</option>
                  <option value="tech">Part 2: Tech Knowledge</option>
                  <option value="hr">Part 3: HR &amp; Cultural Alignment</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Question Text / Scenario</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Enter the question text or problem statement..."
                  value={newQ.prompt}
                  onChange={(e) => setNewQ({ ...newQ, prompt: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Option A text"
                  value={newQ.optA}
                  onChange={(e) => setNewQ({ ...newQ, optA: e.target.value })}
                  required
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Option B text"
                  value={newQ.optB}
                  onChange={(e) => setNewQ({ ...newQ, optB: e.target.value })}
                  required
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Option C text"
                  value={newQ.optC}
                  onChange={(e) => setNewQ({ ...newQ, optC: e.target.value })}
                  required
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Option D text"
                  value={newQ.optD}
                  onChange={(e) => setNewQ({ ...newQ, optD: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: "var(--accent-emerald)", fontWeight: "700" }}>
                  Correct Answer Key (Saved in quiz_answer_keys)
                </label>
                <select
                  className="form-select"
                  value={newQ.correctOpt}
                  onChange={(e) => setNewQ({ ...newQ, correctOpt: e.target.value })}
                  style={{ borderColor: "var(--accent-emerald)" }}
                >
                  <option value="opt_1">Option A ({newQ.optA || "A"})</option>
                  <option value="opt_2">Option B ({newQ.optB || "B"})</option>
                  <option value="opt_3">Option C ({newQ.optC || "C"})</option>
                  <option value="opt_4">Option D ({newQ.optD || "D"})</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Explanation (Server-Only Rationale)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Detailed rationale for correct answer..."
                  value={newQ.explanation}
                  onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save to Question Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
