import { useRef, useMemo, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, useTexture } from "@react-three/drei";
import { useGlobeData } from "../lib/stores/useGlobeData";
import { createCountryMesh } from "../lib/utils/globeUtils";
import { gsap } from "gsap";

export default function Globe() {
  const globeRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const countriesRef = useRef<THREE.Group>(null);
  const { selectedCategory, countries, dataByCountry, selectedCountry, setSelectedCountry } = useGlobeData();
  
  // Load textures with drei's useTexture
  const earthTexture = useTexture("/textures/earth_texture.jpg");

  // Setup glow shader
  const glowShader = useMemo(() => {
    return {
      uniforms: {
        viewVector: { value: new THREE.Vector3(0, 0, 0) },
        c: { value: 0.2 },
        p: { value: 4.5 },
        glowColor: { value: new THREE.Color(0x00ffff) },
        time: { value: 0 },
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normal);
          vec3 vNormel = normalize(viewVector);
          intensity = pow(c - dot(vNormal, vNormel), p);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float time;
        varying float intensity;
        void main() {
          float pulse = 0.5 + 0.5 * sin(time * 0.5);
          vec3 finalColor = glowColor * intensity * (0.8 + 0.2 * pulse);
          gl_FragColor = vec4(finalColor, min(1.0, intensity * 1.2));
        }
      `,
    };
  }, []);

  // Create meshes for all countries 
  const countryMeshes = useMemo(() => {
    if (!countries.length) return [];
    
    return countries.map(country => {
      const data = dataByCountry[country.properties.ISO_A3] || {};
      const dataValue = data[selectedCategory] || 0;
      
      return createCountryMesh(country, dataValue, selectedCategory);
    });
  }, [countries, dataByCountry, selectedCategory]);

  // Handle country selection
  const handleCountryClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const countryCode = event.object?.userData?.countryCode;
    if (countryCode) {
      setSelectedCountry(countryCode);
    }
  };

  // Rotation animation
  useFrame((state) => {
    if (globeRef.current && !selectedCountry) {
      globeRef.current.rotation.y += 0.001;
    }
    
    // Update glow effect
    if (glowRef.current && glowRef.current.material instanceof THREE.ShaderMaterial) {
      glowRef.current.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(
        state.camera.position,
        glowRef.current.position
      );
      glowRef.current.material.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  // Handle camera animation when a country is selected
  useEffect(() => {
    if (selectedCountry && countriesRef.current && globeRef.current) {
      // Find the selected country mesh
      const countryMesh = countriesRef.current.children.find(
        (child: any) => child.userData?.countryCode === selectedCountry
      );
      
      if (countryMesh) {
        // Get the country's center position in world space
        const position = new THREE.Vector3();
        const worldPos = countryMesh.getWorldPosition(position);
        const normal = new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z).normalize();
        
        // Calculate camera target position
        normal.multiplyScalar(3);
        
        // Animate the globe to show the selected country
        if (globeRef.current) {
          gsap.to(globeRef.current.rotation, {
            x: -worldPos.y * 0.5,
            y: worldPos.x * 0.5,
            z: 0,
            duration: 1.5,
            ease: "power2.out"
          });
        }
      }
    }
  }, [selectedCountry]);

  return (
    <>
      <OrbitControls 
        enablePan={false}
        minDistance={2.5}
        maxDistance={8}
        enableDamping
        dampingFactor={0.05}
      />
      
      <group ref={globeRef}>
        {/* Earth Sphere */}
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial 
            map={earthTexture}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
        
        {/* Glow Effect */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.1, 32, 32]} />
          <shaderMaterial
            attach="material"
            args={[glowShader]}
            transparent
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
        
        {/* Country Meshes */}
        <group ref={countriesRef} onClick={handleCountryClick}>
          {countryMeshes.map((mesh, i) => (
            <primitive key={i} object={mesh} />
          ))}
        </group>
      </group>
      
      {/* Ambient light */}
      <ambientLight intensity={0.1} />
      
      {/* Directional light simulating the sun */}
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={1.5} 
        color="#ffffff" 
      />
    </>
  );
}
