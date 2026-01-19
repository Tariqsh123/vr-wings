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
    const time = state.clock.getElapsedTime();

    // Smooth rotation with animation
    const targetRotationX = p * Math.PI * 0.8;
    const targetRotationY = p * Math.PI * 2.5 + Math.sin(time * 0.3) * 0.15; // Slower rotation
    
    // Smoother interpolation
    ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * 0.05;
    ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * 0.05;

    // Scale with pulse
    const pulse = 1 + Math.sin(time * 1.5) * 0.03;
    const maxScale = 1000; // Bigger model
    const targetScale = (initialScale + p * (maxScale - initialScale)) * pulse;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);

    // Floating animation
    ref.current.position.y = -1 + Math.sin(time * 0.4) * 0.15;
    ref.current.position.x = -0.2;
    
    // Add slight Z rotation
    const targetRotationZ = Math.sin(time * 0.2) * 0.05;
    ref.current.rotation.z += (targetRotationZ - ref.current.rotation.z) * 0.03;
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
  const [showVideo, setShowVideo] = useState(false);
  const [modelZIndex, setModelZIndex] = useState(1); // Start with normal z-index

  /* ---------- Check if mobile ---------- */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------- Responsive scale ---------- */
  useEffect(() => {
    const updateScale = () => setInitialScale(window.innerWidth < 768 ? 3.5 : 5.5);
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  /* ---------- Update model z-index when animation starts ---------- */
  useEffect(() => {
    if (progress > 0 && progress < 1) {
      // Animation is active - set z-index to 9999
      setModelZIndex(99999);
    } else if (progress === 0) {
      // Reset to normal z-index when at start
      setModelZIndex(1);
    }
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
    if (showModel && progress < 1) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModel, progress]);

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
        setShowVideo(true);
        document.body.style.overflow = "auto";
      } else if (next <= 0) {
        setScrollLocked(false);
        setShowVideo(false);
        document.body.style.overflow = "hidden";
      }
    };

    /* ---------- PC Wheel ---------- */
    const handleWheel = (e) => {
      if (progress >= 1) return;
      
      if (scrollLocked || progressRef.current < 1) e.preventDefault();
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        updateProgress(e.deltaY * 0.0012);
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
      if (progress >= 1) return;
      
      if (scrollLocked || progressRef.current < 1) e.preventDefault();

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartRef.current.y - currentY;

      const multiplier = 0.008;

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
  }, [scrollLocked, progress]);

  /* ---------- Reverse Animation on Scroll Up ---------- */
  useEffect(() => {
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
        } else {
          setProgress(progressRef.current);
          requestAnimationFrame(reverse);
        }
      };

      setTimeout(() => requestAnimationFrame(reverse), 50);
    };

    const handleScroll = () => {
      checkForReverse();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
          document.body.style.overflow = "hidden";
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
      {showVideo && (
        <div className="absolute inset-0 w-full h-full z-10">
          <video
            key="hero-video"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: showVideo ? 1 : 0,
              transition: 'opacity 0.5s ease'
            }}
          >
            <source src={heroVideo} type="video/webm" />
          </video>
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
              zIndex: 11
            }}
          />
        </div>
      )}

      {/* ================= GRADIENT ================= */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: "linear-gradient(to top right, #9000FF, white, white)",
          opacity: showVideo ? 0 : 1,
          zIndex: 1,
        }}
      />

      {/* ================= 3D MODEL ================= */}
      {showModel && progress < 1 && (
        <div
          className="fixed left-0 w-full h-screen pointer-events-none"
          style={{
            transform: `translate(0px, ${modelTop + (isMobile ? 50 : 0)}px)`,
            zIndex: modelZIndex, // Dynamic z-index based on animation state
            opacity: 1, // Always full opacity
          }}
        >
          <Canvas
            dpr={[1, 1.5]}
            gl={{ 
              antialias: true,
              powerPreference: "high-performance",
              alpha: true
            }}
            camera={{ position: [-3, -4, 6], fov: isMobile ? 50 : 60 }}
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[4, 4, 4]} intensity={1.8} />
            <Suspense fallback={null}>
              <VRHeadset
                progressRef={progressRef}
                initialScale={isMobile ? initialScale * 0.9 : initialScale}
                active={showModel && progress < 1}
              />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{
          zIndex: 1000, // Content z-index
          opacity: 1,
          transform: `translateY(${progress * -10}px)`,
          transition: 'transform 0.3s ease'
        }}
      >
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-6 transition-colors duration-500"
          style={{ 
            color: showVideo ? "#ffffff" : "#51007d", 
            maxWidth: "1200px",
            fontFamily: "Times New Roman, serif",
            textShadow: showVideo ? "0 2px 10px rgba(0,0,0,0.5)" : "none",
            opacity: 1,
            transition: 'color 0.5s ease, text-shadow 0.5s ease'
          }}
        >
          VR Wing delivers cutting-edge AR, VR, XR, VR360, and AI-powered
          simulation & copilot solutions for learning and business growth
        </h1>

        <div className="relative">
          <button 
            className="text-sm sm:text-sm md:text-base px-4 sm:px-4 md:px-6 py-2 sm:py-2 md:py-2 bg-[#9000ff] text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
            style={{
              opacity: 1,
              transform: `translateY(${progress * 20}px)`,
              transition: 'all 0.3s ease',
              boxShadow: showVideo ? "0 10px 30px rgba(144, 0, 255, 0.5)" : "0 5px 20px rgba(144, 0, 255, 0.3)"
            }}
          >
            Osso Nurse Training →
          </button>
          
          {showVideo && (
            <div 
              className="absolute inset-0 rounded-full blur-xl -z-10"
              style={{
                background: 'radial-gradient(circle, rgba(144,0,255,0.4) 0%, transparent 70%)',
                opacity: 0.6,
                transform: 'scale(1.5)'
              }}
            />
          )}
        </div>

        {/* Progress indicator - only show when model is active */}
        {showModel && progress < 1 && progress > 0 && (
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full overflow-hidden"
            style={{
              zIndex: 10000, // Higher than model during animation
              opacity: 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            <div 
              className="h-full bg-[#9000ff] rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}

        {/* Scroll hint - only show when at start */}
        {progress === 0 && showModel && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
            style={{
              zIndex: 1000,
              opacity: 0.8,
              animation: 'fadeInOut 2s infinite'
            }}
          >
            <span className="text-[#51007d] text-sm font-medium">Scroll down</span>
            <div className="w-5 h-8 border-2 border-[#51007d]/30 rounded-full flex justify-center">
              <div 
                className="w-1 h-3 bg-[#9000ff] rounded-full mt-1"
                style={{
                  animation: 'scrollBounce 1.5s infinite'
                }}
              />
            </div>
          </div>
        )}
      </div>

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
      `}</style>
    </section>
  );
}