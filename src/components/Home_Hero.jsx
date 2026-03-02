import { useEffect, useRef, useState, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import heroVideo from "../assets/video.webm";
import * as THREE from "three";

/* ---------- 3D MODEL (Perfect OSSOVR Style) ---------- */
const VRHeadset = memo(function VRHeadset({ progressRef, initialScale, active, isMobile, onScaleStart, onVideoTrigger }) {
  const ref = useRef();
  const { scene } = useGLTF("/vr-wings/vr-headset.glb");
  const scaleStartedRef = useRef(false);
  const videoTriggeredRef = useRef(false);
  
  // Material setup for premium white/silver look
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.transparent = true;
              mat.opacity = 0.78;
              mat.emissive = new THREE.Color(0x333333);
              mat.emissiveIntensity = 0.28;
              mat.roughness = 0.18;
              mat.metalness = 0.45;
              mat.color = new THREE.Color(0xe0e0e0);
              mat.envMapIntensity = 1.2;
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = 0.78;
            child.material.emissive = new THREE.Color(0x333333);
            child.material.emissiveIntensity = 0.28;
            child.material.roughness = 0.18;
            child.material.metalness = 0.45;
            child.material.color = new THREE.Color(0xe0e0e0);
            child.material.envMapIntensity = 1.2;
          }
        }
      });
    }
  }, [scene]);

  const smoothRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  
  useFrame((state) => {
    if (!ref.current || !active) return;

    const p = progressRef.current;
    const t = state.clock.getElapsedTime();

    // Trigger scale start when progress > 0.01
    if (p > 0.01 && !scaleStartedRef.current) {
      scaleStartedRef.current = true;
      onScaleStart();
    }

    // Reset scale start when progress goes back to 0
    if (p === 0 && scaleStartedRef.current) {
      scaleStartedRef.current = false;
    }

    // Trigger video at 150 degrees (0.416 progress of 360 degrees)
    if (p >= 0.416 && !videoTriggeredRef.current) {
      videoTriggeredRef.current = true;
      onVideoTrigger();
    }

    // Reset video trigger when progress goes below threshold
    if (p < 0.416 && videoTriggeredRef.current) {
      videoTriggeredRef.current = false;
    }

    // MOBILE - STATIC POSITION SAME AS PC
    if (isMobile) {
      // Use same rotation logic as desktop but adjusted for mobile view
      const dynamicTilt = -0.2 * (1 - p);
      targetRotation.current.x = dynamicTilt + p * Math.PI * 0.32;
      targetRotation.current.y = p * Math.PI * 2.0 + 0.55;

      // Minimal idle (same as desktop)
      const idleY = Math.sin(t * 0.18) * 0.008;
      const idleX = Math.sin(t * 0.12) * 0.004;

      // Smooth rotation
      smoothRotation.current.x += 
        (targetRotation.current.x + idleX - smoothRotation.current.x) * 0.08;

      smoothRotation.current.y += 
        (targetRotation.current.y + idleY - smoothRotation.current.y) * 0.08;

      ref.current.rotation.x = smoothRotation.current.x;
      ref.current.rotation.y = smoothRotation.current.y;
      ref.current.rotation.z = Math.sin(t * 0.1) * 0.003;

      // POSITION - Optimized for mobile view but same style as PC
      ref.current.position.x = -0.05 + Math.sin(t * 0.12) * 0.008; // Slightly adjusted for mobile
      ref.current.position.y = -0.25 + Math.sin(t * 0.18) * 0.008 + (p * 0.08);
      ref.current.position.z = Math.sin(t * 0.1) * 0.005;
      
    } else {
      // Desktop - Premium right rotated + dynamic tilt
      const dynamicTilt = -0.2 * (1 - p);
      targetRotation.current.x = dynamicTilt + p * Math.PI * 0.32;
      targetRotation.current.y = p * Math.PI * 2.0 + 0.55;

      // Minimal idle
      const idleY = Math.sin(t * 0.18) * 0.008;
      const idleX = Math.sin(t * 0.12) * 0.004;

      // Smooth rotation
      smoothRotation.current.x += 
        (targetRotation.current.x + idleX - smoothRotation.current.x) * 0.08;

      smoothRotation.current.y += 
        (targetRotation.current.y + idleY - smoothRotation.current.y) * 0.08;

      ref.current.rotation.x = smoothRotation.current.x;
      ref.current.rotation.y = smoothRotation.current.y;
      ref.current.rotation.z = Math.sin(t * 0.1) * 0.003;

      // Optimized position - slightly higher after 360 rotation
      ref.current.position.x = -0.12 + Math.sin(t * 0.12) * 0.008;
      ref.current.position.y = -0.38 + Math.sin(t * 0.18) * 0.008 + (p * 0.08);
      ref.current.position.z = Math.sin(t * 0.1) * 0.005;
    }

    // Optimized scaling with mobile-specific values
    const targetScale = isMobile 
      ? initialScale + p * (220 - initialScale) // Adjusted scale for mobile
      : initialScale + p * (380 - initialScale);
    
    const currentScale = ref.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.05;
    ref.current.scale.set(newScale, newScale, newScale);
  });

  return <primitive ref={ref} object={scene} />;
});

/* ---------- MAIN HERO ---------- */
export default function Home_Hero() {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const touchStartRef = useRef({ y: 0, time: 0 });
  const scrollTimeoutRef = useRef(null);
  const lastTouchMoveTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const reverseAnimationFrameRef = useRef(null);
  const videoRef = useRef(null);
  
  // State management
  const [progress, setProgress] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(true);
  const [initialScale, setInitialScale] = useState(5);
  const [showModel, setShowModel] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [modelZIndex, setModelZIndex] = useState(1);
  const [videoReady, setVideoReady] = useState(false);
  const [scaleStarted, setScaleStarted] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  /* ---------- Responsive detection ---------- */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowWidth(width);
      setWindowHeight(height);
      
      // Enhanced mobile detection
      const mobile = width < 768 || (width < 900 && height < 800);
      setIsMobile(mobile);
      
      // Adjust initial scale based on screen size
      if (mobile) {
        if (width < 380) {
          setInitialScale(3.2); // Small phones - slightly larger for better visibility
        } else if (width < 480) {
          setInitialScale(3.8); // Regular phones
        } else {
          setInitialScale(4.2); // Large phones
        }
      } else {
        if (width < 1024) {
          setInitialScale(3.5); // Tablets
        } else {
          setInitialScale(3.0); // Desktop
        }
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- Z-index management ---------- */
  useEffect(() => {
    if (progress > 0 && progress < 1) setModelZIndex(99999);
    else if (progress === 0) setModelZIndex(1);
  }, [progress]);

  /* ---------- Handle scale start ---------- */
  const handleScaleStart = () => {
    if (!scaleStarted) {
      setScaleStarted(true);
    }
  };

  /* ---------- Handle video trigger at 150 degrees ---------- */
  const handleVideoTrigger = () => {
    if (!showVideo) {
      setShowVideo(true);
      setShowModel(false);
      setScrollLocked(false);
    }
  };

  /* ---------- Reset when progress goes back to 0 ---------- */
  useEffect(() => {
    if (progress === 0) {
      setScaleStarted(false);
      setShowVideo(false);
      setShowModel(true);
    }
  }, [progress]);

  /* ---------- Preload video ---------- */
  useEffect(() => {
    const video = document.createElement('video');
    video.src = heroVideo;
    video.preload = 'auto';
    video.oncanplaythrough = () => setVideoReady(true);
    return () => {
      video.oncanplaythrough = null;
    };
  }, []);

  /* ---------- Scroll lock ---------- */
  useEffect(() => {
    if (showModel && progress < 1 && !showVideo) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => { 
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [showModel, progress, showVideo]);

  /* ---------- Optimized Progress Update ---------- */
  const updateProgress = useRef((delta) => {
    if (showVideo) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      // Mobile-optimized sensitivity
      const sensitivity = isMobile 
        ? (windowWidth < 380 ? 0.5 : 0.55) // Adjusted for better control
        : 0.4;
      
      const smoothDelta = delta * sensitivity;
      
      let next = Math.min(Math.max(progressRef.current + smoothDelta, 0), 1);
      
      progressRef.current = next;
      setProgress(next);

      if (next > 0 && next < 1) {
        setScrollLocked(true);
      } else if (next >= 1) {
        setScrollLocked(false);
      } else if (next <= 0) {
        setScrollLocked(false);
      }
      
      animationFrameRef.current = null;
    });
  }).current;

  /* ---------- Smooth Scroll Handler ---------- */
  useEffect(() => {
    let ticking = false;
    let touchAnimationFrame;
    let lastWheelTime = 0;

    const handleWheel = (e) => {
      if (showVideo) return;
      
      const now = Date.now();
      if (now - lastWheelTime < 10) return;
      lastWheelTime = now;

      if (scrollLocked || progressRef.current < 1) {
        e.preventDefault();
      }
      
      if (ticking) return;

      ticking = true;
      
      // Mobile-optimized delta
      const delta = e.deltaY * (isMobile ? 0.00065 : 0.00055);
      
      requestAnimationFrame(() => {
        updateProgress(delta);
        ticking = false;
      });
    };

    const handleTouchStart = (e) => {
      if (showVideo) return;
      touchStartRef.current = { y: e.touches[0].clientY, time: Date.now() };
    };

    const handleTouchMove = (e) => {
      if (showVideo) return;
      
      const now = Date.now();
      if (now - lastTouchMoveTimeRef.current < 16) return;
      lastTouchMoveTimeRef.current = now;

      if (scrollLocked || progressRef.current < 1) {
        e.preventDefault();
      }

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartRef.current.y - currentY;

      // Mobile-optimized multiplier
      const multiplier = windowWidth < 380 ? 0.002 : 0.0022;
      
      if (touchAnimationFrame) {
        cancelAnimationFrame(touchAnimationFrame);
      }

      touchAnimationFrame = requestAnimationFrame(() => {
        updateProgress(deltaY * multiplier);
        touchStartRef.current.y = currentY;
        touchAnimationFrame = null;
      });
    };

    const handleTouchEnd = () => {
      if (touchAnimationFrame) {
        cancelAnimationFrame(touchAnimationFrame);
        touchAnimationFrame = null;
      }
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
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [scrollLocked, progress, isMobile, updateProgress, showVideo, windowWidth]);

  /* ---------- REVERSE ANIMATION ---------- */
  useEffect(() => {
    let isAnimating = false;
    let lastTriggerTime = 0;
    const COOLDOWN_MS = 500;
    const SCROLL_UP_THRESHOLD = isMobile ? 15 : 30;

    const startReverseAnimation = () => {
      if (isAnimating || !showVideo) return;

      const now = Date.now();
      if (now - lastTriggerTime < COOLDOWN_MS) return;
      
      lastTriggerTime = now;
      isAnimating = true;
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (reverseAnimationFrameRef.current) {
        cancelAnimationFrame(reverseAnimationFrameRef.current);
      }

      setShowVideo(false);
      setShowModel(true);
      setScrollLocked(true);
      setScaleStarted(false);

      const startProgress = 0.416;
      const startTime = performance.now();
      const duration = isMobile ? 800 : 1000;

      const animateReverse = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const newProgress = startProgress * (1 - eased);

        progressRef.current = newProgress;
        setProgress(newProgress);

        if (t < 1) {
          reverseAnimationFrameRef.current = requestAnimationFrame(animateReverse);
        } else {
          progressRef.current = 0;
          setProgress(0);
          setScrollLocked(false);
          isAnimating = false;
          reverseAnimationFrameRef.current = null;
        }
      };

      reverseAnimationFrameRef.current = requestAnimationFrame(animateReverse);
    };

    const checkScrollUp = () => {
      const currentScrollY = window.scrollY;
      const sectionTop = sectionRef.current?.offsetTop || 0;
      const isAtTop = currentScrollY <= sectionTop + (isMobile ? 20 : 50);
      
      if (showVideo && 
          isAtTop && 
          currentScrollY < lastScrollYRef.current && 
          lastScrollYRef.current - currentScrollY > SCROLL_UP_THRESHOLD) {
        startReverseAnimation();
      }
      
      lastScrollYRef.current = currentScrollY;
    };

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = requestAnimationFrame(() => {
        checkScrollUp();
        scrollTimeoutRef.current = null;
      });
    };

    const handleWheel = (e) => {
      if (showVideo && e.deltaY < 0) {
        const sectionTop = sectionRef.current?.offsetTop || 0;
        const isAtTop = window.scrollY <= sectionTop + (isMobile ? 20 : 50);
        
        if (isAtTop) {
          e.preventDefault();
          startReverseAnimation();
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (!showVideo) return;
      
      const touch = e.changedTouches[0];
      if (!touch) return;
      
      const deltaY = touchStartRef.current.y - touch.clientY;
      const sectionTop = sectionRef.current?.offsetTop || 0;
      const isAtTop = window.scrollY <= sectionTop + (isMobile ? 20 : 50);
      
      if (isAtTop && deltaY < -SCROLL_UP_THRESHOLD) {
        startReverseAnimation();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchend', handleTouchEnd);
      
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }
      if (reverseAnimationFrameRef.current) {
        cancelAnimationFrame(reverseAnimationFrameRef.current);
      }
    };
  }, [showVideo, isMobile, windowWidth]);

  /* ---------- Start animation from top ---------- */
  useEffect(() => {
    const handleScrollDown = (e) => {
      const sectionTop = sectionRef.current?.offsetTop || 0;
      let isScrollingDown = e.type === 'wheel' 
        ? e.deltaY > 0 
        : (touchStartRef.current.y - (e.touches[0]?.clientY || 0)) < 0;
      
      if (isScrollingDown && 
          window.scrollY <= sectionTop + (isMobile ? 10 : 20) && 
          progress === 0 && 
          showModel && 
          !showVideo) {
        
        progressRef.current = 0.003;
        setProgress(0.003);
        setScrollLocked(true);
      }
    };

    window.addEventListener("wheel", handleScrollDown);
    window.addEventListener("touchmove", handleScrollDown);

    return () => {
      window.removeEventListener("wheel", handleScrollDown);
      window.removeEventListener("touchmove", handleScrollDown);
    };
  }, [progress, showModel, showVideo, isMobile]);

  /* ---------- Model position ---------- */
  const modelTop = isMobile 
    ? 1.5 * (1 - Math.min(progress * 10, 1)) // Reduced movement for mobile
    : 12 * (1 - Math.min(progress * 8, 1));

  // Camera position based on device
  const cameraPosition = isMobile 
    ? windowWidth < 380 
      ? [0.0, -0.2, 5.8] // Small phones - centered
      : [0.05, -0.25, 6.2] // Regular phones - slightly adjusted
    : [-0.9, -1.4, 6.2]; // Desktop

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full overflow-hidden"
      style={{ 
        height: windowHeight || '100vh',
        touchAction: scrollLocked ? "none" : "auto",
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* ================= VIDEO ================= */}
      {showVideo && (
        <div className="absolute inset-0 w-full h-full z-10">
          <video 
            ref={videoRef}
            key="hero-video" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              opacity: 1, 
              transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
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
        className="absolute inset-0 transition-opacity duration-800"
        style={{ 
          background: "linear-gradient(to top right, #9000FF, white, white)", 
          opacity: showVideo ? 0 : 1, 
          zIndex: 1 
        }}
      />

      {/* ================= 3D MODEL ================= */}
      {showModel && (
        <div 
          className="fixed left-0 w-full pointer-events-none flex items-center justify-center"
          style={{ 
            top: 0,
            height: windowHeight || '100vh',
            zIndex: modelZIndex, 
            opacity: 0.9,
            transform: `translateY(${modelTop}px)`,
            transition: isMobile ? 'none' : 'transform 0.15s ease-out',
            willChange: 'transform'
          }}
        >
          <div className="relative w-full h-full">
            <Canvas 
              dpr={[1, isMobile ? 1.2 : 1.5]}
              gl={{ 
                antialias: true, 
                powerPreference: "high-performance", 
                alpha: true,
                depth: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.25
              }}
              camera={{ 
                position: cameraPosition,
                fov: isMobile ? (windowWidth < 380 ? 40 : 38) : 42
              }}
              onCreated={({ gl }) => { 
                gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={isMobile ? 1.8 : 1.6} />
              <directionalLight position={[3, 3, 3]} intensity={isMobile ? 1.8 : 1.5} />
              <directionalLight position={[-2, 1, 2]} intensity={0.7} color="#bbddff" />
              <pointLight position={[1, 1, 2]} intensity={0.5} color="#ffffff" />
              <Suspense fallback={null}>
                <VRHeadset 
                  progressRef={progressRef} 
                  initialScale={initialScale}
                  active={showModel}
                  isMobile={isMobile}
                  onScaleStart={handleScaleStart}
                  onVideoTrigger={handleVideoTrigger}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        style={{ 
          zIndex: 1000, 
          opacity: showVideo ? 1 : 1 - progress * 0.3,
          transform: `translateY(${progress * (isMobile ? -0.5 : -2)}px)`, 
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          pointerEvents: scrollLocked && !showVideo ? 'none' : 'auto',
        }}
      >
        <h1 
          className="font-bold mb-4 px-4"
          style={{ 
            color: showVideo ? "#ffffff" : "#51007d",
            fontFamily: "Times New Roman, serif",
            textShadow: showVideo ? "0 2px 15px rgba(0,0,0,0.6)" : "none",
            transition: 'color 0.5s ease',
            fontSize: isMobile 
              ? windowWidth < 380
                ? 'clamp(1rem, 3.5vw, 1.2rem)'
                : 'clamp(1.2rem, 4vw, 1.5rem)'
              : 'clamp(2rem, 2.8vw, 2.5rem)',
            lineHeight: isMobile ? '1.2' : '1.3',
            maxWidth: isMobile 
              ? windowWidth < 380 ? '90%' : '85%'
              : '750px',
          }}
        >
          VR Wing delivers cutting-edge AR, VR, XR, VR360, and AI-powered simulation solutions
        </h1>

        <div className="relative mt-2">
          <button 
            className="bg-[#9000ff] text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105"
            style={{ 
              opacity: 1, 
              transform: `translateY(${progress * 5}px)`, 
              transition: 'all 0.3s ease',
              boxShadow: showVideo ? "0 10px 30px rgba(144, 0, 255, 0.5)" : "0 5px 20px rgba(144, 0, 255, 0.3)",
              fontSize: isMobile 
                ? windowWidth < 380 ? '0.7rem' : '0.8rem'
                : '0.95rem',
              padding: isMobile 
                ? windowWidth < 380 ? '0.4rem 0.8rem' : '0.5rem 1rem'
                : '0.6rem 1.6rem'
            }}
          >
            Osso Nurse Training →
          </button>
        </div>

        {/* Progress indicator */}
        {showModel && progress > 0.02 && !showVideo && (
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full overflow-hidden"
            style={{ zIndex: 10000 }}
          >
            <div 
              className="h-full bg-[#9000ff] rounded-full transition-all duration-300" 
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}

        {/* 150 degree marker */}
        {showModel && progress >= 0.4 && progress < 0.42 && !showVideo && (
          <div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-[#9000ff] text-xs font-medium animate-pulse"
            style={{ zIndex: 10000 }}
          >
            Video starting...
          </div>
        )}

        {/* Scroll down hint */}
        {progress === 0 && showModel && !showVideo && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ 
              zIndex: 1000, 
              opacity: 0.7, 
              animation: 'fadeInOut 2s infinite',
              bottom: isMobile 
                ? windowWidth < 380 ? '0.5rem' : '0.8rem'
                : '1rem'
            }}
          >
            <span className="text-[#51007d] text-xs font-medium">
              {isMobile ? 'Swipe up' : 'Scroll'}
            </span>
            <div className="w-4 h-6 border-2 border-[#51007d]/30 rounded-full flex justify-center">
              <div 
                className="w-1 h-2 bg-[#9000ff] rounded-full mt-1" 
                style={{ animation: 'scrollBounce 1.5s infinite' }}
              />
            </div>
          </div>
        )}

        {/* Scroll up hint when video is showing */}
        {showVideo && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ 
              zIndex: 1000, 
              opacity: 0.7, 
              animation: 'fadeInOut 2s infinite',
              bottom: isMobile 
                ? windowWidth < 380 ? '0.5rem' : '0.8rem'
                : '1rem'
            }}
          >
            <span className="text-white text-xs font-medium">
              Scroll up to return
            </span>
            <div className="w-4 h-6 border-2 border-white/30 rounded-full flex justify-center">
              <div 
                className="w-1 h-2 bg-white rounded-full mb-1" 
                style={{ animation: 'reverseBounce 1.5s infinite' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        @keyframes reverseBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </section>
  );
}