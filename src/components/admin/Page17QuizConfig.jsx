import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Settings, Clock, Calendar, Shield, Save, CheckCircle } from "lucide-react";

export const Page17QuizConfig = () => {
  const { quizConfig, setQuizConfig } = useQuiz();

  const [form, setForm] = useState({
    title: quizConfig.title,
    oaStartEpoch: quizConfig.oaStartEpoch,
    oaEndEpoch: quizConfig.oaEndEpoch,
    registrationCutoffEpoch: quizConfig.registrationCutoffEpoch,
    durationMinutes: quizConfig.durationMinutes,
    marksPerQuestion: quizConfig.marksPerQuestion,
    negativeMark: quizConfig.negativeMark,
    maxViolationsAllowed: quizConfig.maxViolationsAllowed
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuizConfig({
      ...quizConfig,
      ...form
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "880px" }}>
      {/* Top Header */}
      <div style={{ marginBottom: "30px" }}>
        <span className="badge badge-purple" style={{ marginBottom: "6px" }}>ASSESSMENT PARAMETERS</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Quiz Configuration Hub</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
          Configure operational schedules, anti-cheat limits, and marking rules for Induction 2026.
        </p>
      </div>

      {savedNotice && (
        <div style={{
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid var(--accent-emerald)",
          borderRadius: "8px",
          padding: "14px 18px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--accent-emerald)"
        }}>
          <CheckCircle size={18} />
          <span>Configuration saved successfully. All changes are live on the assessment engine.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "35px" }}>
        {/* Assessment Schedule */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--accent-cyan)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={18} />
            <span>24-Hour Induction Quiz Window &amp; Cutoff</span>
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Quiz Window Starts (ISO / Local)</label>
              <input
                type="text"
                className="form-input mono"
                value={form.oaStartEpoch}
                onChange={(e) => setForm({ ...form, oaStartEpoch: e.target.value })}
              />
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Default: 29th Sept, 8:00 PM</div>
            </div>

            <div className="form-group">
              <label className="form-label">Quiz Window Closes (ISO / Local)</label>
              <input
                type="text"
                className="form-input mono"
                value={form.oaEndEpoch}
                onChange={(e) => setForm({ ...form, oaEndEpoch: e.target.value })}
              />
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Default: 30th Sept, 8:00 PM</div>
            </div>

            <div className="form-group">
              <label className="form-label">Registration Hard Cutoff</label>
              <input
                type="text"
                className="form-input mono"
                value={form.registrationCutoffEpoch}
                onChange={(e) => setForm({ ...form, registrationCutoffEpoch: e.target.value })}
              />
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Default: 30th Sept, 12:00 PM (Noon)</div>
            </div>
          </div>
        </div>

        {/* Timing & Scoring */}
        <div style={{ marginBottom: "30px", borderTop: "1px solid var(--border-subtle)", paddingTop: "24px" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--accent-purple)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Clock size={18} />
            <span>Timing & Marking Scheme</span>
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Candidate Attempt Duration (Minutes)</label>
              <input
                type="number"
                className="form-input mono"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: parseInt(e.target.value) || 30 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Marks Per Correct Question</label>
              <input
                type="number"
                step="0.5"
                className="form-input mono"
                value={form.marksPerQuestion}
                onChange={(e) => setForm({ ...form, marksPerQuestion: parseFloat(e.target.value) || 1 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Negative Marking Penalty</label>
              <input
                type="number"
                step="0.25"
                className="form-input mono"
                value={form.negativeMark}
                onChange={(e) => setForm({ ...form, negativeMark: parseFloat(e.target.value) || 0.25 })}
              />
            </div>
          </div>
        </div>

        {/* Anti-Cheat Thresholds */}
        <div style={{ marginBottom: "30px", borderTop: "1px solid var(--border-subtle)", paddingTop: "24px" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--accent-rose)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Shield size={18} />
            <span>Proctoring & Integrity Safeguards</span>
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Maximum Infractions Before Auto-Submit</label>
              <input
                type="number"
                className="form-input mono"
                value={form.maxViolationsAllowed}
                onChange={(e) => setForm({ ...form, maxViolationsAllowed: parseInt(e.target.value) || 3 })}
              />
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Default: 3 recorded violations</div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px", fontSize: "1.05rem" }}
        >
          <Save size={18} />
          <span>Save Assessment Configuration</span>
        </button>
      </form>
    </div>
  );
};
