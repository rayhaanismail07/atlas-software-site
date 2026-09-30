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
    gradient.addColorStop(0.6, "rgba(37, 99, 235, 0.45)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((item) => {
        if ("map" in item && item.map) (item.map as THREE.Texture).dispose();
        item.dispose();
      });
    } else if (material) {
      if ("map" in material && material.map) (material.map as THREE.Texture).dispose();
      material.dispose();
    }
  });
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
    renderer.toneMappingExposure = 1.2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 1000);
    camera.position.set(0, 3.2, 11);
    camera.lookAt(0, 0.2, 0);

    const root = new THREE.Group();
    scene.add(root);

    const particleTexture = createParticleTexture();

    // 1. Interactive 3D Cyber Wave Particle Grid (MotionSites Signature)
    const cols = 75;
    const rows = 45;
    const width = 32;
    const depth = 18;
    const numPoints = cols * rows;

    const positions = new Float32Array(numPoints * 3);
    const baseCoords = new Float32Array(numPoints * 2); // [x, z]
    const colors = new Float32Array(numPoints * 3);

    let idx = 0;
    let bIdx = 0;
    for (let r = 0; r < rows; r++) {
      const z = (r / (rows - 1) - 0.5) * depth;
      for (let c = 0; c < cols; c++) {
        const x = (c / (cols - 1) - 0.5) * width;

        positions[idx] = x;
        positions[idx + 1] = 0;
        positions[idx + 2] = z;

        baseCoords[bIdx] = x;
        baseCoords[bIdx + 1] = z;

        // Default electric cyan to deep royal blue gradient
        colors[idx] = 0.0;
        colors[idx + 1] = 0.94;
        colors[idx + 2] = 1.0;

        idx += 3;
        bIdx += 2;
      }
    }

    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    waveGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const waveMat = new THREE.PointsMaterial({
      size: 0.135,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const waveMesh = new THREE.Points(waveGeo, waveMat);
    waveMesh.position.set(0, -1.8, 0);
    waveMesh.rotation.x = 0.12;
    root.add(waveMesh);

    // 2. Wireframe Lattice Layer underneath the points for architectural depth
    const wireGeo = new THREE.PlaneGeometry(width, depth, cols - 1, rows - 1);
    wireGeo.rotateX(-Math.PI / 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.position.copy(waveMesh.position);
    wireMesh.rotation.copy(waveMesh.rotation);
    root.add(wireMesh);

    // 3. Floating Orbital Gyroscope Rings (Orbit Engineers Style)
    const gyroGroup = new THREE.Group();
    gyroGroup.position.set(0, 0.4, -2.5);
    root.add(gyroGroup);

    const createGyroRing = (radius: number, tube: number, color: number, opacity: number) => {
      const geo = new THREE.TorusGeometry(radius, tube, 16, 180);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Mesh(geo, mat);
    };

    const ring1 = createGyroRing(4.6, 0.016, 0x00f0ff, 0.45);
    ring1.rotation.set(1.1, 0.4, 0.2);
    gyroGroup.add(ring1);

    const ring2 = createGyroRing(5.4, 0.014, 0x3b82f6, 0.35);
    ring2.rotation.set(-0.8, 0.6, -0.4);
    gyroGroup.add(ring2);

    const ring3 = createGyroRing(6.2, 0.012, 0x00e1ff, 0.25);
    ring3.rotation.set(0.3, -0.9, 0.5);
    gyroGroup.add(ring3);

    // 4. Ambient Floating Dust Nodes (Subtle atmospheric depth)
    const starCount = 220;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 36;
      starPos[i + 1] = (Math.random() - 0.5) * 16 + 1;
      starPos[i + 2] = (Math.random() - 0.5) * 20 - 4;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.09,
      map: particleTexture,
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starMesh = new THREE.Points(starGeo, starMat);
    root.add(starMesh);

    // 5. Ambient Volumetric Lights
    const centerGlow = new THREE.PointLight(0x00f0ff, 8, 18);
    centerGlow.position.set(0, 1.5, 2);
    scene.add(centerGlow);

    const blueBackGlow = new THREE.PointLight(0x2563eb, 12, 24);
    blueBackGlow.position.set(0, -2, -4);
    scene.add(blueBackGlow);

    let active = true;
    let visible = true;
    let frame = 0;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const mouseWorld = { x: 0, z: 0 };
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
      camera.position.z = compact ? 13 : 11;
      camera.position.y = compact ? 3.8 : 3.2;
      root.scale.setScalar(compact ? 0.85 : 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      mouse.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.targetY = -((event.clientY - rect.top) / rect.height - 0.5) * 2;

      // Project pointer to approximate world coordinates on the wave plane
      mouseWorld.x = mouse.targetX * 12;
      mouseWorld.z = -mouse.targetY * 6;
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

    const posAttr = waveGeo.attributes.position as THREE.BufferAttribute;
    const colAttr = waveGeo.attributes.color as THREE.BufferAttribute;
    const wirePosAttr = wireGeo.attributes.position as THREE.BufferAttribute;

    const animate = () => {
      if (!active) return;
      frame = requestAnimationFrame(animate);
      if (!visible) return;

      const elapsed = clock.getElapsedTime();

      // Smooth pointer parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      root.rotation.y = mouse.x * 0.18;
      root.rotation.x = -mouse.y * 0.12;

      // Rotate celestial gyro rings
      ring1.rotation.z = elapsed * 0.12;
      ring1.rotation.y = elapsed * 0.08;
      ring2.rotation.x = -elapsed * 0.1;
      ring2.rotation.z = elapsed * 0.06;
      ring3.rotation.y = elapsed * 0.09;

      // Animate wave points with interactive physics
      if (!reduceMotion) {
        const pArray = posAttr.array as Float32Array;
        const cArray = colAttr.array as Float32Array;
        const wArray = wirePosAttr.array as Float32Array;

        let pIdx = 0;
        let bIdx = 0;
        let wIdx = 1; // wireframe y-component

        const time1 = elapsed * 1.5;
        const time2 = elapsed * 0.9;

        for (let i = 0; i < numPoints; i++) {
          const bx = baseCoords[bIdx];
          const bz = baseCoords[bIdx + 1];

          // Harmonic double sine wave
          const w1 = Math.sin(bx * 0.28 + time1) * Math.cos(bz * 0.32 + time2) * 0.65;
          const w2 = Math.sin((bx + bz) * 0.22 + time1 * 0.7) * 0.35;

          // Mouse reactive ripple / force field
          const dx = bx - mouseWorld.x;
          const dz = bz - mouseWorld.z;
          const distSq = dx * dx + dz * dz;
          let mouseForce = 0;
          if (distSq < 36) {
            const dist = Math.sqrt(distSq);
            mouseForce = Math.sin(dist * 2.2 - elapsed * 4) * Math.max(0, 1 - dist / 6) * 0.85;
          }

          const y = w1 + w2 + mouseForce;
          pArray[pIdx + 1] = y;
          wArray[wIdx] = y;

          // Color modulation based on elevation & mouse proximity
          const normY = (y + 1.0) / 2.0;
          if (mouseForce > 0.2) {
            // Bright white-cyan highlight under mouse cursor
            cArray[pIdx] = 0.85;
            cArray[pIdx + 1] = 0.98;
            cArray[pIdx + 2] = 1.0;
          } else {
            // Gradient from deep royal blue (#1d4ed8) to vivid electric cyan (#00f0ff)
            cArray[pIdx] = 0.12 * (1 - normY);
            cArray[pIdx + 1] = 0.45 + normY * 0.52;
            cArray[pIdx + 2] = 0.92 + normY * 0.08;
          }

          pIdx += 3;
          bIdx += 2;
          wIdx += 3;
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        wirePosAttr.needsUpdate = true;
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
      disposeObject(root);
      particleTexture.dispose();
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
