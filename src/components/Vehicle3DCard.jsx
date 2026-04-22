import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Float, 
} from '@react-three/drei';
import * as THREE from 'three';

// --- Simplified High-Visibility Models ---
const MiniModel = ({ colors }) => (
  <group>
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[1.4, 0.6, 2.5]} />
      <meshToonMaterial color={colors.paint} emissive={colors.paint} emissiveIntensity={0.3} />
    </mesh>
    <mesh position={[0, 0.85, 0.2]}>
      <boxGeometry args={[1.2, 0.5, 1.3]} />
      <meshToonMaterial color="#fff" transparent opacity={0.6} />
    </mesh>
  </group>
);

const SedanModel = ({ colors }) => (
  <group>
    <mesh position={[0, 0.35, 0]}>
      <boxGeometry args={[1.6, 0.5, 4.0]} />
      <meshToonMaterial color={colors.paint} emissive={colors.paint} emissiveIntensity={0.3} />
    </mesh>
    <mesh position={[0, 0.7, -0.4]} rotation={[-0.2, 0, 0]}>
      <boxGeometry args={[1.4, 0.5, 2.0]} />
      <meshToonMaterial color="#fff" transparent opacity={0.6} />
    </mesh>
  </group>
);

const SUVModel = ({ colors }) => (
  <group>
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1.8, 0.8, 4.2]} />
      <meshToonMaterial color={colors.paint} emissive={colors.paint} emissiveIntensity={0.3} />
    </mesh>
    <mesh position={[0, 1.2, -0.2]}>
      <boxGeometry args={[1.6, 0.8, 2.8]} />
      <meshToonMaterial color="#fff" transparent opacity={0.6} />
    </mesh>
  </group>
);

const LuxuryModel = ({ colors }) => (
  <group>
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[1.7, 0.4, 4.5]} />
      <meshToonMaterial color={colors.paint} emissive="#333" emissiveIntensity={0.2} />
    </mesh>
    <mesh position={[0, 0.45, 0]}>
      <boxGeometry args={[1.75, 0.02, 4.6]} />
      <meshToonMaterial color="#FF007F" emissive="#FF007F" emissiveIntensity={1} />
    </mesh>
  </group>
);

const AutoModel = () => (
  <group>
    <mesh position={[0, 0.7, -0.1]}>
      <boxGeometry args={[1.1, 1.0, 1.5]} />
      <meshToonMaterial color="#22AA44" emissive="#22AA44" emissiveIntensity={0.3} />
    </mesh>
  </group>
);

const Wheel = ({ position }) => (
  <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
    <cylinderGeometry args={[0.25, 0.25, 0.2, 12]} />
    <meshToonMaterial color="#111" />
  </mesh>
);

// --- Scene Logic ---
const Scene = ({ type }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  const colors = useMemo(() => {
    let paint = '#888';
    if(type === 'mini') paint = '#F5C518';
    else if(type === 'sedan') paint = '#1a1a1a';
    else if(type === 'suv') paint = '#EAEAEA';
    else if(['luxury', 'premium'].includes(type)) paint = '#050505';
    return { paint };
  }, [type]);

  const Model = useMemo(() => {
    switch (type.toLowerCase()) {
      case 'mini': return <MiniModel colors={colors} />;
      case 'sedan': return <SedanModel colors={colors} />;
      case 'suv': return <SUVModel colors={colors} />;
      case 'premium':
      case 'luxury': return <LuxuryModel colors={colors} />;
      case 'auto': return <AutoModel />;
      default: return <SedanModel colors={colors} />;
    }
  }, [type, colors]);

  return (
    <group ref={groupRef}>
      {Model}
      {type !== 'auto' ? (
        <>
          <Wheel position={[0.8, 0.25, 1.2]} /><Wheel position={[-0.8, 0.25, 1.2]} />
          <Wheel position={[0.8, 0.25, -1.2]} /><Wheel position={[-0.8, 0.25, -1.2]} />
        </>
      ) : (
        <>
          <Wheel position={[0, 0.25, 0.8]} /><Wheel position={[0.6, 0.25, -0.8]} /><Wheel position={[-0.6, 0.25, -0.8]} />
        </>
      )}
    </group>
  );
};

const Vehicle3DCard = ({ type = 'sedan' }) => {
  const viewRef = useRef();
  const viewId = `view-${type.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div id={viewId} ref={viewRef} className="w-full h-40 bg-[#0a0a0a] overflow-hidden relative group border-b-2 border-neo-black">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neo-cyan/10 via-transparent to-neo-pink/10 pointer-events-none" />
      
      <Canvas 
        dpr={1} 
        camera={{ position: [5, 3, 5], fov: 30 }}
        gl={{ antialias: false, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        
        <Scene type={type.toLowerCase()} />

        {/* Center Marker Grid */}
        <gridHelper args={[10, 10, '#333', '#111']} position={[0, -0.01, 0]} />
      </Canvas>
      
      {/* Decorative Tag */}
      <div className="absolute bottom-2 right-2 opacity-20 pointer-events-none">
        <span className="text-[40px] font-black uppercase tracking-tighter text-white/5">{type}</span>
      </div>
    </div>
  );
};

export default Vehicle3DCard;
