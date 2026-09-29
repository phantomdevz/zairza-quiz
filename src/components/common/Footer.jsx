import React from "react";
import { useQuiz } from "../../context/QuizContext";
import { Shield } from "lucide-react";

export const Footer = () => {
  const { setCurrentView } = useQuiz();

  return (
    <footer style={{
      borderTop: "1px solid var(--line)",
      padding: "36px 0 50px",
      marginTop: "auto",
      font: "400 .78rem var(--mono)",
      color: "var(--mut)"
    }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>ZAIRZA CLUB · WONDER • THINK • CREATE</div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span>LAT 20.2644° N · LON 85.7761° E · ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH</span>
          <button
            onClick={() => setCurrentView("page11_login")}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--mut)",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.72rem",
              opacity: 0.6,
              transition: "opacity 0.2s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            title="Administrator Portal (Ctrl + Shift + A)"
          >
            <Shield size={12} />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

