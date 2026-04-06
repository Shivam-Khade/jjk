import { useEffect, useRef, useState } from 'react';
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
    // Robust extraction: get digits before .jpg
    const extractNum = (str) => {
      const match = str.match(/(\d+)\.jpg/);
      return match ? parseInt(match[1], 10) : 0;
    };
    return extractNum(a) - extractNum(b);
  })
  .map(([, mod]) => mod.default || mod);

const TOTAL = FRAMES.length;
console.log(`[DomainSection] Found ${TOTAL} frames`);

export default function DomainSection({ visible }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const titleRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrame = useRef(0);
  const [init, setInit] = useState(false);

  /* ═══════════════════════════════════════════════════════════
     PRELOAD ALL FRAMES INTO IMAGE OBJECTS
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!visible) return;
    
    console.log(`[DomainSection] Initializing with ${TOTAL} frames`);
    
    const images = [];
    FRAMES.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      images[i] = img;
    });
    imagesRef.current = images;
    setInit(true);
  }, [visible]);

  /* ═══════════════════════════════════════════════════════════
     FADE-IN & LAYOUT SYNC
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!visible || !init || !sectionRef.current) return;

    // Snap scroll position to the top of this section
    const startScroll = window.scrollY + sectionRef.current.getBoundingClientRect().top;
    window.scrollTo({
      top: startScroll,
      behavior: 'instant'
    });
    
    // Set section height based on frame count
    sectionRef.current.style.height = `${Math.max(window.innerHeight, TOTAL * 25)}px`;
    sectionRef.current.style.overflowAnchor = 'none';
    
    // Refresh ScrollTrigger after a slight delay to ensure browser layout settle
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Cinematic Title entrance
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.domain-char');
      const hint = titleRef.current.querySelector('.domain-scroll-hint');
      
      gsap.fromTo(chars,
        { y: 30, opacity: 0, scale: 0.8, filter: 'blur(10px)' },
        { 
          y: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 1.2, stagger: 0.04, delay: 0.5, ease: 'expo.out' 
        }
      );

      gsap.fromTo(hint,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, delay: 1.8, ease: 'power2.out' }
      );
    }
  }, [visible, init]);

  /* ═══════════════════════════════════════════════════════════
     CANVAS RENDERING LOGIC
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!visible || !init) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // performance optimization

    const renderFrame = (index) => {
      const img = imagesRef.current[index];
      if (!img || img.naturalWidth === 0) return;
      
      const draw = () => {
        if (!canvas) return;
        
        // Logical centering & Cover logic
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        
        const canvasRatio = cw / ch;
        const imgRatio = iw / ih;
        
        let dx, dy, dw, dh;
        
        // "Cover" behavior while keeping it centered
        if (imgRatio > canvasRatio) {
          // Image is wider than canvas ratio
          dh = ch;
          dw = ch * imgRatio;
          dx = (cw - dw) / 2;
          dy = 0;
        } else {
          // Image is taller than canvas ratio
          dw = cw;
          dh = cw / imgRatio;
          dx = 0;
          dy = (ch - dh) / 2;
        }

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
      };

      if (img.complete) {
        draw();
      } else {
        img.onload = draw;
      }
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      
      renderFrame(currentFrame.current);
    };

    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);

    // Sequence ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const frameIndex = Math.min(TOTAL - 1, Math.floor(self.progress * (TOTAL - 1)));
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
  }, [visible, init]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        .domain-section {
          position: relative;
          background: #000;
          width: 100%;
          min-height: 100vh;
        }

        .domain-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .domain-canvas-sticky {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
          background: #000;
          overflow: hidden;
        }

        .domain-canvas {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Overlays */
        .domain-ui-layer {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          margin-top: -100vh;
          pointer-events: none;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .domain-grad-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%);
          z-index: -1;
        }

        .domain-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.5rem, 8vw, 6rem);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #fff;
          text-align: center;
          text-shadow: 
            0 0 20px rgba(255, 34, 0, 0.6),
            0 0 50px rgba(255, 34, 0, 0.3);
          line-height: 1.1;
        }

        .domain-scroll-hint {
          display: block;
          margin-top: 2rem;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          letter-spacing: 0.5em;
          color: rgba(255,255,255,0.4);
          animation: domain-pulse 1.5s infinite alternate;
        }

        @keyframes domain-pulse {
          from { opacity: 0.3; transform: translateY(0); }
          to { opacity: 0.8; transform: translateY(5px); }
        }
      `}</style>

      <section ref={sectionRef} className="domain-section">
        <div ref={wrapperRef} className="domain-wrapper">
          {/* Sticky Canvas Container */}
          <div className="domain-canvas-sticky">
            <canvas ref={canvasRef} className="domain-canvas" />
          </div>

          {/* UI Layer (Sticky via margin-top hack or just absolute in a tall container) */}
          <div className="domain-ui-layer">
            <div className="domain-grad-overlay" />
            
            <div ref={titleRef} className="domain-title">
              {"DOMAIN EXPANSION".split("").map((char, i) => (
                <span key={i} className="domain-char" style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
                  {char}
                </span>
              ))}
              <span className="domain-scroll-hint">SCROLL TO MANIFEST ▾</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
