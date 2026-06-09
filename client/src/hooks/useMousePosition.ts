import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  elementX: number;
  elementY: number;
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0, normalizedX: 0, normalizedY: 0, elementX: 0, elementY: 0 });
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      let ex = 0, ey = 0;
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        ex = (e.clientX - rect.left) / rect.width;
        ey = (e.clientY - rect.top) / rect.height;
      }
      setPosition({ x: e.clientX, y: e.clientY, normalizedX: nx, normalizedY: ny, elementX: ex, elementY: ey });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const setElement = useCallback((el: HTMLElement | null) => { elementRef.current = el; }, []);

  return { ...position, setElement };
}
