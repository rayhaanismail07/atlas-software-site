"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Pulse = {
  curve: THREE.QuadraticBezierCurve3;
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  offset: number;
  speed: number;
};

function seededRandom(seed = 1847) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function spherePoint(radius: number, latitude: number, longitude: number) {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function lineFromPoints(points: THREE.Vector3[], opacity = 0.35) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0x5eeaff,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.Line(geometry, material);
}

function createOrbit(radius: number, scaleY: number, rotation: THREE.Euler, opacity: number) {
  const group = new THREE.Group();
  const geometry = new THREE.TorusGeometry(radius, 0.009, 8, 240);
  const material = new THREE.MeshBasicMaterial({
    color: 0x79edff,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.scale.y = scaleY;
  group.add(ring);
  group.rotation.copy(rotation);
  return group;
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
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.05, 8.2);

    const root = new THREE.Group();
    root.rotation.set(-0.12, -0.2, 0.05);
    scene.add(root);

    const core = new THREE.Group();
    root.add(core);

    // Inner glowing glass core
    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 5),
      new THREE.MeshPhysicalMaterial({
        color: 0x051a24,
        emissive: 0x084252,
        emissiveIntensity: 0.65,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 0.9,
        clearcoatRoughness: 0.15,
        transparent: true,
        opacity: 0.95,
      }),
    );
    core.add(inner);

    // Outer crystalline wireframe
    const wireGeometry = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.62, 3));
    const wire = new THREE.LineSegments(
      wireGeometry,
      new THREE.LineBasicMaterial({
        color: 0x52f4ed,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    core.add(wire);

    // Orbiting Dodecahedron Satellite Geometry
    const polyGroup = new THREE.Group();
    const dodecaWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(2.1, 0)),
      new THREE.LineBasicMaterial({
        color: 0x9b51e0,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      }),
    );
    polyGroup.add(dodecaWire);
    root.add(polyGroup);

    // Orbiting Octahedron Geometry Shard
    const octaMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.35, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0x00f2fe,
        emissive: 0x00c6ff,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9,
        wireframe: true,
      }),
    );
    octaMesh.position.set(2.4, 1.2, -0.8);
    root.add(octaMesh);

    const octaMesh2 = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.28, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0x7928ca,
        emissive: 0xff0080,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9,
        wireframe: true,
      }),
    );
    octaMesh2.position.set(-2.2, -1.4, 0.6);
    root.add(octaMesh2);

    // Atmospheric halo glow
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.82, 64, 64),
      new THREE.ShaderMaterial({
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
            gl_FragColor = vec4(0.2, 0.9, 1.0, fresnel * 0.42);
          }
        `,
      }),
    );
    core.add(halo);

    // Surface Point Cloud Constellation
    const random = seededRandom();
    const pointCount = 750;
    const pointPositions = new Float32Array(pointCount * 3);
    for (let index = 0; index < pointCount; index += 1) {
      const u = random();
      const v = random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const radius = 1.66 + random() * 0.06;
      pointPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pointPositions[index * 3 + 1] = radius * Math.cos(phi);
      pointPositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    const points = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({
        color: 0x92f5ff,
        size: 0.02,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    );
    core.add(points);

    // Global Node Beacons
    const locations: Array<[number, number]> = [
      [-26, 28],
      [51, -1],
      [25, 55],
      [1, 103],
      [40, -74],
      [-33, 151],
      [60, -120],
      [-45, -60],
    ];
    const nodeGeometry = new THREE.SphereGeometry(0.04, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0xeffdff,
      blending: THREE.AdditiveBlending,
    });
    locations.forEach(([latitude, longitude]) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(spherePoint(1.69, latitude, longitude));
      core.add(node);
    });

    // Interactive Data Pulses along Geodesic Arcs
    const paths: Array<[[number, number], [number, number]]> = [
      [[-26, 28], [51, -1]],
      [[-26, 28], [25, 55]],
      [[25, 55], [1, 103]],
      [[51, -1], [40, -74]],
      [[-26, 28], [-33, 151]],
      [[60, -120], [40, -74]],
      [[-45, -60], [-26, 28]],
    ];
    const pulses: Pulse[] = [];
    paths.forEach((path, index) => {
      const start = spherePoint(1.7, path[0][0], path[0][1]);
      const end = spherePoint(1.7, path[1][0], path[1][1]);
      const midpoint = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(2.25);
      const curve = new THREE.QuadraticBezierCurve3(start, midpoint, end);
      core.add(lineFromPoints(curve.getPoints(80), 0.32));

      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.038, 12, 12),
        new THREE.MeshBasicMaterial({
          color: index % 2 === 0 ? 0xffffff : 0x5eeaff,
          blending: THREE.AdditiveBlending,
        }),
      );
      core.add(pulse);
      pulses.push({ curve, mesh: pulse, offset: index / paths.length, speed: 0.06 + index * 0.007 });
    });

    // Orbital Rings
    const orbitOne = createOrbit(2.18, 0.47, new THREE.Euler(1.05, 0.08, 0.35), 0.38);
    const orbitTwo = createOrbit(2.45, 0.62, new THREE.Euler(0.32, 0.86, -0.48), 0.25);
    const orbitThree = createOrbit(2.72, 0.38, new THREE.Euler(1.34, -0.3, 0.18), 0.15);
    root.add(orbitOne, orbitTwo, orbitThree);

    // Orbit Satellites
    const satelliteGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0x9ff4ff });
    [orbitOne, orbitTwo, orbitThree].forEach((orbit, index) => {
      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
      satellite.position.set(index === 0 ? 2.18 : index === 1 ? -2.45 : 2.72, 0, 0);
      orbit.add(satellite);
    });

    // Deep background interactive particle dust
    const starsCount = 380;
    const starsPositions = new Float32Array(starsCount * 3);
    for (let index = 0; index < starsCount; index += 1) {
      starsPositions[index * 3] = (random() - 0.5) * 11;
      starsPositions[index * 3 + 1] = (random() - 0.5) * 8;
      starsPositions[index * 3 + 2] = (random() - 0.5) * 5 - 1;
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({
        color: 0x82e6ff,
        size: 0.016,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(stars);

    // Volumetric Lights
    const keyLight = new THREE.DirectionalLight(0xbaf8ff, 3.0);
    keyLight.position.set(3.5, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x21c5df, 32, 16);
    rimLight.position.set(-3.5, -1.8, 3.5);
    scene.add(rimLight);
    const accentLight = new THREE.PointLight(0x9d4edd, 24, 12);
    accentLight.position.set(3.0, -2.0, -2.0);
    scene.add(accentLight);
    const fillLight = new THREE.AmbientLight(0x5fb8c9, 1.1);
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
      camera.position.z = compact ? 9.4 : 8.2;
      root.scale.setScalar(compact ? 0.9 : 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.55;
      pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.35;

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
        core.rotation.y += dragVelocity.x + 0.007;
        core.rotation.x += dragVelocity.y + Math.sin(elapsed * 0.35) * 0.0008;
        dragVelocity.x *= 0.93;
        dragVelocity.y *= 0.93;

        polyGroup.rotation.x = elapsed * 0.05;
        polyGroup.rotation.y = elapsed * 0.03;

        octaMesh.rotation.x = elapsed * 0.8;
        octaMesh.rotation.y = elapsed * 0.5;
        octaMesh2.rotation.x = -elapsed * 0.6;
        octaMesh2.rotation.z = elapsed * 0.4;

        orbitOne.rotation.z += 0.0018;
        orbitTwo.rotation.z -= 0.0014;
        orbitThree.rotation.z += 0.0009;
        stars.rotation.z = elapsed * 0.005;

        pulses.forEach((pulse) => {
          const progress = (elapsed * pulse.speed + pulse.offset) % 1;
          pulse.mesh.position.copy(pulse.curve.getPoint(progress));
        });
      }

      root.rotation.y = -0.2 + pointer.x;
      root.rotation.x = -0.12 - pointer.y;
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
