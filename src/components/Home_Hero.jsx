import { useEffect, useRef, useState, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import heroVideo from "../assets/video.webm";

/* ---------- 3D MODEL ---------- */
const VRHeadset = memo(function VRHeadset({ progressRef, initialScale, active }) {
  const ref = useRef();
  const { scene } = useGLTF("/vr-wings/vr-headset.glb");

  useFrame(() => {
    if (!ref.current || !active) return;

    const p = progressRef.current;

    // Rotation
    ref.current.rotation.x += (p * Math.PI * 0.8 - ref.current.rotation.x) * 0.1;
    ref.current.rotation.y += (p * Math.PI * 2.2 - ref.current.rotation.y) * 0.1;

    // Scale
    const maxScale = 45;
    const targetScale = initialScale + p * (maxScale - initialScale);
    ref.current.scale.x += (targetScale - ref.current.scale.x) * 0.15;
    ref.current.scale.y += (targetScale - ref.current.scale.y) * 0.15;
    ref.current.scale.z += (targetScale - ref.current.scale.z) * 0.15;

    ref.current.position.y = -1;
    ref.current.position.x = -0.2;
  });

  return <primitive ref={ref} object={scene.clone()} />;
});

/* ---------- MAIN HERO ---------- */
export default function Home_Hero() {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const isReversingRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const touchStartRef = useRef({ y: 0, time: 0 });
  const reverseTriggeredRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(true);
  const [initialScale, setInitialScale] = useState(5);
  const [showModel, setShowModel] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  /* ---------- Check if mobile ---------- */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------- Responsive scale ---------- */
  useEffect(() => {
    const updateScale = () => setInitialScale(window.innerWidth < 768 ? 3 : 5);
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  /* ---------- Show model when progress resets ---------- */
  useEffect(() => {
    if (progress === 0) {
      setShowModel(true);
      reverseTriggeredRef.current = false;
    }
  }, [progress]);

  /* ---------- Scroll & Touch Animation Handling ---------- */
  useEffect(() => {
    let ticking = false;
    let touchAnimationFrame;

    const updateProgress = (delta) => {
      if (isReversingRef.current) return;

      let next = Math.min(Math.max(progressRef.current + delta, 0), 1);
      progressRef.current = next;
      setProgress(next);

      if (next > 0 && next < 1) {
        setScrollLocked(true);
        document.body.style.overflow = "hidden";
      } else if (next >= 1) {
        setScrollLocked(false);
        document.body.style.overflow = "auto";
        setShowModel(false);
      } else if (next <= 0) {
        setScrollLocked(false);
        document.body.style.overflow = "auto";
        setShowModel(true);
      }
    };

    /* ---------- PC Wheel ---------- */
    const handleWheel = (e) => {
      if (scrollLocked || progressRef.current < 1) e.preventDefault();
      if (!scrollLocked && progressRef.current >= 1) return;
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        updateProgress(e.deltaY * 0.0016);
        ticking = false;
      });
    };

    /* ---------- Mobile Touch ---------- */
    const handleTouchStart = (e) => {
      touchStartRef.current = {
        y: e.touches[0].clientY,
        time: Date.now()
      };
    };

    const handleTouchMove = (e) => {
      if (scrollLocked || progressRef.current < 1) e.preventDefault();
      if (!scrollLocked && progressRef.current >= 1) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartRef.current.y - currentY;

      const multiplier = 0.01; // Increased for smooth mobile animation

      // Cancel previous frame
      if (touchAnimationFrame) cancelAnimationFrame(touchAnimationFrame);

      touchAnimationFrame = requestAnimationFrame(() => {
        updateProgress(deltaY * multiplier);
      });

      touchStartRef.current.y = currentY;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (touchAnimationFrame) cancelAnimationFrame(touchAnimationFrame);
      document.body.style.overflow = "auto";
    };
  }, [scrollLocked]);

  /* ---------- Reverse Animation on Scroll Up ---------- */
  useEffect(() => {
    let scrollTimeout;
    const checkForReverse = () => {
      const currentScrollY = window.scrollY;
      const sectionTop = sectionRef.current?.offsetTop || 0;
      const isAtTop = currentScrollY <= sectionTop + 10;

      if (
        !isReversingRef.current &&
        !reverseTriggeredRef.current &&
        scrollLocked === false &&
        progress === 1 &&
        isAtTop &&
        currentScrollY < lastScrollYRef.current
      ) {
        startReverseAnimation();
      }
      lastScrollYRef.current = currentScrollY;
    };

    const startReverseAnimation = () => {
      reverseTriggeredRef.current = true;
      isReversingRef.current = true;
      setScrollLocked(true);
      document.body.style.overflow = "hidden";
      setShowModel(true);

      const reverse = () => {
        progressRef.current -= 0.02;
        if (progressRef.current <= 0) {
          progressRef.current = 0;
          setProgress(0);
          setScrollLocked(false);
          isReversingRef.current = false;
          document.body.style.overflow = "auto";
        } else {
          setProgress(progressRef.current);
          requestAnimationFrame(reverse);
        }
      };

      setTimeout(() => requestAnimationFrame(reverse), 50);
    };

    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkForReverse, 50);
    };
    const handleTouchEnd = () => setTimeout(checkForReverse, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchend", handleTouchEnd);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollLocked, progress]);

  /* ---------- Reset on scroll down ---------- */
  useEffect(() => {
    const handleScrollDown = (e) => {
      const sectionTop = sectionRef.current?.offsetTop || 0;
      const isScrollingDown =
        (e.deltaY && e.deltaY > 0) ||
        (e.touches && touchStartRef.current.y - e.touches[0]?.clientY < 0);

      if (isScrollingDown && window.scrollY <= sectionTop + 10) {
        if (progress === 0 && showModel) {
          progressRef.current = 0.01;
          setProgress(0.01);
          setScrollLocked(true);
        }
      }
    };

    window.addEventListener("wheel", handleScrollDown);
    window.addEventListener("touchmove", handleScrollDown);

    return () => {
      window.removeEventListener("wheel", handleScrollDown);
      window.removeEventListener("touchmove", handleScrollDown);
    };
  }, [progress, showModel]);

  /* ---------- Model vertical animation ---------- */
  const modelTop = 40 * (1 - Math.min(progress * 5, 1));

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ touchAction: scrollLocked ? "none" : "auto" }}
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

      {/* ================= 3D MODEL ================= */}
     {showModel && progress < 1 && (
  <div
    className="fixed left-0 w-full h-screen pointer-events-none"
    style={{
      transform: `translate(${isMobile ? '0px' : '0px'}, ${modelTop + (isMobile ? 50 : 0)}px)`, 
      zIndex: progress < 0.2 ? 0 : 10,
    }}
  >
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [-3, -4, 6], fov: 60 }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[4, 4, 4]} intensity={1.6} />
      <Suspense fallback={null}>
        <VRHeadset
          progressRef={progressRef}
          initialScale={isMobile ? initialScale * 0.9 : initialScale} // slightly smaller on mobile
          active={showModel && progress < 1}
        />
      </Suspense>
    </Canvas>
  </div>
)}


      {/* ================= CONTENT ================= */}
      <div
        className="absolute inset-0 flex flex-col items-center text-center px-6 pt-[25vh]"
        style={{ zIndex: 5 }}
      >
<h1
  className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-bold mb-6 transition-colors duration-700"
  style={{ 
    color: progress >= 1 ? "#ffffff" : "#51007d", 
    maxWidth: "800px",
    fontFamily: "Times New Roman, serif"
  }}
>
  VR Wing delivers cutting-edge AR, VR, XR, VR360, and AI-powered
  simulation & copilot solutions for learning and business growth
</h1>



    <button className="text-sm sm:text-sm md:text-base px-4 sm:px-4 md:px-6 py-2 sm:py-2 md:py-2 bg-[#9000ff] text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300">
  Osso Nurse Training →
</button>

      </div>
    </section>
  );
}
