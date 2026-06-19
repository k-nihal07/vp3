import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Color, MathUtils } from 'three';
import { useCarbonStore } from '../../stores/useCarbonStore';
import { EcoBuddy } from './EcoBuddy';
import { Creatures3D } from './Creatures3D';
import { SmokeParticles } from './SmokeParticles';
import { Clouds3D } from './Clouds3D';

// Interactive Windmill with Pulsing Emissive Warning Light and Scale-In Animation
const Windmill: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const groupRef = useRef<Group>(null);
  const rotorRef = useRef<Group>(null);
  const beaconRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current && groupRef.current.scale.x < 1.0) {
      const currentScale = groupRef.current.scale.x;
      const nextScale = Math.min(1.0, MathUtils.lerp(currentScale, 1.0, delta * 3.5));
      groupRef.current.scale.set(nextScale, nextScale, nextScale);
    }

    if (rotorRef.current) {
      rotorRef.current.rotation.z += delta * 2.8;
    }

    if (beaconRef.current) {
      const pulse = (Math.sin(time * 8) + 1.0) * 0.5;
      const mat = beaconRef.current.material as any;
      if (mat) {
        mat.emissiveIntensity = pulse * 2.5;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0.01, 0.01, 0.01]}>
      {/* Sleek structural tower */}
      <mesh castShadow>
        <cylinderGeometry args={[0.025, 0.06, 1.3, 8]} />
        <meshStandardMaterial color={0xf1f5f9} roughness={0.3} metalness={0.25} />
      </mesh>

      {/* Red Warning Light */}
      <mesh ref={beaconRef} position={[0, 0.7, 0.03]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color={0xff0000} emissive={0xff0000} emissiveIntensity={1.0} />
      </mesh>

      {/* Nacelle */}
      <group position={[0, 0.65, 0.04]}>
        <mesh castShadow>
          <boxGeometry args={[0.09, 0.09, 0.16]} />
          <meshStandardMaterial color={0xe2e8f0} roughness={0.4} />
        </mesh>
        
        {/* Rotor Blades */}
        <group ref={rotorRef} position={[0, 0, 0.09]}>
          <mesh castShadow>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color={0xffffff} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.025, 0.7, 0.008]} />
            <meshStandardMaterial color={0xffffff} roughness={0.3} />
          </mesh>
          <mesh position={[-0.3, -0.175, 0]} rotation={[0, 0, Math.PI * 2 / 3]} castShadow>
            <boxGeometry args={[0.025, 0.7, 0.008]} />
            <meshStandardMaterial color={0xffffff} roughness={0.3} />
          </mesh>
          <mesh position={[0.3, -0.175, 0]} rotation={[0, 0, -Math.PI * 2 / 3]} castShadow>
            <boxGeometry args={[0.025, 0.7, 0.008]} />
            <meshStandardMaterial color={0xffffff} roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Realistic Tree with scale growth and natural coloring
const Tree: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && groupRef.current.scale.x < 1.0) {
      const currentScale = groupRef.current.scale.x;
      const nextScale = Math.min(1.0, MathUtils.lerp(currentScale, 1.0, delta * 3));
      groupRef.current.scale.set(nextScale, nextScale, nextScale);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0.01, 0.01, 0.01]}>
      {/* Detailed Trunk (Dark wood bark) */}
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.08, 0.6, 10]} />
        <meshStandardMaterial color={0x3f2a14} roughness={0.95} />
      </mesh>
      
      {/* Realistic Multi-tonal Forest Canopy structure */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshStandardMaterial color={0x064e3b} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.08, 0.52, 0.04]} scale={[0.8, 0.8, 0.8]} castShadow>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color={0x0f5132} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[-0.08, 0.42, -0.04]} scale={[0.85, 0.85, 0.85]} castShadow>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color={0x064e3b} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
};

// Realistic Multi-Structure Factory Refinery with glowing indicator panels and metallic sheets
const Factory: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const groupRef = useRef<Group>(null);
  const chimneyTop: [number, number, number] = [position[0] + 0.18, position[1] + 0.75, position[2]];

  useFrame((state, delta) => {
    if (groupRef.current && groupRef.current.scale.x < 1.0) {
      const currentScale = groupRef.current.scale.x;
      const nextScale = Math.min(1.0, MathUtils.lerp(currentScale, 1.0, delta * 3.5));
      groupRef.current.scale.set(nextScale, nextScale, nextScale);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0.01, 0.01, 0.01]}>
      {/* 1. Main Concrete Processing Hall */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.5, 0.38]} />
        <meshStandardMaterial color={0x94a3b8} roughness={0.65} metalness={0.2} />
      </mesh>

      {/* 2. Cylindrical Silo Container */}
      <group position={[-0.22, -0.05, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.4, 12]} />
          <meshStandardMaterial color={0x64748b} roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Silo Dome cap */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color={0x475569} metalness={0.5} />
        </mesh>
      </group>

      {/* 3. Connecting Pipeline bridge */}
      <mesh position={[-0.11, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
        <meshStandardMaterial color={0x334155} roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* 4. Steel Industrial Chimney */}
      <mesh position={[0.18, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
        <meshStandardMaterial color={0x1e293b} roughness={0.5} metalness={0.8} />
      </mesh>

      {/* 5. Glowing Orange/Yellow Furnace Indicators */}
      <mesh position={[0, 0.05, 0.195]}>
        <boxGeometry args={[0.08, 0.06, 0.01]} />
        <meshStandardMaterial color={0xea580c} emissive={0xea580c} emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[-0.08, -0.1, 0.195]}>
        <boxGeometry args={[0.06, 0.05, 0.01]} />
        <meshStandardMaterial color={0xd97706} emissive={0xd97706} emissiveIntensity={2.0} />
      </mesh>

      {/* Active Chimney Smoke */}
      <SmokeParticles position={chimneyTop} count={12} />
    </group>
  );
};

export const EcoIsland: React.FC = () => {
  const groupRef = useRef<Group>(null);
  
  const healthIndex = useCarbonStore((state) => state.healthIndex);
  const treeCount = useCarbonStore((state) => state.treeCount);
  const factoryCount = useCarbonStore((state) => state.factoryCount);
  const windmillCount = useCarbonStore((state) => state.windmillCount);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  // Natural terrain color shift (polluted barren earth to vibrant rich landscape green)
  const grassColor = new Color().lerpColors(
    new Color(0x7c2d12), // Dead dry red clay earth
    new Color(0x15803d), // Natural deep emerald green grass
    healthIndex
  );

  // Jagged granite base plate shards
  const rockShards = useMemo(() => {
    return [
      { size: [1.8, 0.5, 1.8], pos: [0, -0.35, 0], rot: [0, 0, 0] },
      { size: [1.3, 0.7, 1.3], pos: [0.35, -0.75, -0.25], rot: [0.15, 0.35, 0.1] },
      { size: [0.9, 0.9, 0.9], pos: [-0.45, -0.9, 0.35], rot: [-0.25, 0.15, -0.3] },
      { size: [0.55, 0.55, 0.55], pos: [0.85, -0.55, 0.55], rot: [0.4, -0.2, 0.15] },
      { size: [0.45, 0.5, 0.45], pos: [-0.85, -0.5, -0.85], rot: [-0.15, 0.4, -0.2] },
    ];
  }, []);

  const treePositions = useMemo(() => {
    const coords: [number, number, number][] = [];
    const seeds = [
      [-1.1, 0.4, -0.5], [1.1, 0.4, 0.5], 
      [-0.7, 0.4, 1.1], [0.7, 0.4, -1.1],
      [-1.4, 0.4, 0.3], [1.4, 0.4, -0.3],
      [0.0, 0.4, -1.3], [0.0, 0.4, 1.3],
      [-0.6, 0.4, -1.1], [0.6, 0.4, 1.1],
      [-1.2, 0.4, -1.0], [1.2, 0.4, 1.0]
    ];
    for (let i = 0; i < 20; i++) {
      const s = seeds[i % seeds.length]!;
      coords.push([s[0] + (Math.random() - 0.5) * 0.2, 0.4, s[2] + (Math.random() - 0.5) * 0.2]);
    }
    return coords;
  }, []);

  const factoryPositions = useMemo(() => {
    const coords: [number, number, number][] = [];
    const seeds = [
      [1.2, 0.35, -1.0], [-1.2, 0.35, 1.0],
      [1.4, 0.35, 0.0], [-1.4, 0.35, 0.0],
      [0.0, 0.35, 1.2], [0.0, 0.35, -1.2],
    ];
    for (let i = 0; i < 10; i++) {
      const s = seeds[i % seeds.length]!;
      coords.push([s[0] + (Math.random() - 0.5) * 0.15, 0.35, s[2] + (Math.random() - 0.5) * 0.15]);
    }
    return coords;
  }, []);

  const windmillPositions = useMemo(() => {
    const coords: [number, number, number][] = [];
    const seeds = [
      [-1.0, 0.7, -1.0], [1.0, 0.7, 1.0],
      [-1.3, 0.7, 0.7], [1.3, 0.7, -0.7],
    ];
    for (let i = 0; i < 10; i++) {
      const s = seeds[i % seeds.length]!;
      coords.push([s[0] + (Math.random() - 0.5) * 0.1, 0.7, s[2] + (Math.random() - 0.5) * 0.1]);
    }
    return coords;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Drifting atmospheric clouds */}
      <Clouds3D />

      {/* 1. Main Island Base Plate */}
      <mesh receiveShadow castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.9, 2.1, 0.35, 32]} />
        <meshStandardMaterial color={grassColor} roughness={0.8} />
      </mesh>

      {/* 2. Layered Granite underside shards */}
      {rockShards.map((shard, idx) => (
        <mesh 
          key={`shard-${idx}`} 
          position={shard.pos as [number, number, number]} 
          rotation={shard.rot as [number, number, number]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={shard.size as [number, number, number]} />
          <meshStandardMaterial color={0x52525b} roughness={0.9} flatShading /> {/* Granite slate */}
        </mesh>
      ))}

      {/* 3. Mannequin Character "EcoBuddy" */}
      <EcoBuddy />

      {/* 4. Realistic Trees */}
      {treePositions.slice(0, treeCount).map((pos, idx) => (
        <Tree key={`tree-${idx}`} position={pos} />
      ))}

      {/* 5. Windmills */}
      {windmillPositions.slice(0, windmillCount).map((pos, idx) => (
        <Windmill key={`windmill-${idx}`} position={pos} />
      ))}

      {/* 6. Realistic Factory Refinery plant */}
      {factoryPositions.slice(0, factoryCount).map((pos, idx) => (
        <Factory key={`factory-${idx}`} position={pos} />
      ))}

      {/* 7. Animated fauna creatures */}
      <Creatures3D />

      {/* 8. Glossy Bottom Water Plane */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial 
          color={0x0b132b} 
          roughness={0.12} 
          metalness={0.98} 
          transparent 
          opacity={0.65} 
        />
      </mesh>
    </group>
  );
};
