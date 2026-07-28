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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const group = new THREE.Group();
    scene.add(group);

    // Glowing 3D Crystalline Torus Knot Core
    const knotGeo = new THREE.TorusKnotGeometry(0.85, 0.22, 100, 16);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0x072832,
      emissive: 0x095b6d,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.15,
      clearcoat: 1.0,
      wireframe: false,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    group.add(knotMesh);

    // Outer Crystalline Wireframe Overlay
    const wireGeo = new THREE.WireframeGeometry(knotGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x5eeaff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wireMesh);

    // Orbiting particle ring
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const theta = u * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.4;
      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = radius * Math.sin(theta);
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x78edff,
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleRing = new THREE.Points(partGeo, partMat);
    group.add(particleRing);

    // Volumetric Ambient Lighting
    const keyLight = new THREE.DirectionalLight(0x5eeaff, 3);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);
    const fillLight = new THREE.AmbientLight(0x0e2833, 1.2);
    scene.add(fillLight);

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
      pointerTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      pointerTarget.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
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

      group.rotation.y = elapsed * 0.4 + pointer.x;
      group.rotation.x = Math.sin(elapsed * 0.2) * 0.2 + pointer.y;
      particleRing.rotation.y = -elapsed * 0.6;

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
    <div ref={shellRef} className="w-full h-[220px] sm:h-[280px] relative overflow-hidden rounded-2xl bg-slate-950/40 border border-cyan-500/10 my-4">
      <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-cyan-400/70 uppercase z-10 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        Interactive 3D Core
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
