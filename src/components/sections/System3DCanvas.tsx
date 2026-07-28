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

export function System3DCanvas() {
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
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    // Multi-tier server node pillars
    const pillars: THREE.Mesh[] = [];
    const pillarPositions = [
      [-1.4, -0.2, -0.8],
      [-0.4, 0.1, -0.8],
      [0.6, 0.4, -0.8],
      [1.4, 0.2, -0.8],
      [-0.9, -0.1, 0.5],
      [0.2, 0.3, 0.5],
      [1.1, 0.0, 0.5],
    ];

    pillarPositions.forEach(([x, y, z]) => {
      const geo = new THREE.BoxGeometry(0.35, y + 1.2, 0.35);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x082b36,
        emissive: 0x0a4a5c,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.8,
        clearcoat: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, (y - 0.8) / 2, z);
      group.add(mesh);
      pillars.push(mesh);

      // Glowing top cap
      const capGeo = new THREE.BoxGeometry(0.37, 0.04, 0.37);
      const capMat = new THREE.MeshBasicMaterial({
        color: 0x5eeaff,
        transparent: true,
        opacity: 0.8,
      });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.set(x, y + 0.42, z);
      group.add(capMesh);
    });

    // 3D Data Packets moving across nodes
    const packetCount = 18;
    const packetMeshes: THREE.Mesh[] = [];
    const packetData: Array<{ start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }> = [];

    const packetGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0x78edff,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < packetCount; i++) {
      const pMesh = new THREE.Mesh(packetGeo, packetMat);
      group.add(pMesh);
      packetMeshes.push(pMesh);

      const p1 = pillarPositions[i % pillarPositions.length];
      const p2 = pillarPositions[(i + 3) % pillarPositions.length];
      const start = new THREE.Vector3(p1[0], p1[1] + 0.45, p1[2]);
      const end = new THREE.Vector3(p2[0], p2[1] + 0.45, p2[2]);

      packetData.push({
        start,
        end,
        progress: (i / packetCount),
        speed: 0.008 + (i % 4) * 0.003,
      });
    }

    // Lights
    const keyLight = new THREE.DirectionalLight(0x5eeaff, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);
    const ambLight = new THREE.AmbientLight(0x0e2833, 1.2);
    scene.add(ambLight);

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
      pointerTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
      pointerTarget.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.3;
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

      group.rotation.y = Math.sin(elapsed * 0.2) * 0.15 + pointer.x;
      group.rotation.x = 0.1 + pointer.y;

      // Animate packet movement
      packetData.forEach((pkt, idx) => {
        pkt.progress = (pkt.progress + pkt.speed) % 1;
        const pos = new THREE.Vector3().lerpVectors(pkt.start, pkt.end, pkt.progress);
        pos.y += Math.sin(pkt.progress * Math.PI) * 0.25; // Arc trajectory
        packetMeshes[idx].position.copy(pos);
      });

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
    <div ref={shellRef} className="w-full h-[260px] sm:h-[320px] relative overflow-hidden rounded-2xl bg-slate-950/40 border border-cyan-500/10 my-8">
      <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-cyan-400/70 uppercase z-10 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        Real-Time 3D System Architecture Flow
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
