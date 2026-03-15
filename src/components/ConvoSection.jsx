import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import characterSplitImg from '../assets/mid-fight/sukuna-gojo.png';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   DRAIN & CHARGE MESSAGES
   ═══════════════════════════════════════════════════════════ */
const DRAIN_LINES = [
  "CURSED ENERGY FADING…",
  "THE DOMAIN CRUMBLES…",
  "YOUR RESOLVE WAVERS…",
  "THE BINDING VOW WEAKENS…",
  "HOLLOW PURPLE DESTABILIZING…",
  "CURSED TECHNIQUE SLIPPING…",
  "MALEVOLENT SHRINE FADING…",
  "INFINITY COLLAPSING…",
  "REVERSE CURSED ENERGY DRAINING…",
  "DOMAIN EXPANSION FAILING…",
];

const CHARGE_LINES = [
  { max: 1, text: 'HOLD SPACE — FOCUS CURSED ENERGY' },
  { max: 25, text: 'CURSED ENERGY RISING…' },
  { max: 50, text: 'TECHNIQUE AMPLIFYING…' },
  { max: 75, text: 'CRITICAL MASS APPROACHING…' },
  { max: 100, text: '⚡ DOMAIN EXPANSION ⚡' },
];

export default function ConvoSection({ onComplete }) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const progressBarRef = useRef(null);
  const instructionRef = useRef(null);
  const pctRef = useRef(null);
  const uiRef = useRef(null);
  const glowLeftRef = useRef(null);
  const glowRightRef = useRef(null);
  const eyeLRef = useRef(null);
  const eyeRRef = useRef(null);

  const [completed, setCompleted] = useState(false);

  // Direct mutable state — no React re-renders during animation
  const charging = useRef(false);
  const progress = useRef(0);
  const done = useRef(false);
  const wasDraining = useRef(false);
  const drainLine = useRef('');

  /* ═══════════════════════════════════════════════════════════
     KEYBOARD — reads directly into refs, zero latency
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const onDown = (e) => {
      if (e.code === 'Space' && !done.current) {
        e.preventDefault();
        charging.current = true;
      }
    };
    const onUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        charging.current = false;
      }
    };
    // Also stop charging if window loses focus
    const onBlur = () => { charging.current = false; };

    window.addEventListener('keydown', onDown, { passive: false });
    window.addEventListener('keyup', onUp, { passive: false });
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  /* ═══════════════════════════════════════════════════════════
     GSAP TICKER — progress + all visual updates via DOM refs
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const imgEl = imageRef.current;
    const barEl = progressBarRef.current;
    const instrEl = instructionRef.current;
    const pctEl = pctRef.current;
    const glowL = glowLeftRef.current;
    const glowR = glowRightRef.current;
    const eyeL = eyeLRef.current;
    const eyeR = eyeRRef.current;

    const tick = (_, rawDt) => {
      // Cap deltaTime to prevent huge jumps (tab-switch, lag spikes)
      const dt = Math.min(rawDt, 33); // never more than ~2 frames
      const isCharging = charging.current;
      const isDone = done.current;
      let p = progress.current;

      // ── Charge / Drain ──
      if (isCharging && !isDone) {
        p = Math.min(100, p + dt / 25); // ~2.5s to fill
        wasDraining.current = false;
        if (p >= 100) {
          p = 100;
          charging.current = false;
          done.current = true;
          setCompleted(true);
        }
      } else if (!isCharging && !isDone && p > 0) {
        // Pick drain message on transition
        if (!wasDraining.current) {
          drainLine.current = DRAIN_LINES[Math.floor(Math.random() * DRAIN_LINES.length)];
          wasDraining.current = true;
        }
        p = Math.max(0, p - dt / 60); // ~6s to fully drain
      } else if (p <= 0) {
        wasDraining.current = false;
      }

      progress.current = p;

      // ── Progress bar (direct width) ──
      if (barEl) barEl.style.width = `${p}%`;
      if (pctEl) pctEl.textContent = `${Math.floor(p)}%`;

      // ── Instruction text ──
      if (instrEl && !isDone) {
        if (wasDraining.current && p > 0.5) {
          instrEl.textContent = drainLine.current;
          instrEl.style.color = '#ff4444';
        } else if (isCharging) {
          const line = CHARGE_LINES.find(l => p <= l.max) || CHARGE_LINES[CHARGE_LINES.length - 1];
          instrEl.textContent = line.text;
          instrEl.style.color = '#fff';
        } else if (p < 0.5) {
          instrEl.textContent = 'HOLD SPACE — FOCUS CURSED ENERGY';
          instrEl.style.color = '#fff';
        }
      }

      // ── Character & Dialogue Opacity (Fades out completely as energy peaks) ──
      const cards = sectionRef.current?.querySelectorAll('.q-card');
      if (!isDone) {
        const i = p / 100;
        
        if (imgEl) {
          imgEl.style.filter = `brightness(${1 - i * 0.9}) contrast(${1 + i * 0.5}) saturate(${1 + i * 1.5})`;
          imgEl.style.transform = `scale(${1 + i * 0.06})`;
          imgEl.style.opacity = 1 - i;
        }
        
        if (cards) {
          cards.forEach(card => {
            card.style.opacity = 1 - i;
          });
        }
      }

      // ── Glow intensity (Extremely subtle) ──
      const gi = Math.min(1, p / 70); 
      if (glowL) glowL.style.opacity = gi * 0.08; 
      if (glowR) glowR.style.opacity = gi * 0.08; 

      // ── Eye glows (Stay visible even as character fades) ──
      const ei = Math.min(1, p / 55);
      if (eyeL) {
        eyeL.style.background = `radial-gradient(circle, rgba(255,20,0,${ei * 1.1}) 0%, rgba(200,0,0,${ei * 0.5}) 25%, transparent 65%)`;
        eyeL.style.transform = `scale(${1 + ei * 0.5})`;
      }
      if (eyeR) {
        eyeR.style.background = `radial-gradient(circle, rgba(0,180,255,${ei * 1.1}) 0%, rgba(0,100,255,${ei * 0.5}) 25%, transparent 65%)`;
        eyeR.style.transform = `scale(${1 + ei * 0.5})`;
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  /* ═══════════════════════════════════════════════════════════
     SCROLL REVEAL
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.q-card');
    if (cards) {
      gsap.fromTo(cards, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
      });
    }
  }, []);

  /* ═══════════════════════════════════════════════════════════
     COMPLETION
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!completed) return;

    // Create actual black cover
    const black = document.createElement('div');
    black.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#000;opacity:0;pointer-events:none;';
    document.body.appendChild(black);

    // Fade in true black, then seamlessly switch to DomainSection
    gsap.to(black, { 
      opacity: 1, 
      duration: 1.5, 
      delay: 0.1, 
      ease: 'power2.inOut',
      onComplete: () => {
        if (onComplete) onComplete();
        
        // Remove black div quickly so user can instantly see the new section
        gsap.to(black, { opacity: 0, duration: 0.6, delay: 0, ease: 'power1.out', onComplete: () => black.remove() });
      }
    });

    if (uiRef.current) gsap.to(uiRef.current, { opacity: 0, y: 20, duration: 0.4 });
  }, [completed]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

        .quotes-section {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #000;
          overflow: hidden;
        }

        /* ── SIDE GLOWS (pure CSS, no canvas) ── */
        .side-glow {
          position: absolute;
          top: 0;
          width: 40%;
          height: 100%;
          pointer-events: none;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .side-glow-left {
          left: 0;
          background: radial-gradient(circle at 10% 50%, rgba(255,40,0,0.4) 0%, transparent 60%);
        }
        .side-glow-right {
          right: 0;
          background: radial-gradient(circle at 90% 50%, rgba(0,100,255,0.4) 0%, transparent 60%);
        }

        /* ── GLASSMORPHISM QUOTE CARDS ── */
        .q-card {
          position: absolute;
          min-width: 260px;
          padding: 30px 40px;
          border-radius: 20px;
          z-index: 25;
          font-family: 'Syne', sans-serif;
          text-transform: uppercase;
          font-weight: 800;
          font-size: 26px;
          letter-spacing: 0.07em;
          line-height: 1.35;
          text-align: center;
        }
        .q-card-left {
          top: 30%; left: 18%; transform: translate(-50%, -50%);
          background: linear-gradient(135deg, rgba(255,34,0,0.06), rgba(15,4,4,0.5) 40%, rgba(8,2,2,0.75));
          backdrop-filter: blur(22px) saturate(1.5);
          -webkit-backdrop-filter: blur(22px) saturate(1.5);
          border: 1px solid rgba(255,34,0,0.18);
          box-shadow: 0 0 50px rgba(255,34,0,0.1), 0 12px 48px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 40px rgba(255,34,0,0.05);
          color: #ff3333;
          text-shadow: 0 0 20px rgba(255,34,0,0.6), 0 0 60px rgba(255,34,0,0.2);
        }
        .q-card-right {
          top: 30%; left: 82%; transform: translate(-50%, -50%);
          background: linear-gradient(225deg, rgba(0,150,255,0.06), rgba(4,8,18,0.5) 40%, rgba(2,4,10,0.75));
          backdrop-filter: blur(22px) saturate(1.5);
          -webkit-backdrop-filter: blur(22px) saturate(1.5);
          border: 1px solid rgba(0,150,255,0.18);
          box-shadow: 0 0 50px rgba(0,150,255,0.1), 0 12px 48px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 40px rgba(0,150,255,0.05);
          color: #66ccff;
          text-shadow: 0 0 20px rgba(0,150,255,0.6), 0 0 60px rgba(0,150,255,0.2);
        }

        /* ── INTERACTION UI ── */
        .interaction-ui {
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .ui-instruction {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          text-align: center;
          text-shadow: 0 0 16px rgba(255,255,255,0.7), 0 0 35px rgba(255,0,0,0.35);
          animation: pulse-txt 1.2s infinite alternate;
          transition: color 0.3s;
          min-height: 18px;
        }
        @keyframes pulse-txt {
          0% { opacity: 0.45; }
          100% { opacity: 1; }
        }

        /* ── PROGRESS BAR (Refined Blood Tube) ── */
        .progress-track {
          width: 440px;
          height: 12px;
          background: rgba(0,0,0,0.9);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 
            inset 0 2px 10px rgba(0,0,0,0.9),
            0 0 15px rgba(255,0,0,0.05);
          position: relative;
        }
        .progress-track::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent 50%, rgba(255,255,255,0.05));
          z-index: 2;
          pointer-events: none;
        }

        .progress-fill {
          height: 100%;
          width: 0%;
          border-radius: 20px;
          background: linear-gradient(90deg, #440000, #b30000, #ff0000, #ff4d4d, #b30000);
          background-size: 200% 100%;
          animation: blood-flow 1s linear infinite;
          box-shadow: 0 0 25px rgba(255, 0, 0, 0.4);
          transition: none;
          position: relative;
          overflow: hidden;
        }
        
        /* Leading edge spark */
        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0; right: 0;
          width: 30px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6));
          filter: blur(4px);
          z-index: 3;
        }

        .blood-texture {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(0,0,0,0.4) 0%, transparent 20%),
            radial-gradient(circle at 50% 30%, rgba(0,0,0,0.4) 0%, transparent 15%),
            radial-gradient(circle at 80% 60%, rgba(0,0,0,0.4) 0%, transparent 20%);
          background-size: 60px 100%;
          animation: liquid-pan 2s linear infinite;
          opacity: 0.6;
          mix-blend-mode: multiply;
        }

        @keyframes blood-flow {
          0% { background-position: 200% 0%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes liquid-pan {
          0% { background-position: 120px 0; }
          100% { background-position: 0 0; }
        }
        .progress-pct {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.28);
          text-align: center;
        }

        .depth-fog {
          position: absolute; inset: 0; z-index: 18; pointer-events: none;
          background: radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 55%);
        }
      `}</style>

      <section ref={sectionRef} id="quotes" className="quotes-section">
        {/* Background */}
        <div className="absolute inset-0 z-0" style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(70,6,6,0.1), rgba(6,12,45,0.06) 30%, #000 70%)'
        }} />

        {/* Character */}
        <img ref={imageRef} src={characterSplitImg} alt="Sukuna vs Gojo"
          className="absolute inset-0 w-full h-full object-cover object-center z-10" />

        {/* Eye Glows */}
        <div className="absolute inset-0 z-12 mix-blend-screen pointer-events-none" style={{ opacity: 0.8 }}>
          <div ref={eyeLRef} className="absolute w-[42vw] h-[42vw] md:w-[28vw] md:h-[28vw]" style={{ top: '8%', left: '12%' }} />
          <div ref={eyeRRef} className="absolute w-[42vw] h-[42vw] md:w-[28vw] md:h-[28vw]" style={{ top: '8%', right: '12%' }} />
        </div>

        {/* Side Glows (CSS only, scaled by progress) */}
        <div ref={glowLeftRef} className="side-glow side-glow-left" />
        <div ref={glowRightRef} className="side-glow side-glow-right" />

        <div className="depth-fog" />

        {/* Quote Cards */}
        <div className="q-card q-card-left">Gambare,<br />Gambare</div>
        <div className="q-card q-card-right">Nah I'd Win</div>

        {/* Interaction UI */}
        <div ref={uiRef} className="interaction-ui">
          <div ref={instructionRef} className="ui-instruction">HOLD SPACE — FOCUS CURSED ENERGY</div>
          <div className="progress-track">
            <div ref={progressBarRef} className="progress-fill">
              <div className="blood-texture" />
            </div>
          </div>
          <div ref={pctRef} className="progress-pct">0%</div>
        </div>
      </section>
    </>
  );
}
