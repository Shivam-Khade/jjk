import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import videoSrc from '../assets/gojo-vs-sukuna/gojo-vs-sukuna.mp4';

export default function CursedTechniquesSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const animFrameRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Video Setup
    if (videoRef.current) {
      gsap.fromTo(videoRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.inOut' }
      );
    }

    // 4. Canvas Particles
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      let width, height;

      const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      };

      window.addEventListener('resize', resize);
      resize();

      for (let i = 0; i < 28; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.2 + 0.6,
          speedY: -(Math.random() * 0.35 + 0.1),
          speedX: (Math.random() - 0.5) * 0.18,
          opacity: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2,
        });
      }

      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.pulse += 0.018;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.3;
          const safeOpacity = Math.max(0, Math.min(1, currentOpacity));

          // Base dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 20, 20, ${safeOpacity})`;
          ctx.fill();

          // Outer soft glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 20, 20, ${safeOpacity * 0.06})`;
          ctx.fill();
        });

        animFrameRef.current = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        window.removeEventListener('resize', resize);
      };
    }
  }, []);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        .ct-grain-overlay {
          position: absolute; 
          inset: 0; 
          opacity: 0.045;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          z-index: 5;
        }

        .ct-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -1px;
          color: #fff;
          text-shadow:
            0 0 80px rgba(180, 20, 20, 0.35),
            0 0 160px rgba(180, 20, 20, 0.15),
            0 2px 4px rgba(0,0,0,0.8);
        }
      `}</style>
      
      <section
        ref={sectionRef}
        id="cursed-techniques"
        style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--color-bg-dark)' }}
      >
        {/* Layer 1: Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0, // initial
            zIndex: 1,
          }}
        />

        {/* Transition Edge: Top blend */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '180px', zIndex: 8,
          background: 'linear-gradient(to bottom, #050005 0%, rgba(0,0,0,0.8) 30%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* Layer Overlays (zIndex 2-4) */}
        
        {/* Top dark fade */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '35%', zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* Bottom dark fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* Global dark film */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'rgba(0, 0, 0, 0.42)',
          pointerEvents: 'none'
        }} />

        {/* Cursed energy red glow */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          background: 'radial-gradient(ellipse 60% 55% at 25% 55%, rgba(160, 10, 10, 0.28) 0%, rgba(100, 5, 5, 0.10) 45%, transparent 100%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none'
        }} />

        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.85) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Layer 5: Grain */}
        <div className="ct-grain-overlay" />

        {/* Layer 6: Canvas Particles */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none',
            zIndex: 6
          }}
        />

        {/* Transition Edge: Bottom blend */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', zIndex: 8,
          background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.8) 30%, transparent 100%)',
          pointerEvents: 'none'
        }} />
      </section>
    </>
  );
}
