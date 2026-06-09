import { useRef, useEffect } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

// Renders a Lottie animation from a JSON file or URL
interface AnimatedIconProps {
  src: string | object;       // Path to JSON file or inline object
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  size?: number;
}

export default function AnimatedIcon({
  src,
  className = '',
  loop = true,
  autoplay = true,
  speed = 1,
  size = 48,
}: AnimatedIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay,
      animationData: typeof src === 'object' ? src : undefined,
      path: typeof src === 'string' ? src : undefined,
    });
    anim.setSpeed(speed);
    animRef.current = anim;
    return () => anim.destroy();
  }, [src, loop, autoplay, speed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
