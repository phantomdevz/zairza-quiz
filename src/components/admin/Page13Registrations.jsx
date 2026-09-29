import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Search, Filter, Download, UserPlus, AlertCircle, CheckCircle, Eye } from "lucide-react";

export const Page13Registrations = () => {
  const { candidates, setCurrentView, setSelectedCandidateForDetails } = useQuiz();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterWing, setFilterWing] = useState("ALL");
  const [filterYear, setFilterYear] = useState("ALL");

  // Filtering
  const filteredCandidates = candidates.filter((c) => {
    const matchSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchWing = filterWing === "ALL" || c.preferredWing === filterWing;
    const matchYear = filterYear === "ALL" || c.year === filterYear;

    return matchSearch && matchWing && matchYear;
  });

  // Duplicate Registration Number / Email Detection Check
  const rollCounts = candidates.reduce((acc, c) => {
    acc[c.rollNumber] = (acc[c.rollNumber] || 0) + 1;
    return acc;
  }, {});

  const exportCSV = () => {
    const headers = ["Registration Number", "Full Name", "Email", "Mobile", "Year", "Branch", "Gender", "Wing", "Status", "Score"];
    const rows = candidates.map((c) => [
      c.rollNumber,
      `"${c.fullName}"`,
      c.email,
      c.mobile,
      c.year,
      `"${c.branch}"`,
      c.gender,
      c.preferredWing,
      c.quizStatus,
      c.score !== null ? c.score : "N/A"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zairza_induction_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "1240px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: "6px" }}>CANDIDATE DATABASE</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Registrations Management</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
            Total Registered Candidates: <strong>{candidates.length}</strong> (Cutoff: 30th Sept 12:00 PM).
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={exportCSV}
            className="btn btn-secondary"
            style={{ padding: "10px 18px", fontSize: "0.88rem" }}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel" style={{ padding: "20px", marginBottom: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "38px" }}
              placeholder="Search by Roll No, Name, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} style={{ position: "absolute", left: "14px", top: "15px", color: "var(--text-muted)" }} />
          </div>

          <div>
            <select
              className="form-select"
              value={filterWing}
              onChange={(e) => setFilterWing(e.target.value)}
            >
              <option value="ALL">All Wings (Software / Robotics / Design)</option>
              <option value="Software">Software Wing</option>
              <option value="Robotics & IoT">Robotics & IoT Wing</option>
              <option value="Design">Design Wing</option>
            </select>
          </div>

          <div>
            <select
              className="form-select"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="ALL">All Academic Years</option>
              <option value="1st Year">1st Year Only</option>
              <option value="2nd Year">2nd Year Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "12px 10px" }}>OUTR Roll No</th>
                <th style={{ padding: "12px 10px" }}>Name & Email</th>
                <th style={{ padding: "12px 10px" }}>Academic Info</th>
                <th style={{ padding: "12px 10px" }}>Preferred Wing</th>
                <th style={{ padding: "12px 10px" }}>Technical Interests</th>
                <th style={{ padding: "12px 10px" }}>Status</th>
                <th style={{ padding: "12px 10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                    No candidates match the specified search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => {
                  const isDuplicate = rollCounts[c.rollNumber] > 1;
                  return (
                    <tr key={c.rollNumber} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "14px 10px" }}>
                        <div className="mono" style={{ fontWeight: "700", color: "var(--accent-cyan)" }}>
                          {c.rollNumber}
                        </div>
                        {isDuplicate && (
                          <span className="badge badge-rose" style={{ fontSize: "0.68rem", marginTop: "4px" }}>
                            DUPLICATE ROLL
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "14px 10px" }}>
                        <div style={{ fontWeight: "600" }}>{c.fullName}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{c.email}</div>
                      </td>
                      <td style={{ padding: "14px 10px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        <div>{c.branch}</div>
                        <div style={{ color: "var(--text-muted)" }}>{c.year} • {c.residentialType}</div>
                      </td>
                      <td style={{ padding: "14px 10px" }}>
                        <span className="badge badge-purple">{c.preferredWing}</span>
                      </td>
                      <td style={{ padding: "14px 10px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {c.technicalInterests && c.technicalInterests.map((t) => (
                            <span key={t} style={{ fontSize: "0.72rem", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)" }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "14px 10px" }}>
                        {c.quizStatus === "COMPLETED" ? (
                          <span className="badge badge-emerald">
                            COMPLETED ({c.score}/30)
                          </span>
                        ) : c.quizStatus === "IN_PROGRESS" ? (
                          <span className="badge badge-cyan">IN PROGRESS</span>
                        ) : (
                          <span className="badge badge-amber">REGISTERED</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 10px" }}>
                        <button
                          onClick={() => {
                            setSelectedCandidateForDetails(c.rollNumber);
                            setCurrentView("page14_candidate_details");
                          }}
                          className="btn btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "0.8rem", minHeight: "32px" }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
