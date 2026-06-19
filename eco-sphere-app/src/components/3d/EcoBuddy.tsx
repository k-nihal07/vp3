import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Color, MathUtils } from 'three';
import { useCarbonStore } from '../../stores/useCarbonStore';

export const EcoBuddy: React.FC = () => {
  const mainGroup = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const torsoRef = useRef<Mesh>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  
  const healthIndex = useCarbonStore((state) => state.healthIndex);
  const companionState = useCarbonStore((state) => state.companionState);

  useFrame((state, delta) => {
    if (!mainGroup.current) return;
    const time = state.clock.getElapsedTime();

    // Reset base positions
    mainGroup.current.position.x = 0;
    
    // Animation states based on health and companion emotional loops
    if (companionState === 'coughing') {
      // Coughing: torso contracts, head jerks forward
      mainGroup.current.position.y = 1.05 + Math.sin(time * 30) * 0.03;
      mainGroup.current.position.x = Math.sin(time * 40) * 0.04;
      mainGroup.current.scale.set(1.0, 1.0 - Math.abs(Math.sin(time * 20)) * 0.08, 1.0);
      
      if (headRef.current) {
        headRef.current.rotation.x = 0.35 + Math.sin(time * 30) * 0.15; // Jerking motion
      }
      if (leftArmRef.current) leftArmRef.current.rotation.z = MathUtils.lerp(leftArmRef.current.rotation.z, -0.2, delta * 5);
      if (rightArmRef.current) rightArmRef.current.rotation.z = MathUtils.lerp(rightArmRef.current.rotation.z, 0.2, delta * 5);

    } else if (companionState === 'happy') {
      // Happy: Bouncing, swinging arms
      mainGroup.current.position.y = 1.05 + Math.abs(Math.sin(time * 4)) * 0.35;
      mainGroup.current.rotation.y = Math.sin(time * 3) * 0.15;
      mainGroup.current.scale.set(1.0, 1.0 + Math.sin(time * 8) * 0.04, 1.0);

      if (headRef.current) {
        headRef.current.rotation.x = -0.05 + Math.sin(time * 4) * 0.05;
        headRef.current.rotation.y = Math.sin(time * 4) * 0.1;
      }
      // Swing arms happily
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(time * 8) * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(time * 8) * 0.5;

    } else if (companionState === 'sad') {
      // Sad: head drooped, slumped posture, breathing slowly
      mainGroup.current.position.y = 0.95 + Math.sin(time * 1.5) * 0.01;
      mainGroup.current.scale.set(0.95, 0.92, 0.95);

      if (headRef.current) {
        headRef.current.rotation.x = MathUtils.lerp(headRef.current.rotation.x, 0.35, delta * 3); // Droop head
        headRef.current.rotation.y = 0;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = MathUtils.lerp(leftArmRef.current.rotation.x, 0.1, delta * 3);
        leftArmRef.current.rotation.z = MathUtils.lerp(leftArmRef.current.rotation.z, -0.05, delta * 3);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = MathUtils.lerp(rightArmRef.current.rotation.x, 0.1, delta * 3);
        rightArmRef.current.rotation.z = MathUtils.lerp(rightArmRef.current.rotation.z, 0.05, delta * 3);
      }

    } else {
      // Default Professional Idle: Slow breathing
      mainGroup.current.position.y = 1.05 + Math.sin(time * 1.8) * 0.015;
      mainGroup.current.rotation.y = MathUtils.lerp(mainGroup.current.rotation.y, 0, delta * 2);
      mainGroup.current.scale.set(1.0, 1.0 + Math.sin(time * 1.8) * 0.012, 1.0);

      if (headRef.current) {
        headRef.current.rotation.x = MathUtils.lerp(headRef.current.rotation.x, 0, delta * 2);
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.05; // Slow ambient glance
      }
      // Relax arms by side
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(time * 1.8) * 0.03;
        leftArmRef.current.rotation.z = MathUtils.lerp(leftArmRef.current.rotation.z, -0.08, delta * 2);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.sin(time * 1.8) * 0.03;
        rightArmRef.current.rotation.z = MathUtils.lerp(rightArmRef.current.rotation.z, 0.08, delta * 2);
      }
    }
  });

  // Suit fabric base color maps to health index: slate/blue when healthy -> dark soot gray when polluted
  const suitColor = new Color().lerpColors(
    new Color(0x374151), // Slub soot gray
    new Color(0x1e293b), // Sleek professional navy-slate suit
    healthIndex
  );

  // Skin tone color maps to health (cyan/sick -> flesh tone)
  const skinColor = new Color().lerpColors(
    new Color(0x71717a), // Sick gray
    new Color(0xffdbac), // Realistic human skin tone
    healthIndex
  );

  return (
    <group ref={mainGroup} position={[0, 1.05, 0]}>
      {/* 1. Torso: Suit Jacket (Proportional Cylinder/Capsule) */}
      <mesh ref={torsoRef} castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 0.7, 16]} />
        <meshStandardMaterial color={suitColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Tie detail */}
      <mesh position={[0, 0.2, 0.11]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.04, 0.28, 0.015]} />
        <meshStandardMaterial color={0x991b1b} roughness={0.4} /> {/* Crimson red tie */}
      </mesh>

      {/* Shirt collar (White) */}
      <mesh position={[0, 0.35, 0.05]}>
        <cylinderGeometry args={[0.09, 0.1, 0.04, 12]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>

      {/* 2. Head Group */}
      <group ref={headRef} position={[0, 0.52, 0]}>
        {/* Face */}
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        
        {/* Eyes (Realistic beads) */}
        <mesh position={[-0.07, 0.03, 0.14]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={0x111827} roughness={0.2} />
        </mesh>
        <mesh position={[0.07, 0.03, 0.14]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={0x111827} roughness={0.2} />
        </mesh>

        {/* Hair Mesh (Brown side-part style) */}
        <group position={[0, 0.08, -0.02]}>
          <mesh castShadow>
            <sphereGeometry args={[0.19, 12, 12]} />
            <meshStandardMaterial color={0x3f2a14} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.1, 0.08]} scale={[0.9, 0.4, 0.6]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial color={0x3f2a14} />
          </mesh>
        </group>
      </group>

      {/* 3. Arms */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.27, 0.28, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.55, 8]} />
          <meshStandardMaterial color={suitColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.27, 0.28, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.55, 8]} />
          <meshStandardMaterial color={suitColor} roughness={0.7} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* 4. Legs */}
      {/* Left Leg (Trousers) */}
      <group position={[-0.11, -0.65, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.6, 12]} />
          <meshStandardMaterial color={suitColor} roughness={0.7} />
        </mesh>
        {/* Left Leather Shoe */}
        <mesh position={[0, -0.34, 0.06]} castShadow>
          <boxGeometry args={[0.09, 0.08, 0.18]} />
          <meshStandardMaterial color={0x1e1b18} roughness={0.4} metalness={0.3} />
        </mesh>
      </group>

      {/* Right Leg (Trousers) */}
      <group position={[0.11, -0.65, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.6, 12]} />
          <meshStandardMaterial color={suitColor} roughness={0.7} />
        </mesh>
        {/* Right Leather Shoe */}
        <mesh position={[0, -0.34, 0.06]} castShadow>
          <boxGeometry args={[0.09, 0.08, 0.18]} />
          <meshStandardMaterial color={0x1e1b18} roughness={0.4} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
