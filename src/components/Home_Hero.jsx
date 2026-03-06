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
  
  // Enhanced material setup for premium look
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.transparent = true;
              mat.opacity = 0.82;
              mat.emissive = new THREE.Color(0x222222);
              mat.emissiveIntensity = 0.32;
              mat.roughness = 0.15;
              mat.metalness = 0.52;
              mat.color = new THREE.Color(0xe8e8e8);
              mat.envMapIntensity = 1.4;
              mat.clearcoat = 0.8;
              mat.clearcoatRoughness = 0.1;
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = 0.82;
            child.material.emissive = new THREE.Color(0x222222);
            child.material.emissiveIntensity = 0.32;
            child.material.roughness = 0.15;
            child.material.metalness = 0.52;
            child.material.color = new THREE.Color(0xe8e8e8);
            child.material.envMapIntensity = 1.4;
            child.material.clearcoat = 0.8;
            child.material.clearcoatRoughness = 0.1;
          }
        }
      });
    }
  }, [scene]);

  // Smooth animation with spring physics
  const smoothRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const smoothPosition = useRef({ x: 0, y: 0, z: 0 });
  const smoothScale = useRef(initialScale);
  
  useFrame((state, delta) => {
    if (!ref.current || !active) return;

    const p = progressRef.current;
    const t = state.clock.getElapsedTime();
    const smoothFactor = Math.min(delta * 8, 0.15);

    // Trigger scale start when progress > 0.01
    if (p > 0.01 && !scaleStartedRef.current) {
      scaleStartedRef.current = true;
      onScaleStart();
    }

    // Reset scale start when progress goes back to 0
    if (p === 0 && scaleStartedRef.current) {
      scaleStartedRef.current = false;
    }

    // Trigger video at 150 degrees with slight hysteresis
    if (p >= 0.416 && !videoTriggeredRef.current) {
      videoTriggeredRef.current = true;
      onVideoTrigger();
    }

    // Reset video trigger when progress goes below threshold
    if (p < 0.4 && videoTriggeredRef.current) {
      videoTriggeredRef.current = false;
    }

    // Calculate base rotations with smoother easing
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const easedP = easeOutCubic(p);
    
    // Dynamic tilt based on progress - REDUCED ROTATION SPEED
    const dynamicTilt = -0.25 * (1 - easedP);
    targetRotation.current.x = dynamicTilt + easedP * Math.PI * 0.25;
    targetRotation.current.y = easedP * Math.PI * 1.5 + 0.55;

    // Subtle idle animations
    const idleY = Math.sin(t * 0.12) * 0.006;
    const idleX = Math.sin(t * 0.08) * 0.003;
    const idleZ = Math.sin(t * 0.1) * 0.002;

    // Smooth rotation
    smoothRotation.current.x += (targetRotation.current.x + idleX - smoothRotation.current.x) * smoothFactor * 0.6;
    smoothRotation.current.y += (targetRotation.current.y + idleY - smoothRotation.current.y) * smoothFactor * 0.6;
    
    ref.current.rotation.x = smoothRotation.current.x;
    ref.current.rotation.y = smoothRotation.current.y;
    ref.current.rotation.z = idleZ;

    // Smooth position
    if (isMobile) {
      smoothPosition.current.x += (-0.05 + Math.sin(t * 0.1) * 0.006 - smoothPosition.current.x) * smoothFactor;
      smoothPosition.current.y += (-0.25 + Math.sin(t * 0.15) * 0.006 + (easedP * 0.1) - smoothPosition.current.y) * smoothFactor;
      smoothPosition.current.z += (Math.sin(t * 0.08) * 0.004 - smoothPosition.current.z) * smoothFactor;
    } else {
      smoothPosition.current.x += (-0.12 + Math.sin(t * 0.1) * 0.006 - smoothPosition.current.x) * smoothFactor;
      smoothPosition.current.y += (-0.38 + Math.sin(t * 0.15) * 0.006 + (easedP * 0.1) - smoothPosition.current.y) * smoothFactor;
      smoothPosition.current.z += (Math.sin(t * 0.08) * 0.004 - smoothPosition.current.z) * smoothFactor;
    }

    ref.current.position.x = smoothPosition.current.x;
    ref.current.position.y = smoothPosition.current.y;
    ref.current.position.z = smoothPosition.current.z;

    // Smooth scale
    const targetScale = isMobile 
      ? initialScale + easedP * (220 - initialScale)
      : initialScale + easedP * (380 - initialScale);
    
    smoothScale.current += (targetScale - smoothScale.current) * smoothFactor * 0.8;
    ref.current.scale.set(smoothScale.current, smoothScale.current, smoothScale.current);
  });

  return <primitive ref={ref} object={scene} />;
});

/* ---------- SMOKY COMPONENT (Pure Smoke Effect) ---------- */
const SmokyComponent = ({ isVisible }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Initialize particles
    const initParticles = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      particlesRef.current = [];
      const particleCount = Math.min(60, Math.floor(width / 20));
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 50 + Math.random() * 100,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.1,
          opacity: 0.1 + Math.random() * 0.2,
          blur: 20 + Math.random() * 30,
        });
      }
    };
    
    initParticles();
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw smoky background
      const gradient = ctx.createRadialGradient(
        width * 0.7, height * 0.3, 50,
        width * 0.7, height * 0.3, width
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw and update particles
      particlesRef.current.forEach(p => {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap around edges
        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;
        
        // Draw smoke particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        gradient.addColorStop(0.4, `rgba(255, 255, 255, ${p.opacity * 0.6})`);
        gradient.addColorStop(0.7, `rgba(255, 255, 255, ${p.opacity * 0.2})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.filter = `blur(${p.blur}px)`;
        ctx.fill();
      });
      
      // Add some noise texture
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      
      for (let i = 0; i < 20; i++) {
        ctx.fillRect(
          Math.random() * width,
          Math.random() * height,
          2, 2
        );
      }
      
      ctx.globalCompositeOperation = 'source-over';
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      initParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 99999,
        opacity: 0.8,
        mixBlendMode: 'screen',
      }}
    />
  );
};

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
  const wheelVelocityRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  
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
  const [showSmoky, setShowSmoky] = useState(false);

  /* ---------- Responsive detection ---------- */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowWidth(width);
      setWindowHeight(height);
      
      const mobile = width < 768 || (width < 900 && height < 800);
      setIsMobile(mobile);
      
      if (mobile) {
        if (width < 380) {
          setInitialScale(3.4);
        } else if (width < 480) {
          setInitialScale(4.0);
        } else {
          setInitialScale(4.4);
        }
      } else {
        if (width < 1024) {
          setInitialScale(3.8);
        } else {
          setInitialScale(3.2);
        }
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- Show smoky component when progress is high ---------- */
  useEffect(() => {
    if (progress > 0.8 && !showVideo && showModel) {
      setShowSmoky(true);
    } else {
      setShowSmoky(false);
    }
  }, [progress, showVideo, showModel]);

  /* ---------- Z-index management ---------- */
  useEffect(() => {
    if (progress > 0 && progress < 1) setModelZIndex(99999);
    else if (progress === 0) setModelZIndex(1);
  }, [progress]);

  const handleScaleStart = () => {
    if (!scaleStarted) {
      setScaleStarted(true);
    }
  };

  const handleVideoTrigger = () => {
    if (!showVideo) {
      setShowVideo(true);
      setShowModel(false);
      setScrollLocked(false); // IMPORTANT: Unlock scroll when video starts
    }
  };

  useEffect(() => {
    if (progress === 0) {
      setScaleStarted(false);
      setShowVideo(false);
      setShowModel(true);
      setShowSmoky(false);
    }
  }, [progress]);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = heroVideo;
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.oncanplaythrough = () => setVideoReady(true);
    return () => {
      video.oncanplaythrough = null;
      video.pause();
      video.src = '';
      video.load();
    };
  }, []);

  // FIXED: Scroll lock management
  useEffect(() => {
    if (showModel && progress < 1 && !showVideo) {
      // Only lock scroll when model is showing and progress is less than 1
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Always unlock scroll when video is showing or progress is complete
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
  }, [showModel, progress, showVideo]); // Added showVideo to dependencies

  const updateProgress = useRef((delta) => {
    if (showVideo) return; // Don't update progress when video is showing

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const smoothedDelta = delta * 0.6;
      
      const sensitivity = isMobile 
        ? (windowWidth < 380 ? 0.45 : 0.5)
        : 0.35;
      
      const smoothDelta = smoothedDelta * sensitivity;
      
      let next = Math.min(Math.max(progressRef.current + smoothDelta, 0), 1);
      
      if (next > progressRef.current) {
        next = progressRef.current + (next - progressRef.current) * 0.8;
      }
      
      progressRef.current = next;
      setProgress(next);

      // Update scroll lock state based on progress
      if (next > 0 && next < 1 && !showVideo) {
        setScrollLocked(true);
      } else {
        setScrollLocked(false);
      }
      
      animationFrameRef.current = null;
    });
  }).current;

  // FIXED: Scroll handler to respect video state
  useEffect(() => {
    let ticking = false;
    let touchAnimationFrame;
    let lastWheelTime = 0;

    const handleWheel = (e) => {
      if (showVideo) {
        // When video is showing, allow normal scrolling
        return;
      }
      
      const now = Date.now();
      if (now - lastWheelTime < 8) return;
      lastWheelTime = now;

      if (scrollLocked || progressRef.current < 1) {
        e.preventDefault();
      }
      
      const delta = e.deltaY * (isMobile ? 0.0006 : 0.0005);
      wheelVelocityRef.current = delta;
      
      if (ticking) return;

      ticking = true;
      
      requestAnimationFrame(() => {
        updateProgress(delta);
        ticking = false;
      });
    };

    const handleTouchStart = (e) => {
      if (showVideo) return; // Allow normal touch when video is showing
      touchStartRef.current = { y: e.touches[0].clientY, time: Date.now() };
      wheelVelocityRef.current = 0;
    };

    const handleTouchMove = (e) => {
      if (showVideo) return; // Allow normal touch when video is showing
      
      const now = Date.now();
      if (now - lastTouchMoveTimeRef.current < 12) return;
      lastTouchMoveTimeRef.current = now;

      if (scrollLocked || progressRef.current < 1) {
        e.preventDefault();
      }

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartRef.current.y - currentY;

      const multiplier = windowWidth < 380 ? 0.0018 : 0.002;
      
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
  }, [scrollLocked, progress, isMobile, updateProgress, showVideo, windowWidth]); // Added showVideo dependency

  // REVERSE ANIMATION - FIXED to properly handle scroll
  useEffect(() => {
    let isAnimating = false;
    let lastTriggerTime = 0;
    const COOLDOWN_MS = 400;
    const SCROLL_UP_THRESHOLD = isMobile ? 10 : 20;

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
      setScrollLocked(true); // Lock scroll while reversing animation
      setScaleStarted(false);

      const startProgress = 0.416;
      const startTime = performance.now();
      const duration = isMobile ? 1200 : 1500;

      const animateReverse = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        
        const eased = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        const newProgress = startProgress * (1 - eased);

        progressRef.current = newProgress;
        setProgress(newProgress);

        if (t < 1) {
          reverseAnimationFrameRef.current = requestAnimationFrame(animateReverse);
        } else {
          progressRef.current = 0;
          setProgress(0);
          setScrollLocked(false); // Unlock when reverse animation completes
          isAnimating = false;
          reverseAnimationFrameRef.current = null;
        }
      };

      reverseAnimationFrameRef.current = requestAnimationFrame(animateReverse);
    };

    const checkScrollUp = () => {
      const currentScrollY = window.scrollY;
      const sectionTop = sectionRef.current?.offsetTop || 0;
      const isAtTop = currentScrollY <= sectionTop + (isMobile ? 15 : 30);
      
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
        const isAtTop = window.scrollY <= sectionTop + (isMobile ? 15 : 30);
        
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
      const isAtTop = window.scrollY <= sectionTop + (isMobile ? 15 : 30);
      
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

  // Start animation from top
  useEffect(() => {
    const handleScrollDown = (e) => {
      const sectionTop = sectionRef.current?.offsetTop || 0;
      let isScrollingDown = e.type === 'wheel' 
        ? e.deltaY > 0 
        : (touchStartRef.current.y - (e.touches[0]?.clientY || 0)) < 0;
      
      if (isScrollingDown && 
          window.scrollY <= sectionTop + (isMobile ? 8 : 15) && 
          progress === 0 && 
          showModel && 
          !showVideo) {
        
        progressRef.current = 0.002;
        setProgress(0.002);
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

  const modelTop = isMobile 
    ? 1.2 * (1 - Math.min(progress * 10, 1))
    : 10 * (1 - Math.min(progress * 8, 1));

  const cameraPosition = isMobile 
    ? windowWidth < 380 
      ? [0.0, -0.15, 5.6]
      : [0.03, -0.2, 6.0]
    : [-0.85, -1.3, 6.0];

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full"
      style={{ 
        height: windowHeight || '100vh',
        overflow: showVideo ? 'visible' : 'hidden', // Allow scrolling when video shows
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
            style={{ 
              opacity: 1, 
              transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)' 
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

      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ 
          background: "linear-gradient(to top right, #9000FF, white, white)", 
          opacity: showVideo ? 0 : Math.max(1 - progress * 2, 0.2), 
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
            opacity: showVideo ? 0 : Math.min(0.9 + progress * 0.1, 1),
            transform: `translateY(${modelTop}px)`,
            transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), opacity 0.5s ease',
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
                toneMappingExposure: 1.3 + progress * 0.2
              }}
              camera={{ 
                position: cameraPosition,
                fov: isMobile ? (windowWidth < 380 ? 39 : 37) : 41
              }}
              onCreated={({ gl }) => { 
                gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={isMobile ? 1.9 + progress * 0.3 : 1.7 + progress * 0.3} />
              <directionalLight position={[3, 3, 3]} intensity={isMobile ? 1.9 : 1.6} />
              <directionalLight position={[-2, 1, 2]} intensity={0.8} color="#bbddff" />
              <pointLight position={[1, 1, 2]} intensity={0.6} color="#ffffff" />
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

      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        style={{ 
          zIndex: 1000, 
          opacity: showVideo ? 1 : 1 - progress * 0.25,
          transform: `translateY(${progress * (isMobile ? -0.3 : -1.5)}px)`, 
          transition: 'transform 0.4s cubic-bezier(0.2, 0, 0, 1), opacity 0.4s ease',
          pointerEvents: scrollLocked && !showVideo ? 'none' : 'auto',
        }}
      >
        <h1 
          className="font-bold mb-4 px-4"
          style={{ 
            color: showVideo ? "#ffffff" : "#51007d",
            fontFamily: "Times New Roman, serif",
            textShadow: showVideo 
              ? "0 2px 20px rgba(0,0,0,0.7)" 
              : showSmoky
                ? "0 0 30px rgba(255,255,255,0.8)"
                : "none",
            transition: 'color 0.6s ease, text-shadow 0.5s ease',
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
            className="bg-[#9000ff] text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-500 hover:scale-105"
            style={{ 
              opacity: 1, 
              transform: `translateY(${progress * 4}px)`, 
              transition: 'all 0.4s cubic-bezier(0.2, 0, 0, 1)',
              boxShadow: showVideo 
                ? "0 15px 35px rgba(144, 0, 255, 0.6)" 
                : showSmoky
                  ? "0 20px 50px rgba(255,255,255,0.8)"
                  : "0 8px 25px rgba(144, 0, 255, 0.4)",
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

        {showModel && progress > 0.02 && !showVideo && (
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full overflow-hidden"
            style={{ zIndex: 10000 }}
          >
            <div 
              className="h-full bg-[#9000ff] rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}

        {showModel && progress >= 0.4 && progress < 0.42 && !showVideo && (
          <div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-[#9000ff] text-xs font-medium animate-pulse"
            style={{ zIndex: 10000, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
          >
            Video starting...
          </div>
        )}

        {progress === 0 && showModel && !showVideo && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ 
              zIndex: 1000, 
              opacity: 0.7, 
              animation: 'fadeInOut 2.5s ease-in-out infinite',
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
                style={{ animation: 'scrollBounce 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
              />
            </div>
          </div>
        )}

        {showVideo && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ 
              zIndex: 1000, 
              opacity: 0.7, 
              animation: 'fadeInOut 2.5s ease-in-out infinite',
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
                style={{ animation: 'reverseBounce 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        @keyframes reverseBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}