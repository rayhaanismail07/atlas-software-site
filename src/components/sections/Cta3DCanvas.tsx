"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Radio } from "lucide-react";

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach((item) => item.dispose());
    else if (material) material.dispose();
  });
}

export function Cta3DCanvas() {
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Metallic Quantum Crystal Core
    const coreGeo = new THREE.OctahedronGeometry(0.75, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x070809,
      emissive: 0x00e1ff,
      emissiveIntensity: 0.85,
      roughness: 0.12,
      metalness: 0.95,
      clearcoat: 1.0,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 2. Dual Counter-rotating Metallic Rings
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x00e1ff,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x0077ff,
      emissiveIntensity: 0.5,
    });

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xc0c0c8,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0x00e1ff,
      emissiveIntensity: 0.4,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.022, 16, 80), ringMat1);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.018, 16, 80), ringMat2);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // 3. Orbital Energy Particles
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color(0x00e1ff),
      new THREE.Color(0x0077ff),
      new THREE.Color(0xc0c0c8),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 1.45 + Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    partGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const partMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleCloud = new THREE.Points(partGeo, partMat);
    group.add(particleCloud);

    // 4. Lighting & Dynamic Glow Points
    const mainLight = new THREE.DirectionalLight(0x61e7fb, 3.5);
    mainLight.position.set(3, 4, 3);
    scene.add(mainLight);

    const cyanLight = new THREE.PointLight(0x14b8a6, 4, 10);
    cyanLight.position.set(-2, 2, 2);
    scene.add(cyanLight);

    let active = true;
    let visible = true;
    let frame = 0;
    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const resize = () => {
      const rect = shell.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      const compact = width < 560;
      camera.position.z = compact ? 5.8 : 4.4;
      group.scale.setScalar(compact ? 0.75 : 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      pointerTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.7;
      pointerTarget.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(shell);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(shell);

    shell.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", () => {
      active = document.visibilityState === "visible";
    });

    resize();

    const render = () => {
      frame = window.requestAnimationFrame(render);
      if (!active || !visible) return;

      const elapsed = clock.getElapsedTime();
      pointer.lerp(pointerTarget, 0.05);

      coreMesh.rotation.y = elapsed * 0.5 + pointer.x;
      coreMesh.rotation.x = Math.sin(elapsed * 0.3) * 0.3 + pointer.y;

      ring1.rotation.z = elapsed * 0.6;
      ring1.rotation.y = Math.sin(elapsed * 0.2) * 0.4;

      ring2.rotation.x = -elapsed * 0.5;
      ring2.rotation.z = Math.cos(elapsed * 0.3) * 0.4;

      particleCloud.rotation.y = elapsed * 0.15;

      renderer.render(scene, camera);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      shell.removeEventListener("pointermove", onPointerMove);
      disposeObject(scene);
      renderer.dispose();
    };
  }, []);

  if (!supported) return null;

  return (
    <div
      ref={shellRef}
      className="w-full h-[210px] sm:h-[230px] relative overflow-hidden rounded-2xl bg-slate-900/60 border border-cyan-500/25 shadow-xl backdrop-blur-xl group"
    >
      <div className="absolute top-3 left-3.5 right-3.5 z-10 flex items-center justify-between text-[11px] font-mono tracking-widest text-cyan-300 uppercase pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
          </span>
          <span>LIVE BEACON</span>
        </div>
        <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
