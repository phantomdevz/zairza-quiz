import React from "react";
import { Globe, Heart, ShieldAlert } from "lucide-react";

export const Footer = () => {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-subtle)",
      background: "rgba(7, 9, 14, 0.95)",
      padding: "30px 0",
      marginTop: "auto",
      color: "var(--text-muted)",
      fontSize: "0.85rem"
    }}>
      <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-main)", fontWeight: "700", marginBottom: "4px" }}>
            <span>ZAIRZA</span>
            <span style={{ color: "var(--accent-cyan)" }}>•</span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>The Technical Society of OUTR</span>
          </div>
          <div>Odisha University of Technology and Research, Bhubaneswar — 751029</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShieldAlert size={14} color="var(--accent-cyan)" />
            <span>Anti-Cheat AI Telemetry Active</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Built with</span>
            <Heart size={14} color="var(--accent-rose)" />
            <span>by Zairza Software Wing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
