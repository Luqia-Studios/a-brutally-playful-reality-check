"use client";

import { useEffect, useRef, useState } from "react";

const KEYBOARD_THRESHOLD = 120;

export function useViewportMetrics() {
  const baselineHeightRef = useRef(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const viewport = window.visualViewport;
    let frame = 0;

    const measure = () => {
      const currentHeight = Math.round(viewport?.height ?? window.innerHeight);
      const currentWidth = Math.round(viewport?.width ?? window.innerWidth);
      const narrowScreen = currentWidth < 1024;

      if (baselineHeightRef.current === 0) {
        baselineHeightRef.current = currentHeight;
      }

      if (!narrowScreen || baselineHeightRef.current - currentHeight < 80) {
        baselineHeightRef.current = Math.max(baselineHeightRef.current, currentHeight);
      }

      const delta = Math.max(0, baselineHeightRef.current - currentHeight);
      const nextKeyboardOpen = narrowScreen && delta > KEYBOARD_THRESHOLD;

      document.documentElement.style.setProperty("--app-height", `${currentHeight}px`);
      document.documentElement.style.setProperty("--keyboard-offset", `${delta}px`);
      document.documentElement.dataset.keyboard = nextKeyboardOpen ? "open" : "closed";
      setKeyboardOpen(nextKeyboardOpen);
    };

    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    schedule();
    viewport?.addEventListener("resize", schedule);
    viewport?.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", schedule);
      viewport?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      document.documentElement.style.removeProperty("--keyboard-offset");
      document.documentElement.style.removeProperty("--app-height");
      delete document.documentElement.dataset.keyboard;
    };
  }, []);

  return { keyboardOpen };
}
