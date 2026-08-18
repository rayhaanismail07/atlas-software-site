"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const TECH_NODES = [
  { name: "TypeScript", color: 0x3178c6, pos: [1.2, 0.8, 0.5] },
  { name: "React", color: 0x61dafb, pos: [-1.1, 1.0, -0.4] },
  { name: "Next.js", color: 0xffffff, pos: [0.3, -1.2, 1.0] },
  { name: "Python", color: 0x4b8bbe, pos: [-1.4, -0.6, 0.8] },
  { name: "Node.js", color: 0x5fa04e, pos: [1.5, -0.7, -0.6] },
  { name: "PostgreSQL", color: 0x4169e1, pos: [-0.6, 1.4, 0.7] },
  { name: "Docker", color: 0x2496ed, pos: [0.8, 1.3, -0.9] },
  { name: "Azure", color: 0x0089d6, pos: [-0.9, -1.3, -0.8] },
  { name: "OpenAI", color: 0x74aa9c, pos: [0.0, 0.0, 1.6] },
  { name: ".NET", color: 0x8a5cd7, pos: [1.3, -0.2, -1.2] },
];

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach((item) => item.dispose());
    else if (material) material.dispose();
  });
}

export function Tech3DCanvas() {
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
    camera.position.set(0, 0, 5.5);

    const group = new THREE.Group();
    scene.add(group);

    // Central wireframe geodesic core
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const coreMat = new THREE.LineBasicMaterial({
      color: 0x00e1ff,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.LineSegments(new THREE.WireframeGeometry(coreGeo), coreMat);
    group.add(coreMesh);

    // Nodes & connections
    const nodeMeshes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];

    TECH_NODES.forEach((nodeData) => {
      const vec = new THREE.Vector3(...nodeData.pos);
      nodePositions.push(vec);

      const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const sphereMat = new THREE.MeshPhysicalMaterial({
        color: nodeData.color,
        emissive: nodeData.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });
      const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeMesh.position.copy(vec);
      group.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      // Glowing outer ring for each node
      const ringGeo = new THREE.TorusGeometry(0.18, 0.01, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: nodeData.color,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      nodeMesh.add(ringMesh);
    });

    // Connecting lines between nodes closer than threshold
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 2.5) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            nodePositions[i],
            nodePositions[j],
          ]);
          const lineMat = new THREE.LineBasicMaterial({
            color: 0x78edff,
            transparent: true,
            opacity: Math.max(0.1, (2.5 - dist) * 0.25),
            blending: THREE.AdditiveBlending,
          });
          const line = new THREE.Line(lineGeo, lineMat);
          group.add(line);
        }
      }
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x5eeaff, 2, 10);
    pointLight.position.set(2, 2, 3);
    scene.add(pointLight);

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
      pointerTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.8;
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

      group.rotation.y = elapsed * 0.2 + pointer.x;
      group.rotation.x = Math.sin(elapsed * 0.15) * 0.1 - pointer.y;

      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.y = elapsed * 0.8 + idx;
        const scale = 1 + Math.sin(elapsed * 2 + idx) * 0.08;
        mesh.scale.setScalar(scale);
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
    <div ref={shellRef} className="w-full h-[280px] sm:h-[340px] relative overflow-hidden rounded-2xl bg-slate-950/40 border border-cyan-500/10 my-6">
      <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-cyan-400/70 uppercase z-10 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        3D Tech Constellation
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
