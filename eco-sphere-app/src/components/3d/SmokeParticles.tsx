import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D } from 'three';

interface SmokeParticlesProps {
  position: [number, number, number];
  count?: number;
}

export const SmokeParticles: React.FC<SmokeParticlesProps> = ({ position, count = 12 }) => {
  const meshRef = useRef<InstancedMesh>(null);

  // Generate random velocities and starting offsets for particles
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        y: Math.random() * 2, // starting height spread
        xOffset: (Math.random() - 0.5) * 0.1,
        zOffset: (Math.random() - 0.5) * 0.1,
        speed: 0.8 + Math.random() * 0.6,
        wobbleSpeed: 2 + Math.random() * 4,
        scale: 0.15 + Math.random() * 0.15,
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      // Float up
      particle.y += delta * particle.speed;
      
      // Reset particle if it drifts too high
      if (particle.y > 3.0) {
        particle.y = 0;
      }

      // Wobble sideways
      const currentX = position[0] + particle.xOffset + Math.sin(time * particle.wobbleSpeed + i) * 0.15;
      const currentZ = position[2] + particle.zOffset + Math.cos(time * particle.wobbleSpeed + i) * 0.15;
      const currentY = position[1] + particle.y;

      // Scale down / fade as it rises
      const lifePct = particle.y / 3.0; // 0 to 1
      const size = particle.scale * (1.0 - lifePct * 0.7);

      dummy.position.set(currentX, currentY, currentZ);
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]} castShadow>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial 
        color={0x333333} 
        roughness={0.9} 
        transparent 
        opacity={0.6}
      />
    </instancedMesh>
  );
};
