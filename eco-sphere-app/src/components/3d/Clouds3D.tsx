import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

const SingleCloud: React.FC<{ index: number }> = ({ index }) => {
  const cloudRef = useRef<Group>(null);

  // Set random orbit radius, height, speed, and starting angle
  const orbitRadius = useMemo(() => 2.8 + Math.random() * 0.8, []);
  const height = useMemo(() => 1.2 + Math.random() * 1.0, []);
  const orbitSpeed = useMemo(() => 0.05 + Math.random() * 0.05, []);
  const startAngle = useMemo(() => index * 1.8, [index]);
  const scale = useMemo(() => 0.4 + Math.random() * 0.3, []);

  useFrame((state) => {
    if (!cloudRef.current) return;
    const time = state.clock.getElapsedTime();

    // Circle orbit path
    const angle = startAngle + time * orbitSpeed;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;

    cloudRef.current.position.set(x, height, z);
    // Align cloud rotation with path direction
    cloudRef.current.rotation.y = -angle;
  });

  return (
    <group ref={cloudRef} scale={[scale, scale, scale]}>
      {/* Central puff */}
      <mesh castShadow>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color={0xffffff} roughness={0.9} flatShading />
      </mesh>
      {/* Left puff */}
      <mesh position={[-0.3, -0.05, 0]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color={0xf8fafc} roughness={0.9} flatShading />
      </mesh>
      {/* Right puff */}
      <mesh position={[0.3, -0.05, 0]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color={0xf8fafc} roughness={0.9} flatShading />
      </mesh>
      {/* Front puff */}
      <mesh position={[0, -0.08, 0.25]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color={0xf1f5f9} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
};

export const Clouds3D: React.FC = () => {
  const clouds = useMemo(() => Array.from({ length: 5 }), []);

  return (
    <group>
      {clouds.map((_, idx) => (
        <SingleCloud key={`cloud-${idx}`} index={idx} />
      ))}
    </group>
  );
};
