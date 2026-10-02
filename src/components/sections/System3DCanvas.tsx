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
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.4, 5.0);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    // Full-Stack Architecture System Nodes
    // Tier 1: Client / Web Tier (Top / Left)
    // Tier 2: API Gateway & Microservices (Center)
    // Tier 3: Database & Cloud Services (Bottom / Right)
    const systemNodes = [
      { name: "Client Web App", pos: [-2.1, 0.7, -0.2], color: 0x38bdf8, size: 0.22, shape: "box" },
      { name: "Client Mobile/Portal", pos: [-1.4, -0.6, 0.2], color: 0x60a5fa, size: 0.19, shape: "box" },
      { name: "API Gateway", pos: [-0.4, 0.35, 0.1], color: 0x0077ff, size: 0.26, shape: "octa" },
      { name: "Async Microservice", pos: [0.5, -0.4, 0.3], color: 0x2563eb, size: 0.22, shape: "octa" },
      { name: "Auth & Redis Cache", pos: [0.3, 0.8, -0.3], color: 0xa855f7, size: 0.18, shape: "sphere" },
      { name: "Postgres Database", pos: [1.6, 0.2, 0.0], color: 0x38bdf8, size: 0.28, shape: "cylinder" },
      { name: "Cloud & Storage Bucket", pos: [2.1, -0.7, -0.2], color: 0x10b981, size: 0.20, shape: "cylinder" },
    ];

    const nodeMeshes: THREE.Mesh[] = [];

    systemNodes.forEach((node) => {
      let geo: THREE.BufferGeometry;
      if (node.shape === "box") {
        geo = new THREE.BoxGeometry(node.size * 1.5, node.size * 1.5, node.size * 0.8);
      } else if (node.shape === "octa") {
        geo = new THREE.OctahedronGeometry(node.size, 1);
      } else if (node.shape === "cylinder") {
        geo = new THREE.CylinderGeometry(node.size, node.size, node.size * 1.2, 16);
      } else {
        geo = new THREE.IcosahedronGeometry(node.size, 2);
      }

      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x0a1017,
        emissive: node.color,
        emissiveIntensity: 0.75,
        roughness: 0.2,
        metalness: 0.85,
        clearcoat: 1.0,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(node.pos[0], node.pos[1], node.pos[2]);
      group.add(mesh);
      nodeMeshes.push(mesh);

      // Orbital halo ring for each node
      const haloGeo = new THREE.RingGeometry(node.size * 1.35, node.size * 1.45, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 3;
      mesh.add(halo);
    });

    // Connecting Network Data Conduits (Bezier Curves)
    const conduitConnections = [
      [0, 2], // Web -> Gateway
      [1, 2], // Mobile -> Gateway
      [2, 3], // Gateway -> Microservice
      [2, 4], // Gateway -> Auth/Cache
      [3, 5], // Microservice -> Postgres
      [3, 6], // Microservice -> Cloud
      [4, 5], // Auth/Cache -> Postgres
    ];

    const packetGeo = new THREE.SphereGeometry(0.035, 10, 10);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
    });

    const conduitStreams: Array<{
      curve: THREE.QuadraticBezierCurve3;
      packet: THREE.Mesh;
      speed: number;
      progress: number;
    }> = [];

    conduitConnections.forEach(([from, to], i) => {
      const p1 = new THREE.Vector3(...systemNodes[from].pos);
      const p2 = new THREE.Vector3(...systemNodes[to].pos);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += (i % 2 === 0 ? 0.35 : -0.25);
      mid.z += 0.2;

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(36);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x0077ff,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);

      // Floating data packet
      const packet = new THREE.Mesh(packetGeo, packetMat);
      group.add(packet);

      conduitStreams.push({
        curve,
        packet,
        speed: 0.007 + (i % 3) * 0.003,
        progress: i / conduitConnections.length,
      });
    });

    // Lighting
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x0077ff, 3.5, 12);
    blueLight.position.set(-2, -1, 3);
    scene.add(blueLight);

    const ambLight = new THREE.AmbientLight(0x091420, 1.2);
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
      const compact = width < 560;
      camera.position.z = compact ? 6.2 : 5.0;
      group.scale.setScalar(compact ? 0.78 : 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      pointerTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.4;
      pointerTarget.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.25;
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

      group.rotation.y = Math.sin(elapsed * 0.25) * 0.12 + pointer.x;
      group.rotation.x = pointer.y;

      // Animate nodes subtle floating rotation
      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.y += 0.01 + (idx % 3) * 0.005;
        mesh.rotation.x = Math.sin(elapsed + idx) * 0.15;
      });

      // Animate packet movement along conduits
      conduitStreams.forEach((stream) => {
        stream.progress = (stream.progress + stream.speed) % 1;
        const pt = stream.curve.getPoint(stream.progress);
        stream.packet.position.copy(pt);
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
    <div ref={shellRef} className="w-full h-[240px] sm:h-[300px] relative overflow-hidden my-4 pointer-events-auto">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
