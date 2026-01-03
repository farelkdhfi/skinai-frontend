import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// --- SHADER CONFIGURATION ---
// Shader ini tetap sama untuk efek scan yang keren
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uScanColor;
  
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    // Area scan bergerak naik turun
    // Angka 1.5 dan 2.0 disesuaikan dengan ukuran model 'face.glb'
    float scanPos = sin(uTime * 1.5) * 2.0; 
    
    // Hitung jarak vertikal pixel ke garis scan
    float dist = abs(vPosition.y - scanPos);
    
    // Ketebalan garis bercahaya
    float intensity = smoothstep(0.15, 0.0, dist); 
    
    // Warna: Mix antara warna dasar (gelap) dan warna scan (terang)
    vec3 finalColor = mix(uColor, uScanColor, intensity * 2.5);
    
    // Transparansi: Bagian yang discan lebih solid (1.0), sisanya transparan (0.15)
    float alpha = 0.15 + (intensity * 0.85); 

    // Efek glitch/techy di wireframe
    if(mod(vPosition.y * 20.0, 1.0) < 0.1) alpha *= 0.5;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const FaceModel = () => {
  const meshRef = useRef();
  
  // LOAD MODEL GLB
  // Pastikan file 'face.glb' ada di folder /public/
  const { nodes } = useGLTF('/face.glb');

  // Uniforms untuk Shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#fff") }, // Slate-950 (Deep Blue/Black)
      uScanColor: { value: new THREE.Color("#e0e7ff") }, // Sky-400 (Cyan Neon)
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
      // Update waktu scan
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
      
      // Rotasi otomatis pelan-pelan
      meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <group dispose={null}>
      <mesh 
        ref={meshRef}
        geometry={nodes.geometry_0.geometry} 
        scale={[3, 3, 3]} // Sesuaikan scale ini jika model terlalu besar/kecil
        position={[0, -0.9, 0]} // Turunkan sedikit agar pas di tengah
        rotation={[0, 0, 0]}
      >
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          wireframe={true} // Mode Wireframe ON
          transparent={true}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending} // Efek Glowing
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const FaceScanner = () => {
  return (
    <div className="w-full h-full relative group">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <FaceModel />
            <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                minPolarAngle={Math.PI / 2.5} 
                maxPolarAngle={Math.PI / 1.5}
            />
        </Canvas>
        
        {/* Modern Overlay UI */}
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
            {/* Top Corners */}
            <div className="flex justify-between items-start opacity-40">
                <div className="w-8 h-8 border-l-2 border-t-2 border-sky-500 rounded-tl-lg"></div>
                <div className="w-8 h-8 border-r-2 border-t-2 border-sky-500 rounded-tr-lg"></div>
            </div>

             {/* Bottom Corners */}
             <div className="flex justify-between items-end opacity-40">
                <div className="w-8 h-8 border-l-2 border-b-2 border-sky-500 rounded-bl-lg"></div>
                <div className="w-8 h-8 border-r-2 border-b-2 border-sky-500 rounded-br-lg"></div>
            </div>
        </div>
    </div>
  );
};

// Preload agar model langsung muncul tanpa delay hitam
useGLTF.preload('/face.glb');

export default FaceScanner;