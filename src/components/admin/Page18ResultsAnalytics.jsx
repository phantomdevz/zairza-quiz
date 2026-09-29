import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { BarChart2, Award, Download, Filter, CheckCircle, Users } from "lucide-react";

export const Page18ResultsAnalytics = () => {
  const { candidates } = useQuiz();

  const [minScoreThreshold, setMinScoreThreshold] = useState(20);
  const [selectedWing, setSelectedWing] = useState("ALL");

  const completed = candidates.filter((c) => c.score !== null);

  const shortlisted = completed.filter((c) => {
    const matchWing = selectedWing === "ALL" || c.preferredWing === selectedWing;
    const matchScore = c.score >= minScoreThreshold;
    return matchWing && matchScore;
  });

  const exportShortlist = () => {
    const headers = ["Registration Number", "Full Name", "Email", "Wing", "Total Score (of 30)", "Logical Score", "Tech Score", "HR Score"];
    const rows = shortlisted.map((c) => [
      c.rollNumber,
      `"${c.fullName}"`,
      c.email,
      c.preferredWing,
      c.score,
      c.sectionScores?.logical ?? "N/A",
      c.sectionScores?.tech ?? "N/A",
      c.sectionScores?.hr ?? "N/A"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zairza_shortlist_round2_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "1240px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "26px" }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: "6px" }}>ANALYTICS & SELECTION</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Results & Shortlisting Matrix</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
            Performance distributions and shortlist generation for Round 2 personal interviews.
          </p>
        </div>

        <button
          onClick={exportShortlist}
          disabled={shortlisted.length === 0}
          className="btn btn-primary"
          style={{ padding: "10px 20px" }}
        >
          <Download size={16} />
          <span>Export Shortlist ({shortlisted.length})</span>
        </button>
      </div>

      {/* Summary KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "26px" }}>
        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Completed Attempts</div>
          <div className="mono" style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-cyan)", margin: "4px 0" }}>
            {completed.length}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Evaluated candidates</div>
        </div>

        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Currently Shortlisted</div>
          <div className="mono" style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-emerald)", margin: "4px 0" }}>
            {shortlisted.length}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Score $\ge$ {minScoreThreshold}</div>
        </div>

        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Highest Score</div>
          <div className="mono" style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-amber)", margin: "4px 0" }}>
            {completed.length > 0 ? Math.max(...completed.map((c) => c.score)) : 0} / 30
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Top candidate mark</div>
        </div>
      </div>

      {/* Shortlist Criteria Controls */}
      <div className="glass-panel" style={{ padding: "22px", marginBottom: "26px" }}>
        <h3 style={{ fontSize: "1.05rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-cyan)" }}>
          <Filter size={16} />
          <span>Shortlist Filtering Parameters</span>
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">
              <span>Minimum Cutoff Score</span>
              <strong className="mono" style={{ color: "var(--accent-cyan)" }}>{minScoreThreshold} marks</strong>
            </label>
            <input
              type="range"
              min={0}
              max={30}
              value={minScoreThreshold}
              onChange={(e) => setMinScoreThreshold(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-cyan)", cursor: "pointer" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Wing Filter</label>
            <select
              className="form-select"
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
            >
              <option value="ALL">All Wings</option>
              <option value="Software">Software Wing</option>
              <option value="Robotics & IoT">Robotics & IoT Wing</option>
              <option value="Design">Design Wing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shortlisted Candidates Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.15rem", marginBottom: "16px" }}>
          Shortlisted Candidates ({shortlisted.length})
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "12px 10px" }}>OUTR Roll No</th>
                <th style={{ padding: "12px 10px" }}>Candidate Name</th>
                <th style={{ padding: "12px 10px" }}>Wing</th>
                <th style={{ padding: "12px 10px" }}>Logical (/10)</th>
                <th style={{ padding: "12px 10px" }}>Tech (/15)</th>
                <th style={{ padding: "12px 10px" }}>HR (/5)</th>
                <th style={{ padding: "12px 10px" }}>Total (/30)</th>
                <th style={{ padding: "12px 10px" }}>Interview Status</th>
              </tr>
            </thead>
            <tbody>
              {shortlisted.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "26px", textAlign: "center", color: "var(--text-muted)" }}>
                    No candidates qualify under the current score threshold.
                  </td>
                </tr>
              ) : (
                shortlisted.map((c) => (
                  <tr key={c.rollNumber} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 10px" }} className="mono" style={{ color: "var(--accent-cyan)", fontWeight: "700" }}>
                      {c.rollNumber}
                    </td>
                    <td style={{ padding: "12px 10px", fontWeight: "600" }}>{c.fullName}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className="badge badge-purple">{c.preferredWing}</span>
                    </td>
                    <td style={{ padding: "12px 10px" }} className="mono">{c.sectionScores?.logical ?? "—"}</td>
                    <td style={{ padding: "12px 10px" }} className="mono">{c.sectionScores?.tech ?? "—"}</td>
                    <td style={{ padding: "12px 10px" }} className="mono">{c.sectionScores?.hr ?? "—"}</td>
                    <td style={{ padding: "12px 10px" }} className="mono" style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>
                      {c.score}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span className="badge badge-emerald">
                        <CheckCircle size={12} /> SHORTLISTED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
