import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import {
  User,
  Shield,
  Clock,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Layers,
  ExternalLink
} from "lucide-react";

export const Page14CandidateDetails = () => {
  const { candidates, selectedCandidateForDetails, setCurrentView, setCandidates } = useQuiz();

  const candidate = candidates.find((c) => c.rollNumber === selectedCandidateForDetails) || candidates[0];
  const [flagged, setFlagged] = useState(candidate?.violationsCount > 0);
  const [actionNotice, setActionNotice] = useState("");

  const handleResetAttempt = () => {
    if (window.confirm(`Are you sure you want to reset the assessment attempt for Roll No ${candidate.rollNumber}? This clears all saved answers.`)) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.rollNumber === candidate.rollNumber
            ? { ...c, quizStatus: "NOT_STARTED", score: null, timeTakenSeconds: 0, violationsCount: 0 }
            : c
        )
      );
      setActionNotice(`Attempt for ${candidate.rollNumber} has been reset to NOT_STARTED.`);
    }
  };

  const handleToggleFlag = () => {
    setFlagged(!flagged);
    setActionNotice(flagged ? `Removed flag for ${candidate.rollNumber}` : `Candidate ${candidate.rollNumber} marked for manual review.`);
  };

  if (!candidate) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <h3>Candidate Record Not Found</h3>
        <button onClick={() => setCurrentView("page13_registrations")} className="btn btn-secondary" style={{ marginTop: "16px" }}>
          Back to Registrations
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "1080px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <button
          onClick={() => setCurrentView("page13_registrations")}
          className="btn btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.85rem" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Registrations</span>
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleToggleFlag}
            className={`btn ${flagged ? "btn-danger" : "btn-secondary"}`}
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
          >
            <AlertTriangle size={15} />
            <span>{flagged ? "Flagged for Review" : "Flag Candidate"}</span>
          </button>

          <button
            onClick={handleResetAttempt}
            className="btn btn-secondary"
            style={{ padding: "8px 16px", fontSize: "0.85rem", color: "var(--accent-amber)" }}
          >
            <RotateCcw size={15} />
            <span>Reset Attempt</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div style={{
          background: "rgba(6, 182, 212, 0.1)",
          border: "1px solid var(--accent-cyan)",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "20px",
          color: "var(--accent-cyan)",
          fontSize: "0.88rem"
        }}>
          {actionNotice}
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="glass-panel" style={{ padding: "30px", marginBottom: "26px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <h1 style={{ fontSize: "1.8rem" }}>{candidate.fullName}</h1>
              <span className="badge badge-purple">{candidate.preferredWing}</span>
              {flagged && <span className="badge badge-rose">FLAGGED</span>}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              <span className="mono" style={{ color: "var(--accent-cyan)", fontWeight: "700" }}>
                OUTR ROLL: {candidate.rollNumber}
              </span>
              <span>•</span>
              <span>{candidate.email}</span>
              <span>•</span>
              <span>{candidate.mobile}</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Assessment Score</div>
            <div className="mono" style={{ fontSize: "2.2rem", fontWeight: "800", color: candidate.score !== null ? "var(--accent-cyan)" : "var(--text-muted)" }}>
              {candidate.score !== null ? `${candidate.score} / 30` : "PENDING"}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Profiler Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "30px" }}>
        {/* Left: Academic & Wing Details */}
        <div className="glass-panel" style={{ padding: "26px" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "18px", color: "var(--accent-cyan)" }}>
            Academic & Wing Demographics
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>University Branch:</span>
              <span>{candidate.branch}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Year of Study:</span>
              <span>{candidate.year}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Residential Status:</span>
              <span>{candidate.residentialType}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Gender:</span>
              <span>{candidate.gender}</span>
            </div>
            {candidate.portfolioUrl && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Portfolio / GitHub:</span>
                <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>Link</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
            <div style={{ marginTop: "6px" }}>
              <div style={{ color: "var(--text-muted)", marginBottom: "6px" }}>Technical Interests:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {candidate.technicalInterests && candidate.technicalInterests.map((t) => (
                  <span key={t} className="badge badge-cyan">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Section Scores & Attempt Telemetry */}
        <div className="glass-panel" style={{ padding: "26px" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "18px", color: "var(--accent-purple)" }}>
            Sectional Scores & Timing
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>🧩 Part 1: Logical Reasoning</span>
              <span className="mono" style={{ fontWeight: "700", color: "var(--accent-cyan)" }}>
                {candidate.sectionScores?.logical ?? "—"} / 10
              </span>
            </div>

            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>⚡ Part 2: Tech Knowledge</span>
              <span className="mono" style={{ fontWeight: "700", color: "var(--accent-purple)" }}>
                {candidate.sectionScores?.tech ?? "—"} / 15
              </span>
            </div>

            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>🤝 Part 3: HR & Cultural Alignment</span>
              <span className="mono" style={{ fontWeight: "700", color: "var(--accent-emerald)" }}>
                {candidate.sectionScores?.hr ?? "—"} / 5
              </span>
            </div>

            <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Time taken: <strong>{candidate.timeTakenSeconds ? `${Math.floor(candidate.timeTakenSeconds / 60)}m ${candidate.timeTakenSeconds % 60}s` : "0m"}</strong> (of 30m allocated).
            </div>
          </div>
        </div>
      </div>

      {/* Proctoring Event Log */}
      <div className="glass-panel" style={{ padding: "26px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-rose)" }}>
          <Shield size={18} />
          <span>Proctoring Integrity Event Log</span>
        </h3>

        {candidate.violationsCount === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--accent-emerald)", background: "rgba(16, 185, 129, 0.05)", borderRadius: "8px" }}>
            <CheckCircle size={22} style={{ margin: "0 auto 6px" }} />
            <div>No proctoring infractions detected during this candidate's test session.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { type: "TAB_SWITCH", msg: "Browser tab switched to background window", time: "10:14:02 AM" },
              { type: "FULLSCREEN_EXIT", msg: "Candidate exited fullscreen viewport", time: "10:21:45 AM" }
            ].map((v, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "8px", background: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.25)" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.88rem", color: "var(--accent-rose)" }}>{v.type}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{v.msg}</div>
                </div>
                <div className="mono" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{v.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
