import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import logo from '../assets/logo.jpg';

const NAV_LINKS = [
  { label: 'Character', href: '#character' },
  { label: 'Timeline', href: '#timeline' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
      play: () => {},
      pause: () => {},
      kill: () => {},
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
        <a href="#" className="flex items-center z-[110]">
          <img
            src={logo}
            alt="Sukuna Logo"
            className="h-14 w-auto object-contain"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255,34,0,0.4))',
            }}
          />
        </a>

        {/* Hamburger Button */}
        <button
          id="hamburger-btn"
          className="hamburger-btn relative z-[110] flex flex-col items-center justify-center gap-[6px] w-12 h-12 bg-transparent border-none cursor-pointer outline-none"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span ref={topLineRef} className="hamburger-line" />
          <span ref={midLineRef} className="hamburger-line" />
          <span ref={botLineRef} className="hamburger-line" />
        </button>
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
