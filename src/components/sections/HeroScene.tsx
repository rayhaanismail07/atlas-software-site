"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Generates procedural circular soft neon glow texture
function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const center = 32;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 30);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.25, "rgba(0, 240, 255, 0.95)");
    gradient.addColorStop(0.6, "rgba(37, 99, 235, 0.4)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;
    if (!canvas || !shell) return undefined;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setSupported(false);
      return undefined;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 1000);
    camera.position.set(0, 0.3, 9.8);
    camera.lookAt(0, 0, 0);

    const root = new THREE.Group();
    scene.add(root);

    const particleTexture = createParticleTexture();

    // =========================================================================
    // 1. Quantum Kinetic Core (Precision Faceted Geodesic Nucleus)
    // Positioned deeper in z-space to frame the typography with celestial depth
    // =========================================================================
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0.4, -3.8);
    root.add(coreGroup);

    // Inner Radiant Nucleus (Pulsing glowing orb)
    const nucleusGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleus);

    // Nucleus Core Light (Volumetric cast outward)
    const coreLight = new THREE.PointLight(0x00f0ff, 4.0, 16);
    coreGroup.add(coreLight);

    const violetRimLight = new THREE.PointLight(0xa855f7, 3.0, 18);
    violetRimLight.position.set(4, 2.5, 2);
    scene.add(violetRimLight);

    // Primary Faceted Crystal (Icosahedron Shell)
    const crystalGeo = new THREE.IcosahedronGeometry(1.9, 0);
    const crystalWireGeo = new THREE.IcosahedronGeometry(1.91, 1);

    // Faceted Glass Faces
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x02111d,
      emissive: 0x00223d,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.9,
      transmission: 0.55,
      ior: 1.45,
      transparent: true,
      opacity: 0.28,
      wireframe: false,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    coreGroup.add(crystalMesh);

    // Ultra-Fine Glowing Wireframe Lattice on Crystal
    const crystalWireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const crystalWireMesh = new THREE.Mesh(crystalWireGeo, crystalWireMat);
    coreGroup.add(crystalWireMesh);

    // Secondary Nested Octahedron Core
    const octaGeo = new THREE.OctahedronGeometry(1.25, 0);
    const octaMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const octaMesh = new THREE.Mesh(octaGeo, octaMat);
    coreGroup.add(octaMesh);

    // =========================================================================
    // 2. Concentric Gyroscopic Orbital Energy Rings
    // =========================================================================
    const gyroGroup = new THREE.Group();
    gyroGroup.position.copy(coreGroup.position);
    root.add(gyroGroup);

    const createRing = (radius: number, tube: number, color: number, opacity: number) => {
      const geo = new THREE.TorusGeometry(radius, tube, 20, 180);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Mesh(geo, mat);
    };

    // Ring 1 - Inner High-Frequency Ring
    const ring1 = createRing(3.2, 0.015, 0x00f0ff, 0.55);
    ring1.rotation.set(1.2, 0.4, 0.2);
    gyroGroup.add(ring1);

    // Ring 2 - Mid Equator Ring
    const ring2 = createRing(4.3, 0.013, 0x38bdf8, 0.42);
    ring2.rotation.set(-0.9, 0.7, -0.5);
    gyroGroup.add(ring2);

    // Ring 3 - Outer Celestial Ring
    const ring3 = createRing(5.5, 0.012, 0x818cf8, 0.32);
    ring3.rotation.set(0.4, -1.1, 0.8);
    gyroGroup.add(ring3);

    // Ring 4 - Deep Perimeter Precision Guide
    const ring4 = createRing(6.8, 0.009, 0xa855f7, 0.2);
    ring4.rotation.set(-0.5, -0.3, 1.4);
    gyroGroup.add(ring4);

    // Orbiting Photon Spark Satellites along rings (Ultra-fine luminous sparks)
    const satelliteGeo = new THREE.SphereGeometry(0.038, 16, 16);
    const satelliteMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      blending: THREE.AdditiveBlending,
    });

    const sat1 = new THREE.Mesh(satelliteGeo, satelliteMat);
    ring1.add(sat1);

    const sat2 = new THREE.Mesh(satelliteGeo, satelliteMat);
    ring2.add(sat2);

    const sat3 = new THREE.Mesh(satelliteGeo, satelliteMat);
    ring3.add(sat3);

    // =========================================================================
    // 3. Cosmic Swirl Stardust & Flow Particles
    // =========================================================================
    const particleCount = 420;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleMeta = new Float32Array(particleCount * 4); // [radius, angle, speed, yOffset]

    const colorPalette = [
      new THREE.Color(0x00f0ff),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x818cf8),
      new THREE.Color(0xc084fc),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 4.8;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.2 + Math.random() * 0.45) * (Math.random() > 0.5 ? 1 : -1);
      const yOffset = (Math.random() - 0.5) * 4.0;

      particleMeta[i * 4] = radius;
      particleMeta[i * 4 + 1] = angle;
      particleMeta[i * 4 + 2] = speed;
      particleMeta[i * 4 + 3] = yOffset;

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = yOffset;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius - 1.8;

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.09,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    root.add(particles);

    // =========================================================================
    // 4. Subtle Horizon Ambient Grid (Architectural Scale & Depth)
    // =========================================================================
    const gridGeo = new THREE.PlaneGeometry(38, 22, 24, 16);
    gridGeo.rotateX(-Math.PI / 2);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.024,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.position.set(0, -3.4, -4);
    gridMesh.rotation.x = 0.16;
    root.add(gridMesh);

    // =========================================================================
    // 5. Interaction & Render Loop
    // =========================================================================
    let active = true;
    let visible = true;
    let frame = 0;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();

    const resize = () => {
      const rect = shell.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const compact = width < 768;
      camera.position.z = compact ? 12 : 9.8;
      camera.position.y = compact ? 0.4 : 0.3;
      root.scale.setScalar(compact ? 0.8 : 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      mouse.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.targetY = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(shell);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    resize();

    const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;

    const animate = () => {
      if (!active) return;
      frame = requestAnimationFrame(animate);
      if (!visible) return;

      const elapsed = clock.getElapsedTime();

      // Fluid pointer parallax with silky damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Gyroscopic Root Reaction: responds smoothly to mouse movement
      root.rotation.y = mouse.x * 0.22;
      root.rotation.x = -mouse.y * 0.16;

      // Rotate Faceted Crystal Core
      crystalMesh.rotation.x = elapsed * 0.25;
      crystalMesh.rotation.y = elapsed * 0.38;
      crystalWireMesh.rotation.copy(crystalMesh.rotation);

      octaMesh.rotation.x = -elapsed * 0.42;
      octaMesh.rotation.z = elapsed * 0.35;

      // Nucleus Breathing / Pulse Effect
      const pulse = 1 + Math.sin(elapsed * 2.8) * 0.08;
      nucleus.scale.setScalar(pulse);
      coreLight.intensity = 4.2 + Math.sin(elapsed * 3.5) * 1.0;

      // Clockwork Gyroscopic Multi-Axis Ring Rotations
      ring1.rotation.z = elapsed * 0.35;
      ring1.rotation.x = 1.2 + Math.sin(elapsed * 0.4) * 0.2;
      sat1.position.set(Math.cos(elapsed * 2.2) * 2.6, Math.sin(elapsed * 2.2) * 2.6, 0);

      ring2.rotation.y = -elapsed * 0.28;
      ring2.rotation.z = -0.5 + Math.cos(elapsed * 0.35) * 0.25;
      sat2.position.set(Math.cos(elapsed * 1.8) * 3.4, Math.sin(elapsed * 1.8) * 3.4, 0);

      ring3.rotation.x = elapsed * 0.22;
      ring3.rotation.y = -1.1 + Math.sin(elapsed * 0.3) * 0.2;
      sat3.position.set(Math.cos(elapsed * 1.4) * 4.3, Math.sin(elapsed * 1.4) * 4.3, 0);

      ring4.rotation.z = -elapsed * 0.15;

      // Orbiting Stardust Particles
      if (!reduceMotion) {
        const pArr = posAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const mIdx = i * 4;
          const pIdx = i * 3;

          const radius = particleMeta[mIdx];
          const baseAngle = particleMeta[mIdx + 1];
          const speed = particleMeta[mIdx + 2];
          const yOffset = particleMeta[mIdx + 3];

          const currentAngle = baseAngle + elapsed * speed * 0.35;

          // Gentle 3D orbital trajectory with vertical undulation
          pArr[pIdx] = Math.cos(currentAngle) * radius;
          pArr[pIdx + 1] = yOffset + Math.sin(elapsed * 1.5 + baseAngle) * 0.4;
          pArr[pIdx + 2] = Math.sin(currentAngle) * radius - 1.8;
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);

      nucleusGeo.dispose();
      nucleusMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      crystalWireGeo.dispose();
      crystalWireMat.dispose();
      octaGeo.dispose();
      octaMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      satelliteGeo.dispose();
      satelliteMat.dispose();
      renderer.dispose();
    };
  }, []);

  if (!supported) {
    return (
      <div className="hero-three hero-three--fallback" aria-hidden="true">
        <span />
      </div>
    );
  }

  return (
    <div ref={shellRef} className="hero-three-full" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
