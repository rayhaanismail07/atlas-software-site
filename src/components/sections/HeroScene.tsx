"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// High-definition procedural soft glowing bokeh particle texture
function createGlowParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const center = 32;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 31);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.2, "rgba(0, 240, 255, 0.95)");
    gradient.addColorStop(0.5, "rgba(37, 99, 235, 0.45)");
    gradient.addColorStop(0.8, "rgba(139, 92, 246, 0.15)");
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
    camera.position.set(0, 1.6, 10.2);
    camera.lookAt(0, 0, 0);

    const root = new THREE.Group();
    scene.add(root);

    const particleTexture = createGlowParticleTexture();

    // =========================================================================
    // 1. Ambient Volumetric Lighting (Soft, deep glowing atmospheric aura)
    // =========================================================================
    const centerAura = new THREE.PointLight(0x0077ff, 3.8, 22);
    centerAura.position.set(0, 0, -2);
    scene.add(centerAura);

    const violetAura = new THREE.PointLight(0x8b5cf6, 3.2, 24);
    violetAura.position.set(5, 2, -1);
    scene.add(violetAura);

    const deepBlueAura = new THREE.PointLight(0x1d4ed8, 4.0, 26);
    deepBlueAura.position.set(-5, -2, -3);
    scene.add(deepBlueAura);

    // =========================================================================
    // 2. Expansive Quantum Vortex (9,000 Points Framing the Center)
    // The center (radius < 3.2) is left as a clean obsidian eye for text clarity,
    // while the surrounding galaxy swirls with rich chromatic energy.
    // =========================================================================
    const totalParticles = 9000;
    const vortexGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(totalParticles * 3);
    const colors = new Float32Array(totalParticles * 3);
    const particleMeta = new Float32Array(totalParticles * 4); // [radius, angle, speed, yParam]

    const colWhite = new THREE.Color(0xffffff);
    const colElectricBlue = new THREE.Color(0x0077ff);
    const colSky = new THREE.Color(0x38bdf8);
    const colCobalt = new THREE.Color(0x2563eb);
    const colViolet = new THREE.Color(0xa855f7);
    const colIndigo = new THREE.Color(0x4f46e5);

    for (let i = 0; i < totalParticles; i++) {
      const idx3 = i * 3;
      const idx4 = i * 4;

      if (i < 6200) {
        // Multi-Arm Accretion Vortex Disk (Framing the text)
        const t = i / 6200;
        // Inner radius 3.1 ensures the center typography remains in pristine open space
        const radius = 3.1 + Math.pow(t, 0.82) * 6.5 + (Math.random() - 0.5) * 0.5;
        // 3-arm logarithmic spiral
        const armIndex = i % 3;
        const armOffset = (armIndex * Math.PI * 2) / 3;
        const spiralAngle = Math.log(radius) * 2.4 + armOffset + (Math.random() - 0.5) * 0.45;
        const speed = (0.28 + (1 / Math.sqrt(radius)) * 0.55) * 0.75;
        const yBase = (Math.random() - 0.5) * (0.35 + radius * 0.08);

        particleMeta[idx4] = radius;
        particleMeta[idx4 + 1] = spiralAngle;
        particleMeta[idx4 + 2] = speed;
        particleMeta[idx4 + 3] = yBase;

        positions[idx3] = Math.cos(spiralAngle) * radius;
        positions[idx3 + 1] = yBase;
        positions[idx3 + 2] = Math.sin(spiralAngle) * radius - 2.8;

        // Chromatic Color mapping
        const normR = (radius - 3.1) / 6.5;
        let col = colElectricBlue.clone();
        if (normR < 0.2) {
          col = colElectricBlue.clone().lerp(colWhite, 0.35);
        } else if (normR < 0.55) {
          col = colSky.clone().lerp(colCobalt, (normR - 0.2) / 0.35);
        } else {
          col = colCobalt.clone().lerp(colViolet, (normR - 0.55) / 0.45);
        }

        colors[idx3] = col.r;
        colors[idx3 + 1] = col.g;
        colors[idx3 + 2] = col.b;
      } else if (i < 7800) {
        // Celestial Orbital Filament Rings (Arching above and below the horizon)
        const loopT = (i - 6200) / 1600;
        const loopAngle = loopT * Math.PI * 2;
        const loopRadius = 4.8 + (Math.random() - 0.5) * 1.2;
        const speed = 0.4 + Math.random() * 0.35;
        const tilt = (i % 2 === 0 ? 1 : -1) * 0.65;

        const lx = Math.cos(loopAngle) * loopRadius;
        const ly = Math.sin(loopAngle) * (loopRadius * 0.75);
        const lz = ly * tilt - 2.8;

        particleMeta[idx4] = loopRadius;
        particleMeta[idx4 + 1] = loopAngle;
        particleMeta[idx4 + 2] = speed;
        particleMeta[idx4 + 3] = tilt;

        positions[idx3] = lx;
        positions[idx3 + 1] = ly;
        positions[idx3 + 2] = lz;

        const col = colViolet.clone().lerp(colIndigo, Math.random() * 0.5);
        colors[idx3] = col.r;
        colors[idx3 + 1] = col.g;
        colors[idx3 + 2] = col.b;
      } else {
        // Ambient Galactic Stardust Halo (Deep field dispersion)
        const radius = 3.5 + Math.random() * 8.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI * 0.9;
        const speed = 0.12 + Math.random() * 0.25;

        const x = radius * Math.cos(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi);
        const z = radius * Math.cos(phi) * Math.sin(theta) - 2.8;

        particleMeta[idx4] = radius;
        particleMeta[idx4 + 1] = theta;
        particleMeta[idx4 + 2] = speed;
        particleMeta[idx4 + 3] = phi;

        positions[idx3] = x;
        positions[idx3 + 1] = y;
        positions[idx3 + 2] = z;

        const col = Math.random() > 0.5 ? colElectricBlue : colSky;
        colors[idx3] = col.r;
        colors[idx3 + 1] = col.g;
        colors[idx3 + 2] = col.b;
      }
    }

    vortexGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    vortexGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const vortexMat = new THREE.PointsMaterial({
      size: 0.105,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const vortexPoints = new THREE.Points(vortexGeo, vortexMat);
    root.add(vortexPoints);

    // =========================================================================
    // 3. Precision Laser Framing Rings (Framing the calm eye of the vortex)
    // =========================================================================
    const createLaserRing = (radius: number, color: number, opacity: number, tiltX: number) => {
      const geo = new THREE.RingGeometry(radius, radius + 0.018, 160);
      const mat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = tiltX;
      mesh.position.set(0, 0, -2.8);
      return mesh;
    };

    const ring1 = createLaserRing(3.6, 0x0077ff, 0.4, Math.PI / 2.3);
    root.add(ring1);

    const ring2 = createLaserRing(4.9, 0x38bdf8, 0.22, Math.PI / 2.2);
    root.add(ring2);

    const ring3 = createLaserRing(6.4, 0x8b5cf6, 0.16, Math.PI / 2.4);
    root.add(ring3);

    // =========================================================================
    // 4. Smooth Interaction & Render Loop
    // =========================================================================
    let active = true;
    let visible = true;
    let frame = 0;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const mouseWorld = new THREE.Vector2(0, 0);
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
      camera.position.z = compact ? 12.0 : 10.2;
      camera.position.y = compact ? 1.8 : 1.6;
      root.scale.setScalar(compact ? 0.8 : 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      mouse.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.targetY = -((event.clientY - rect.top) / rect.height - 0.5) * 2;

      mouseWorld.set(mouse.targetX * 9, mouse.targetY * 5);
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

    const posAttr = vortexGeo.attributes.position as THREE.BufferAttribute;

    const animate = () => {
      if (!active) return;
      frame = requestAnimationFrame(animate);
      if (!visible) return;

      const elapsed = clock.getElapsedTime();

      // Silky spring pointer parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      // 3D perspective galaxy tilt
      root.rotation.x = -mouse.y * 0.22 + 0.24;
      root.rotation.y = mouse.x * 0.30;

      // Subtle atmospheric pulsing
      centerAura.intensity = 3.6 + Math.sin(elapsed * 2.2) * 0.8;
      violetAura.intensity = 3.0 + Math.cos(elapsed * 1.8) * 0.6;

      // Rotate precision laser rings
      ring1.rotation.z = elapsed * 0.14;
      ring2.rotation.z = -elapsed * 0.09;
      ring3.rotation.z = elapsed * 0.06;

      // Dynamic Particle Vortex Physics
      if (!reduceMotion) {
        const pArr = posAttr.array as Float32Array;

        for (let i = 0; i < totalParticles; i++) {
          const idx3 = i * 3;
          const idx4 = i * 4;

          const radius = particleMeta[idx4];
          const baseAngle = particleMeta[idx4 + 1];
          const speed = particleMeta[idx4 + 2];
          const param4 = particleMeta[idx4 + 3];

          if (i < 6200) {
            // Spiral disk orbit with harmonic wave elevation
            const currentAngle = baseAngle + elapsed * speed * 0.26;
            const waveY = param4 + Math.sin(radius * 1.5 - elapsed * 2.0) * 0.16;

            let px = Math.cos(currentAngle) * radius;
            let py = waveY;
            let pz = Math.sin(currentAngle) * radius - 2.8;

            // Interactive cursor gravitational fluid wake
            const dx = px - mouseWorld.x;
            const dy = py - mouseWorld.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 20.0) {
              const dist = Math.sqrt(distSq);
              const force = (1.0 - dist / 4.47) * 0.32;
              px += -dy * force;
              py += dx * force;
            }

            pArr[idx3] = px;
            pArr[idx3 + 1] = py;
            pArr[idx3 + 2] = pz;
          } else if (i < 7800) {
            // Filament loop orbits
            const currentAngle = baseAngle + elapsed * speed * 0.22;
            const lx = Math.cos(currentAngle) * radius;
            const ly = Math.sin(currentAngle) * (radius * 0.75);
            const lz = ly * param4 - 2.8;

            pArr[idx3] = lx;
            pArr[idx3 + 1] = ly;
            pArr[idx3 + 2] = lz;
          } else {
            // Stardust halo drift
            const currentTheta = baseAngle + elapsed * speed * 0.06;
            const x = radius * Math.cos(param4) * Math.cos(currentTheta);
            const y = radius * Math.sin(param4) + Math.sin(elapsed * 1.0 + i) * 0.07;
            const z = radius * Math.cos(param4) * Math.sin(currentTheta) - 2.8;

            pArr[idx3] = x;
            pArr[idx3 + 1] = y;
            pArr[idx3 + 2] = z;
          }
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

      vortexGeo.dispose();
      vortexMat.dispose();
      ring1.geometry.dispose();
      ring2.geometry.dispose();
      ring3.geometry.dispose();
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
