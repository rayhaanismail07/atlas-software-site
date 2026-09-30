"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Floating3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return undefined;
    }

    renderer.setClearColor(0x040608, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 1000);
    camera.position.set(0, 0, 22);

    const spaceGroup = new THREE.Group();
    scene.add(spaceGroup);

    // 1. Subtle Deep Spatial Starfield (5,000 Distant Stars with Soft Luminance)
    const starCount = 5000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0x00e1ff).multiplyScalar(0.55), // Subtle Atlas Cyan
      new THREE.Color(0x0077ff).multiplyScalar(0.50), // Subtle Electric Cobalt
      new THREE.Color(0x00f5b8).multiplyScalar(0.50), // Subtle Neon Mint
      new THREE.Color(0xa78bfa).multiplyScalar(0.55), // Subtle Quantum Violet
      new THREE.Color(0xd0d4dc).multiplyScalar(0.45), // Subtle Stellar Silver
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 480;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 16;

      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const starField = new THREE.Points(starGeo, starMat);
    spaceGroup.add(starField);

    // 2. Soft Ambient Nebulae (Calibrated low opacity for maximum text contrast)
    const nebulaeGroup = new THREE.Group();
    spaceGroup.add(nebulaeGroup);

    const nebulaeSpecs = [
      { color: 0x00e1ff, size: 24, pos: [-14, 20, -22], opacity: 0.07 }, // Hero
      { color: 0x0077ff, size: 28, pos: [16, -25, -25], opacity: 0.06 }, // Section 1 & 2
      { color: 0x00f5b8, size: 30, pos: [-18, -80, -28], opacity: 0.08 }, // Section 3: Systems
      { color: 0x00e1ff, size: 28, pos: [18, -120, -25], opacity: 0.07 }, // Section 3: Architecture
      { color: 0xa78bfa, size: 32, pos: [-15, -170, -28], opacity: 0.08 }, // Section 4: Process
      { color: 0x00e1ff, size: 28, pos: [16, -220, -25], opacity: 0.07 }, // Section 5: Studio
      { color: 0xfbbf24, size: 26, pos: [-12, -270, -28], opacity: 0.06 }, // Section 5: Tech Stack
      { color: 0x0077ff, size: 30, pos: [14, -330, -24], opacity: 0.07 }, // Final CTA
    ];

    nebulaeSpecs.forEach((spec) => {
      const geo = new THREE.SphereGeometry(spec.size, 20, 20);
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: new THREE.Color(spec.color) },
          uOpacity: { value: spec.opacity },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.60 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
            gl_FragColor = vec4(uColor, intensity * uOpacity);
          }
        `,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      nebulaeGroup.add(mesh);
    });

    const dynamic3DMeshes: Array<{
      mesh: THREE.Object3D;
      rotX: number;
      rotY: number;
      rotZ: number;
      baseY: number;
      driftSpeed: number;
      driftAmp: number;
    }> = [];

    // Deep Background Orbital Rings
    const cyberRingsGroup = new THREE.Group();
    spaceGroup.add(cyberRingsGroup);

    for (let i = 0; i < 10; i++) {
      const ringGeo = new THREE.TorusGeometry(8 + (i % 3) * 3, 0.014, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00e1ff : 0xa78bfa,
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set((i % 2 === 0 ? -1 : 1) * 10, -i * 32, -30 - (i % 4) * 3);
      ringMesh.rotation.set(Math.PI / 3 + i * 0.3, 0.4, i * 0.35);
      cyberRingsGroup.add(ringMesh);
    }

    // 7. Scroll Physics & Smooth Rendering Loop
    let active = true;
    let frame = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;
    let scrollVelocity = 0;
    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    const onPointerMove = (e: MouseEvent) => {
      pointerTarget.x = (e.clientX / window.innerWidth - 0.5) * 0.4;
      pointerTarget.y = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", () => {
      active = document.visibilityState === "visible";
    });

    resize();

    const render = () => {
      frame = window.requestAnimationFrame(render);
      if (!active) return;

      const elapsed = clock.getElapsedTime();

      const prevScrollY = currentScrollY;
      currentScrollY += (targetScrollY - currentScrollY) * 0.055;
      scrollVelocity = currentScrollY - prevScrollY;

      pointer.lerp(pointerTarget, 0.04);

      const scrollUnit = currentScrollY * 0.0015;
      spaceGroup.position.y = currentScrollY * 0.016;
      spaceGroup.rotation.y = elapsed * 0.015 + scrollUnit * 0.25 + pointer.x;
      spaceGroup.rotation.x = Math.sin(elapsed * 0.012) * 0.02 + scrollUnit * 0.10 - pointer.y;

      camera.position.z = 22 - Math.min(Math.abs(scrollVelocity) * 0.06, 3);
      camera.rotation.z = scrollVelocity * 0.0002;

      dynamic3DMeshes.forEach((item, idx) => {
        item.mesh.rotation.x += item.rotX;
        item.mesh.rotation.y += item.rotY;
        item.mesh.rotation.z += item.rotZ;

        const floatOffset = Math.sin(elapsed * item.driftSpeed + idx) * item.driftAmp;
        item.mesh.position.y = item.baseY + floatOffset;
      });

      nebulaeGroup.rotation.z = elapsed * 0.006;
      cyberRingsGroup.rotation.z = -elapsed * 0.008;

      renderer.render(scene, camera);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onPointerMove);
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle ambient contrast protection overlay to guarantee pristine readability */}
      <div className="absolute inset-0 bg-[#040608]/30 pointer-events-none" />
    </div>
  );
}
