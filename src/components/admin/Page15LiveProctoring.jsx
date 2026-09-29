import React, { useState } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Activity, Shield, AlertTriangle, Send, RefreshCw, Eye, Wifi, Laptop } from "lucide-react";

export const Page15LiveProctoring = () => {
  const { candidates, setCurrentView, setSelectedCandidateForDetails } = useQuiz();

  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [filterFlaggedOnly, setFilterFlaggedOnly] = useState(false);

  const activeCandidatesList = candidates.map((c, idx) => ({
    ...c,
    // Simulate real-time progress for active test-takers
    currentQ: c.quizStatus === "IN_PROGRESS" ? (c.currentQuestion || 18) : (c.quizStatus === "COMPLETED" ? 30 : 0),
    timeRemainingMins: c.quizStatus === "IN_PROGRESS" ? 14 : (c.quizStatus === "COMPLETED" ? 0 : 30),
    connectionStatus: "ONLINE"
  }));

  const displayedCandidates = filterFlaggedOnly
    ? activeCandidatesList.filter((c) => c.violationsCount > 0)
    : activeCandidatesList;

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage("");
    }, 2500);
  };

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "1240px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "26px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-rose">LIVE TELEMETRY STREAM</span>
            <span className="badge badge-emerald">HEARTBEAT 5s</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Live Proctoring Grid</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
            Real-time candidate telemetry, window focus monitoring, and violation tracker.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            <input
              type="checkbox"
              checked={filterFlaggedOnly}
              onChange={(e) => setFilterFlaggedOnly(e.target.checked)}
            />
            <span>Show Flagged Candidates Only</span>
          </label>
        </div>
      </div>

      {/* Broadcast Alert Modal / Banner */}
      <div className="glass-panel" style={{ padding: "20px", marginBottom: "26px" }}>
        <form onSubmit={handleBroadcast} style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Send real-time warning broadcast to all live test screens (e.g. 'Ensure full screen is maintained')..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px" }}>
            <Send size={15} />
            <span>Broadcast Message</span>
          </button>
        </form>
        {broadcastSent && (
          <div style={{ marginTop: "10px", color: "var(--accent-emerald)", fontSize: "0.85rem", fontWeight: "600" }}>
            ✓ Warning notification broadcast to all active candidate viewports.
          </div>
        )}
      </div>

      {/* Live Candidates Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "12px 10px" }}>OUTR Roll No</th>
                <th style={{ padding: "12px 10px" }}>Candidate Name</th>
                <th style={{ padding: "12px 10px" }}>Quiz Progress</th>
                <th style={{ padding: "12px 10px" }}>Time Left</th>
                <th style={{ padding: "12px 10px" }}>Heartbeat & Net</th>
                <th style={{ padding: "12px 10px" }}>Violations Flag</th>
                <th style={{ padding: "12px 10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedCandidates.map((c) => {
                const isFlagged = c.violationsCount > 0;
                return (
                  <tr key={c.rollNumber} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "14px 10px" }} className="mono" style={{ fontWeight: "700", color: "var(--accent-cyan)" }}>
                      {c.rollNumber}
                    </td>

                    <td style={{ padding: "14px 10px", fontWeight: "600" }}>
                      <div>{c.fullName}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{c.preferredWing}</div>
                    </td>

                    <td style={{ padding: "14px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="mono" style={{ fontWeight: "700" }}>{c.currentQ} / 30</span>
                        <div style={{ width: "60px", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${(c.currentQ / 30) * 100}%`, height: "100%", background: "var(--accent-cyan)" }} />
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "14px 10px" }} className="mono">
                      {c.quizStatus === "IN_PROGRESS" ? `${c.timeRemainingMins}m left` : c.quizStatus === "COMPLETED" ? "Submitted" : "Not Started"}
                    </td>

                    <td style={{ padding: "14px 10px" }}>
                      <span className="badge badge-emerald" style={{ fontSize: "0.72rem" }}>
                        <Wifi size={11} /> 🟢 PING 42ms
                      </span>
                    </td>

                    <td style={{ padding: "14px 10px" }}>
                      {c.violationsCount === 0 ? (
                        <span className="badge badge-emerald" style={{ fontSize: "0.75rem" }}>
                          🟢 0 Flags
                        </span>
                      ) : c.violationsCount < 3 ? (
                        <span className="badge badge-amber" style={{ fontSize: "0.75rem" }}>
                          🟡 {c.violationsCount} / 3 Violations
                        </span>
                      ) : (
                        <span className="badge badge-rose" style={{ fontSize: "0.75rem" }}>
                          🔴 {c.violationsCount} Auto-Submitted
                        </span>
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
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
