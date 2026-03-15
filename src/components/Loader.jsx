import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const STATUS_MESSAGES = [
  "MANIFESTING DOMAIN",
  "CHANNELLING CURSED ENERGY",
  "PREPARING DISMANTLE",
  "UNLEASHING MALEVOLENT SHRINE"
];

export default function Loader({ onComplete, onReveal }) {
  const loaderRef = useRef(null);
  const sigilRef = useRef(null);
  const sigilRingsRef = useRef([]);
  const panelRef = useRef([]);
  const slashLinesRef = useRef(null);
  const flashRef = useRef(null);
  const barRef = useRef(null);
  const percentRef = useRef(null);
  const statusRef = useRef(null);
  const bgGlowRef = useRef(null);
  const auraRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Background Glow & Aura Pulse
      gsap.to(bgGlowRef.current, {
        opacity: 0.8,
        scale: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(auraRef.current, {
        opacity: 0.4,
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      });

      // 2. Sigil Entrance & Complex Rotation
      gsap.from(sigilRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 1.2,
        ease: 'expo.out',
        delay: 0.3,
      });

      // Animate rings at different speeds
      sigilRingsRef.current.forEach((ring, i) => {
        gsap.to(ring, {
          rotation: i % 2 === 0 ? 360 : -360,
          duration: 8 + i * 4,
          repeat: -1,
          ease: 'none',
          transformOrigin: 'center center',
        });
      });

      // 3. Status Text Cycling
      let currentStatus = 0;
      const statusInterval = setInterval(() => {
        if (statusRef.current) {
          gsap.to(statusRef.current, {
            opacity: 0,
            y: -5,
            duration: 0.3,
            onComplete: () => {
              currentStatus = (currentStatus + 1) % STATUS_MESSAGES.length;
              statusRef.current.textContent = STATUS_MESSAGES[currentStatus];
              gsap.to(statusRef.current, { opacity: 1, y: 0, duration: 0.3 });
            }
          });
        }
      }, 1500);

      // 4. Loading Bar
      const progress = { val: 0 };
      gsap.to(progress, {
        val: 100,
        duration: 4.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (barRef.current && percentRef.current) {
            barRef.current.style.width = `${progress.val}%`;
            percentRef.current.textContent = `${Math.round(progress.val)}%`;
          }
        },
      });

      // 5. THE SLASH + RIP SPLIT
      const mainTl = gsap.timeline({ delay: 4.5 });

      mainTl
        // Intensify sigil before impact
        .to(sigilRef.current, {
          scale: 1.3,
          filter: 'drop-shadow(0 0 60px #ff2200)',
          duration: 0.3,
          ease: 'power4.in',
        })
        // Visceral Vibration
        .to(sigilRef.current, {
          x: '+=3',
          y: '+=2',
          duration: 0.05,
          repeat: 4,
          yoyo: true,
          ease: 'none'
        }, '-=0.1')
        // Impact Moment
        .set(loaderRef.current, { background: 'transparent' })
        .to(flashRef.current, {
          opacity: 0.7,
          backgroundColor: '#ff2200',
          duration: 0.05,
          onStart: () => { if (onReveal) onReveal(); }
        })
        .to(flashRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
        // Slash lines flicker
        .fromTo(slashLinesRef.current, 
          { opacity: 0 },
          { opacity: 1, duration: 0.1, repeat: 1, yoyo: true },
          '<='
        )
        // Hide UI
        .to(['.slash-sigil', '.slash-bar-wrapper', '.slash-loader-bg-glow', '.loader-aura'], { 
          opacity: 0, 
          duration: 0.2,
          ease: 'power2.out'
        }, '<=')
        // Rip panels apart
        .to(panelRef.current[0], { x: '-25vw', y: '160vh', rotation: -15, duration: 1.6, ease: 'power4.in' }, '<=')
        .to(panelRef.current[1], { x: '15vw', y: '160vh', rotation: 20, duration: 1.6, ease: 'power4.in' }, '<=')
        .to(panelRef.current[2], { x: '-35vw', y: '170vh', rotation: -10, duration: 1.6, ease: 'power4.in' }, '<=')
        .to(panelRef.current[3], { x: '45vw', y: '170vh', rotation: 25, duration: 1.6, ease: 'power4.in' }, '<=')
        .to(panelRef.current[4], { x: '-20vw', y: '180vh', rotation: -18, duration: 1.6, ease: 'power4.in' }, '<=')
        .to(panelRef.current[5], { x: '30vw', y: '180vh', rotation: 12, duration: 1.6, ease: 'power4.in' }, '<=')
        .call(() => {
          clearInterval(statusInterval);
          if (onComplete) onComplete();
        });

    }, loaderRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={loaderRef} className="slash-loader-wrapper">
      {/* Background glow base */}
      <div ref={bgGlowRef} className="slash-loader-bg-glow" />
      
      {/* Cursed Aura background */}
      <div ref={auraRef} className="loader-aura" />

      {/* The 6 Black Panels */}
      {[1, 2, 3, 4, 5, 6].map((num, i) => (
        <div 
          key={num}
          ref={el => panelRef.current[i] = el}
          className={`slash-panel slash-panel-${num}`} 
        />
      ))}

      {/* Enhanced Multi-Layer Sigil */}
      <div ref={sigilRef} className="slash-sigil">
        <svg viewBox="0 0 300 300" width="300" height="300">
          <defs>
            <filter id="sigilGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Outer rotating rings */}
          <g ref={el => sigilRingsRef.current[0] = el}>
            <circle cx="150" cy="150" r="140" fill="none" stroke="#ff2200" strokeWidth="0.5" strokeDasharray="10 20" opacity="0.4" />
          </g>
          
          <g ref={el => sigilRingsRef.current[1] = el}>
            <circle cx="150" cy="150" r="125" fill="none" stroke="#ff2200" strokeWidth="2" strokeDasharray="80 100" />
            <circle cx="150" cy="150" r="125" fill="none" stroke="#ff6600" strokeWidth="1" strokeDasharray="1 20" />
          </g>

          <g ref={el => sigilRingsRef.current[2] = el}>
            <circle cx="150" cy="150" r="100" fill="none" stroke="#cc1100" strokeWidth="1.5" strokeDasharray="40 10" />
            <path d="M150 50 L160 100 L150 110 L140 100 Z" fill="#ff2200" opacity="0.8" transform="rotate(45 150 150)" />
            <path d="M150 50 L160 100 L150 110 L140 100 Z" fill="#ff2200" opacity="0.8" transform="rotate(135 150 150)" />
            <path d="M150 50 L160 100 L150 110 L140 100 Z" fill="#ff2200" opacity="0.8" transform="rotate(225 150 150)" />
            <path d="M150 50 L160 100 L150 110 L140 100 Z" fill="#ff2200" opacity="0.8" transform="rotate(315 150 150)" />
          </g>

          {/* Inner core */}
          <g transform="scale(0.8) translate(37.5 37.5)">
            <path
              d="M150 60 L168 130 L240 150 L168 170 L150 240 L132 170 L60 150 L132 130 Z"
              fill="#ff2200"
              filter="url(#sigilGlow)"
              opacity="0.9"
            />
            <circle cx="150" cy="150" r="12" fill="#ff2200" />
            <circle cx="150" cy="150" r="5" fill="#fff" />
          </g>
        </svg>
      </div>

      {/* The Slash Lines */}
      <svg ref={slashLinesRef} className="slash-lines-svg">
        {[25, 40, 60, 80, 95].map((y, i) => (
          <g key={i}>
            <line x1="0" y1={`${y}%`} x2="100%" y2={`${y - 10}%`} stroke="white" strokeWidth="3" opacity="0.8" />
            <line x1="0" y1={`${y + 0.5}%`} x2="100%" y2={`${y - 9.5}%`} stroke="#ff2200" strokeWidth="2" />
          </g>
        ))}
      </svg>

      {/* Screen Flash */}
      <div ref={flashRef} className="slash-flash" />

      {/* Loading UI */}
      <div className="slash-bar-wrapper">
        <div ref={statusRef} className="loader-status-text">MANIFESTING DOMAIN</div>
        <div className="slash-bar-track">
          <div ref={barRef} className="slash-bar-fill">
            <div className="bar-glow-tip" />
          </div>
        </div>
        <div className="loader-bottom-row">
          <div className="loader-meta-label">CURSED ENERGY FLOW</div>
          <div ref={percentRef} className="slash-bar-text">0%</div>
        </div>
      </div>
    </div>
  );
}
