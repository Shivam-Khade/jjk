import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    
    // Initial setup hidden outside view
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -100, y: -100, opacity: 0 });

    // QuickSetter for ultra‑low‑latency movement
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    let inHero = false;

    const onMouseMove = (e) => {
      setX(e.clientX);
      setY(e.clientY);
      
      // Reveal the cursor on first movement
      if (!inHero && cursor.style.opacity === "0") {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
      }
    };

    const hero = document.getElementById('character');
    const onHeroEnter = () => {
      inHero = true;
      gsap.to(cursor, { opacity: 0, scale: 0, duration: 0.2, overwrite: 'auto' });
    };
    const onHeroLeave = () => {
      inHero = false;
      gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.25, overwrite: 'auto' });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    hero?.addEventListener('mouseenter', onHeroEnter);
    hero?.addEventListener('mouseleave', onHeroLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      hero?.removeEventListener('mouseenter', onHeroEnter);
      hero?.removeEventListener('mouseleave', onHeroLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        /* Hide default cursor site-wide */
        body, * {
          cursor: none !important;
        }

        /* Enforce custom cursor hiding when hovering elements that need it */
        .global-custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(200, 20, 20, 0.5);
          pointer-events: none;
          z-index: 99999;
          mix-blend-mode: difference;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* Interactive scaling on links/buttons */
        a:hover ~ .global-custom-cursor,
        button:hover ~ .global-custom-cursor {
          transform: scale(2.5);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 20, 20, 0.8);
          mix-blend-mode: normal;
        }
      `}</style>
      <div ref={cursorRef} className="global-custom-cursor" />
    </>
  );
}
