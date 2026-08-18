"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type OrbitalNode = {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  orbitRadius: number;
  speed: number;
  angle: number;
  orbitGroup: THREE.Group;
};

// Generates points on Earth's continental landmasses
function generateContinentPoints(radius: number, totalPoints = 1600): Float32Array {
  const positions: number[] = [];

  const isInLand = (lat: number, lon: number) => {
    // North America
    if (lat >= 15 && lat <= 72 && lon >= -168 && lon <= -52) return true;
    // South America
    if (lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34) return true;
    // Europe
    if (lat >= 36 && lat <= 71 && lon >= -10 && lon <= 45) return true;
    // Africa
    if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 51) return true;
    // Asia
    if (lat >= 8 && lat <= 75 && lon >= 45 && lon <= 180) return true;
    // Australia
    if (lat >= -44 && lat <= -10 && lon >= 112 && lon <= 154) return true;
    return false;
  };

  for (let i = 0; i < totalPoints * 4; i++) {
    const lat = (Math.random() - 0.5) * 180;
    const lon = (Math.random() - 0.5) * 360;

    if (isInLand(lat, lon)) {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon + 180);
      const r = radius + (Math.random() - 0.5) * 0.03;

      positions.push(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      );
    }
  }

  return new Float32Array(positions);
}

function createGlowingRing(radius: number, thickness: number, colorHex: number, opacity: number) {
  const geometry = new THREE.TorusGeometry(radius, thickness, 16, 200);
  const material = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.Mesh(geometry, material);
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach((item) => item.dispose());
    else if (material) material.dispose();
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.2, 8.2);

    const root = new THREE.Group();
    scene.add(root);

    // 1. Inner Dark Globe Core
    const globeRadius = 1.65;
    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius, 64, 64),
      new THREE.MeshPhysicalMaterial({
        color: 0x05070a,
        roughness: 0.1,
        metalness: 0.95,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.94,
      }),
    );
    root.add(coreMesh);

    // 2. Cyan Fresnel Atmospheric Halo Glow
    const atmosphereHalo = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius * 1.05, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
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
            gl_FragColor = vec4(0.0, 0.88, 1.0, fresnel * 0.75);
          }
        `,
      }),
    );
    root.add(atmosphereHalo);

    // 3. Continental Landmass Dot Matrix Cloud
    const globeGroup = new THREE.Group();
    root.add(globeGroup);

    const landPositions = generateContinentPoints(globeRadius * 1.01, 1600);
    const landGeometry = new THREE.BufferGeometry();
    landGeometry.setAttribute("position", new THREE.BufferAttribute(landPositions, 3));
    const landMaterial = new THREE.PointsMaterial({
      color: 0x00e1ff,
      size: 0.032,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const landDots = new THREE.Points(landGeometry, landMaterial);
    globeGroup.add(landDots);

    // Latitude / Longitude Subtle Line Grid
    const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius * 1.005, 24, 16));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x0077ff,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const wireGrid = new THREE.LineSegments(wireGeo, wireMat);
    globeGroup.add(wireGrid);

    // 4. Three Interlocking Glowing Orbital Rings (Exact Logo Matching)
    const ring1Group = new THREE.Group();
    ring1Group.rotation.set(0.85, 0.35, 0.4);
    const ring1 = createGlowingRing(2.25, 0.012, 0x00e1ff, 0.85);
    ring1Group.add(ring1);

    const ring2Group = new THREE.Group();
    ring2Group.rotation.set(-0.75, 0.7, -0.3);
    const ring2 = createGlowingRing(2.4, 0.012, 0x0077ff, 0.75);
    ring2Group.add(ring2);

    const ring3Group = new THREE.Group();
    ring3Group.rotation.set(1.25, -0.45, 0.15);
    const ring3 = createGlowingRing(2.55, 0.01, 0x00e1ff, 0.65);
    ring3Group.add(ring3);

    root.add(ring1Group, ring2Group, ring3Group);

    // 5. Glowing Cyan Orbital Nodes (Spheres anchoring on the rings)
    const orbitalNodes: OrbitalNode[] = [];
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
    });
    const nodeGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00e1ff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const addNodesToOrbit = (group: THREE.Group, radius: number, count: number, baseSpeed: number) => {
      for (let i = 0; i < count; i++) {
        const nodeGroup = new THREE.Group();
        const coreNode = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), nodeMat);
        const glowNode = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), nodeGlowMat);
        nodeGroup.add(coreNode, glowNode);
        group.add(nodeGroup);

        orbitalNodes.push({
          mesh: coreNode,
          orbitRadius: radius,
          speed: baseSpeed + (i * 0.002),
          angle: (i * (Math.PI * 2)) / count,
          orbitGroup: nodeGroup,
        });
      }
    };

    addNodesToOrbit(ring1Group, 2.25, 2, 0.012);
    addNodesToOrbit(ring2Group, 2.4, 2, -0.01);
    addNodesToOrbit(ring3Group, 2.55, 1, 0.008);

    // 6. Perspective Cyber Grid Ground Plane (Matching Logo Bottom)
    const gridHelper = new THREE.GridHelper(12, 30, 0x00e1ff, 0x004466);
    gridHelper.position.set(0, -2.4, 0);
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.25;
    root.add(gridHelper);

    // 7. Lighting
    const keyLight = new THREE.DirectionalLight(0x00e1ff, 2.5);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x0077ff, 15, 12);
    fillLight.position.set(-4, -2, 4);
    scene.add(fillLight);

    let active = true;
    let visible = true;
    let frame = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const dragVelocity = { x: 0, y: 0 };

    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();

    const resize = () => {
      const rect = shell.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const compact = width < 560;
      camera.position.z = compact ? 10.4 : 8.2;
      root.scale.setScalar(compact ? 0.72 : 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
      pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.3;

      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        dragVelocity.x = deltaX * 0.008;
        dragVelocity.y = deltaY * 0.008;
        previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onPointerLeave = () => {
      isDragging = false;
      pointerTarget.set(0, 0);
    };

    const onVisibilityChange = () => {
      active = document.visibilityState === "visible";
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
    shell.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    shell.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();

    const render = () => {
      frame = window.requestAnimationFrame(render);
      if (!active || !visible) return;

      const elapsed = clock.getElapsedTime();
      pointer.lerp(pointerTarget, 0.05);

      if (!reduceMotion) {
        // Globe Continental Rotation
        globeGroup.rotation.y += dragVelocity.x + 0.004;
        globeGroup.rotation.x += dragVelocity.y + Math.sin(elapsed * 0.3) * 0.0005;
        dragVelocity.x *= 0.92;
        dragVelocity.y *= 0.92;

        // Orbital Ring Rotation
        ring1Group.rotation.z = elapsed * 0.08;
        ring2Group.rotation.z = -elapsed * 0.06;
        ring3Group.rotation.z = elapsed * 0.04;

        // Orbital Nodes Positioning along Torus Curve
        orbitalNodes.forEach((node) => {
          node.angle += node.speed;
          node.orbitGroup.position.set(
            Math.cos(node.angle) * node.orbitRadius,
            Math.sin(node.angle) * node.orbitRadius,
            0,
          );
        });
      }

      root.rotation.y = -0.15 + pointer.x;
      root.rotation.x = -0.05 - pointer.y;
      renderer.render(scene, camera);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      shell.removeEventListener("pointermove", onPointerMove);
      shell.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      shell.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      disposeObject(scene);
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
    <div ref={shellRef} className="hero-three cursor-grab active:cursor-grabbing" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
