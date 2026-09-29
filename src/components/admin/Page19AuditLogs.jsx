import React from "react";
import { useQuiz } from "../../context/QuizContext";
import { Shield, Clock, FileText, CheckCircle } from "lucide-react";

export const Page19AuditLogs = () => {
  const { auditLogs } = useQuiz();

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "1080px" }}>
      <div style={{ marginBottom: "26px" }}>
        <span className="badge badge-purple" style={{ marginBottom: "6px" }}>SECURITY AUDIT</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}>Audit & Security Logs</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
          Cryptographically immutable system audit trail tracking admin logins, question mutations, and proctoring overrides.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: "26px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {auditLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "14px 18px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="badge badge-purple mono" style={{ fontSize: "0.75rem" }}>
                  {log.action}
                </span>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{log.details}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Initiated by: <strong>{log.admin}</strong>
                  </div>
                </div>
              </div>

              <div className="mono" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
