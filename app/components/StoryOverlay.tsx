"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  id: number;
  title: string;
  subtitle?: string;
  range: [number, number]; // scroll progress 0–1
  isHero?: boolean;
  isFinal?: boolean;
  isTemple?: boolean;
}

const SECTIONS: Section[] = [
  {
    id: 0,
    title: "We're Building the Next Interface.",
    subtitle: "Subvocal AI headphones that turn inner monologue into conversation.",
    range: [0, 0.08],
    isHero: true,
  },
  {
    id: 1,
    title: "For centuries, thinking and communicating were separate.",
    range: [0.1, 0.2],
  },
  {
    id: 2,
    title: "We built screens to bridge the gap.",
    range: [0.22, 0.32],
  },
  {
    id: 3,
    title: "We typed. We tapped. We spoke.",
    range: [0.34, 0.44],
  },
  {
    id: 4,
    title: "What if AI could hear the voice inside your mind?",
    range: [0.46, 0.56],
  },
  {
    id: 5,
    title: "Subvocal signals convert inner speech into AI interaction.",
    subtitle: "Micro-movements of jaw and larynx. Intercepted before sound.",
    range: [0.58, 0.92],
  },
];

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function StoryOverlay({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const [activeSection, setActiveSection] = useState<Section | null>(SECTIONS[0]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const p = scrollProgress.current;
      const section = SECTIONS.find(
        (s) => p >= s.range[0] && p <= s.range[1]
      ) ?? null;
      setActiveSection((prev) => {
        if (prev?.id === section?.id) return prev;
        return section;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [scrollProgress]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection.id}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="text-center px-8 max-w-3xl"
          >
            {activeSection.isHero ? (
              <HeroContent />
            ) : activeSection.isFinal ? (
              <FinalContent />
            ) : (
              <StoryContent section={activeSection} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeroContent() {
  return (
    <div className="text-center">
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.3em" }}
        animate={{ opacity: 0.6, letterSpacing: "0.4em" }}
        transition={{ duration: 1.2 }}
        style={{ color: "#c9a84c", fontSize: "0.75rem", marginBottom: "1.5rem", textTransform: "uppercase" }}
      >
        innerloop
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 400,
          lineHeight: 1.15,
          color: "#f5f0e8",
          marginBottom: "1.5rem",
          textShadow: "0 0 40px rgba(201,168,76,0.3)",
        }}
      >
        We're Building
        <br />
        <span style={{ color: "#c9a84c" }}>the Next Interface</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 1, delay: 0.6 }}
        style={{
          fontSize: "clamp(1rem, 2vw, 1.3rem)",
          color: "#d4b483",
          marginBottom: "2.5rem",
          lineHeight: 1.6,
        }}
      >
        Subvocal AI headphones that turn inner monologue
        <br />
        into conversation.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="pointer-events-auto"
      >
        <a
          href="#tally-open=ZjdERa&tally-hide-title=1&tally-emoji-animation=wave"
          style={{
            display: "inline-block",
            padding: "0.85rem 2.5rem",
            border: "1px solid #c9a84c",
            color: "#c9a84c",
            fontSize: "0.9rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.3s",
            backgroundColor: "rgba(201,168,76,0.08)",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = "rgba(201,168,76,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = "rgba(201,168,76,0.08)";
          }}
        >
          Get Updates
        </a>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 1, delay: 1.4 }}
        style={{ marginTop: "2rem", fontSize: "0.85rem", color: "#d4b483", letterSpacing: "0.15em" }}
      >
        Scroll to see the future ↓
      </motion.p>
    </div>
  );
}

function StoryContent({ section }: { section: Section }) {
  return (
    <>
      <h2
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
          fontWeight: 400,
          color: "#f5f0e8",
          lineHeight: 1.3,
          textShadow: "0 0 60px rgba(0,0,0,0.8), 0 0 20px rgba(201,168,76,0.2)",
          marginBottom: section.subtitle ? "1.2rem" : 0,
        }}
      >
        {section.title}
      </h2>
      {section.subtitle && (
        <p
          style={{
            fontSize: "clamp(0.9rem, 1.8vw, 1.15rem)",
            color: "#c9a84c",
            opacity: 0.85,
            lineHeight: 1.6,
          }}
        >
          {section.subtitle}
        </p>
      )}
    </>
  );
}

function FinalContent() {
  return (
    <div>
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.2em" }}
        animate={{ opacity: 0.5, letterSpacing: "0.35em" }}
        transition={{ duration: 1.5 }}
        style={{ color: "#c9a84c", fontSize: "0.7rem", textTransform: "uppercase", marginBottom: "1.2rem" }}
      >
        innerloop
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
          fontWeight: 400,
          color: "#f5f0e8",
          lineHeight: 1.2,
          marginBottom: "1rem",
          textShadow: "0 0 40px rgba(201,168,76,0.4)",
        }}
      >
        We're Building
        <br />
        <span style={{ color: "#c9a84c" }}>the Interface.</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 0.7 }}
        style={{ color: "#d4b483", fontSize: "1.1rem", marginBottom: "0.75rem", lineHeight: 1.6 }}
      >
        A new way to think with machines — and we're just getting started.
      </motion.p>
    </div>
  );
}
