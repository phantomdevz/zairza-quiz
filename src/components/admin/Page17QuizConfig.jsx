import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { QUIZ_CONFIG } from "../../data/mockQuizData";
import { Settings, Clock, Calendar, Shield, Save, CheckCircle, Zap, RefreshCw, AlertCircle } from "lucide-react";

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

  // Check if window is currently open based on current time
  const now = new Date();
  const start = new Date(form.oaStartEpoch);
  const end = new Date(form.oaEndEpoch);
  const isWindowActive = now >= start && now <= end;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...quizConfig,
      ...form
    };
    setQuizConfig(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  // Quick Preset Handlers
  const handleOpenWindowNow = () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    setForm(prev => ({
      ...prev,
      oaStartEpoch: fiveMinutesAgo,
      oaEndEpoch: tomorrow
    }));
  };

  const handleSetDuration = (mins) => {
    setForm(prev => ({
      ...prev,
      durationMinutes: mins
    }));
  };

  const handleResetToEnvDefaults = () => {
    if (window.confirm("Reset all operational timings to initial .env defaults?")) {
      const defaults = {
        title: QUIZ_CONFIG.title,
        oaStartEpoch: import.meta.env.VITE_OA_WINDOW_START || QUIZ_CONFIG.oaStartEpoch,
        oaEndEpoch: import.meta.env.VITE_OA_WINDOW_END || QUIZ_CONFIG.oaEndEpoch,
        registrationCutoffEpoch: import.meta.env.VITE_REGISTRATION_CUTOFF || QUIZ_CONFIG.registrationCutoffEpoch,
        durationMinutes: parseInt(import.meta.env.VITE_ATTEMPT_DURATION_MINUTES) || QUIZ_CONFIG.durationMinutes,
        marksPerQuestion: QUIZ_CONFIG.marksPerQuestion,
        negativeMark: QUIZ_CONFIG.negativeMark,
        maxViolationsAllowed: parseInt(import.meta.env.VITE_MAX_VIOLATIONS_ALLOWED) || QUIZ_CONFIG.maxViolationsAllowed
      };
      setForm(defaults);
      setQuizConfig(defaults);
      localStorage.removeItem("zairza_quiz_config");
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "920px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "26px" }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: "6px" }}>ASSESSMENT PARAMETERS</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Quiz Configuration Hub</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
            Dynamically control operational schedules, window opening/closing, attempt durations, and rules in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetToEnvDefaults}
          className="btn btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.82rem" }}
          title="Reset to .env factory defaults"
        >
          <RefreshCw size={14} />
          <span>Reset to .env Defaults</span>
        </button>
      </div>

      {/* Information Banner Explaining .env vs Dashboard Controls */}
      <div style={{
        background: "rgba(6, 182, 212, 0.06)",
        border: "1px solid rgba(6, 182, 212, 0.25)",
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
      }}>
        <AlertCircle size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "0.86rem", lineHeight: "1.6", color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--accent-cyan)" }}>Why is it in .env? </strong>
          The <code className="mono">.env</code> file acts as the <strong>initial boot fallback</strong> for deployment servers. However, <strong>you have full dynamic control right here</strong>: any changes you save in this Hub override the defaults instantly across candidate countdowns, test attempts, and evaluation engines without restarting the server!
        </div>
      </div>

      {savedNotice && (
        <div style={{
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid var(--accent-emerald)",
          borderRadius: "10px",
          padding: "14px 18px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--accent-emerald)",
          animation: "fadeIn 0.3s ease"
        }}>
          <CheckCircle size={18} />
          <span>Configuration saved successfully! All timings and parameters are immediately live.</span>
        </div>
      )}

      {/* Quick Timing Presets Bar */}
      <div className="glass-panel" style={{ padding: "20px 24px", marginBottom: "26px" }}>
        <div style={{ fontSize: "0.82rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <Zap size={14} color="var(--accent-amber)" />
          <span>Quick Admin Overrides (Click to apply)</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button
            type="button"
            onClick={handleOpenWindowNow}
            className="btn btn-secondary"
            style={{ padding: "8px 14px", fontSize: "0.82rem", borderColor: isWindowActive ? "var(--accent-emerald)" : "var(--border-subtle)" }}
          >
            <span style={{ color: "var(--accent-emerald)" }}>●</span>
            <span>Open Window Right Now (Start Live)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetDuration(5)}
            className="btn btn-secondary"
            style={{ padding: "8px 14px", fontSize: "0.82rem" }}
          >
            <span>Test Mode: 5 Mins</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetDuration(30)}
            className="btn btn-secondary"
            style={{ padding: "8px 14px", fontSize: "0.82rem" }}
          >
            <span>Standard: 30 Mins</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetDuration(45)}
            className="btn btn-secondary"
            style={{ padding: "8px 14px", fontSize: "0.82rem" }}
          >
            <span>Extended: 45 Mins</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "35px" }}>
        {/* Assessment Schedule */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.15rem", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
              <Calendar size={18} />
              <span>24-Hour Induction Quiz Window &amp; Cutoff</span>
            </h3>

            <span className={`badge ${isWindowActive ? "badge-emerald" : "badge-amber"}`} style={{ fontSize: "0.75rem" }}>
              {isWindowActive ? "WINDOW CURRENTLY ACTIVE (LIVE)" : "WINDOW CURRENTLY UPCOMING / CLOSED"}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Quiz Window Starts (ISO / Timestamp)</label>
              <input
                type="text"
                className="form-input mono"
                value={form.oaStartEpoch}
                onChange={(e) => setForm({ ...form, oaStartEpoch: e.target.value })}
              />
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Default: 29th Sept, 10:00 PM
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Quiz Window Closes (ISO / Timestamp)</label>
              <input
                type="text"
                className="form-input mono"
                value={form.oaEndEpoch}
                onChange={(e) => setForm({ ...form, oaEndEpoch: e.target.value })}
              />
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Default: 30th Sept, 10:00 PM
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Registration Hard Cutoff</label>
              <input
                type="text"
                className="form-input mono"
                value={form.registrationCutoffEpoch}
                onChange={(e) => setForm({ ...form, registrationCutoffEpoch: e.target.value })}
              />
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Default: 30th Sept, 12:00 PM (Noon)
              </div>
            </div>
          </div>
        </div>

        {/* Timing & Scoring */}
        <div style={{ marginBottom: "30px", borderTop: "1px solid var(--border-subtle)", paddingTop: "24px" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--accent-purple)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Clock size={18} />
            <span>Timing &amp; Marking Scheme</span>
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
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Active timer for each student attempt
              </div>
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
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Default: 1.00 Mark
              </div>
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
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Default: 0.25 Mark deduction
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Cheat Thresholds */}
        <div style={{ marginBottom: "30px", borderTop: "1px solid var(--border-subtle)", paddingTop: "24px" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--accent-rose)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Shield size={18} />
            <span>Proctoring &amp; Integrity Safeguards</span>
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
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Violations allowed before forced submission (Default: 3)
              </div>
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
