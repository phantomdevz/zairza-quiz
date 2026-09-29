import React from "react";
import { QuizProvider, useQuiz } from "./context/QuizContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { WatermarkOverlay } from "./components/common/WatermarkOverlay";
import { ProctoringGuard } from "./components/common/ProctoringGuard";

// Candidate Pages
import { Page1Landing } from "./components/candidate/Page1Landing";
import { Page2Registration } from "./components/candidate/Page2Registration";
import { Page3Countdown } from "./components/candidate/Page3Countdown";
import { Page4PreQuizCheck } from "./components/candidate/Page4PreQuizCheck";
import { Page5ProctoredQuiz } from "./components/candidate/Page5ProctoredQuiz";
import { Page6ViolationModal } from "./components/candidate/Page6ViolationModal";
import { Page7SubmitModal } from "./components/candidate/Page7SubmitModal";
import { Page8SubmissionSuccess } from "./components/candidate/Page8SubmissionSuccess";
import { Page9CandidateDashboard } from "./components/candidate/Page9CandidateDashboard";
import { Page10Results } from "./components/candidate/Page10Results";

// Admin Pages
import { Page11AdminLogin } from "./components/admin/Page11AdminLogin";
import { Page12AdminDashboard } from "./components/admin/Page12AdminDashboard";
import { Page13Registrations } from "./components/admin/Page13Registrations";
import { Page14CandidateDetails } from "./components/admin/Page14CandidateDetails";
import { Page15LiveProctoring } from "./components/admin/Page15LiveProctoring";
import { Page16QuestionBank } from "./components/admin/Page16QuestionBank";
import { Page17QuizConfig } from "./components/admin/Page17QuizConfig";
import { Page18ResultsAnalytics } from "./components/admin/Page18ResultsAnalytics";
import { Page19AuditLogs } from "./components/admin/Page19AuditLogs";
import { Page20UserManagement } from "./components/admin/Page20UserManagement";

const PlatformRouter = () => {
  const { currentView, setCurrentView, isQuizActive } = useQuiz();

  React.useEffect(() => {
    const handleHashAndShortcut = () => {
      if (window.location.hash === "#admin" || window.location.search.includes("admin")) {
        setCurrentView("page11_login");
      }
    };

    const handleKeyDown = (e) => {
      // Ctrl + Shift + A shortcut for admin access
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setCurrentView("page11_login");
      }
    };

    handleHashAndShortcut();
    window.addEventListener("hashchange", handleHashAndShortcut);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("hashchange", handleHashAndShortcut);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCurrentView]);

  const renderActiveView = () => {
    switch (currentView) {
      // Candidate Experience (Pages 1–10)
      case "page1_landing":
        return <Page1Landing />;
      case "page2_register":
        return <Page2Registration />;
      case "page3_countdown":
        return <Page3Countdown />;
      case "page4_precheck":
        return <Page4PreQuizCheck />;
      case "page5_quiz":
        return <Page5ProctoredQuiz />;
      case "page8_success":
        return <Page8SubmissionSuccess />;
      case "page9_dashboard":
        return <Page9CandidateDashboard />;
      case "page10_results":
        return <Page10Results />;

      // Admin Suite (Pages 11–20)
      case "page11_login":
        return <Page11AdminLogin />;
      case "page12_admin_dashboard":
        return <Page12AdminDashboard />;
      case "page13_registrations":
        return <Page13Registrations />;
      case "page14_candidate_details":
        return <Page14CandidateDetails />;
      case "page15_proctoring":
        return <Page15LiveProctoring />;
      case "page16_question_bank":
        return <Page16QuestionBank />;
      case "page17_quiz_config":
        return <Page17QuizConfig />;
      case "page18_analytics":
        return <Page18ResultsAnalytics />;
      case "page19_audit_logs":
        return <Page19AuditLogs />;
      case "page20_users":
        return <Page20UserManagement />;

      default:
        return <Page1Landing />;
    }
  };

  return (
    <div className="page-wrapper">
      <ProctoringGuard />
      <WatermarkOverlay />
      <Page6ViolationModal />
      <Page7SubmitModal />

      <Navbar />
      <main style={{ flex: 1 }}>{renderActiveView()}</main>
      {!isQuizActive && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <QuizProvider>
      <PlatformRouter />
    </QuizProvider>
  );
}
