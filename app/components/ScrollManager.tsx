"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import StoryOverlay from "./StoryOverlay";
import SignupSection from "./SignupSection";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

const SCROLL_HEIGHT = 370; // vh units

export default function ScrollManager() {
  const scrollProgress = useRef(0);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollEl = document.documentElement;
      const tunnelMax = scrollEl.clientHeight * SCROLL_HEIGHT * 0.01 - scrollEl.clientHeight;
      const current = Math.min(window.scrollY, tunnelMax);
      scrollProgress.current = Math.max(0, Math.min(1, current / tunnelMax));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Scene3D scrollProgress={scrollProgress} />
      <StoryOverlay scrollProgress={scrollProgress} />
      <div style={{ height: `${SCROLL_HEIGHT}vh` }} />
      <SignupSection />
    </>
  );
}
