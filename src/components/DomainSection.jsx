import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   Import all 167 frames from assets/domain
   Vite handles static imports via import.meta.glob
   ═══════════════════════════════════════════════════════════ */
const frameModules = import.meta.glob('../assets/domain/ezgif-frame-*.jpg', { eager: true });

// Sort by frame number to guarantee order
const FRAMES = Object.entries(frameModules)
  .sort(([a], [b]) => {
    const numA = parseInt(a.match(/(\d+)\.jpg/)?.[1] || '0');
    const numB = parseInt(b.match(/(\d+)\.jpg/)?.[1] || '0');
    return numA - numB;
  })
  .map(([, mod]) => mod.default || mod);

const TOTAL = FRAMES.length;

export default function DomainSection({ visible }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const titleRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrame = useRef(0);

  /* ═══════════════════════════════════════════════════════════
     PRELOAD ALL FRAMES INTO IMAGE OBJECTS
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const images = [];
    FRAMES.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      images[i] = img;
    });
    imagesRef.current = images;
  }, []);

  /* ═══════════════════════════════════════════════════════════
     FADE-IN WHEN VISIBLE (after convo completion)
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!visible || !wrapperRef.current || !sectionRef.current) return;

    if (sectionRef.current) {
      // Snap scroll position to the very top of this section flawlessly while the screen is black
      window.scrollTo({
        top: window.scrollY + sectionRef.current.getBoundingClientRect().top,
        behavior: 'instant'
      });
      
      sectionRef.current.style.height = `${TOTAL * 30}px`;
      sectionRef.current.style.overflowAnchor = 'none'; // prevents browser from jumping scroll position
      ScrollTrigger.refresh();
    }

    // Cinematic Title entrance (Staggered Characters)
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.domain-char');
      const hint = titleRef.current.querySelector('.domain-scroll-hint');
      
      gsap.set(titleRef.current, { opacity: 1 }); // ensure container is visible
      
      gsap.fromTo(chars,
        { 
          y: 20, 
          opacity: 0,
          scale: 0.8,
          filter: 'blur(10px)'
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          filter: 'blur(0px)',
          duration: 1, 
          stagger: 0.05, 
          delay: 0.8, 
          ease: 'expo.out' 
        }
      );

      gsap.fromTo(hint,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, delay: 2, ease: 'power2.out' }
      );
    }
  }, [visible]);

  /* ═══════════════════════════════════════════════════════════
     SCROLL-DRIVEN FRAME ANIMATION
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = document.documentElement.clientWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrame.current);
    };

    const renderFrame = (index) => {
      const img = imagesRef.current[index];
      if (!img) return;
      
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Stretch the frame to completely fill the canvas width and height
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      if (img.complete) {
        draw();
      } else {
        img.addEventListener('load', draw, { once: true });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Draw first frame immediately
    renderFrame(0);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIndex = Math.min(TOTAL - 1, Math.floor(self.progress * TOTAL));
        if (frameIndex !== currentFrame.current) {
          currentFrame.current = frameIndex;
          renderFrame(frameIndex);
        }
      },
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      st.kill();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        .domain-section {
          position: relative;
          background: #000;
        }

        .domain-wrapper {
          opacity: 1;
          height: 100%;
          width: 100%;
        }

        .domain-canvas-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
        }

        .domain-canvas {
          display: block;
          width: 100%;
          height: 100%;
        }

        /* Dark overlay on the frames */
        .domain-overlay {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          margin-top: -100vh;
          pointer-events: none;
          z-index: 2;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.2) 0%,
            rgba(0,0,0,0.0) 30%,
            rgba(0,0,0,0.0) 70%,
            rgba(0,0,0,0.3) 100%
          );
        }

        /* Vignette */
        .domain-vignette {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          margin-top: -100vh;
          pointer-events: none;
          z-index: 3;
          background: radial-gradient(
            ellipse at 50% 50%,
            transparent 50%,
            rgba(0,0,0,0.3) 85%,
            rgba(0,0,0,0.6) 100%
          );
        }

        /* Title */
        .domain-title {
          position: sticky;
          top: 50%;
          left: 0;
          width: 100%;
          margin-top: -100vh;
          transform: translateY(-50%);
          z-index: 5;
          pointer-events: none;
          text-align: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 5vw, 4.5rem);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #fff;
          text-shadow:
            0 0 30px rgba(255,34,0,0.5),
            0 0 80px rgba(255,34,0,0.2),
            0 0 120px rgba(0,100,255,0.15);
          opacity: 0;
        }

        /* Scroll Hint */
        .domain-scroll-hint {
          display: block;
          margin-top: 15px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.6);
          animation: pulse-hint 1.5s infinite alternate;
        }
        @keyframes pulse-hint {
          0% { opacity: 0.3; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(4px); }
        }
      `}</style>

      <section ref={sectionRef} className="domain-section">
        <div ref={wrapperRef} className="domain-wrapper">
          {/* Sticky canvas for frame playback */}
          <div className="domain-canvas-sticky">
            <canvas ref={canvasRef} className="domain-canvas" />
          </div>

          {/* Dark overlay */}
          <div className="domain-overlay" />

          {/* Vignette */}
          <div className="domain-vignette" />

          {/* Title with staggered character animation */}
          <div ref={titleRef} className="domain-title">
            {"DOMAIN EXPANSION".split("").map((char, i) => (
              <span key={i} className="domain-char" style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
                {char}
              </span>
            ))}
            <span className="domain-scroll-hint">SCROLL TO EXPAND ▾</span>
          </div>
        </div>
      </section>
    </>
  );
}
