import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Plus, Edit2, Trash2, CheckCircle, Search, Filter, BookOpen } from "lucide-react";

export const Page16QuestionBank = () => {
  const { questions, setQuestions, quizConfig } = useQuiz();

  const [selectedSection, setSelectedSection] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

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
    const created = {
      id: nextId,
      section: newQ.section,
      sectionTitle: newQ.section === "logical" ? "Part 1: Logical Reasoning" : newQ.section === "tech" ? "Part 2: Tech Knowledge" : "Part 3: HR & Cultural Alignment",
      prompt: newQ.prompt,
      options: [
        { id: "opt_1", text: newQ.optA || "Option A" },
        { id: "opt_2", text: newQ.optB || "Option B" },
        { id: "opt_3", text: newQ.optC || "Option C" },
        { id: "opt_4", text: newQ.optD || "Option D" }
      ],
      correctOptionId: newQ.correctOpt,
      explanation: newQ.explanation || "Standard society evaluation criteria."
    };

    setQuestions([...questions, created]);
    setShowAddModal(false);
    setNewQ({ section: "tech", prompt: "", optA: "", optB: "", optC: "", optD: "", correctOpt: "opt_1", explanation: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete question Q${id}?`)) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "1240px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "26px" }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: "6px" }}>CURRICULUM REPOSITORY</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Question Bank Studio</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
            Total pool: <strong>{questions.length} Questions</strong> categorized across Logical, Tech, and HR sections.
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
              <option value="hr">Part 3: HR & Culture ({questions.filter((q) => q.section === "hr").length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredQuestions.map((q) => (
          <div key={q.id} className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="badge badge-cyan mono">Q{q.id}</span>
                <span className="badge badge-purple">{q.section.toUpperCase()}</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{q.sectionTitle}</span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="btn btn-secondary"
                  style={{ padding: "6px 10px", fontSize: "0.8rem", color: "var(--accent-rose)", minHeight: "32px" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <h4 style={{ fontSize: "1.05rem", fontWeight: "600", lineHeight: "1.6", marginBottom: "16px" }}>
              {q.prompt}
            </h4>

            {/* Options Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px", marginBottom: "16px" }}>
              {q.options.map((opt, i) => {
                const isCorrect = opt.id === q.correctOptionId;
                return (
                  <div
                    key={opt.id}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.02)",
                      border: isCorrect ? "1px solid var(--accent-emerald)" : "1px solid var(--border-subtle)",
                      fontSize: "0.88rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span>{String.fromCharCode(65 + i)}. {opt.text}</span>
                    {isCorrect && (
                      <span className="badge badge-emerald" style={{ fontSize: "0.68rem" }}>KEY</span>
                    )}
                  </div>
                );
              })}
            </div>

            {q.explanation && (
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-subtle)", paddingTop: "10px" }}>
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
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
                  <option value="hr">Part 3: HR & Cultural Alignment</option>
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
                <label className="form-label">Correct Option</label>
                <select
                  className="form-select"
                  value={newQ.correctOpt}
                  onChange={(e) => setNewQ({ ...newQ, correctOpt: e.target.value })}
                >
                  <option value="opt_1">Option A</option>
                  <option value="opt_2">Option B</option>
                  <option value="opt_3">Option C</option>
                  <option value="opt_4">Option D</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Explanation (Server-Only)</label>
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
