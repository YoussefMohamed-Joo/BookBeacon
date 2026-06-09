import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useMousePosition } from '../../hooks/useMousePosition';

interface FloatingBookProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  scale?: number;
  speed?: number;
}

const bookColors = ['#4F46E5', '#7C3AED', '#2563EB', '#06B6D4', '#8B5CF6', '#0EA5E9', '#6366F1'];

export default function FloatingBook({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = '#4F46E5',
  scale = 1,
  speed = 1,
}: FloatingBookProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bookRef = useRef<THREE.Mesh>(null);
  const { normalizedX, normalizedY } = useMousePosition();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime() * speed;
      groupRef.current.rotation.x = rotation[0] + Math.sin(time * 0.5) * 0.08 + normalizedY * 0.04;
      groupRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3) * 0.08 + normalizedX * 0.04;
      groupRef.current.rotation.z = rotation[2] + Math.sin(time * 0.4) * 0.03;
    }
  });

  const themeColor = new THREE.Color(color);
  const lighterColor = themeColor.clone().multiplyScalar(1.3);

  return (
    <Float speed={1.2 * speed} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef} position={position}>
        {/* Glow behind book */}
        <mesh position={[0, 0, -0.15]}>
          <planeGeometry args={[1.8, 2.2]} />
          <meshBasicMaterial color={color} opacity={0.08} transparent />
        </mesh>

        <group
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          scale={hovered ? scale * 1.12 : scale}
        >
          {/* Book body - using RoundedBox for premium look */}
          <RoundedBox args={[1.2, 1.6, 0.15]} radius={0.04} smoothness={4}>
            <meshPhysicalMaterial
              color={color}
              metalness={0.15}
              roughness={0.25}
              clearcoat={0.3}
              clearcoatRoughness={0.3}
              envMapIntensity={0.6}
            />
          </RoundedBox>

          {/* Pages (side) */}
          <mesh position={[0, 0, 0.085]}>
            <planeGeometry args={[1.08, 1.48]} />
            <meshPhysicalMaterial color="#fafafa" metalness={0.05} roughness={0.6} transparent opacity={0.92} />
          </mesh>

          {/* Cover decorative band */}
          <mesh position={[0, 0.35, 0.095]}>
            <planeGeometry args={[0.9, 0.025]} />
            <meshBasicMaterial color={lighterColor} opacity={0.5} transparent />
          </mesh>

          {/* Decorative dot */}
          <mesh position={[0, -0.15, 0.095]}>
            <planeGeometry args={[0.35, 0.35]} />
            <meshBasicMaterial color={lighterColor} opacity={0.12} transparent />
          </mesh>

          {/* Small accent square */}
          <mesh position={[0.35, 0.25, 0.095]}>
            <planeGeometry args={[0.06, 0.06]} />
            <meshBasicMaterial color={lighterColor} opacity={0.3} transparent />
          </mesh>
        </group>
      </group>
    </Float>
  );
}
