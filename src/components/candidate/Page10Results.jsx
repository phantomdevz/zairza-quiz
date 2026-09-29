import React from "react";
import { useQuiz } from "../../context/QuizContext";
import { Award, CheckCircle, XCircle, Clock, BarChart2, ShieldCheck, ArrowRight, User } from "lucide-react";

export const Page10Results = () => {
  const { activeCandidate, setCurrentView, quizConfig } = useQuiz();

  const candidate = activeCandidate || {
    rollNumber: "2401106042",
    fullName: "Aarav Mohapatra",
    score: 26,
    timeTakenSeconds: 1420,
    correctCount: 27,
    incorrectCount: 2,
    unansweredCount: 1,
    sectionScores: { logical: 9, tech: 13, hr: 4 }
  };

  const totalPossible = quizConfig.totalQuestions * quizConfig.marksPerQuestion; // 30
  const score = candidate.score !== null ? candidate.score : 26;
  const percentage = Math.round((score / totalPossible) * 100);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const logicalScore = candidate.sectionScores?.logical ?? 9;
  const techScore = candidate.sectionScores?.tech ?? 13;
  const hrScore = candidate.sectionScores?.hr ?? 4;

  return (
    <div className="container" style={{ padding: "40px 20px 80px", maxWidth: "900px" }}>
      {/* Top Header */}
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <span className="badge badge-emerald" style={{ marginBottom: "8px" }}>PERFORMANCE EVALUATION</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.6rem)", marginBottom: "6px" }}>
          Candidate Scorecard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Official induction performance breakdown for Registration Number: <strong className="mono" style={{ color: "var(--accent-cyan)" }}>{candidate.rollNumber}</strong> ({candidate.fullName}).
        </p>
      </div>

      {/* Main Scorecard Banner */}
      <div className="glass-panel glass-panel-glow" style={{ padding: "35px", textAlign: "center", marginBottom: "30px" }}>
        <div style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: "rgba(6, 182, 212, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          color: "var(--accent-cyan)"
        }}>
          <Award size={38} />
        </div>

        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Total Assessment Score
        </div>

        <div style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: "900", fontFamily: "var(--font-heading)", margin: "4px 0" }}>
          <span className="text-gradient">{score}</span>
          <span style={{ fontSize: "1.8rem", color: "var(--text-muted)", fontWeight: "500" }}> / {totalPossible}</span>
        </div>

        <div style={{ display: "inline-flex", gap: "10px", marginTop: "10px" }}>
          <span className="badge badge-emerald" style={{ fontSize: "0.85rem" }}>
            {percentage}% OVERALL ACCURACY
          </span>
          <span className="badge badge-cyan" style={{ fontSize: "0.85rem" }}>
            SHORTLIST QUALIFIED
          </span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px" }}>
        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--accent-emerald)" }}><CheckCircle size={28} /></div>
          <div>
            <div className="mono" style={{ fontSize: "1.4rem", fontWeight: "700" }}>{candidate.correctCount || 27}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Correct Answers</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--accent-rose)" }}><XCircle size={28} /></div>
          <div>
            <div className="mono" style={{ fontSize: "1.4rem", fontWeight: "700" }}>{candidate.incorrectCount || 2}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Incorrect Answers</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--accent-amber)" }}><Clock size={28} /></div>
          <div>
            <div className="mono" style={{ fontSize: "1.4rem", fontWeight: "700" }}>{formatTime(candidate.timeTakenSeconds || 1420)}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Time Taken (of 30m)</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--accent-cyan)" }}><ShieldCheck size={28} /></div>
          <div>
            <div className="mono" style={{ fontSize: "1.4rem", fontWeight: "700" }}>Clean (0 Flags)</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Proctoring Record</div>
          </div>
        </div>
      </div>

      {/* 3-Part Sectional Proficiency Breakdown */}
      <div className="glass-panel" style={{ padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "22px", display: "flex", alignItems: "center", gap: "8px" }}>
          <BarChart2 size={20} color="var(--accent-cyan)" />
          <span>Section-Wise Proficiency Breakdown (3 Parts)</span>
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Part 1 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                🧩 Part 1: Logical Reasoning & Analytical Aptitude
              </div>
              <div className="mono" style={{ fontWeight: "700", color: "var(--accent-cyan)" }}>
                {logicalScore} / 10 marks ({Math.round((logicalScore / 10) * 100)}%)
              </div>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${(logicalScore / 10) * 100}%`, height: "100%", background: "var(--grad-cyan-blue)", borderRadius: "4px" }} />
            </div>
          </div>

          {/* Part 2 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                ⚡ Part 2: Tech Knowledge & Domain Fundamentals
              </div>
              <div className="mono" style={{ fontWeight: "700", color: "var(--accent-purple)" }}>
                {techScore} / 15 marks ({Math.round((techScore / 15) * 100)}%)
              </div>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${(techScore / 15) * 100}%`, height: "100%", background: "var(--grad-purple-pink)", borderRadius: "4px" }} />
            </div>
          </div>

          {/* Part 3 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                🤝 Part 3: HR & Cultural Alignment Fit
              </div>
              <div className="mono" style={{ fontWeight: "700", color: "var(--accent-emerald)" }}>
                {hrScore} / 5 marks ({Math.round((hrScore / 5) * 100)}%)
              </div>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${(hrScore / 5) * 100}%`, height: "100%", background: "var(--accent-emerald)", borderRadius: "4px" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps Card */}
      <div className="glass-panel" style={{ padding: "26px", textAlign: "center", borderTop: "3px solid var(--accent-cyan)" }}>
        <h4 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>What's Next in Induction 2026?</h4>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: "600px", margin: "0 auto 20px" }}>
          You now have direct access to the <strong>Ideathon Problem Statements (PS)</strong> on your dashboard. <strong>Ideathon presentations &amp; Personal Interviews (PI)</strong> will take place from <strong>1st October to 3rd October</strong>, followed by the release of the <strong>Final Inductees List</strong>!
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
          <button
            onClick={() => setCurrentView("page9_dashboard")}
            className="btn btn-primary"
          >
            <span>View Ideathon PS on Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
