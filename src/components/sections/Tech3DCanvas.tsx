"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type TechNode = {
  name: string;
  color: number;
  radius: number;
  speed: number;
  orbitAngle: number;
  orbitTilt: [number, number, number];
  size: number;
};

const TECH_NODES: TechNode[] = [
  { name: "TypeScript", color: 0x3178c6, radius: 1.35, speed: 0.38, orbitAngle: 0.0, orbitTilt: [0.35, 0.2, 0.1], size: 0.085 },
  { name: "React", color: 0x61dafb, radius: 1.55, speed: 0.30, orbitAngle: 1.1, orbitTilt: [-0.4, 0.5, -0.2], size: 0.09 },
  { name: "Next.js", color: 0xffffff, radius: 1.78, speed: 0.26, orbitAngle: 2.3, orbitTilt: [0.55, -0.3, 0.4], size: 0.09 },
  { name: "Python", color: 0x4b8bbe, radius: 1.42, speed: 0.34, orbitAngle: 3.5, orbitTilt: [0.1, 0.7, -0.35], size: 0.085 },
  { name: "Node.js", color: 0x5fa04e, radius: 1.68, speed: 0.28, orbitAngle: 4.6, orbitTilt: [-0.6, -0.2, 0.5], size: 0.085 },
  { name: "PostgreSQL", color: 0x4169e1, radius: 1.50, speed: 0.32, orbitAngle: 5.4, orbitTilt: [0.45, 0.4, -0.15], size: 0.085 },
  { name: "Docker", color: 0x2496ed, radius: 1.90, speed: 0.22, orbitAngle: 0.7, orbitTilt: [-0.25, 0.8, 0.3], size: 0.08 },
  { name: "Azure", color: 0x0089d6, radius: 1.60, speed: 0.29, orbitAngle: 1.9, orbitTilt: [0.3, -0.6, -0.4], size: 0.08 },
  { name: "OpenAI", color: 0x00e1ff, radius: 1.25, speed: 0.42, orbitAngle: 2.9, orbitTilt: [-0.5, 0.1, 0.6], size: 0.09 },
  { name: "Tailwind", color: 0x06b6d4, radius: 1.75, speed: 0.24, orbitAngle: 4.1, orbitTilt: [0.6, 0.35, 0.2], size: 0.08 },
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.15, 5.0);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Central Holographic Quantum Tech Core (Refined compact scale)
    const coreGroup = new THREE.Group();
    worldGroup.add(coreGroup);

    // Inner dark reflective nucleus
    const nucleusGeo = new THREE.IcosahedronGeometry(0.72, 4);
    const nucleusMat = new THREE.MeshPhysicalMaterial({
      color: 0x050c12,
      emissive: 0x002c3d,
      emissiveIntensity: 0.75,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.94,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleusMesh);

    // Luminous Geodesic Wireframe Overlay
    const wireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.78, 2));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x00e1ff,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // Core Outer Fresnel Glow Halo
    const haloGeo = new THREE.SphereGeometry(0.86, 32, 32);
    const haloMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewPosition)), 0.0), 2.2);
          gl_FragColor = vec4(0.0, 0.88, 1.0, fresnel * 0.4);
        }
      `,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    coreGroup.add(haloMesh);

    // 2. Concentric Orbital Energy Rings
    const orbitRingGeos: THREE.BufferGeometry[] = [];
    const orbitRingMats: THREE.Material[] = [];
    const orbitRingRotations = [
      new THREE.Euler(0.4, 0.2, 0.1),
      new THREE.Euler(-0.35, 0.5, -0.2),
      new THREE.Euler(0.6, -0.3, 0.4),
      new THREE.Euler(-0.25, 0.8, 0.3),
    ];

    [1.35, 1.55, 1.78, 1.95].forEach((radius, idx) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.006, 8, 140);
      orbitRingGeos.push(ringGeo);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x00e1ff : 0x0077ff,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      orbitRingMats.push(ringMat);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.copy(orbitRingRotations[idx]);
      worldGroup.add(ringMesh);
    });

    // 3. Orbiting Tech Satellite Nodes
    const nodeMeshes: Array<{
      group: THREE.Group;
      sphere: THREE.Mesh;
      ring: THREE.Mesh;
      node: TechNode;
    }> = [];

    TECH_NODES.forEach((node) => {
      const nodeGroup = new THREE.Group();
      worldGroup.add(nodeGroup);

      // Node sphere
      const sphereGeo = new THREE.SphereGeometry(node.size, 18, 18);
      const sphereMat = new THREE.MeshPhysicalMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.85,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeGroup.add(sphereMesh);

      // Node subtle planetary ring
      const ringGeo = new THREE.TorusGeometry(node.size * 1.5, 0.006, 6, 28);
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.8;
      nodeGroup.add(ringMesh);

      nodeMeshes.push({
        group: nodeGroup,
        sphere: sphereMesh,
        ring: ringMesh,
        node,
      });
    });

    // 4. Harmonic Curved Data Streams
    const dataCurves: Array<{
      curve: THREE.QuadraticBezierCurve3;
      line: THREE.Line;
      pulse: THREE.Mesh;
      fromIdx: number;
      toIdx: number;
      speed: number;
      offset: number;
    }> = [];

    const connections = [
      [0, 1], // TS -> React
      [1, 2], // React -> Next.js
      [2, 9], // Next.js -> Tailwind
      [0, 4], // TS -> Node
      [3, 8], // Python -> OpenAI
      [8, 2], // OpenAI -> Next.js
      [4, 5], // Node -> Postgres
      [5, 7], // Postgres -> Azure
      [7, 6], // Azure -> Docker
    ];

    const pulseGeo = new THREE.SphereGeometry(0.022, 10, 10);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
    });

    connections.forEach(([fromIdx, toIdx], cIdx) => {
      const lineGeo = new THREE.BufferGeometry();
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00e1ff,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      worldGroup.add(line);

      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      worldGroup.add(pulse);

      const dummyCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      );

      dataCurves.push({
        curve: dummyCurve,
        line,
        pulse,
        fromIdx,
        toIdx,
        speed: 0.35 + (cIdx % 3) * 0.08,
        offset: cIdx / connections.length,
      });
    });

    // 5. Starlight Particle Atmosphere
    const starCount = 120;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 7;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 0.5;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x00e1ff,
      size: 0.018,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 6. Lighting
    const keyLight = new THREE.DirectionalLight(0x00e1ff, 3.2);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x0077ff, 4, 12);
    blueLight.position.set(-3, -2, 3);
    scene.add(blueLight);

    const ambientLight = new THREE.AmbientLight(0x0a141d, 1.2);
    scene.add(ambientLight);

    // 7. Interactive Lifecycle & Responsive Scaling
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

      const compact = width < 560;
      camera.position.z = compact ? 6.0 : 5.0;
      worldGroup.scale.setScalar(compact ? 0.82 : 1.0);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      pointerTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      pointerTarget.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
    };

    const onPointerLeave = () => {
      pointerTarget.set(0, 0);
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
    shell.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", () => {
      active = document.visibilityState === "visible";
    });

    resize();

    const getNodePos = (node: TechNode, time: number) => {
      const angle = node.orbitAngle + time * node.speed;
      const x = Math.cos(angle) * node.radius;
      const z = Math.sin(angle) * node.radius;
      const v = new THREE.Vector3(x, 0, z);

      const euler = new THREE.Euler(...node.orbitTilt);
      v.applyEuler(euler);
      return v;
    };

    const render = () => {
      frame = window.requestAnimationFrame(render);
      if (!active || !visible) return;

      const elapsed = clock.getElapsedTime();
      pointer.lerp(pointerTarget, 0.06);

      // Core rotation
      nucleusMesh.rotation.y = elapsed * 0.12;
      wireMesh.rotation.y = -elapsed * 0.08;
      wireMesh.rotation.x = Math.sin(elapsed * 0.3) * 0.05;
      starPoints.rotation.z = elapsed * 0.005;

      // Group tilt from mouse
      worldGroup.rotation.y = -0.15 + pointer.x + Math.sin(elapsed * 0.1) * 0.04;
      worldGroup.rotation.x = 0.12 - pointer.y + Math.cos(elapsed * 0.15) * 0.03;

      // Update tech nodes positions
      const currentPositions: THREE.Vector3[] = [];
      nodeMeshes.forEach(({ group, ring, node }, idx) => {
        const pos = getNodePos(node, elapsed);
        group.position.copy(pos);
        currentPositions.push(pos);

        group.rotation.y = elapsed * 0.8 + idx;
        ring.rotation.z = elapsed * 1.2;
      });

      // Update curved data streams
      dataCurves.forEach((curveObj) => {
        const start = currentPositions[curveObj.fromIdx];
        const end = currentPositions[curveObj.toIdx];
        if (start && end) {
          const mid = start
            .clone()
            .add(end)
            .multiplyScalar(0.5)
            .normalize()
            .multiplyScalar(0.9);

          curveObj.curve.v0.copy(start);
          curveObj.curve.v1.copy(mid);
          curveObj.curve.v2.copy(end);

          const pts = curveObj.curve.getPoints(24);
          curveObj.line.geometry.setFromPoints(pts);

          const progress = (elapsed * curveObj.speed + curveObj.offset) % 1;
          const pPos = curveObj.curve.getPoint(progress);
          curveObj.pulse.position.copy(pPos);
        }
      });

      renderer.render(scene, camera);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      shell.removeEventListener("pointermove", onPointerMove);
      shell.removeEventListener("pointerleave", onPointerLeave);
      disposeObject(scene);
      renderer.dispose();
    };
  }, []);

  if (!supported) return null;

  return (
    <div
      ref={shellRef}
      className="w-full h-[250px] sm:h-[290px] relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#070d14]/70 to-[#05080c]/90 border border-cyan-500/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] my-5 backdrop-blur-md"
    >
      <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase z-10 flex items-center gap-2 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        3D Tech Constellation &middot; Live System
      </div>
      <div className="absolute bottom-2.5 right-4 text-[9px] font-mono text-[#c0c0c8]/50 z-10 hidden sm:block select-none">
        Drag or move cursor to inspect system
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
