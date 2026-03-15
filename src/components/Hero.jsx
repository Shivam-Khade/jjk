import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import sukunaImg from '../assets/character/sukuna.png';
import yujiImg from '../assets/character/yuji.png';

export default function Hero() {
  // Layer refs
  const sectionRef = useRef(null);
  const sukunaImgRef = useRef(null);
  const yujiGroupRef = useRef(null);
  const yujiImgRef = useRef(null);
  const ringRef = useRef(null);

  // Text refs removed

  // ── Cursor reveal effect ──
  useEffect(() => {
    const section = sectionRef.current;
    const yujiGroup = yujiGroupRef.current;
    const ring = ringRef.current;

    if (!section || !yujiGroup || !ring) return;

    let revealX = window.innerWidth / 2;
    let revealY = window.innerHeight / 2;
    const revealPos = { x: revealX, y: revealY };
    const ringPos = { x: revealX, y: revealY };
    const revealRadius = { r: 0 };
    let isHovering = false;

    // Breathing pulse on the foggy ring
    const ringPulse = gsap.to(ring, {
      scale: 1.15,
      opacity: 0.7,
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: 'sine.inOut',
      paused: true,
    });

    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      revealX = e.clientX - rect.left;
      revealY = e.clientY - rect.top;
    };

    const handleMouseEnter = () => {
      isHovering = true;
      gsap.to(revealRadius, {
        r: 150,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(ring, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      ringPulse.play();
    };

    const handleMouseLeave = () => {
      isHovering = false;
      gsap.to(revealRadius, {
        r: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
      gsap.to(ring, {
        opacity: 0,
        scale: 0.85,
        duration: 0.5,
        ease: 'power2.in',
        overwrite: 'auto',
      });
      ringPulse.pause();
    };

    let time = 0;

    // GSAP ticker for smooth real-time clip-path update
    const tick = () => {
      time += 0.05;

      // Smooth cursor follow
      revealPos.x += (revealX - revealPos.x) * 0.12;
      revealPos.y += (revealY - revealPos.y) * 0.12;

      // Ring follows with slight lag
      ringPos.x += (revealX - ringPos.x) * 0.08;
      ringPos.y += (revealY - ringPos.y) * 0.08;

      // Make the reveal hole wobble to simulate gaseous/liquid spread
      const r = revealRadius.r;
      const wobbleX = Math.sin(time * 0.8) * (r * 0.15);
      const wobbleY = Math.cos(time * 1.1) * (r * 0.15);
      
      const px = revealPos.x;
      const py = revealPos.y;
      
      const rx = r + wobbleX;
      const ry = r + wobbleY;

      // Foggy, irregularly stretching mask
      yujiGroup.style.maskImage = `radial-gradient(ellipse ${rx}px ${ry}px at ${px}px ${py}px, transparent 0%, transparent 20%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.85) 75%, black 100%)`;
      yujiGroup.style.webkitMaskImage = yujiGroup.style.maskImage;

      ring.style.left = `${ringPos.x}px`;
      ring.style.top = `${ringPos.y}px`;
    };

    gsap.ticker.add(tick);
    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseenter', handleMouseEnter);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      gsap.ticker.remove(tick);
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseenter', handleMouseEnter);
      section.removeEventListener('mouseleave', handleMouseLeave);
      ringPulse.kill();
    };
  }, []);

  // ── Hero text entrance + image zoom animations ──
  useEffect(() => {
    // Cinematic image zoom-in on mount
    gsap.from([sukunaImgRef.current, yujiImgRef.current], {
      scale: 1.08,
      duration: 1.4,
      ease: 'power2.out',
      transformOrigin: 'top center',
    });

    // Text entrance removed
  }, []);

  return (
    <section
      id="character"
      ref={sectionRef}
      className="hero-section"
      style={{ cursor: 'none' }}
    >
      {/* Layer 0 — Base background is set via CSS */}

      {/* Layer 1 — Sukuna (always visible beneath) */}
      <img
        ref={sukunaImgRef}
        src={sukunaImg}
        alt="Ryomen Sukuna"
        className="hero-img hero-img--sukuna"
      />

      {/* Layer 2 — Sukuna dark overlay */}
      <div className="hero-overlay hero-overlay--sukuna" />

      {/* Layer 3 — Yuji group (this gets clip-path applied) */}
      <div ref={yujiGroupRef} className="hero-yuji-group">
        <img
          ref={yujiImgRef}
          src={yujiImg}
          alt="Yuji Itadori"
          className="hero-img hero-img--yuji"
        />
        <div className="hero-overlay hero-overlay--yuji" />
      </div>

      {/* Layer 4 — Global bottom fade */}
      <div className="hero-bottom-fade" />

      {/* Layer 5 — Cursor glow ring */}
      <div ref={ringRef} className="hero-cursor-ring" />

    </section>
  );
}
