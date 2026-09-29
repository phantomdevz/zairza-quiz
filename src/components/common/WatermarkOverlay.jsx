import React, { useState, useEffect } from "react";
import { useQuiz } from "../../context/QuizContext";

export const WatermarkOverlay = () => {
  const { activeCandidate, isQuizActive, isQuizSubmitted } = useQuiz();
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    if (!isQuizActive || isQuizSubmitted) return;
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, [isQuizActive, isQuizSubmitted]);

  if (!isQuizActive || isQuizSubmitted) return null;

  const roll = activeCandidate?.rollNumber || "24011042";
  const name = activeCandidate?.fullName || "OUTR Candidate";

  return (
    <div className="proctor-watermark-layer" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="watermark-stamp">
          <div style={{ fontWeight: "700", color: "#38bdf8" }}>OUTR: {roll}</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>{name}</div>
          <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>{timestamp}</div>
        </div>
      ))}
    </div>
  );
};
