import { useEffect, useRef, useState, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import heroVideo from "../assets/video.webm";

/* ---------- 3D MODEL ---------- */
const VRHeadset = memo(function VRHeadset({
  progressRef,
  initialScale,
  active,
}) {
  const ref = useRef();
  const { scene } = useGLTF("/vr-wings/vr-headset.glb");

  useFrame(() => {
    if (!ref.current || !active) return;

    const p = progressRef.current;

    // Smooth rotation
    ref.current.rotation.x +=
      (p * Math.PI * 0.8 - ref.current.rotation.x) * 0.1;
    ref.current.rotation.y +=
      (p * Math.PI * 2 - ref.current.rotation.y) * 0.1;

    // Smooth scale
    const targetScale = initialScale + p * (12 - initialScale);
    ref.current.scale.x += (targetScale - ref.current.scale.x) * 0.1;
    ref.current.scale.y += (targetScale - ref.current.scale.y) * 0.1;
    ref.current.scale.z += (targetScale - ref.current.scale.z) * 0.1;

    ref.current.position.y = -0.4;
  });

  return <primitive ref={ref} object={scene.clone()} />;
});

/* ---------- MAIN HERO ---------- */
export default function Home_Hero() {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(true);
  const [initialScale, setInitialScale] = useState(5);

  /* ---------- Responsive scale ---------- */
  useEffect(() => {
    const updateScale = () => {
      setInitialScale(window.innerWidth < 768 ? 3 : 5);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  /* ---------- Scroll handling (optimized) ---------- */
  useEffect(() => {
    let touchStartY = 0;
    let ticking = false;

    const updateProgress = (delta) => {
      const next = Math.min(Math.max(progressRef.current + delta, 0), 1);
      progressRef.current = next;
      setProgress(next);

      if (next >= 1) {
        setScrollLocked(false);
        document.body.style.overflow = "auto";
      }
    };

    const handleWheel = (e) => {
      if (!scrollLocked) return;
      e.preventDefault();
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        updateProgress(e.deltaY * 0.0015);
        ticking = false;
      });
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!scrollLocked) return;
      const delta = touchStartY - e.touches[0].clientY;
      updateProgress(delta * 0.003);
      touchStartY = e.touches[0].clientY;
    };

    if (scrollLocked) document.body.style.overflow = "hidden";

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      document.body.style.overflow = "auto";
    };
  }, [scrollLocked]);

  /* ---------- Model vertical animation ---------- */
  const modelTop = 40 * (1 - Math.min(progress * 5, 1));

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden mb-0"
    >
      {/* ================= VIDEO ================= */}
      {progress >= 1 && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideo} type="video/webm" />
        </video>
      )}

      {/* ================= GRADIENT ================= */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: "linear-gradient(to top right, #9000FF, white, white)",
          opacity: progress >= 1 ? 0 : 1,
          zIndex: 0,
        }}
      />

      {/* ================= 3D MODEL (DESTROY AFTER DONE) ================= */}
      {progress < 1 && (
        <div
          className="fixed left-0 w-full h-screen pointer-events-none"
          style={{
            transform: `translateY(${modelTop}px)`,
            zIndex: progress < 0.2 ? 0 : 10,
          }}
        >
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            camera={{ position: [0, 0, 6], fov: 50 }}
          >
            <ambientLight intensity={1} />
            <directionalLight position={[4, 4, 4]} intensity={1.6} />
            <Suspense fallback={null}>
              <VRHeadset
                progressRef={progressRef}
                initialScale={initialScale}
                active={progress < 1}
              />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-start text-center px-6 pt-[20vh] sm:pt-[22vh] md:pt-[25vh] lg:pt-[30vh]"
        style={{ zIndex: 5 }}
      >
        <div className="max-w-[1200px] w-full flex flex-col items-center">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 transition-colors duration-700"
            style={{ color: progress >= 1 ? "#ffffff" : "#51007d" }}
          >
            VR Wing delivers cutting-edge AR, VR, XR, VR360, and AI-powered
            simulation & copilot solutions for learning and business growth
          </h1>

          <button className="px-6 sm:px-8 py-2 sm:py-3 bg-[#9000ff] text-white font-semibold rounded-[30px] shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group">
            Osso Nurse Training
            <span className="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              {">"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
