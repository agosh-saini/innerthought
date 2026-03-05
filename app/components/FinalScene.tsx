"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const FINAL_START = 0.88;

// ─── 3D headphone case ────────────────────────────────────────────────────────

function HeadphoneCase() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.6;
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.07;
  });

  return (
    <group ref={groupRef}>
      {/* ── Bottom shell ── */}
      <RoundedBox args={[2.2, 0.75, 1.4]} radius={0.18} smoothness={4} position={[0, -0.38, 0]}>
        <meshStandardMaterial
          color="#111008"
          roughness={0.25}
          metalness={0.6}
          envMapIntensity={1}
        />
      </RoundedBox>

      {/* ── Lid ── */}
      <RoundedBox args={[2.2, 0.38, 1.4]} radius={0.18} smoothness={4} position={[0, 0.19, 0]}>
        <meshStandardMaterial
          color="#1a1610"
          roughness={0.2}
          metalness={0.65}
          envMapIntensity={1}
        />
      </RoundedBox>

      {/* ── Split seam line (thin gold strip) ── */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.26, 0.025, 1.46]} />
        <meshStandardMaterial
          color="#c9a84c"
          roughness={0.1}
          metalness={0.9}
          emissive="#c9a84c"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* ── Hinge (back centre) ── */}
      <mesh position={[0, 0, -0.72]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.55, 16]} />
        <meshStandardMaterial color="#c9a84c" roughness={0.1} metalness={0.95} />
      </mesh>
      {/* hinge caps */}
      {[-0.28, 0.28].map((x, i) => (
        <mesh key={i} position={[x, 0, -0.72]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#c9a84c" roughness={0.1} metalness={0.95} />
        </mesh>
      ))}

      {/* ── Clasp (front centre) ── */}
      <mesh position={[0, 0, 0.72]}>
        <boxGeometry args={[0.28, 0.1, 0.06]} />
        <meshStandardMaterial
          color="#c9a84c"
          roughness={0.1}
          metalness={0.95}
          emissive="#c9a84c"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ── Subtle logo indent (dark circle on lid top) ── */}
      <mesh position={[0, 0.385, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.01, 32]} />
        <meshStandardMaterial color="#c9a84c" roughness={0.3} metalness={0.8} emissive="#c9a84c" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

export default function FinalScene({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const [opacity, setOpacity] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const p = scrollProgress.current;
      setOpacity(Math.max(0, Math.min(1, (p - FINAL_START) / 0.05)));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scrollProgress]);

  if (opacity === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 8,
        pointerEvents: "none",
        opacity,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "5vh",
      }}
    >
      {/* Gold glow behind the case */}
      <div
        style={{
          position: "absolute",
          bottom: "4vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: 320,
          height: 200,
          background:
            "radial-gradient(ellipse at center, rgba(201,168,76,0.18) 0%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      {/* R3F canvas just for the case */}
      <div style={{ width: 320, height: 200, position: "relative" }}>
        <Canvas
          camera={{ position: [0, 0.4, 4], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 3]} intensity={1.4} color="#f5ecd4" />
          {/* Gold rim light from behind */}
          <pointLight position={[-2, 1, -3]} color="#c9a84c" intensity={3} distance={8} />
          {/* Cool fill from below */}
          <pointLight position={[0, -3, 2]} color="#7a9e7e" intensity={0.6} distance={6} />

          <HeadphoneCase />
        </Canvas>
      </div>
    </div>
  );
}
