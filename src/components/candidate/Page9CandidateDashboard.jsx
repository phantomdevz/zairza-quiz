import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import {
  User,
  CheckCircle,
  Clock,
  Award,
  Bell,
  ArrowRight,
  Shield,
  Layers,
  Calendar,
  ExternalLink
} from "lucide-react";

export const Page9CandidateDashboard = () => {
  const {
    activeCandidate,
    loginCandidateByRoll,
    setCurrentView,
    quizConfig
  } = useQuiz();

  const [inputRoll, setInputRoll] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleRollLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    if (!inputRoll.trim()) {
      setLoginError("Please enter your OUTR Roll Number.");
      return;
    }
    const res = loginCandidateByRoll(inputRoll.trim());
    if (!res.success) {
      setLoginError(res.error);
    }
  };

  // If no candidate is active, show quick Roll Number check-in
  if (!activeCandidate) {
    return (
      <div className="container" style={{ padding: "60px 20px 80px", maxWidth: "540px", textAlign: "center" }}>
        <div className="glass-panel" style={{ padding: "40px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(6, 182, 212, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            color: "var(--accent-cyan)"
          }}>
            <User size={28} />
          </div>

          <h2 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>Candidate Portal</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "24px" }}>
            Enter your OUTR Roll Number to access your induction status, test launcher, and scorecard.
          </p>

          {loginError && (
            <div style={{ color: "var(--accent-rose)", fontSize: "0.85rem", marginBottom: "16px" }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleRollLogin}>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label className="form-label">OUTR Roll Number</label>
              <input
                type="text"
                className="form-input mono"
                placeholder="e.g. 2401106042"
                value={inputRoll}
                onChange={(e) => setInputRoll(e.target.value.toUpperCase())}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px", marginTop: "10px" }}>
              <span>Access Candidate Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: "24px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Haven't registered yet?{" "}
            <span
              onClick={() => setCurrentView("page2_register")}
              style={{ color: "var(--accent-cyan)", cursor: "pointer", fontWeight: "600" }}
            >
              Register here
            </span>
          </div>
        </div>
      </div>
    );
  }

  const {
    fullName,
    rollNumber,
    email,
    branch,
    year,
    preferredWing,
    technicalInterests,
    quizStatus
  } = activeCandidate;

  const isCompleted = quizStatus === "COMPLETED";

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "980px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: "6px" }}>CANDIDATE DASHBOARD</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
            Welcome, {fullName}
          </h1>
          <div style={{ display: "flex", gap: "12px", color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
            <span className="mono" style={{ color: "var(--accent-cyan)" }}>ROLL: {rollNumber}</span>
            <span>•</span>
            <span>{branch}</span>
            <span>•</span>
            <span>{year}</span>
          </div>
        </div>

        <div>
          {isCompleted ? (
            <button
              onClick={() => setCurrentView("page10_results")}
              className="btn btn-primary"
              style={{ padding: "10px 22px" }}
            >
              <Award size={16} />
              <span>View Scorecard</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView("page4_precheck")}
              className="btn btn-primary pulse-glow"
              style={{ padding: "12px 26px" }}
            >
              <span>Take Assessment (30 Mins)</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Lifecycle Progress Pipeline */}
      <div className="glass-panel" style={{ padding: "26px", marginBottom: "30px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Induction Lifecycle Status</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {/* Stage 1 */}
          <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-emerald)", fontWeight: "700", marginBottom: "4px" }}>
              <CheckCircle size={16} />
              <span>1. REGISTRATION</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Verified & Locked
            </div>
          </div>

          {/* Stage 2 */}
          <div style={{
            padding: "16px",
            borderRadius: "10px",
            background: isCompleted ? "rgba(16, 185, 129, 0.1)" : "rgba(6, 182, 212, 0.1)",
            border: isCompleted ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(6, 182, 212, 0.3)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: isCompleted ? "var(--accent-emerald)" : "var(--accent-cyan)", fontWeight: "700", marginBottom: "4px" }}>
              {isCompleted ? <CheckCircle size={16} /> : <Clock size={16} />}
              <span>2. ONLINE TEST (OA)</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {isCompleted ? "Submitted & Scored" : "Live • 30 Mins Attempt"}
            </div>
          </div>

          {/* Stage 3 */}
          <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontWeight: "700", marginBottom: "4px" }}>
              <Award size={16} />
              <span>3. ROUND 2 INTERVIEWS</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Shortlists announced soon
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {/* Candidate Profile Details */}
        <div className="glass-panel" style={{ padding: "26px" }}>
          <h3 style={{ fontSize: "1.15rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-cyan)" }}>
            <User size={18} />
            <span>Profile Details</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>OUTR Roll:</span>
              <span className="mono" style={{ fontWeight: "700" }}>{rollNumber}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>University Email:</span>
              <span>{email}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Preferred Wing:</span>
              <span className="badge badge-cyan">{preferredWing}</span>
            </div>
            <div>
              <div style={{ color: "var(--text-muted)", marginBottom: "6px" }}>Technical Interests:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {technicalInterests && technicalInterests.map((t) => (
                  <span key={t} className="badge badge-purple">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Announcements & Next Steps */}
        <div className="glass-panel" style={{ padding: "26px" }}>
          <h3 style={{ fontSize: "1.15rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-amber)" }}>
            <Bell size={18} />
            <span>Important Announcements</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--accent-cyan)" }}>
                Assessment Window Closing Time
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                The 24-hr OA window closes promptly at 8:00 PM on 30th September. Ensure you complete your attempt before the cutoff.
              </div>
            </div>

            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--accent-emerald)" }}>
                Discord & Community Server
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Join the official Zairza Discord community to interact with wing leads, ask questions, and attend workshops.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
