"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

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
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Holographic Crystal Gem Core
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x093a47,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.65,
      roughness: 0.1,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 2. Outer Wireframe Energy Shield
    const wireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.05, 1));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x61e7fb,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wireMesh);

    // 3. Orbital Particle Filaments
    const count = 240;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color(0x61e7fb),
      new THREE.Color(0x9d8cff),
      new THREE.Color(0x7bf1cd),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 1.35 + Math.random() * 0.45;
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
      size: 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleCloud = new THREE.Points(partGeo, partMat);
    group.add(particleCloud);

    // 4. Lighting & Dynamic Glow Points
    const mainLight = new THREE.PointLight(0x61e7fb, 4, 10);
    mainLight.position.set(2, 3, 3);
    scene.add(mainLight);

    const purpleLight = new THREE.PointLight(0x9d8cff, 3, 10);
    purpleLight.position.set(-3, -2, 2);
    scene.add(purpleLight);

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

      coreMesh.rotation.y = elapsed * 0.4 + pointer.x;
      coreMesh.rotation.x = Math.sin(elapsed * 0.2) * 0.3 + pointer.y;

      wireMesh.rotation.y = -elapsed * 0.35 + pointer.x * 0.5;
      wireMesh.rotation.z = Math.cos(elapsed * 0.25) * 0.2;

      particleCloud.rotation.y = elapsed * 0.2;
      particleCloud.rotation.x = Math.sin(elapsed * 0.15) * 0.15;

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
      className="w-full h-[240px] sm:h-[300px] relative overflow-hidden rounded-2xl bg-slate-950/70 border border-cyan-500/20 my-4 shadow-2xl backdrop-blur-xl group"
    >
      <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-cyan-300 uppercase z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        Interactive 3D Beacon
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
