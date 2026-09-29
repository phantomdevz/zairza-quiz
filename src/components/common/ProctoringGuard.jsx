import React, { useEffect } from "react";
import { useQuiz } from "../../context/QuizContext";

export const ProctoringGuard = () => {
  const { isQuizActive, isQuizSubmitted, triggerViolation } = useQuiz();

  useEffect(() => {
    if (!isQuizActive || isQuizSubmitted) return;

    // 1. Tab / App Switch Detector (Visibility Change)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        triggerViolation(
          isMobile ? "MOBILE_APP_SWITCH" : "TAB_SWITCH",
          "Document switched to hidden background state."
        );
      }
    };

    // 2. Window Blur Detector
    const handleWindowBlur = () => {
      triggerViolation("WINDOW_BLUR", "Browser window lost focus.");
    };

    // 3. Fullscreen Exit Detector (Desktop)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && window.innerWidth > 768) {
        triggerViolation("FULLSCREEN_EXIT", "Assessment exited fullscreen mode.");
      }
    };

    // 4. Prohibited Shortcut Trap
    const handleKeyDown = (e) => {
      // Prevent F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        triggerViolation("FORBIDDEN_KEY", "F12 Developer Tools shortcut");
        return;
      }

      // Prevent PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        triggerViolation("FORBIDDEN_KEY", "PrintScreen captured");
        return;
      }

      // Prevent Ctrl+C, Ctrl+V, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === "c" || key === "v" || key === "u" || key === "p" || key === "s") {
          e.preventDefault();
          triggerViolation("FORBIDDEN_KEY", `Ctrl+${key.toUpperCase()}`);
        }
        if (e.shiftKey && (key === "i" || key === "c" || key === "j")) {
          e.preventDefault();
          triggerViolation("FORBIDDEN_KEY", "Developer Console Inspector shortcut");
        }
      }
    };

    // 5. Context Menu Suppression
    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerViolation("FORBIDDEN_KEY", "Right click / Context Menu disabled");
    };

    // 6. Mobile Multi-Window / Split-Screen Detection
    const handleResize = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && window.innerHeight < 400) {
        triggerViolation("MOBILE_APP_SWITCH", "Split-screen or multitasking resize detected.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("resize", handleResize);
    };
  }, [isQuizActive, isQuizSubmitted, triggerViolation]);

  return null;
};
