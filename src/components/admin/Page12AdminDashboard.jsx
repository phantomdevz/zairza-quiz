import React from "react";
import { useQuiz } from "../../context/QuizContext";
import {
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  Terminal,
  Activity,
  ArrowRight,
  Shield,
  Layers
} from "lucide-react";

export const Page12AdminDashboard = () => {
  const { candidates, questions, quizConfig, setCurrentView, setSelectedCandidateForDetails } = useQuiz();

  const totalRegs = candidates.length;
  const completedCount = candidates.filter((c) => c.quizStatus === "COMPLETED").length;
  const inProgressCount = candidates.filter((c) => c.quizStatus === "IN_PROGRESS").length;
  const notStartedCount = candidates.filter((c) => c.quizStatus === "NOT_STARTED").length;
  const flaggedCount = candidates.filter((c) => c.violationsCount > 0).length;

  const completedCandidates = candidates.filter((c) => c.score !== null);
  const avgScore = completedCandidates.length > 0
    ? (completedCandidates.reduce((acc, c) => acc + c.score, 0) / completedCandidates.length).toFixed(1)
    : "N/A";

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "1240px" }}>
      {/* Top Banner */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: "6px" }}>CONTROL TOWER</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Admin Master Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
            Real-time induction telemetry, candidate tracking, and live invigilation status.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setCurrentView("page15_proctoring")}
            className="btn btn-primary pulse-glow"
            style={{ padding: "10px 20px" }}
          >
            <Activity size={16} />
            <span>Open Live Proctoring Deck</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px" }}>
        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--accent-cyan)", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "700" }}>Total Registrations</span>
            <Users size={18} />
          </div>
          <div className="mono" style={{ fontSize: "2rem", fontWeight: "800" }}>{totalRegs}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Verified OUTR Roll Numbers</div>
        </div>

        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--accent-emerald)", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "700" }}>Quiz Completed</span>
            <CheckCircle size={18} />
          </div>
          <div className="mono" style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-emerald)" }}>{completedCount}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Responses Evaluated</div>
        </div>

        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--accent-cyan)", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "700" }}>Active Live Now</span>
            <Activity size={18} />
          </div>
          <div className="mono" style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-cyan)" }}>{inProgressCount}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Concurrent Test-Takers</div>
        </div>

        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--accent-rose)", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "700" }}>Flagged Infractions</span>
            <AlertTriangle size={18} />
          </div>
          <div className="mono" style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-rose)" }}>{flaggedCount}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Under Invigilator Review</div>
        </div>

        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--accent-amber)", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "700" }}>Average Score</span>
            <Award size={18} />
          </div>
          <div className="mono" style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-amber)" }}>{avgScore} / 30</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Mean Performance</div>
        </div>
      </div>

      {/* Quick Navigation Hub to Other Admin Pages */}
      <div className="glass-panel" style={{ padding: "26px", marginBottom: "30px" }}>
        <h3 style={{ fontSize: "1.15rem", marginBottom: "16px", color: "var(--accent-purple)" }}>
          Administrative Modules
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          {[
            { id: "page13_registrations", title: "Registrations", desc: "Filter, search, duplicate check & export" },
            { id: "page15_proctoring", title: "Live Proctoring", desc: "Real-time candidate telemetry & violations" },
            { id: "page16_question_bank", title: "Question Studio", desc: "Edit 30 questions across 3 parts" },
            { id: "page17_quiz_config", title: "Quiz Configurator", desc: "Window times, duration, marking rules" },
            { id: "page18_analytics", title: "Analytics & Shortlist", desc: "Branch distributions & interview cutoffs" },
            { id: "page19_audit_logs", title: "Audit Trail", desc: "Immutable security and action logs" },
            { id: "page20_users", title: "RBAC & Team", desc: "Manage admin accounts and permissions" }
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => setCurrentView(m.id)}
              style={{
                padding: "16px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-subtle)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-purple)";
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
              }}
            >
              <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "var(--text-main)" }}>{m.title}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Status Mini Table */}
      <div className="glass-panel" style={{ padding: "26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "1.15rem" }}>Recent Candidate Submissions</h3>
          <button
            onClick={() => setCurrentView("page13_registrations")}
            className="btn btn-secondary"
            style={{ padding: "6px 14px", fontSize: "0.82rem" }}
          >
            <span>View All Registrations</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "10px" }}>OUTR Roll</th>
                <th style={{ padding: "10px" }}>Full Name</th>
                <th style={{ padding: "10px" }}>Branch & Year</th>
                <th style={{ padding: "10px" }}>Wing</th>
                <th style={{ padding: "10px" }}>Status</th>
                <th style={{ padding: "10px" }}>Score</th>
                <th style={{ padding: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.rollNumber} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "12px 10px" }} className="mono" style={{ color: "var(--accent-cyan)", fontWeight: "700" }}>
                    {c.rollNumber}
                  </td>
                  <td style={{ padding: "12px 10px", fontWeight: "600" }}>{c.fullName}</td>
                  <td style={{ padding: "12px 10px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                    {c.branch} ({c.year})
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <span className="badge badge-purple" style={{ fontSize: "0.75rem" }}>{c.preferredWing}</span>
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    {c.quizStatus === "COMPLETED" ? (
                      <span className="badge badge-emerald">COMPLETED</span>
                    ) : c.quizStatus === "IN_PROGRESS" ? (
                      <span className="badge badge-cyan">IN PROGRESS</span>
                    ) : (
                      <span className="badge badge-amber">NOT STARTED</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 10px" }} className="mono" style={{ fontWeight: "700" }}>
                    {c.score !== null ? `${c.score}/30` : "—"}
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <button
                      onClick={() => {
                        setSelectedCandidateForDetails(c.rollNumber);
                        setCurrentView("page14_candidate_details");
                      }}
                      className="btn btn-secondary"
                      style={{ padding: "4px 10px", fontSize: "0.75rem", minHeight: "28px" }}
                    >
                      Inspect Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
