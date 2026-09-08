import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function KineticCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.25;
      meshRef.current.rotation.y = time * 0.35;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -time * 0.2;
      wireRef.current.rotation.y = -time * 0.3;
    }
  });

  return (
    <group>
      {/* Outer Floating Monolith */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={meshRef} scale={1.8}>
          <octahedronGeometry args={[1, 2]} />
          <MeshDistortMaterial
            color="#141418"
            roughness={0.15}
            metalness={0.9}
            distort={0.25}
            speed={2}
          />
        </mesh>

        {/* Wireframe Electric Accent Cage */}
        <mesh ref={wireRef} scale={2.1}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#dfff00"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </Float>

      {/* Atmospheric Point Light Sources */}
      <pointLight position={[5, 5, 5]} intensity={80} color="#dfff00" />
      <pointLight position={[-5, -5, -3]} intensity={50} color="#6366f1" />
      <ambientLight intensity={0.4} />
    </group>
  );
}

export default function DynamicMonolithCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      className="w-full h-full pointer-events-none"
    >
      <KineticCore />
    </Canvas>
  );
}
