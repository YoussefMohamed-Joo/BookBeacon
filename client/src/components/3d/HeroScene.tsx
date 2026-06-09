import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, PerspectiveCamera, Stars } from '@react-three/drei';
import FloatingBook from './FloatingBook';

const books = [
  { position: [-2.8, -0.3, -1] as [number, number, number], rotation: [0.15, 0.4, 0.08] as [number, number, number], color: '#4F46E5', scale: 1.3, speed: 0.7 },
  { position: [3, 0.6, -2] as [number, number, number], rotation: [-0.08, -0.35, 0.15] as [number, number, number], color: '#7C3AED', scale: 0.95, speed: 1.0 },
  { position: [-3.5, 1.4, -3.5] as [number, number, number], rotation: [0.25, -0.25, -0.08] as [number, number, number], color: '#2563EB', scale: 0.75, speed: 0.5 },
  { position: [3.8, -0.4, -3] as [number, number, number], rotation: [-0.15, 0.5, 0.04] as [number, number, number], color: '#06B6D4', scale: 0.65, speed: 1.2 },
  { position: [0, -1.4, -3.2] as [number, number, number], rotation: [0.08, 0.7, -0.04] as [number, number, number], color: '#8B5CF6', scale: 0.85, speed: 0.8 },
  { position: [1.2, 1.8, -4] as [number, number, number], rotation: [-0.2, 0.3, 0.1] as [number, number, number], color: '#0EA5E9', scale: 0.55, speed: 1.1 },
];

function SceneContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={42} />

      {/* Ambient + directional lights */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 6, 6]} intensity={0.9} />
      <directionalLight position={[-6, -3, -6]} intensity={0.35} color="#818cf8" />
      <pointLight position={[0, 4, 0]} intensity={0.6} color="#6366f1" />

      {/* Subtle stars background */}
      <Stars radius={30} depth={40} count={80} factor={3} saturation={0} fade speed={0.5} />

      {/* Books */}
      {books.map((book, i) => (
        <FloatingBook key={i} {...book} />
      ))}

      {/* Ground shadow */}
      <ContactShadows position={[0, -2.2, 0]} opacity={0.35} scale={12} blur={2.5} far={5} />

      {/* Environment preset for reflections */}
      <Environment preset="city" />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 7], fov: 42 }}>
        <Suspense fallback={<LoadingFallback />}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
