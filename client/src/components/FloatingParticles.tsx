import { useEffect, useRef } from 'react';

const emojis = ['📚', '📖', '⭐', '✨', '📕', '📗', '📘', '📙', '🌟', '💫'];
const colors = ['#4A6F5D', '#5B8A73', '#E07A5F', '#D4A76A', '#8BA989', '#B8A99A'];

interface Particle {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export default function FloatingParticles({ count = 15 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: Particle[] = [];

    const createParticle = (): Particle => {
      const el = document.createElement('div');
      const isBook = Math.random() > 0.4;
      if (isBook) {
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.fontSize = `${18 + Math.random() * 16}px`;
      } else {
        el.style.width = `${6 + Math.random() * 8}px`;
        el.style.height = el.style.width;
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '4px';
        el.style.opacity = `${0.2 + Math.random() * 0.3}`;
      }
      el.style.position = 'absolute';
      el.style.pointerEvents = 'none';
      el.style.transition = 'none';
      el.style.willChange = 'transform';
      container.appendChild(el);

      return {
        el,
        x: Math.random() * container.offsetWidth,
        y: Math.random() * container.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.2 + Math.random() * 0.4),
        size: 0,
        opacity: 0.2 + Math.random() * 0.4,
      };
    };

    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    let animationId: number;

    const animate = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -50) {
          p.y = container.offsetHeight + 20;
          p.x = Math.random() * container.offsetWidth;
        }
        if (p.x < -50) p.x = container.offsetWidth + 20;
        if (p.x > container.offsetWidth + 50) p.x = -20;

        p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.x * 0.05}deg)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => { cancelAnimationFrame(animationId); particles.forEach(p => p.el.remove()); };
  }, [count]);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0" />;
}
