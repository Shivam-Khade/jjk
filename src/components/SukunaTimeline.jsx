import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import CursedTechniquesSection from './CursedTechniquesSection';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const timelineData = [
  {
    label: "I — The Beginning",
    title: "Heian Era",
    subtitle: "The Strongest in History",
    body: "During the Heian Era, Ryomen Sukuna ruled as the most powerful sorcerer. His overwhelming cursed energy earned him the title \"King of Curses.\"",
  },
  {
    label: "II — The Battle",
    title: "Sorcerers vs Sukuna",
    subtitle: "An Unwinnable War",
    body: "The greatest jujutsu sorcerers united to defeat Sukuna. But again and again, Sukuna defeated them, proving his unmatched power.",
  },
  {
    label: "III — The Pact",
    title: "Twenty Cursed Fingers",
    subtitle: "Sealed, Not Destroyed",
    body: "Sukuna made a pact that allowed his power to survive through cursed objects. His body was sealed into twenty indestructible cursed fingers.",
  },
  {
    label: "IV — The Vessel",
    title: "Sukuna Awakens",
    subtitle: "A New Host Emerges",
    body: "Centuries later, Yuji Itadori consumes one of the cursed fingers, becoming the vessel of the King of Curses.",
  },
  {
    label: "V — The Clash",
    title: "Strongest vs Strongest",
    subtitle: "", // Not specified, but implied as a climactic transition
    body: "The strongest sorcerer in history faces the strongest sorcerer of the present era. Ryomen Sukuna vs Satoru Gojo.",
    isClimax: true
  }
];

export default function SukunaTimeline() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);
  const cursorRef = useRef(null);
  const flashRef = useRef(null);

  const climaxPinRef = useRef(null);
  const climaxVideoRef = useRef(null);
  const climaxCardContentRef = useRef(null);

  useEffect(() => {
    // Inject Fonts and Custom Styles
    const styleId = "sukuna-timeline-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Pro:ital,wght@0,400;0,700;1,400&display=swap');
        
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-crimson { font-family: 'Crimson Pro', serif; }
        
        .timeline-container {
          cursor: none;
        }

        .custom-cursor {
          pointer-events: none;
          position: fixed;
          width: 16px;
          height: 16px;
          z-index: 9999;
          transform: translate(-50%, -50%);
        }

        .cursor-crosshair {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .cursor-crosshair::before, .cursor-crosshair::after {
          content: '';
          position: absolute;
          background: #cc1111;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
        .cursor-crosshair::before { width: 100%; height: 1px; }
        .cursor-crosshair::after { width: 1px; height: 100%; }

        /* Noise Texture overlay */
        .noise-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          opacity: 0.04;
          z-index: 2;
          filter: url(#noiseFilter);
        }

        /* Hero Text Shadow */
        .text-glow-red {
          text-shadow: 0 0 25px rgba(204, 17, 17, 0.8), 0 0 10px rgba(204, 17, 17, 0.5);
        }
        
        .text-glow-red-strong {
          text-shadow: 0 0 35px rgba(255, 51, 51, 0.9), 0 0 15px rgba(255, 51, 51, 0.7);
        }

        /* ── Animated shimmer angle ── */
        @property --shimmer-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes shimmer-rotate {
          to { --shimmer-angle: 360deg; }
        }

        @keyframes inner-glow-pulse {
          0%, 100% { opacity: 0.04; }
          50%      { opacity: 0.12; }
        }

        /* ── Premium Card ── */
        .tl-card {
          position: relative;
          background: linear-gradient(160deg, rgba(18, 4, 8, 0.95) 0%, rgba(8, 1, 3, 0.88) 100%);
          backdrop-filter: blur(8px) saturate(1.2);
          -webkit-backdrop-filter: blur(8px) saturate(1.2);
          border-radius: 14px;
          overflow: hidden;
          transition: transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.5s ease;
          box-shadow:
            0 10px 40px rgba(0,0,0,0.55),
            0 0 0 1px rgba(204,17,17,0.15);
        }

        /* Animated shimmer border */
        .tl-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 15px;
          padding: 1px;
          background: conic-gradient(from var(--shimmer-angle), transparent 30%, rgba(204,17,17,0.45) 50%, transparent 70%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: shimmer-rotate 6s linear infinite;
          pointer-events: none;
        }

        /* Inner cursed-energy glow */
        .tl-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          background: radial-gradient(ellipse at 50% 0%, rgba(204,17,17,0.18) 0%, transparent 65%);
          animation: inner-glow-pulse 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        .tl-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 18px 56px rgba(0,0,0,0.6),
            0 0 25px rgba(204,17,17,0.15),
            0 0 0 1px rgba(204,17,17,0.35);
        }

        /* ── Climax Card ── */
        .tl-card--climax {
          background: linear-gradient(160deg, rgba(28, 5, 10, 0.98) 0%, rgba(12, 2, 5, 0.92) 100%);
          box-shadow:
            0 14px 56px rgba(0,0,0,0.6),
            0 0 40px rgba(204,17,17,0.1),
            0 0 0 1px rgba(255,51,51,0.3);
          border-radius: 16px;
        }

        .tl-card--climax::before {
          border-radius: 17px;
          background: conic-gradient(from var(--shimmer-angle), transparent 20%, rgba(255,51,51,0.55) 50%, transparent 80%);
          animation: shimmer-rotate 4s linear infinite;
        }

        .tl-card--climax::after {
          border-radius: 16px;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,51,51,0.22) 0%, transparent 60%);
        }

        .tl-card--climax:hover {
          transform: translateY(-5px);
          box-shadow:
            0 22px 64px rgba(0,0,0,0.65),
            0 0 40px rgba(255,51,51,0.2),
            0 0 0 1px rgba(255,51,51,0.5);
        }

        /* ── Corner ornaments ── */
        .corner-ornament {
          position: absolute;
          width: 28px;
          height: 28px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.35;
          transition: opacity 0.4s ease;
        }
        .tl-card:hover .corner-ornament { opacity: 0.7; }
        .corner-tl { top: 8px; left: 8px; }
        .corner-tr { top: 8px; right: 8px; transform: scaleX(-1); }
        .corner-bl { bottom: 8px; left: 8px; transform: scaleY(-1); }
        .corner-br { bottom: 8px; right: 8px; transform: scale(-1); }

        /* ── Card inner divider ── */
        .card-divider {
          width: 40px;
          height: 1px;
          background: linear-gradient(to right, rgba(204,17,17,0.6), transparent);
          margin: 18px 0;
        }
        .card-divider--right {
          margin-left: auto;
          background: linear-gradient(to left, rgba(204,17,17,0.6), transparent);
        }
        .card-divider--center {
          margin-left: auto;
          margin-right: auto;
          width: 56px;
          background: linear-gradient(to right, transparent, rgba(255,51,51,0.6), transparent);
        }

        /* ── Climax kanji watermark ── */
        .climax-watermark {
          position: absolute;
          bottom: -10px;
          right: 16px;
          font-size: 120px;
          line-height: 1;
          color: rgba(204, 17, 17, 0.04);
          font-weight: 900;
          pointer-events: none;
          z-index: 0;
          user-select: none;
        }

        /* Card body relative z for text above pseudo-elements */
        .tl-card-body { position: relative; z-index: 1; }

        /* Dashed connector animation */
        .dashed-line {
          background-image: linear-gradient(to right, #cc1111 50%, transparent 50%);
          background-size: 10px 1px;
          background-repeat: repeat-x;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup styles on unmount if appropriate, or leave them
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Custom Cursor
      const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" });
      const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" });
      
      const onMouseMove = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener("mousemove", onMouseMove);

      // 2. Animated Fog/Smoke Layer
      gsap.to(".fog-layer", {
        xPercent: -50,
        repeat: -1,
        duration: 40,
        ease: "linear"
      });

      // 3. Floating Cursed Particles
      gsap.utils.toArray(".particle").forEach((particle) => {
        const randomX = gsap.utils.random(-20, 20);
        const randomDuration = gsap.utils.random(3, 7);
        const randomDelay = gsap.utils.random(0, 5);

        gsap.to(particle, {
          y: "-=100",
          x: "+=" + randomX,
          opacity: 0,
          duration: randomDuration,
          delay: randomDelay,
          repeat: -1,
          ease: "none",
          onRepeat: () => {
            gsap.set(particle, { y: 0, opacity: gsap.utils.random(0.4, 0.8) });
          }
        });
      });

      // 4. Hero Reveal (Premium Typing Effect)
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 60%", // Triggers when section slides into the bottom 40% of the screen
          toggleActions: "play none none none"
        }
      });
      
      // Initial states
      gsap.set(".hero-type-elem", { opacity: 1 });
      gsap.set(".scroll-indicator", { opacity: 0, y: 30 });
      gsap.set(".hero-cursor", { opacity: 1 });

      // Blinking cursor
      gsap.to(".hero-cursor", {
        opacity: 0,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        duration: 0.6
      });

      // Typing animation sequence
      heroTl.to(".hero-subtitle", {
        text: "The King of Curses",
        duration: 0.5,
        ease: "none",
        delay: 0.2
      })
      .to(".hero-title", {
        text: "Ryomen Sukuna",
        duration: 0.6,
        ease: "none"
      }, "+=0.1")
      .to(".hero-desc", {
        text: "A Chronicle of Cursed Power",
        duration: 0.5,
        ease: "none"
      }, "+=0.1")
      .to(".scroll-indicator", {
        opacity: 0.5,
        y: 0,
        duration: 1,
        ease: "power3.out"
      }, "+=0.5");

      // Hero Scroll Indicator Pulse
      gsap.to(".scroll-indicator", {
        y: 10,
        opacity: 0.5,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut"
      });

      // 5. Timeline Center Line Draw
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top center",
            end: "bottom bottom",
            scrub: true,
          }
        }
      );

      // 6. Cards Reveal
      const cards = gsap.utils.toArray(".timeline-card-wrapper");
      cards.forEach((card, index) => {
        const isLeft = index % 2 === 0;
        const isClimax = index === cards.length - 1;
        
        const cardBox = card.querySelector(".timeline-card");
        const dot = card.querySelector(".timeline-dot");
        const connector = card.querySelector(".timeline-connector");
        const textElements = card.querySelectorAll(".card-text");
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        });

        // Setup initial states
        gsap.set(cardBox, { opacity: 0, x: isClimax ? 0 : (isLeft ? -80 : 80), y: isClimax ? 50 : 0 });
        gsap.set(dot, { scale: 0 });
        if (connector) gsap.set(connector, { width: 0 });
        gsap.set(textElements, { opacity: 0, y: 15 });

        // Animation sequence
        tl.to(cardBox, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "power3.out"
        }, 0);

        tl.to(dot, {
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)"
        }, 0.2);

        if (connector) {
          tl.to(connector, {
            width: "100%",
            duration: 0.5,
            ease: "power2.out"
          }, 0.3);
        }

        tl.to(textElements, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        }, 0.4);

        // Sub-animation for climax flash
        if (isClimax) {
          tl.to(flashRef.current, {
            opacity: 0.08,
            duration: 0.1,
            ease: "power1.in",
            yoyo: true,
            repeat: 1
          }, 0.2);
        }
      });

      // 7. Cinematic Climax Transition (Card -> Video)
      if (climaxPinRef.current && climaxCardContentRef.current && climaxVideoRef.current) {
        gsap.set(climaxVideoRef.current, { scale: 0.45, opacity: 0 });
        
        const climaxTl = gsap.timeline({
          scrollTrigger: {
            trigger: climaxPinRef.current,
            start: "top 73px", // Pin exactly below the navbar height
            end: "+=600%", // Extensively increased pin scroll distance
            pin: true,
            scrub: 1.5 
          }
        });

        climaxTl
          // Phase 1: Card fades out, Video scales up over a longer scroll duration
          .to(climaxCardContentRef.current, { opacity: 0, scale: 0.85, duration: 1, ease: "power2.inOut" }, 0)
          .to(climaxVideoRef.current, { opacity: 1, scale: 1, duration: 2.5, ease: "power2.inOut" }, 0)
          // Phase 2: Massive hold duration so the video stays fullscreen for several seconds of scrolling
          .to({}, { duration: 8 });
      }

    }, containerRef);

    return () => {
      window.removeEventListener("mousemove", ctx.data);
      ctx.revert();
    };
  }, []);

  const renderParticles = () => {
    return Array.from({ length: 25 }).map((_, i) => {
      const size = Math.random() * 3 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      return (
        <div 
          key={i} 
          className="particle absolute rounded-full bg-red-500 z-10"
          style={{
            width: size,
            height: size,
            left: `${left}%`,
            top: `${top}%`,
            opacity: Math.random() * 0.5 + 0.3,
            boxShadow: "0 0 8px rgba(255, 0, 0, 0.8)",
          }}
        />
      );
    });
  };

  return (
    <div ref={containerRef} className="timeline-container relative bg-[#050005] text-white min-h-screen overflow-hidden font-crimson">
      
      {/* --- Global Backgrounds & Effects --- */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(155, 26, 26, 0.15) 0%, rgba(5, 0, 5, 1) 60%)' }} 
      />

      {/* SVG Shrine Silhouettes */}
      <svg className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.12]" viewBox="0 0 1000 800" preserveAspectRatio="none">
        <path d="M 200,300 L 200,800 M 800,300 L 800,800 M 100,350 L 900,350 M 250,280 L 750,280 M 250,280 Q 500,240 750,280" stroke="#9b1a1a" strokeWidth="20" fill="none" strokeDasharray="5000" />
        <path d="M 400,500 L 400,800 M 600,500 L 600,800 M 350,530 L 650,530 M 420,480 L 580,480" stroke="#9b1a1a" strokeWidth="10" fill="none" opacity="0.6"/>
      </svg>

      {/* Fog Layer Container (200% width for infinite scroll) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="fog-layer absolute top-0 left-0 w-[200%] h-full flex opacity-30">
          <div className="w-1/2 h-full" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(155, 26, 26, 0.1) 0%, transparent 60%)', filter: 'blur(40px)' }} />
          <div className="w-1/2 h-full" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(155, 26, 26, 0.1) 0%, transparent 60%)', filter: 'blur(40px)' }} />
        </div>
      </div>

      {/* SVG Noise */}
      <svg width="0" height="0" className="hidden">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>
      <div className="noise-overlay" />

      {/* Floating Particles */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-10">
        {renderParticles()}
      </div>

      {/* Climax Screen Flash */}
      <div ref={flashRef} className="fixed inset-0 bg-red-600 opacity-0 pointer-events-none z-[100]" />

      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor hidden md:block">
        <div className="cursor-crosshair" />
      </div>


      {/* --- Hero Section --- */}
      <section ref={heroRef} className="relative z-20 w-full h-screen flex flex-col items-center justify-center text-center px-4 pt-12">
        <div className="font-cinzel text-xs md:text-sm tracking-[12px] text-[#cc1111] uppercase mb-12 min-h-[20px] flex items-center justify-center gap-2">
          <span className="hero-subtitle"></span>
        </div>
        
        <h1 className="font-cinzel font-black text-6xl md:text-8xl lg:text-[100px] text-white text-glow-red leading-none mb-12 uppercase min-h-[100px] flex items-center justify-center">
          <span className="hero-title"></span>
        </h1>
        
        <p className="font-crimson italic text-xl md:text-2xl text-gray-400 max-w-xl mx-auto mb-24 tracking-[2px] min-h-[30px] flex items-center justify-center gap-2">
          <span className="hero-desc"></span>
          <span className="hero-cursor w-2 h-6 md:h-8 bg-[#cc1111] inline-block shadow-[0_0_8px_#cc1111]"></span>
        </p>

        <div className="hero-elem scroll-indicator absolute bottom-12 left-1/2 flex flex-col items-center -translate-x-1/2">
          <span className="font-cinzel text-[10px] tracking-[3px] text-[#cc1111] mb-2 uppercase">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cc1111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </section>

      {/* --- Timeline Section --- */}
      <section ref={timelineRef} className="relative w-full py-24 px-4 z-20" style={{ maxWidth: '72rem', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Center Line */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#cc1111]/20 to-transparent" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <div className="h-full w-full relative">
            <div ref={lineRef} className="absolute top-0 w-full h-full bg-[#cc1111] shadow-[0_0_8px_#cc1111] origin-top scale-y-0" />
            <div className="absolute top-0 w-[1px] h-32 bg-gradient-to-t from-transparent to-[#050005] z-10 -translate-x-px" />
            <div className="absolute bottom-0 w-[1px] h-32 bg-gradient-to-b from-transparent to-[#050005] z-10 -translate-x-px" />
          </div>
        </div>

        {/* Cards */}
        <div className="relative flex flex-col gap-32 pb-32">
          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0;
            const isClimax = item.isClimax;
            
            if (isClimax) return null;

            return (
              <div key={index} className="timeline-card-wrapper relative w-full grid grid-cols-1 md:grid-cols-2 md:gap-x-24 z-30 px-4 md:px-0">
                
                {/* Dot */}
                <div className="absolute z-40" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                   <div className="timeline-dot w-3 h-3 rounded-full bg-[#cc1111] shadow-[0_0_10px_#cc1111]" />
                   <div className="timeline-dot absolute -inset-1 rounded-full border border-[#cc1111] opacity-50" />
                </div>

                {isLeft ? (
                  <div className="col-start-1 flex justify-start pl-12 md:pl-0 md:justify-end">
                     <div className="timeline-card tl-card relative w-full md:w-[88%] md:text-right text-left" style={{ padding: '2.25rem 2.25rem 2.5rem' }}>
                       {/* Corner Ornaments */}
                       <svg className="corner-ornament corner-tl" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#cc1111" strokeWidth="1"/></svg>
                       <svg className="corner-ornament corner-tr" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#cc1111" strokeWidth="1"/></svg>
                       <svg className="corner-ornament corner-bl" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#cc1111" strokeWidth="1"/></svg>
                       <svg className="corner-ornament corner-br" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#cc1111" strokeWidth="1"/></svg>
                       
                       <div className="hidden md:block absolute top-[40px] md:top-1/2 w-12 h-[1px] -right-12" style={{ transform: 'translateY(-50%)' }}>
                         <div className="timeline-connector h-full dashed-line w-full" style={{ float: 'right' }} />
                       </div>

                       <div className="tl-card-body">
                         <div className="card-text font-cinzel text-[9px] tracking-[6px] text-[#7a2020] uppercase" style={{ marginBottom: '12px' }}>{item.label}</div>
                         <h3 className="card-text font-cinzel font-bold text-[22px] text-white uppercase" style={{ marginBottom: '6px', letterSpacing: '0.03em', textShadow: '0 2px 12px rgba(204,17,17,0.3)' }}>{item.title}</h3>
                         <div className="card-text font-crimson italic text-[14px] text-[#cc4444]" style={{ marginBottom: '0' }}>{item.subtitle}</div>
                         <div className="card-divider card-divider--right" />
                         <p className="card-text font-crimson text-[15px] leading-[2] text-[rgba(232,213,196,0.72)]">{item.body}</p>
                       </div>
                     </div>
                  </div>
                ) : (
                  <div className="col-start-1 md:col-start-2 flex justify-start pl-12 md:pl-0">
                     <div className="timeline-card tl-card relative w-full md:w-[88%] text-left" style={{ padding: '2.25rem 2.25rem 2.5rem' }}>
                       {/* Corner Ornaments */}
                       <svg className="corner-ornament corner-tl" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#cc1111" strokeWidth="1"/></svg>
                       <svg className="corner-ornament corner-tr" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#cc1111" strokeWidth="1"/></svg>
                       <svg className="corner-ornament corner-bl" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#cc1111" strokeWidth="1"/></svg>
                       <svg className="corner-ornament corner-br" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#cc1111" strokeWidth="1"/></svg>
                       
                       <div className="hidden md:block absolute top-[40px] md:top-1/2 w-12 h-[1px] -left-12" style={{ transform: 'translateY(-50%)' }}>
                         <div className="timeline-connector h-full dashed-line w-full" style={{ float: 'left' }} />
                       </div>

                       <div className="tl-card-body">
                         <div className="card-text font-cinzel text-[9px] tracking-[6px] text-[#7a2020] uppercase" style={{ marginBottom: '12px' }}>{item.label}</div>
                         <h3 className="card-text font-cinzel font-bold text-[22px] text-white uppercase" style={{ marginBottom: '6px', letterSpacing: '0.03em', textShadow: '0 2px 12px rgba(204,17,17,0.3)' }}>{item.title}</h3>
                         <div className="card-text font-crimson italic text-[14px] text-[#cc4444]" style={{ marginBottom: '0' }}>{item.subtitle}</div>
                         <div className="card-divider" />
                         <p className="card-text font-crimson text-[15px] leading-[2] text-[rgba(232,213,196,0.72)]">{item.body}</p>
                       </div>
                     </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* --- CLIMAX SECTION (Outside Flex Container to prevent GSAP PinSpacer height collapse) --- */}
        {(() => {
          const item = timelineData[timelineData.length - 1];
          return (
            <div 
              ref={climaxPinRef} 
              className="relative flex justify-center items-center mt-32 z-30 overflow-hidden"
              style={{ 
                height: 'calc(100vh - 73px)', 
                width: '100vw', 
                marginLeft: 'calc(-50vw + 50%)', 
                marginRight: 'calc(-50vw + 50%)' 
              }}
            >
              
              {/* Background Scalable Video */}
              <div ref={climaxVideoRef} className="absolute inset-0 z-0 origin-center pointer-events-none flex items-center justify-center">
                 <div className="w-full h-full">
                    <CursedTechniquesSection />
                 </div>
              </div>

              {/* Foreground Climax Card */}
              <div ref={climaxCardContentRef} className="timeline-card-wrapper relative w-full flex justify-center z-10 h-auto">
                {/* Climax Dot */}
                <div className="absolute top-0 flex items-center justify-center z-40" style={{ left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div className="timeline-dot w-5 h-5 rounded-full bg-[#ff3333] shadow-[0_0_15px_#ff3333]" />
                  <div className="timeline-dot absolute w-8 h-8 rounded-full border border-[#ff3333] opacity-60" />
                  <div className="timeline-dot absolute w-12 h-12 rounded-full border border-[#ff3333] opacity-30" />
                </div>

                {/* Climax Card */}
                <div className="timeline-card tl-card tl-card--climax relative ml-12 md:ml-0 w-[calc(100%-3rem)] md:w-[60%]" style={{ padding: '3rem 3rem 3.5rem' }}>
                {/* Corner Ornaments */}
                <svg className="corner-ornament corner-tl" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#ff3333" strokeWidth="1.5"/></svg>
                <svg className="corner-ornament corner-tr" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#ff3333" strokeWidth="1.5"/></svg>
                <svg className="corner-ornament corner-bl" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#ff3333" strokeWidth="1.5"/></svg>
                <svg className="corner-ornament corner-br" viewBox="0 0 28 28"><path d="M0 28V8a8 8 0 0 1 8-8h20" fill="none" stroke="#ff3333" strokeWidth="1.5"/></svg>

                {/* Kanji watermark */}
                <div className="climax-watermark font-cinzel">宿</div>

                <div className="tl-card-body">
                  <div className="card-text font-cinzel text-[10px] tracking-[6px] text-[#cc4444] uppercase text-center" style={{ marginBottom: '16px' }}>
                    {item.label}
                  </div>
                  <h3 className="card-text font-cinzel font-black text-[26px] md:text-[32px] text-[#ff3333] text-glow-red-strong uppercase text-center" style={{ marginBottom: '10px', letterSpacing: '0.04em' }}>
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="card-text font-crimson italic text-[15px] text-[#ff6666] text-center" style={{ marginBottom: '0' }}>
                       {item.subtitle}
                    </p>
                  )}
                  <div className="card-divider card-divider--center" />
                  <p className="card-text font-crimson text-[16px] md:text-[17px] leading-[2] text-[rgba(232,213,196,0.88)] text-center" style={{ maxWidth: '34rem', margin: '0 auto' }}>
                    {item.body}
                  </p>
                </div>
              </div>
              </div>
            </div>
          );
        })()}
        
      </section>
    </div>
  );
}
