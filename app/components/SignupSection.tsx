"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function SignupSection() {
  // Load Tally popup script once
  useEffect(() => {
    if (document.getElementById("tally-js")) return;
    const s = document.createElement("script");
    s.id = "tally-js";
    s.src = "https://tally.so/widgets/embed.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);


  return (
    <section
      id="signup"
      style={{
        position: "relative",
        zIndex: 20,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, transparent 0%, rgba(13,11,7,0.97) 20%, #0d0b07 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        style={{
          maxWidth: 480,
          width: "100%",
          padding: "3rem 2rem",
          textAlign: "center",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#c9a84c",
            marginBottom: "1.5rem",
            opacity: 0.7,
          }}
        >
          innerthought
        </p>

        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 400,
            color: "#f5f0e8",
            lineHeight: 1.3,
            marginBottom: "1rem",
          }}
        >
          We're building
          <br />
          <span style={{ color: "#c9a84c" }}>the next interface.</span>
        </h2>

        <p
          style={{
            color: "#d4b483",
            fontSize: "1rem",
            lineHeight: 1.7,
            marginBottom: "3rem",
            opacity: 0.8,
          }}
        >
          Follow along as we build it.
        </p>

        {/* CTA button */}
        <a
          href="#tally-open=ZjdERa&tally-hide-title=1&tally-emoji-animation=wave"
          style={{
            display: "inline-block",
            padding: "1rem 2.5rem",
            background: "rgba(201,168,76,0.12)",
            border: "1px solid #c9a84c",
            color: "#c9a84c",
            fontSize: "0.85rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "Georgia, 'Times New Roman', serif",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.22)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.12)";
          }}
        >
          Get Updates
        </a>

        <p style={{ marginTop: "4rem", fontSize: "0.7rem", color: "#d4b483", opacity: 0.35, letterSpacing: "0.05em" }}>
          &copy; {new Date().getFullYear()} innerthought
        </p>
      </motion.div>
    </section>
  );
}
