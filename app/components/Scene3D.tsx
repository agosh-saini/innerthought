"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// ─── Section image config ─────────────────────────────────────────────────────
// Each entry maps a story section to one image placed at a Z depth in the tunnel.
// Camera travels from Z=0 → Z=-310 as scroll goes 0→1.
// Place each image near the center of its section's camera range.
//
// Section ranges (scroll 0–1) → camera Z:
//   1  [0.10–0.20] → cam -31 to -62  → image Z ≈ -52
//   2  [0.22–0.32] → cam -68 to -99  → image Z ≈ -85
//   3  [0.34–0.44] → cam -105 to -136 → image Z ≈ -122
//   4  [0.46–0.56] → cam -143 to -174 → image Z ≈ -160
//   5  [0.58–0.68] → cam -180 to -211 → image Z ≈ -197
//   6  [0.70–0.80] → cam -217 to -248 → image Z ≈ -234

interface SectionImage {
  sectionId: number;
  src: string;
  z: number;
  x: number;   // side offset: positive = right, negative = left
  y: number;
  // width/height are derived from the image's natural aspect ratio at runtime
  // baseHeight sets the world-unit height; width is computed from aspect ratio
  baseHeight: number;
  driftX: number; // which side to drift toward as it passes
}

// Only section 1 has an image for now; others are placeholders (no src)
const SECTION_IMAGES: SectionImage[] = [
  { sectionId: 1, src: "/1.jpg",  z: -52,  x:  2.8, y: 0, baseHeight: 3.5, driftX:  1 },
  { sectionId: 2, src: "/2.jpg",  z: -85,  x: -2.8, y: 0, baseHeight: 3.5, driftX: -1 },
  { sectionId: 3, src: "/3.jpg",  z: -122, x:  2.8, y: 0, baseHeight: 3.5, driftX:  1 },
  { sectionId: 4, src: "/4.jpg",  z: -160, x: -2.8, y: 0, baseHeight: 3.5, driftX: -1 },
  { sectionId: 5, src: "/5.jpg",  z: -197, x:  2.8, y: 0, baseHeight: 3.5, driftX:  1 },
];

// ─── Image plane ──────────────────────────────────────────────────────────────

function ImagePlane({
  img,
  cameraZ,
}: {
  img: SectionImage;
  cameraZ: React.MutableRefObject<number>;
}) {
  const texture = useTexture(img.src);
  const meshRef = useRef<THREE.Mesh>(null);

  // Derive plane dimensions from the image's natural pixel dimensions.
  // useTexture suspends until loaded, so texture.image is available here.
  const aspect =
    texture.image instanceof HTMLImageElement
      ? texture.image.naturalWidth / texture.image.naturalHeight
      : 16 / 9;
  const planeW = img.baseHeight * aspect;
  const planeH = img.baseHeight;

  useFrame(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    // relZ: negative = image is ahead of camera, positive = behind
    const relZ = img.z - cameraZ.current;

    if (relZ > 8 || relZ < -70) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;

    // dist: 0 = right at camera, 1 = 60 units away
    const dist = Math.max(0, Math.min(1, -relZ / 60));

    // Uniform scale for depth effect
    const scale = Math.pow(1 - dist * 0.92, 1.5) + 0.08;
    mesh.scale.setScalar(scale);

    // Drift further to the side as it passes the camera
    const passAmount = Math.max(0, relZ);
    mesh.position.x = img.x + img.driftX * passAmount * 0.4;
    mesh.position.y = img.y - passAmount * 0.1;
    mesh.position.z = img.z;

    // Slight outward tilt as it drifts past
    mesh.rotation.y = img.driftX * passAmount * 0.04;

    // Fade in from distance, fade out as it passes
    let opacity = 1;
    if (dist > 0.75) {
      opacity = THREE.MathUtils.lerp(0, 1, (1 - dist) / 0.25);
    }
    if (relZ > 0) {
      opacity = Math.max(0, 1 - relZ / 6);
    }

    const mat = mesh.material as THREE.MeshBasicMaterial;
    if (mat) mat.opacity = Math.max(0, Math.min(1, opacity));
  });

  return (
    <mesh ref={meshRef} position={[img.x, img.y, img.z]}>
      <planeGeometry args={[planeW, planeH]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Camera rig ───────────────────────────────────────────────────────────────

function CameraRig({
  scrollProgress,
  cameraZ,
}: {
  scrollProgress: React.MutableRefObject<number>;
  cameraZ: React.MutableRefObject<number>;
}) {
  const { camera } = useThree();
  const targetZ = useRef(0);

  useFrame(() => {
    const progress = scrollProgress.current;
    targetZ.current = -progress * 310;

    // Slow down at temple (last 10%)
    const eased =
      progress < 0.9
        ? targetZ.current
        : THREE.MathUtils.lerp(targetZ.current, -295, (progress - 0.9) / 0.1);

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, eased, 0.05);
    cameraZ.current = camera.position.z;

    // Gentle sway
    camera.position.x = Math.sin(Date.now() * 0.0003) * 0.06;
    camera.position.y = Math.cos(Date.now() * 0.0002) * 0.04;
    camera.lookAt(
      camera.position.x * 0.5,
      camera.position.y * 0.5,
      camera.position.z - 10
    );
  });

  return null;
}

// ─── Main canvas ──────────────────────────────────────────────────────────────

export default function Scene3D({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const cameraZ = useRef(0);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 500 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#0d0b07",
      }}
      gl={{ antialias: true, alpha: false }}
    >
      <fog attach="fog" args={["#0d0b07", 30, 200]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#f2c94c" />
      <pointLight position={[0, 5, -100]} color="#c9a84c" intensity={0.8} distance={80} />
      <pointLight position={[0, 5, -200]} color="#7a9e7e" intensity={0.5} distance={60} />

      <CameraRig scrollProgress={scrollProgress} cameraZ={cameraZ} />

      {/* Section images */}
      <Suspense fallback={null}>
        {SECTION_IMAGES.map((img) => (
          <ImagePlane key={img.sectionId} img={img} cameraZ={cameraZ} />
        ))}
      </Suspense>

    </Canvas>
  );
}
