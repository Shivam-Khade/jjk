import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    
    // Initial setup hidden outside view
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -100, y: -100, opacity: 0 });

    // QuickSetter for smooth, bouncy performance
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    // Spring interpolation values
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    let speed = 0.18; // Bounce speed

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Reveal the cursor on first movement
      if (cursor.style.opacity === "0") {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // Animation ticker loop for spring physics
    gsap.ticker.add(() => {
      // Interpolate position
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
      
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      
      setX(pos.x);
      setY(pos.y);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove();
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

        /* Hide the global cursor when hovering over the character hero section */
        body:has(#character:hover) .global-custom-cursor {
          opacity: 0 !important;
          transform: scale(0);
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
