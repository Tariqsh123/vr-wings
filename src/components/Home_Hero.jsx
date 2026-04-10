import { useEffect, useRef, useState, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import heroVideo from "../assets/video.webm";
import * as THREE from "three";

/* ---------- 3D MODEL (Enhanced OSSOVR Style) ---------- */
const VRHeadset = memo(function VRHeadset({ progressRef, initialScale, active, isMobile, onScaleStart, onVideoTrigger }) {
  const ref = useRef();
  const { scene } = useGLTF("/vr-wings/vr-headset.glb");
  const scaleStartedRef = useRef(false);
  const videoTriggeredRef = useRef(false);

  // Premium material - closer to glossy/metallic OssoVR feel
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          mat.transparent = true;
          mat.opacity = 0.87;
          mat.emissive = new THREE.Color(0x1f0028);
          mat.emissiveIntensity = 0.38;
          mat.roughness = 0.11;
          mat.metalness = 0.68;
          mat.color = new THREE.Color(0xf0f0f0);
          mat.envMapIntensity = 1.65;
          mat.clearcoat = 0.92;
          mat.clearcoatRoughness = 0.06;
          mat.needsUpdate = true;
        });
      }
    });
  }, [scene]);

  const smoothRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const smoothPosition = useRef({ x: 0, y: 0, z: 0 });
  const smoothScale = useRef(initialScale);

  useFrame((state, delta) => {
    if (!ref.current || !active) return;

    const p = Math.max(0, Math.min(1, progressRef.current));
    const t = state.clock.getElapsedTime();
    // Mobile gets faster smoothing factor
    const smoothFactor = isMobile 
      ? Math.min(delta * 15, 0.28)  // Much faster for mobile
      : Math.min(delta * 8.5, 0.15); // PC speed unchanged

    // Triggers
    if (p > 0.009 && !scaleStartedRef.current) {
      scaleStartedRef.current = true;
      onScaleStart();
    }
    if (p === 0) scaleStartedRef.current = false;

    if (p >= 0.416 && !videoTriggeredRef.current) {
      videoTriggeredRef.current = true;
      onVideoTrigger();
    }
    if (p < 0.395) videoTriggeredRef.current = false;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const easedP = easeOutCubic(p);

    // Refined rotation (smoother, slightly reduced speed for elegance)
    const dynamicTilt = -0.22 * (1 - easedP);
    targetRotation.current.x = dynamicTilt + easedP * Math.PI * 0.28;
    targetRotation.current.y = easedP * Math.PI * 1.58 + 0.58;

    // Subtle idle - slightly faster idle for mobile
    const idleSpeed = isMobile ? 0.18 : 0.11;
    const idleY = Math.sin(t * idleSpeed) * 0.0055;
    const idleX = Math.sin(t * (isMobile ? 0.12 : 0.075)) * 0.0028;
    const idleZ = Math.sin(t * (isMobile ? 0.15 : 0.095)) * 0.0018;

    smoothRotation.current.x += (targetRotation.current.x + idleX - smoothRotation.current.x) * smoothFactor * (isMobile ? 0.85 : 0.65);
    smoothRotation.current.y += (targetRotation.current.y + idleY - smoothRotation.current.y) * smoothFactor * (isMobile ? 0.85 : 0.65);

    ref.current.rotation.x = smoothRotation.current.x;
    ref.current.rotation.y = smoothRotation.current.y;
    ref.current.rotation.z = idleZ;

    // Position - faster breathing for mobile
    const breathSpeed = isMobile ? 0.15 : 0.09;
    if (isMobile) {
      smoothPosition.current.x += (-0.04 + Math.sin(t * breathSpeed) * 0.005 - smoothPosition.current.x) * smoothFactor;
      smoothPosition.current.y += (-0.23 + Math.sin(t * (isMobile ? 0.22 : 0.14)) * 0.0055 + easedP * 0.08 - smoothPosition.current.y) * smoothFactor;
      smoothPosition.current.z += (Math.sin(t * (isMobile ? 0.11 : 0.07)) * 0.0035 - smoothPosition.current.z) * smoothFactor;
    } else {
      smoothPosition.current.x += (-0.11 + Math.sin(t * 0.09) * 0.005 - smoothPosition.current.x) * smoothFactor;
      smoothPosition.current.y += (-0.36 + Math.sin(t * 0.14) * 0.0055 + easedP * 0.08 - smoothPosition.current.y) * smoothFactor;
      smoothPosition.current.z += (Math.sin(t * 0.07) * 0.0035 - smoothPosition.current.z) * smoothFactor;
    }

    ref.current.position.set(smoothPosition.current.x, smoothPosition.current.y, smoothPosition.current.z);

    // Scale - Faster scaling for mobile
    const targetScale = isMobile
      ? initialScale + easedP * (168 - initialScale)
      : initialScale + easedP * (385 - initialScale);

    const scaleSpeed = isMobile ? 0.92 : 0.72;
    smoothScale.current += (targetScale - smoothScale.current) * smoothFactor * scaleSpeed;
    ref.current.scale.set(smoothScale.current, smoothScale.current, smoothScale.current);
  });

  return <primitive ref={ref} object={scene} />;
});

/* ---------- SMOKY COMPONENT (Slightly improved performance) ---------- */
const SmokyComponent = ({ isVisible }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;

    const initParticles = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      particlesRef.current = [];
      const particleCount = Math.min(58, Math.floor(width / 22));

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 48 + Math.random() * 95,
          speedX: (Math.random() - 0.5) * 0.22,
          speedY: (Math.random() - 0.5) * 0.11,
          opacity: 0.09 + Math.random() * 0.19,
          blur: 19 + Math.random() * 32,
        });
      }
    };

    initParticles();

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Smoky radial gradient
      const gradient = ctx.createRadialGradient(
        width * 0.68, height * 0.32, 45,
        width * 0.72, height * 0.35, width * 1.1
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
      gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.04)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particlesRef.current.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        pg.addColorStop(0, `rgba(255,255,255,${p.opacity})`);
        pg.addColorStop(0.45, `rgba(255,255,255,${p.opacity * 0.55})`);
        pg.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.save();
        ctx.filter = `blur(${p.blur}px)`;
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Light noise
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255,255,255,0.018)';
      for (let i = 0; i < 22; i++) {
        ctx.fillRect(Math.random() * width, Math.random() * height, 1.8, 1.8);
      }
      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => initParticles();
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 99999, opacity: 0.82, mixBlendMode: 'screen' }}
    />
  );
};

/* ---------- MAIN HERO (Your preferred structure + improvements) ---------- */
export default function Home_Hero() {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const touchStartRef = useRef({ y: 0 });
  const scrollTimeoutRef = useRef(null);
  const lastTouchMoveTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const reverseAnimationFrameRef = useRef(null);
  const videoRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(true);
  const [initialScale, setInitialScale] = useState(5);
  const [showModel, setShowModel] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [modelZIndex, setModelZIndex] = useState(1);
  const [showSmoky, setShowSmoky] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Responsive - Improved mobile initial scale (smaller on load, grows on scroll)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowWidth(width);
      setWindowHeight(height);

      const mobile = width < 768 || (width < 900 && height < 800);
      setIsMobile(mobile);

      if (mobile) {
        // Much smaller initial scale on mobile for better visibility on load
        if (width < 380) {
          setInitialScale(1.85);
        } else if (width < 480) {
          setInitialScale(2.15);
        } else {
          setInitialScale(2.45);
        }
      } else {
        setInitialScale(width < 1024 ? 2.85 : 2.65);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (progress > 0.79 && !showVideo && showModel) {
      setShowSmoky(true);
    } else {
      setShowSmoky(false);
    }
  }, [progress, showVideo, showModel]);

  useEffect(() => {
    if (progress > 0 && progress < 1) setModelZIndex(99999);
    else if (progress === 0) setModelZIndex(1);
  }, [progress]);

  const handleScaleStart = () => {};
  const handleVideoTrigger = () => {
    if (!showVideo) {
      setShowVideo(true);
      setShowModel(false);
      setScrollLocked(false);
    }
  };

  useEffect(() => {
    if (progress === 0) {
      setShowVideo(false);
      setShowModel(true);
      setShowSmoky(false);
    }
  }, [progress]);

  // Scroll lock
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
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [showModel, progress, showVideo]);

  // FASTER SCROLL ANIMATION FOR MOBILE - Increased sensitivity significantly
  const updateProgress = useRef((delta) => {
    if (showVideo) return;

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    animationFrameRef.current = requestAnimationFrame(() => {
      // Much higher sensitivity for faster mobile scroll animation
      const sensitivity = isMobile 
        ? (windowWidth < 380 ? 0.65 : 0.72)  // Much faster for mobile
        : 0.22; // PC speed unchanged
      let next = Math.min(Math.max(progressRef.current + delta * sensitivity, 0), 1);

      // Reduced smoothing for faster response on mobile
      if (isMobile) {
        next = progressRef.current + (next - progressRef.current) * 0.85;
      } else if (next > progressRef.current) {
        next = progressRef.current + (next - progressRef.current) * 0.68;
      }

      progressRef.current = next;
      setProgress(next);

      if (next > 0 && next < 1 && !showVideo) {
        setScrollLocked(true);
      } else {
        setScrollLocked(false);
      }

      animationFrameRef.current = null;
    });
  }).current;

  // Wheel & Touch handlers with faster progression for mobile
  useEffect(() => {
    let ticking = false;
    let touchAnimationFrame = null;

    const handleWheel = (e) => {
      if (showVideo) return;

      const now = Date.now();
      if (now - (lastTouchMoveTimeRef.current || 0) < 12) return;
      lastTouchMoveTimeRef.current = now;

      if (scrollLocked || progressRef.current < 1) e.preventDefault();

      // Much larger delta multiplier for faster mobile animation
      const delta = e.deltaY * (isMobile ? 0.0012 : 0.00032); // Mobile: ~3.75x faster

      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        updateProgress(delta);
        ticking = false;
      });
    };

    const handleTouchStart = (e) => {
      if (showVideo) return;
      touchStartRef.current = { y: e.touches[0].clientY };
    };

    const handleTouchMove = (e) => {
      if (showVideo) return;
      e.preventDefault();

      const now = Date.now();
      if (now - lastTouchMoveTimeRef.current < 18) return;
      lastTouchMoveTimeRef.current = now;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartRef.current.y - currentY;
      // Much higher multiplier for faster touch response on mobile
      const multiplier = windowWidth < 380 ? 0.0032 : 0.0038; // ~3x faster

      if (touchAnimationFrame) cancelAnimationFrame(touchAnimationFrame);

      touchAnimationFrame = requestAnimationFrame(() => {
        updateProgress(deltaY * multiplier);
        touchStartRef.current.y = currentY;
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (touchAnimationFrame) cancelAnimationFrame(touchAnimationFrame);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [scrollLocked, isMobile, windowWidth, updateProgress, showVideo]);

  // Reverse animation (faster for mobile, same for PC)
  useEffect(() => {
    let isAnimating = false;
    let lastTriggerTime = 0;
    const COOLDOWN_MS = isMobile ? 250 : 450; // Faster cooldown for mobile
    const SCROLL_UP_THRESHOLD = isMobile ? 8 : 30; // Lower threshold for mobile

    const startReverseAnimation = () => {
      if (isAnimating || !showVideo) return;

      const now = Date.now();
      if (now - lastTriggerTime < COOLDOWN_MS) return;

      lastTriggerTime = now;
      isAnimating = true;

      setShowVideo(false);
      setShowModel(true);
      setScrollLocked(true);

      const startProgress = 0.416;
      const startTime = performance.now();
      // Much shorter duration for faster mobile reverse animation
      const duration = isMobile ? 700 : 1900; // Mobile: ~2.7x faster

      const animateReverse = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Smoother easing
        const eased = 1 - Math.pow(1 - t, 3.5);
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
        }
      };

      reverseAnimationFrameRef.current = requestAnimationFrame(animateReverse);
    };

    const checkScrollUp = () => {
      const currentScrollY = window.scrollY;
      const sectionTop = sectionRef.current?.offsetTop || 0;
      const isAtTop = currentScrollY <= sectionTop + (isMobile ? 15 : 45);

      if (showVideo && isAtTop && currentScrollY < lastScrollYRef.current &&
          lastScrollYRef.current - currentScrollY > SCROLL_UP_THRESHOLD) {
        startReverseAnimation();
      }
      lastScrollYRef.current = currentScrollY;
    };

    const handleScroll = () => {
      if (scrollTimeoutRef.current) cancelAnimationFrame(scrollTimeoutRef.current);
      scrollTimeoutRef.current = requestAnimationFrame(() => {
        checkScrollUp();
      });
    };

    const handleWheelReverse = (e) => {
      if (showVideo && e.deltaY < 0) {
        const sectionTop = sectionRef.current?.offsetTop || 0;
        const isAtTop = window.scrollY <= sectionTop + (isMobile ? 15 : 45);
        if (isAtTop) {
          e.preventDefault();
          startReverseAnimation();
        }
      }
    };

    const handleTouchEndReverse = (e) => {
      if (!showVideo) return;
      const touch = e.changedTouches[0];
      if (!touch) return;
      const deltaY = touchStartRef.current.y - touch.clientY;
      const sectionTop = sectionRef.current?.offsetTop || 0;
      const isAtTop = window.scrollY <= sectionTop + (isMobile ? 15 : 45);

      if (isAtTop && deltaY < -SCROLL_UP_THRESHOLD) {
        startReverseAnimation();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheelReverse, { passive: false });
    window.addEventListener('touchend', handleTouchEndReverse, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheelReverse);
      window.removeEventListener('touchend', handleTouchEndReverse);
      if (scrollTimeoutRef.current) cancelAnimationFrame(scrollTimeoutRef.current);
      if (reverseAnimationFrameRef.current) cancelAnimationFrame(reverseAnimationFrameRef.current);
    };
  }, [showVideo, isMobile]);

  // Start small progress on initial scroll down - faster for mobile
  useEffect(() => {
    let initTimeout = null;
    const handleScrollDown = (e) => {
      const sectionTop = sectionRef.current?.offsetTop || 0;
      let isScrollingDown = false;
      
      if (e.type === 'wheel') {
        isScrollingDown = e.deltaY > 0;
      } else if (e.type === 'touchmove') {
        if (e.touches && e.touches[0]) {
          const currentY = e.touches[0].clientY;
          const deltaY = touchStartRef.current.y - currentY;
          isScrollingDown = deltaY > 0;
        }
      }

      if (isScrollingDown &&
          window.scrollY <= sectionTop + (isMobile ? 10 : 30) &&
          progress === 0 && showModel && !showVideo) {

        if (initTimeout) clearTimeout(initTimeout);
        
        // Much shorter delay for faster initial trigger on mobile
        const delay = isMobile ? 20 : 50;
        initTimeout = setTimeout(() => {
          progressRef.current = 0.005;
          setProgress(0.005);
          setScrollLocked(true);
        }, delay);
      }
    };

    window.addEventListener("wheel", handleScrollDown);
    window.addEventListener("touchmove", handleScrollDown);

    return () => {
      window.removeEventListener("wheel", handleScrollDown);
      window.removeEventListener("touchmove", handleScrollDown);
      if (initTimeout) clearTimeout(initTimeout);
    };
  }, [progress, showModel, showVideo, isMobile]);

  const modelTop = isMobile
    ? 0.85 * (1 - Math.min(progress * 7.5, 1))
    : 9.5 * (1 - Math.min(progress * 6.8, 1));

  const cameraPosition = isMobile
    ? windowWidth < 380
      ? [0.0, -0.08, 5.45]
      : [0.02, -0.12, 5.8]
    : [-0.88, -1.32, 6.15];

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        height: windowHeight || '100vh',
        overflow: showVideo ? 'visible' : 'hidden',
        touchAction: scrollLocked && !showVideo ? "none" : "auto",
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <SmokyComponent isVisible={showSmoky} />

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
            style={{ opacity: 1, transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <source src={heroVideo} type="video/webm" />
          </video>
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.32), rgba(0,0,0,0.08))', zIndex: 11 }}
          />
        </div>
      )}

      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: "linear-gradient(to top right, #9000FF, white, white)",
          opacity: showVideo ? 0 : Math.max(1 - progress * 2.1, 0.22),
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {showModel && (
        <div
          className="fixed left-0 w-full pointer-events-none flex items-center justify-center"
          style={{
            top: 0,
            height: windowHeight || '100vh',
            zIndex: modelZIndex,
            opacity: showVideo ? 0 : Math.min(0.92 + progress * 0.08, 1),
            transform: `translateY(${modelTop}px)`,
            transition: 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s ease',
            willChange: 'transform'
          }}
        >
          <div className="relative w-full h-full">
            <Canvas
              dpr={[1, isMobile ? 1.25 : 1.6]}
              gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: true,
                depth: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.32 + progress * 0.22
              }}
              camera={{
                position: cameraPosition,
                fov: isMobile ? (windowWidth < 380 ? 40 : 38) : 42
              }}
              onCreated={({ gl }) => {
                gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.6 : 2.2));
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={isMobile ? 1.95 + progress * 0.3 : 1.75 + progress * 0.3} />
              <directionalLight position={[3.5, 3.5, 3.5]} intensity={isMobile ? 1.95 : 1.65} />
              <directionalLight position={[-2.5, 1.5, 2.5]} intensity={0.85} color="#bbddff" />
              <pointLight position={[1.2, 1, 2.5]} intensity={0.65} color="#ffffff" />

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

      {/* Text Overlay - fully responsive */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-50"
        style={{
          opacity: showVideo ? 1 : 1 - progress * 0.28,
          transform: `translateY(${progress * (isMobile ? -0.25 : -1.2)}px)`,
          transition: 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.55s ease',
          pointerEvents: scrollLocked && !showVideo ? 'none' : 'auto',
        }}
      >
       <h1
  className="font-bold mb-5 px-4"
  style={{
    color: showVideo ? "#ffffff" : "#51007d",
    fontFamily: "Times New Roman, serif",
    textShadow: showVideo
      ? "0 3px 25px rgba(0,0,0,0.75)"
      : showSmoky
      ? "0 0 35px rgba(255,255,255,0.85)"
      : "none",
    fontSize: isMobile
      ? windowWidth < 380
        ? 'clamp(30px, 5vw, 1.6rem)'
        : 'clamp(1.4rem, 5.5vw, 1.9rem)'
      : 'clamp(2.25rem, 3.1vw, 2.85rem)',
    lineHeight: isMobile ? '1.35' : '1.32',
    maxWidth: isMobile
      ? windowWidth < 380
        ? '96%'
        : '92%'
      : '780px',
  }}
>
  VR Wing delivers cutting-edge AR, VR, XR, VR360, and AI-powered simulation solutions
</h1>

        <button
          className="bg-[#9000ff] text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-500 hover:scale-105"
          style={{
            transform: `translateY(${progress * 4}px)`,
            boxShadow: showVideo
              ? "0 18px 40px rgba(144, 0, 255, 0.65)"
              : showSmoky ? "0 22px 55px rgba(255,255,255,0.85)" : "0 10px 30px rgba(144, 0, 255, 0.45)",
            fontSize: isMobile ? (windowWidth < 380 ? '0.72rem' : '0.82rem') : '1.02rem',
            padding: isMobile ? (windowWidth < 380 ? '0.4rem 0.9rem' : '0.55rem 1.2rem') : '0.75rem 2rem',
          }}
        >
          Osso Nurse Training →
        </button>

        {/* Progress bar */}
        {showModel && progress > 0.02 && !showVideo && (
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/25 rounded-full overflow-hidden z-[10000]">
            <div className="h-full bg-[#9000ff] transition-all duration-300" style={{ width: `${progress * 100}%` }} />
          </div>
        )}

        {/* Scroll hint - appears when model is visible and progress is small */}
        {showModel && progress < 0.05 && !showVideo && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[10000]">
            <span className="text-[#9000ff] text-xs font-medium tracking-wider opacity-70">SCROLL</span>
            <div className="w-5 h-8 border-2 border-[#9000ff]/50 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-[#9000ff]/60 rounded-full mt-1 animate-[scrollBounce_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInOut { 0%,100%{opacity:0.5} 50%{opacity:0.8} }
        @keyframes scrollBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
        @keyframes reverseBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>
    </section>
  );
}