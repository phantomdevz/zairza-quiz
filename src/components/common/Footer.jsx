import React from "react";

export const Footer = () => {
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
        <div>LAT 20.2644° N · LON 85.7761° E · ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH</div>
      </div>
    </footer>
  );
};
