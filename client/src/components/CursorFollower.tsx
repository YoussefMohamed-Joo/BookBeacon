import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CursorFollower() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const springConfig = { damping: 30, stiffness: 250, mass: 0.4 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const scale = useSpring(1, { damping: 25, stiffness: 350 });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const updatePosition = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', updatePosition, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, select, textarea').forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, [x, y]);

  useEffect(() => {
    scale.set(isHovering ? 2.5 : 1);
  }, [isHovering, scale]);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x, y, scale }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: useSpring(x, { damping: 40, stiffness: 150, mass: 0.8 }),
          y: useSpring(y, { damping: 40, stiffness: 150, mass: 0.8 }),
          scale: useSpring(isHovering ? 1.8 : 1, { damping: 30, stiffness: 300 }),
        }}
        animate={{ opacity: isVisible ? 0.4 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-400/50 bg-primary-400/5 backdrop-blur-[2px]" />
      </motion.div>
    </>
  );
}
