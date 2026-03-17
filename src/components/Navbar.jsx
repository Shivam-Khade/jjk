import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import logo from '../assets/logo.jpg';
import bgMusic from '../assets/music/music.mp3';

const NAV_LINKS = [
  { label: 'Character', href: '#character' },
  { label: 'Timeline', href: '#timeline' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs for GSAP targets
  const topLineRef = useRef(null);
  const midLineRef = useRef(null);
  const botLineRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const linksRef = useRef([]);
  const closeRef = useRef(null);
  const veilRef = useRef(null);
  const radialGlowRef = useRef(null);
  const backdropRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.35;
  }, []);

  // GSAP timeline refs
  const menuTlRef = useRef(null);
  const hamburgerTlRef = useRef(null);
  const glowTlRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Store link refs
  const setLinkRef = useCallback((el, i) => {
    linksRef.current[i] = el;
  }, []);

  useEffect(() => {
    // ── Build the hamburger animation timeline (paused) ──
    const hamburgerTl = gsap.timeline({ paused: true });
    hamburgerTl
      .to(topLineRef.current, {
        rotation: 45,
        y: 8,
        duration: 0.4,
        ease: 'power2.inOut',
      }, 0)
      .to(midLineRef.current, {
        opacity: 0,
        scaleX: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      }, 0)
      .to(botLineRef.current, {
        rotation: -45,
        y: -8,
        duration: 0.4,
        ease: 'power2.inOut',
      }, 0);
    hamburgerTlRef.current = hamburgerTl;

    // ── Static cursed energy glow (optimized) ──
    // Instead of animating heavy box-shadows continuously via JS (which kills performance),
    // we use a static rich glow on the panel.

    // Mock the glowTlRef so the rest of the code doesn't break
    glowTlRef.current = {
      play: () => { },
      pause: () => { },
      kill: () => { },
    };

    // Cleanup
    return () => {
      hamburgerTl.kill();
      gsap.killTweensOf(panelRef.current);
    };
  }, []);

  // ── Menu link hover animations ──
  useEffect(() => {
    const tweens = [];
    linksRef.current.forEach((link) => {
      if (!link) return;
      const underline = link.querySelector('.link-underline');

      const onEnter = () => {
        gsap.to(link, {
          color: '#ff3300',
          letterSpacing: '0.08em',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        if (underline) {
          gsap.to(underline, {
            scaleX: 1,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: true,
          });
        }
      };

      const onLeave = () => {
        gsap.to(link, {
          color: '#ffffff',
          letterSpacing: '0.02em',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        if (underline) {
          gsap.to(underline, {
            scaleX: 0,
            duration: 0.3,
            ease: 'power2.in',
            overwrite: true,
          });
        }
      };

      link.addEventListener('mouseenter', onEnter);
      link.addEventListener('mouseleave', onLeave);

      tweens.push({ link, onEnter, onLeave });
    });

    return () => {
      tweens.forEach(({ link, onEnter, onLeave }) => {
        link.removeEventListener('mouseenter', onEnter);
        link.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  // ── Open Menu ──
  const openMenu = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // Make overlay visible first
    overlayRef.current.style.visibility = 'visible';
    overlayRef.current.style.opacity = '1';
    overlayRef.current.style.pointerEvents = 'all';

    // Reset initial states before animating in
    gsap.set(linksRef.current, { y: 40, opacity: 0 });
    gsap.set(closeRef.current, { opacity: 0, rotation: 90 });
    gsap.set(panelRef.current, { scale: 0.92, opacity: 0 });
    gsap.set(backdropRef.current, { opacity: 0 });
    gsap.set(radialGlowRef.current, { opacity: 0 });
    gsap.set(veilRef.current, { opacity: 0 });

    // Play hamburger animation
    hamburgerTlRef.current.play();

    // Build open timeline
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    // Dark veil
    tl.to(veilRef.current, {
      opacity: 0.6,
      duration: 0.5,
      ease: 'power2.out',
    }, 0);

    // Backdrop fade
    tl.to(backdropRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, 0);

    // Radial glow
    tl.to(radialGlowRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.1);

    // Panel entrance
    tl.to(panelRef.current, {
      scale: 1,
      opacity: 0.55,
      duration: 0.5,
      ease: 'power3.out',
    }, 0.05);

    // Stagger links in
    tl.to(linksRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
    }, 0.15);

    // Close button entrance
    tl.to(closeRef.current, {
      opacity: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.4);

    // Start pulsing glow
    glowTlRef.current.play();

    menuTlRef.current = tl;
  };

  // ── Close Menu ──
  const closeMenu = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const closeTl = gsap.timeline({
      onComplete: () => {
        overlayRef.current.style.visibility = 'hidden';
        overlayRef.current.style.pointerEvents = 'none';
        glowTlRef.current.pause();
        isAnimatingRef.current = false;

        // Reset all link underlines and colors so nothing is stuck
        linksRef.current.forEach((link) => {
          if (!link) return;
          gsap.set(link, { color: '#ffffff', letterSpacing: '0.02em' });
          const ul = link.querySelector('.link-underline');
          if (ul) gsap.set(ul, { scaleX: 0 });
        });
      },
    });

    // Close button out
    closeTl.to(closeRef.current, {
      opacity: 0,
      rotation: 90,
      duration: 0.25,
      ease: 'power2.in',
    }, 0);

    // Links stagger out
    closeTl.to([...linksRef.current].reverse(), {
      y: -30,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
    }, 0);

    // Panel out
    closeTl.to(panelRef.current, {
      scale: 0.92,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.in',
    }, 0.15);

    // Radial glow out
    closeTl.to(radialGlowRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 0.15);

    // Backdrop out
    closeTl.to(backdropRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    }, 0.2);

    // Veil out
    closeTl.to(veilRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, 0.15);

    hamburgerTlRef.current.reverse();
  };

  // ── Toggle handler ──
  const toggleMenu = () => {
    if (!isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
    setIsOpen(prev => !prev);
  };

  // Close button handler inside overlay
  const handleCloseClick = () => {
    closeMenu();
    setIsOpen(false);
  };

  // ── Audio toggle handler ──
  const handleAudioToggle = async () => {
    try {
      const audio = audioRef.current;
      if (!audio) return;

      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Audio playback error', err);
    }
  };

  return (
    <>
      {/* ═══ NAVBAR ═══ */}
      <nav
        id="sukuna-navbar"
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between"
        style={{
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(255,40,0,0.15)',
          padding: '8px 48px',
        }}
      >
        {/* Logo */}
        <a href="#" className="flex items-center z-110">
          <img
            src={logo}
            alt="Sukuna Logo"
            className="h-14 w-auto object-contain"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255,34,0,0.4))',
            }}
          />
        </a>

        {/* Right controls: Audio toggle + Hamburger */}
        <div className="flex items-center gap-3 z-110">
          {/* Persistent audio element (prevents pauses during section swaps) */}
          <audio ref={audioRef} src={bgMusic} loop preload="auto" />

          {/* Premium audio button */}
          <button
            type="button"
            onClick={handleAudioToggle}
            aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
            className="group relative flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(12,6,6,0.85)]/90 shadow-[0_0_20px_rgba(255,34,0,0.25)] outline-none cursor-pointer overflow-hidden"
            style={{
              backdropFilter: 'blur(10px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(10px) saturate(1.4)',
            }}
          >
            <span
              className="absolute inset-0 opacity-60 group-hover:opacity-90 transition-opacity duration-300"
              style={{
                background:
                  'conic-gradient(from 210deg, rgba(255,60,0,0.7), rgba(255,255,255,0.1), rgba(255,40,0,0.9), rgba(80,10,0,0.9))',
                mixBlendMode: 'screen',
              }}
            />
            <span className="absolute inset-[2px] rounded-full bg-[rgba(4,0,0,0.9)]" />

            {/* Icon */}
            <span className="relative flex items-center justify-center text-xs text-white">
              {isPlaying ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="drop-shadow-[0_0_8px_rgba(255,80,40,0.7)]"
                >
                  <path
                    d="M6.5 5.25C5.67 5.25 5 5.92 5 6.75v10.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V6.75c0-.83-.67-1.5-1.5-1.5Zm11 0c-.83 0-1.5.67-1.5 1.5v10.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V6.75c0-.83-.67-1.5-1.5-1.5Z"
                    fill="#ffffff"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="drop-shadow-[0_0_8px_rgba(255,80,40,0.7)]"
                >
                  <path
                    d="M5 9.75c0-.69.56-1.25 1.25-1.25h1.086a1.5 1.5 0 0 0 1.06-.44L10.94 5.46A1.5 1.5 0 0 1 12 5h.75A2.25 2.25 0 0 1 15 7.25v9.5A2.25 2.25 0 0 1 12.75 19H12a1.5 1.5 0 0 1-1.06-.44l-2.544-2.54a1.5 1.5 0 0 0-1.06-.44H6.25A1.25 1.25 0 0 1 5 14.25v-4.5Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M17.5 8.5c.94.94 1.5 2.23 1.5 3.5s-.56 2.56-1.5 3.5"
                    stroke="#ff5522"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19.5 6.5c1.6 1.6 2.5 3.73 2.5 5.5s-.9 3.9-2.5 5.5"
                    stroke="#ff9970"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>

            {/* Subtle pulse ring when playing */}
            <span
              className={`absolute inset-0 rounded-full border border-[rgba(255,120,60,0.0)] ${isPlaying ? 'animate-ping-slow border-[rgba(255,80,40,0.55)]' : ''
                }`}
            />
          </button>

          {/* YouTube button (tooltip on hover) */}
          <a
            href="https://youtu.be/48vj_nwUtss?si=V3rYbAWn-8gMYFgS"
            target="_blank"
            rel="noreferrer"
            aria-label="Watch full fight on YouTube"
            className="group relative flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(12,6,6,0.85)]/90 shadow-[0_0_22px_rgba(255,34,0,0.22)] outline-none cursor-pointer overflow-hidden"
            style={{
              backdropFilter: 'blur(10px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(10px) saturate(1.4)',
            }}
          >
            <span
              className="absolute inset-0 opacity-60 group-hover:opacity-90 transition-opacity duration-300"
              style={{
                background:
                  'conic-gradient(from 220deg, rgba(255,30,0,0.85), rgba(255,255,255,0.08), rgba(255,30,0,0.9), rgba(60,0,0,0.95))',
                mixBlendMode: 'screen',
              }}
            />
            <span className="absolute inset-[2px] rounded-full bg-[rgba(4,0,0,0.9)]" />

            {/* YT icon */}
            <span className="relative">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M21.6 7.2a3 3 0 0 0-2.12-2.12C17.76 4.5 12 4.5 12 4.5s-5.76 0-7.48.58A3 3 0 0 0 2.4 7.2 31.6 31.6 0 0 0 2 12a31.6 31.6 0 0 0 .4 4.8 3 3 0 0 0 2.12 2.12c1.72.58 7.48.58 7.48.58s5.76 0 7.48-.58a3 3 0 0 0 2.12-2.12A31.6 31.6 0 0 0 22 12a31.6 31.6 0 0 0-.4-4.8Z"
                  fill="rgba(255,30,0,0.95)"
                />
                <path d="M10 15.5v-7l6 3.5-6 3.5Z" fill="#fff" />
              </svg>
            </span>

            {/* Tooltip */}
            <span
              className="pointer-events-none absolute top-full mt-2 px-3 py-1 rounded-full border border-[rgba(255,120,70,0.35)] bg-[rgba(0,0,0,0.88)] text-[9px] tracking-[0.32em] uppercase text-[rgba(255,240,235,0.92)] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 whitespace-nowrap"
              style={{
                boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 18px rgba(255,60,20,0.22)',
              }}
            >
              Watch full fight
            </span>
          </a>

          {/* Hamburger Button */}
          <button
            id="hamburger-btn"
            className="hamburger-btn relative flex flex-col items-center justify-center gap-[6px] w-12 h-12 bg-transparent border-none cursor-pointer outline-none"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span ref={topLineRef} className="hamburger-line" />
            <span ref={midLineRef} className="hamburger-line" />
            <span ref={botLineRef} className="hamburger-line" />
          </button>
        </div>
      </nav>

      {/* ═══ DARK VEIL ═══ */}
      <div ref={veilRef} className="dark-veil" />

      {/* ═══ MENU OVERLAY ═══ */}
      <div ref={overlayRef} className="menu-overlay">
        {/* Backdrop */}
        <div ref={backdropRef} className="menu-backdrop" onClick={handleCloseClick} />

        {/* Radial Glow */}
        <div
          ref={radialGlowRef}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: '800px',
            height: '800px',
            background:
              'radial-gradient(circle, rgba(255,34,0,0.12) 0%, rgba(200,20,0,0.05) 40%, transparent 70%)',
          }}
        />

        {/* Panel */}
        <div ref={panelRef} className="menu-panel">
          {/* Close Button */}
          <button
            ref={closeRef}
            className="close-button"
            onClick={handleCloseClick}
            aria-label="Close navigation menu"
          >
            ✕
          </button>

          {/* Menu Links */}
          <div className="flex flex-col items-center gap-1 w-full">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className="menu-link"
                ref={el => setLinkRef(el, i)}
                onClick={handleCloseClick}
                style={{ whiteSpace: 'nowrap' }}
              >
                {link.label}
                <span
                  className="link-underline"
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '16px',
                    right: '16px',
                    height: '2px',
                    backgroundColor: '#ff3300',
                    borderRadius: '2px',
                    transformOrigin: 'left center',
                    transform: 'scaleX(0)',
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
