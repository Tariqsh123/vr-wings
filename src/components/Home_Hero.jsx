import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import heroVideo from "../assets/video.webm";

/* ---------- 3D MODEL ---------- */
function VRHeadset({ progress, initialScale }) {
  const ref = useRef();
  const { scene } = useGLTF("/vr-wings/vr-headset.glb");

  useFrame(() => {
    if (!ref.current) return;

    // Rotate X-axis
    ref.current.rotation.x = progress * Math.PI * 0.8;

    // Full 360° Y rotation
    ref.current.rotation.y = progress * Math.PI * 2;

    // Zoom: initialScale → 12 on scroll
    const scale = initialScale + progress * (12 - initialScale);
    ref.current.scale.set(scale, scale, scale);

    // Slight Y offset
    ref.current.position.y = -0.4;
  });

  return <primitive ref={ref} object={scene} />;
}

/* ---------- MAIN HERO ---------- */
export default function Home_Hero() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  /* ---------- Scroll + Touch Handling ---------- */
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e) => {
      e.preventDefault();
      setProgress((prev) => Math.min(Math.max(prev + e.deltaY * 0.001, 0), 1));
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      const delta = touchStartY - touchY;
      setProgress((prev) => Math.min(Math.max(prev + delta * 0.002, 0), 1));
      touchStartY = touchY;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  /* ---------- Responsive initial scale ---------- */
  const [initialScale, setInitialScale] = useState(5);
  useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth < 768) setInitialScale(3); // mobile
      else setInitialScale(5); // tablet + desktop
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  /* ---------- Animate top: start 40px → scroll 0px ---------- */
  const modelTop = 40 * (1 - Math.min(progress * 5, 1));

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* ================= VIDEO ================= */}
      {progress > 0.95 && (
        <video
          autoPlay
          loop
          muted
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
          opacity: progress > 0.95 ? 0 : 1,
          zIndex: 0,
        }}
      />

      {/* ================= 3D MODEL ================= */}
      <div
        className="fixed left-0 w-full h-screen pointer-events-none transition-all duration-500"
        style={{
          transform: `translateY(${modelTop}px)`,
          zIndex: progress < 0.2 ? 0 : 10,
          opacity: progress > 0.95 ? 0 : 1,
        }}
      >
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} className="w-full h-full">
          <ambientLight intensity={1.3} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} />
          <Suspense fallback={null}>
            <VRHeadset progress={progress} initialScale={initialScale} />
          </Suspense>
        </Canvas>
      </div>

      {/* ================= CONTENT ================= */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-start text-center px-6 pt-[20vh] sm:pt-[22vh] md:pt-[25vh] lg:pt-[30vh] transition-all duration-300"
        style={{ zIndex: 5 }}
      >
        <div className="max-w-[1200px] w-full flex flex-col items-center">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-center transition-colors duration-700"
            style={{ color: progress > 0.95 ? "#ffffff" : "#51007d" }}
          >
            VR Wing delivers cutting-edge AR, VR, XR, VR360, and AI-powered
            simulation & copilot solutions for learning and business growth
          </h1>

          <button className="px-6 sm:px-8 py-2 sm:py-3 bg-[#9000ff] text-white font-semibold rounded-[30px] shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group">
            Osso Nurse Training
            <span className="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              {'>'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
