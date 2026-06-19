import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { useCarbonStore } from '../../stores/useCarbonStore';

// Individual Animated Bird component
const SingleBird: React.FC<{ index: number }> = ({ index }) => {
  const birdRef = useRef<Group>(null);
  const leftWingRef = useRef<Mesh>(null);
  const rightWingRef = useRef<Mesh>(null);

  // Random flight radius and speed
  const flightRadius = useMemo(() => 2.0 + Math.random() * 0.8, []);
  const flightSpeed = useMemo(() => 0.6 + Math.random() * 0.4, []);
  const flightHeight = useMemo(() => 2.2 + Math.random() * 0.5, []);
  const startAngle = useMemo(() => index * 2.3, [index]);

  useFrame((state) => {
    if (!birdRef.current) return;
    const time = state.clock.getElapsedTime();

    // Circle flight path
    const angle = startAngle + time * flightSpeed;
    const x = Math.cos(angle) * flightRadius;
    const z = Math.sin(angle) * flightRadius;

    birdRef.current.position.set(x, flightHeight, z);
    
    // Face the direction of flight (tangent angle + offset)
    birdRef.current.rotation.y = -angle + Math.PI / 2;

    // Wing flapping
    const flap = Math.sin(time * 15) * 0.4;
    if (leftWingRef.current) leftWingRef.current.rotation.z = flap;
    if (rightWingRef.current) rightWingRef.current.rotation.z = -flap;
  });

  return (
    <group ref={birdRef}>
      {/* Bird Body */}
      <mesh castShadow>
        <coneGeometry args={[0.07, 0.25, 4]} />
        <meshStandardMaterial color={0xffffff} roughness={0.3} />
      </mesh>
      
      {/* Left Wing */}
      <mesh ref={leftWingRef} position={[-0.1, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <meshStandardMaterial color={0xdddddd} />
      </mesh>
      
      {/* Right Wing */}
      <mesh ref={rightWingRef} position={[0.1, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <meshStandardMaterial color={0xdddddd} />
      </mesh>
    </group>
  );
};

// Individual Animated Butterfly component
const SingleButterfly: React.FC<{ index: number }> = ({ index }) => {
  const bfRef = useRef<Group>(null);
  const leftWing = useRef<Mesh>(null);
  const rightWing = useRef<Mesh>(null);

  // Position offset
  const angleOffset = useMemo(() => index * 1.5, [index]);
  const hoverSpeed = useMemo(() => 1.2 + Math.random() * 0.8, []);

  useFrame((state) => {
    if (!bfRef.current) return;
    const time = state.clock.getElapsedTime();

    // Small fluttery path around trees
    const x = Math.sin(time * hoverSpeed + angleOffset) * 1.2;
    const y = 1.2 + Math.sin(time * 4) * 0.15;
    const z = Math.cos(time * hoverSpeed + angleOffset) * 1.2;

    bfRef.current.position.set(x, y, z);
    bfRef.current.rotation.y = time * 2;

    // Fast fluttering wings
    const wingFlap = Math.sin(time * 35) * 0.6;
    if (leftWing.current) leftWing.current.rotation.y = wingFlap;
    if (rightWing.current) rightWing.current.rotation.y = -wingFlap;
  });

  return (
    <group ref={bfRef}>
      {/* Tiny Body */}
      <mesh>
        <boxGeometry args={[0.02, 0.08, 0.02]} />
        <meshStandardMaterial color={0x000000} />
      </mesh>
      {/* Left Wing (Pink/Purple) */}
      <mesh ref={leftWing} position={[-0.05, 0, 0]}>
        <boxGeometry args={[0.06, 0.06, 0.005]} />
        <meshStandardMaterial color={0xec4899} roughness={0.1} />
      </mesh>
      {/* Right Wing */}
      <mesh ref={rightWing} position={[0.05, 0, 0]}>
        <boxGeometry args={[0.06, 0.06, 0.005]} />
        <meshStandardMaterial color={0xec4899} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Individual Animated Sheep component
const SingleSheep: React.FC<{ index: number }> = ({ index }) => {
  const sheepRef = useRef<Group>(null);

  // Random grazing points on the grassy island surface
  const x = useMemo(() => (Math.random() - 0.5) * 1.8, []);
  const z = useMemo(() => (Math.random() - 0.5) * 1.8, []);
  const idleSpin = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!sheepRef.current) return;
    const time = state.clock.getElapsedTime();
    // Minor head bobbing to simulate grazing
    const bob = Math.sin(time * 3 + index) * 0.02;
    sheepRef.current.position.y = 0.5 + bob;
  });

  return (
    <group ref={sheepRef} position={[x, 0.5, z]} rotation={[0, idleSpin, 0]}>
      {/* Wool Body */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.25, 0.4]} />
        <meshStandardMaterial color={0xffffff} roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.12, 0.22]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color={0xfbcfe8} roughness={0.5} />
      </mesh>
      {/* Left Front Leg */}
      <mesh position={[-0.1, -0.18, 0.12]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 6]} />
        <meshStandardMaterial color={0x222222} />
      </mesh>
      {/* Right Front Leg */}
      <mesh position={[0.1, -0.18, 0.12]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 6]} />
        <meshStandardMaterial color={0x222222} />
      </mesh>
      {/* Left Back Leg */}
      <mesh position={[-0.1, -0.18, -0.12]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 6]} />
        <meshStandardMaterial color={0x222222} />
      </mesh>
      {/* Right Back Leg */}
      <mesh position={[0.1, -0.18, -0.12]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 6]} />
        <meshStandardMaterial color={0x222222} />
      </mesh>
    </group>
  );
};

export const Creatures3D: React.FC = () => {
  const creatures = useCarbonStore((state) => state.creatures);

  const birdArray = useMemo(() => Array.from({ length: creatures.birds }), [creatures.birds]);
  const butterflyArray = useMemo(() => Array.from({ length: creatures.butterflies }), [creatures.butterflies]);
  const sheepArray = useMemo(() => Array.from({ length: creatures.sheep }), [creatures.sheep]);

  return (
    <group>
      {birdArray.map((_, i) => (
        <SingleBird key={`bird-${i}`} index={i} />
      ))}
      {butterflyArray.map((_, i) => (
        <SingleButterfly key={`bf-${i}`} index={i} />
      ))}
      {sheepArray.map((_, i) => (
        <SingleSheep key={`sheep-${i}`} index={i} />
      ))}
    </group>
  );
};
