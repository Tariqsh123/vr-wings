import { useEffect, useRef, useState, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import heroVideo from "../assets/video.webm";
import * as THREE from "three";

/* ---------- 3D MODEL ---------- */
const VRHeadset = memo(function VRHeadset({ progressRef, initialScale, active }) {
  const ref = useRef();
  const { scene } = useGLTF("/vr-wings/vr-headset.glb");

  useFrame((state) => {
    if (!ref.current || !active) return;

    const p = progressRef.current;
    const t = state.clock.getElapsedTime();

    // --- Smooth rotation ---
    const rotX = p * Math.PI * 0.8 + Math.sin(t * 0.3) * 0.04;
    const rotY = p * Math.PI * 2.5 + Math.sin(t * 0.2) * 0.06;
    const rotZ = Math.sin(t * 0.25) * 0.03;

    ref.current.rotation.x += (rotX - ref.current.rotation.x) * 0.08;
    ref.current.rotation.y += (rotY - ref.current.rotation.y) * 0.08;
    ref.current.rotation.z += (rotZ - ref.current.rotation.z) * 0.06;

    // --- Smooth floating ---
    ref.current.position.x = -0.2 + Math.sin(t * 0.3) * 0.05;
    ref.current.position.y = -1 + Math.sin(t * 0.4) * 0.12 + p * 0.2;
    ref.current.position.z = Math.sin(t * 0.2) * 0.05;

    // --- Breathing / pulsing scale ---
    const pulse = 1 + Math.sin(t * 1.2) * 0.025;
    const maxScale = 1000;
    const targetScale = (initialScale + p * (maxScale - initialScale)) * pulse;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // --- Scroll-based tilt for interactivity ---
    ref.current.rotation.x += p * 0.05;
    ref.current.rotation.y += p * 0.05;
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
  const scrollTimeoutRef = useRef(null);
  const lastTouchMoveTimeRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(true);
  const [initialScale, setInitialScale] = useState(5);
  const [showModel, setShowModel] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [modelZIndex, setModelZIndex] = useState(1);
  const [touchDirection, setTouchDirection] = useState(null);

  /* ---------- Check if mobile ---------- */
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setInitialScale(mobile ? 3.5 : 5.5);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------- Update model z-index when animation starts ---------- */
  useEffect(() => {
    if (progress > 0 && progress < 1) setModelZIndex(99999);
    else if (progress === 0) setModelZIndex(1);
  }, [progress]);

  /* ---------- Show/Hide video based on progress ---------- */
  useEffect(() => {
    if (progress >= 1) {
      setShowVideo(true);
      setShowModel(false);
      setScrollLocked(false);
    } else {
      setShowVideo(false);
      setShowModel(true);
    }
  }, [progress]);

  /* ---------- Hide body scroll when model is showing ---------- */
  useEffect(() => {
    if (showModel && progress < 1) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showModel, progress]);

  /* ---------- Show model when progress resets ---------- */
  useEffect(() => {
    if (progress === 0) {
      setShowModel(true);
      reverseTriggeredRef.current = false;
    }
  }, [progress]);

  /* ---------- Smooth Progress Update ---------- */
  const updateProgress = useRef((delta) => {
    if (isReversingRef.current) return;

    let next = Math.min(Math.max(progressRef.current + delta, 0), 1);
    progressRef.current = next;
    setProgress(next);

    if (next > 0 && next < 1) {
      setScrollLocked(true);
      document.body.style.overflow = "hidden";
    } else if (next >= 1) {
      setScrollLocked(false);
      setShowVideo(true);
      document.body.style.overflow = "auto";
    } else if (next <= 0) {
      setScrollLocked(false);
      setShowVideo(false);
      document.body.style.overflow = "hidden";
    }
  }).current;

  /* ---------- Optimized Scroll Handler ---------- */
  useEffect(() => {
    let ticking = false;
    let touchAnimationFrame;
    let lastWheelTime = 0;

    const handleWheel = (e) => {
      if (progress >= 1) return;
      const now = Date.now();
      if (now - lastWheelTime < 16) return;
      lastWheelTime = now;

      if (scrollLocked || progressRef.current < 1) e.preventDefault();
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const delta = e.deltaY * (isMobile ? 0.002 : 0.0012);
        updateProgress(delta);
        ticking = false;
      });
    };

    const handleTouchStart = (e) => {
      touchStartRef.current = { y: e.touches[0].clientY, time: Date.now() };
      touchDirection = null;
    };

    const handleTouchMove = (e) => {
      if (progress >= 1) return;
      const now = Date.now();
      if (now - lastTouchMoveTimeRef.current < 16) return;
      lastTouchMoveTimeRef.current = now;

      if (scrollLocked || progressRef.current < 1) e.preventDefault();

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartRef.current.y - currentY;

      if (Math.abs(deltaY) > 5) setTouchDirection(deltaY > 0 ? 'down' : 'up');

      const multiplier = isMobile ? 0.005 : 0.008;
      if (touchAnimationFrame) cancelAnimationFrame(touchAnimationFrame);

      touchAnimationFrame = requestAnimationFrame(() => updateProgress(deltaY * multiplier));
      touchStartRef.current.y = currentY;
    };

    const handleTouchEnd = () => {
      if (touchAnimationFrame) cancelAnimationFrame(touchAnimationFrame);
      if (progress > 0 && progress < 1) {
        const momentum = touchDirection === 'down' ? 0.02 : touchDirection === 'up' ? -0.02 : 0;
        if (Math.abs(momentum) > 0.01) setTimeout(() => updateProgress(momentum * 0.5), 50);
      }
      touchDirection = null;
    };

    const wheelOptions = { passive: false };
    const touchMoveOptions = { passive: false };

    window.addEventListener("wheel", handleWheel, wheelOptions);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, touchMoveOptions);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (touchAnimationFrame) cancelAnimationFrame(touchAnimationFrame);
      document.body.style.overflow = "auto";
    };
  }, [scrollLocked, progress, isMobile, updateProgress]);

  /* ---------- Reverse Animation on Scroll Up ---------- */
  useEffect(() => {
    let reverseAnimationFrame;
    const checkForReverse = () => {
      const currentScrollY = window.scrollY;
      const sectionTop = sectionRef.current?.offsetTop || 0;
      const isAtTop = currentScrollY <= sectionTop + 10;

      if (!isReversingRef.current &&
          !reverseTriggeredRef.current &&
          scrollLocked === false &&
          progress === 1 &&
          isAtTop &&
          currentScrollY < lastScrollYRef.current) startReverseAnimation();

      lastScrollYRef.current = currentScrollY;
    };

    const startReverseAnimation = () => {
      reverseTriggeredRef.current = true;
      isReversingRef.current = true;
      setScrollLocked(true);
      document.body.style.overflow = "hidden";
      setShowVideo(false);
      setShowModel(true);

      const reverse = () => {
        progressRef.current -= 0.015;
        if (progressRef.current <= 0) {
          progressRef.current = 0;
          setProgress(0);
          setScrollLocked(false);
          isReversingRef.current = false;
          document.body.style.overflow = "hidden";
          if (reverseAnimationFrame) cancelAnimationFrame(reverseAnimationFrame);
        } else {
          setProgress(progressRef.current);
          reverseAnimationFrame = requestAnimationFrame(reverse);
        }
      };

      setTimeout(() => reverseAnimationFrame = requestAnimationFrame(reverse), 50);
    };

    const handleScroll = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => checkForReverse(), 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (reverseAnimationFrame) cancelAnimationFrame(reverseAnimationFrame);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [scrollLocked, progress]);

  /* ---------- Reset on scroll down ---------- */
  useEffect(() => {
    const handleScrollDown = (e) => {
      const sectionTop = sectionRef.current?.offsetTop || 0;
      let isScrollingDown = e.type === 'wheel' ? e.deltaY > 0 : touchStartRef.current.y - e.touches[0]?.clientY < 0;
      if (isScrollingDown && window.scrollY <= sectionTop + 10 && progress === 0 && showModel && !isReversingRef.current) {
        progressRef.current = 0.01;
        setProgress(0.01);
        setScrollLocked(true);
        document.body.style.overflow = "hidden";
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
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden"
      style={{ touchAction: scrollLocked ? "none" : "auto", WebkitOverflowScrolling: 'touch' }}
    >
      {/* ================= VIDEO ================= */}
      {showVideo && (
        <div className="absolute inset-0 w-full h-full z-10">
          <video key="hero-video" autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: showVideo ? 1 : 0, transition: 'opacity 0.5s ease' }}
          >
            <source src={heroVideo} type="video/webm" />
          </video>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1))', zIndex: 11 }}/>
        </div>
      )}

      {/* ================= GRADIENT ================= */}
      <div className="absolute inset-0 transition-opacity duration-500"
        style={{ background: "linear-gradient(to top right, #9000FF, white, white)", opacity: showVideo ? 0 : 1, zIndex: 1 }}
      />

      {/* ================= 3D MODEL ================= */}
      {showModel && progress < 1 && (
        <div className="fixed left-0 w-full h-screen pointer-events-none"
          style={{ transform: `translate(0px, ${modelTop + (isMobile ? 50 : 0)}px)`, zIndex: modelZIndex, opacity: 1, WebkitTransform: `translate(0px, ${modelTop + (isMobile ? 50 : 0)}px)` }}
        >
          <Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance", alpha: true, preserveDrawingBuffer: isMobile, depth: true }}
            camera={{ position: isMobile ? [-3, -4, 8] : [-3, -4, 6], fov: isMobile ? 45 : 60 }}
            performance={{ min: 0.5 }}
            onCreated={({ gl }) => { if (isMobile) gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); }}
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[4, 4, 4]} intensity={1.8} />
            <Suspense fallback={null}>
              <VRHeadset progressRef={progressRef} initialScale={isMobile ? initialScale * 0.7 : initialScale} active={showModel && progress < 1}/>
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6"
        style={{ zIndex: 1000, opacity: 1, transform: `translateY(${progress * -10}px)`, transition: 'transform 0.3s ease', pointerEvents: scrollLocked ? 'none' : 'auto' }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-6 transition-colors duration-500 px-4"
          style={{ color: showVideo ? "#ffffff" : "#51007d", maxWidth: "1200px", fontFamily: "Times New Roman, serif", textShadow: showVideo ? "0 2px 10px rgba(0,0,0,0.5)" : "none", opacity: 1, transition: 'color 0.5s ease, text-shadow 0.5s ease', lineHeight: isMobile ? '1.3' : '1.4' }}
        >
          VR Wing delivers cutting-edge AR, VR, XR, VR360, and AI-powered simulation & copilot solutions for learning and business growth
        </h1>

        <div className="relative">
          <button className="text-sm sm:text-sm md:text-base px-4 sm:px-4 md:px-6 py-2 sm:py-2 md:py-2 bg-[#9000ff] text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
            style={{ opacity: 1, transform: `translateY(${progress * 20}px)`, transition: 'all 0.3s ease', boxShadow: showVideo ? "0 10px 30px rgba(144, 0, 255, 0.5)" : "0 5px 20px rgba(144, 0, 255, 0.3)", touchAction: 'manipulation' }}
          >
            Osso Nurse Training →
          </button>

          {showVideo && (
            <div className="absolute inset-0 rounded-full blur-xl -z-10"
              style={{ background: 'radial-gradient(circle, rgba(144,0,255,0.4) 0%, transparent 70%)', opacity: 0.6, transform: 'scale(1.5)' }}
            />
          )}
        </div>

        {/* Progress indicator */}
        {showModel && progress < 1 && progress > 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full overflow-hidden"
            style={{ zIndex: 10000, opacity: 1, transition: 'opacity 0.3s ease', WebkitTransform: 'translateX(-50%)' }}
          >
            <div className="h-full bg-[#9000ff] rounded-full transition-all duration-300" style={{ width: `${progress * 100}%` }}/>
          </div>
        )}

        {/* Scroll hint */}
        {progress === 0 && showModel && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 1000, opacity: 0.8, animation: 'fadeInOut 2s infinite' }}>
            <span className="text-[#51007d] text-sm font-medium">Scroll down</span>
            <div className="w-5 h-8 border-2 border-[#51007d]/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-[#9000ff] rounded-full mt-1" style={{ animation: 'scrollBounce 1.5s infinite' }}/>
            </div>
          </div>
        )}
      </div>

      {/* Touch instructions for mobile */}
      {isMobile && progress === 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center" style={{ zIndex: 1000, opacity: 0.7 }}>
          <p className="text-[#51007d] text-xs">Swipe up to explore</p>
        </div>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        h1, button {
          -webkit-user-select: text;
          user-select: text;
        }
      `}</style>
    </section>
  );
}
