"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type OrbitalNode = {
  mesh: THREE.Mesh;
  halo: THREE.Sprite;
  orbitRadius: number;
  speed: number;
  angle: number;
  orbitGroup: THREE.Group;
};

// Generates procedural soft circular glow texture for satellite lens flares
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const center = 64;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.2, "rgba(180, 245, 255, 0.95)");
    gradient.addColorStop(0.45, "rgba(0, 225, 255, 0.7)");
    gradient.addColorStop(0.75, "rgba(0, 119, 255, 0.25)");
    gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Generates procedural circular texture for luminous, sharp continent beads
function createDotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const center = 32;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 28);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.3, "rgba(120, 245, 255, 0.98)");
    gradient.addColorStop(0.65, "rgba(0, 220, 255, 0.75)");
    gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Ray-casting point-in-polygon algorithm for geographical coordinates
function pointInPolygon(x: number, y: number, vs: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// High-fidelity continent boundary polygons [lon, lat] for realistic Earth geography
const CONTINENTS: number[][][] = [
  // North America (Alaska, Canada, USA, Mexico, Central America)
  [
    [-168, 65], [-162, 70], [-140, 70], [-125, 70], [-105, 74], [-80, 72], [-65, 62],
    [-55, 52], [-60, 46], [-66, 44], [-70, 42], [-76, 35], [-81, 25], [-80, 25],
    [-83, 29], [-89, 30], [-97, 26], [-97, 21], [-89, 21], [-88, 16], [-83, 9],
    [-77, 8], [-80, 16], [-87, 13], [-96, 16], [-105, 20], [-109, 23], [-115, 32],
    [-120, 35], [-124, 38], [-124, 48], [-130, 54], [-140, 60], [-160, 58], [-168, 65],
  ],
  // Greenland
  [
    [-55, 60], [-40, 60], [-20, 70], [-18, 77], [-25, 83], [-45, 83], [-58, 77], [-55, 60],
  ],
  // South America
  [
    [-77, 8], [-72, 11], [-60, 10], [-50, 0], [-38, -4], [-35, -7], [-37, -13],
    [-39, -18], [-43, -23], [-48, -28], [-53, -33], [-58, -38], [-65, -44],
    [-68, -54], [-73, -53], [-75, -45], [-72, -37], [-71, -30], [-76, -18],
    [-80, -5], [-81, 2], [-77, 8],
  ],
  // Europe
  [
    [-9, 36], [-5, 36], [0, 37], [10, 38], [15, 40], [25, 37], [28, 41],
    [32, 46], [38, 47], [42, 55], [45, 65], [40, 68], [30, 70], [24, 66],
    [20, 60], [15, 54], [5, 50], [0, 48], [-4, 48], [-9, 43], [-9, 36],
  ],
  // Scandinavia
  [
    [5, 58], [10, 58], [13, 56], [18, 59], [25, 65], [30, 70], [24, 71],
    [15, 69], [10, 64], [5, 62], [5, 58],
  ],
  // Great Britain & Ireland
  [
    [-10, 51], [-6, 50], [-1, 51], [2, 53], [0, 58], [-3, 58], [-5, 55],
    [-6, 54], [-10, 54], [-10, 51],
  ],
  // Africa
  [
    [-6, 36], [0, 36], [11, 37], [20, 33], [26, 32], [32, 31], [33, 27],
    [39, 22], [43, 13], [51, 12], [47, 8], [42, -1], [40, -10], [35, -24],
    [32, -29], [28, -33], [20, -35], [17, -33], [12, -22], [12, -10],
    [9, 4], [3, 6], [-5, 5], [-12, 8], [-17, 15], [-17, 21], [-13, 28], [-6, 36],
  ],
  // Madagascar
  [
    [44, -13], [50, -14], [50, -20], [47, -25], [44, -25], [44, -13],
  ],
  // Middle East & Western Asia
  [
    [35, 32], [42, 38], [50, 40], [60, 42], [70, 45], [80, 50], [80, 70],
    [60, 72], [45, 67], [38, 55], [35, 42], [35, 32],
  ],
  // Arabian Peninsula
  [
    [35, 30], [44, 30], [55, 26], [60, 22], [58, 17], [53, 16], [44, 13], [38, 20], [35, 30],
  ],
  // India
  [
    [68, 24], [73, 25], [80, 25], [88, 23], [85, 18], [80, 13], [77, 8], [75, 12], [72, 18], [68, 24],
  ],
  // East Asia & Siberia
  [
    [80, 50], [100, 50], [120, 52], [140, 55], [165, 60], [175, 65], [170, 72],
    [130, 75], [90, 75], [80, 70], [80, 50],
  ],
  // Southeast Asia & China
  [
    [88, 23], [100, 25], [115, 22], [122, 30], [120, 40], [100, 42], [85, 35], [88, 23],
  ],
  // Australia
  [
    [114, -22], [125, -15], [136, -12], [143, -11], [148, -20], [153, -28],
    [150, -37], [140, -38], [130, -32], [117, -35], [114, -26], [114, -22],
  ],
];

function isLandmass(lon: number, lat: number): boolean {
  for (let i = 0; i < CONTINENTS.length; i++) {
    if (pointInPolygon(lon, lat, CONTINENTS[i])) return true;
  }
  return false;
}

// Generates uniform dot-matrix grid points for Earth continents matching reference image
function generateGridContinentPoints(radius: number): Float32Array {
  const positions: number[] = [];
  const step = 2.0; // 2.0 degree regular dot matrix grid

  for (let lat = -68; lat <= 76; lat += step) {
    for (let lon = -180; lon < 180; lon += step) {
      if (isLandmass(lon, lat)) {
        const phi = THREE.MathUtils.degToRad(90 - lat);
        const theta = THREE.MathUtils.degToRad(lon + 180);

        positions.push(
          -(radius * Math.sin(phi) * Math.cos(theta)),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta),
        );
      }
    }
  }

  return new Float32Array(positions);
}

function createGlowingRing(
  radius: number,
  tubeThickness: number,
  colorHex: number,
  opacity: number,
): THREE.Group {
  const group = new THREE.Group();

  // Core sharp neon tube
  const coreGeo = new THREE.TorusGeometry(radius, tubeThickness, 16, 220);
  const coreMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(coreGeo, coreMat));

  // Soft neon bloom halo
  const bloomGeo = new THREE.TorusGeometry(radius, tubeThickness * 2.8, 12, 160);
  const bloomMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: opacity * 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(bloomGeo, bloomMat));

  return group;
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((item) => {
        if ("map" in item && item.map) (item.map as THREE.Texture).dispose();
        item.dispose();
      });
    } else if (material) {
      if ("map" in material && material.map) (material.map as THREE.Texture).dispose();
      material.dispose();
    }
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.1, 8.2);

    const root = new THREE.Group();
    scene.add(root);

    const glowTexture = createGlowTexture();
    const dotTexture = createDotTexture();
    const globeRadius = 1.68;

    // 1. Soft Cosmic Atmosphere Haze Sprite (Behind the globe, NO hard outer border)
    const atmosphereHaze = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0x00d4ff,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
      }),
    );
    atmosphereHaze.position.set(0, 0.12, -0.25);
    atmosphereHaze.scale.set(globeRadius * 3.2, globeRadius * 3.2, 1);
    root.add(atmosphereHaze);

    // 2. Dark Glossy Core Shell (Deep Obsidian Space Navy Sphere)
    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0x020710,
        roughness: 0.85,
        metalness: 0.15,
      }),
    );
    coreMesh.renderOrder = 0;
    root.add(coreMesh);

    // 3. Top-Lit Crescent Rim Glow Shader (Directly on sphere surface, exact match to reference image)
    const rimMesh = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius * 1.004, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.FrontSide,
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
            float fresnel = 1.0 - max(dot(vNormal, normalize(vViewPosition)), 0.0);
            fresnel = pow(fresnel, 3.2);
            
            // Peak glow at top zenith (12 o'clock) matching the reference image specular crescent
            float topZenith = smoothstep(0.05, 0.92, vNormal.y);
            float intensity = fresnel * topZenith * 2.2;
            
            vec3 neonCyan = vec3(0.0, 0.95, 1.0);
            vec3 pureWhite = vec3(0.9, 0.98, 1.0);
            vec3 color = mix(neonCyan, pureWhite, pow(fresnel, 2.5));
            
            gl_FragColor = vec4(color, intensity);
          }
        `,
      }),
    );
    rimMesh.renderOrder = 1;
    root.add(rimMesh);

    const globeGroup = new THREE.Group();
    // Rotate globe to ~295° (5.15 rad) so Americas & Europe/Africa face the viewer exactly like reference image
    globeGroup.rotation.y = 5.15;
    globeGroup.renderOrder = 2;
    root.add(globeGroup);

    // 4. Continental Landmass Points Matrix in Vibrant Electric Cyan (Direct Match to Image)
    const landPositions = generateGridContinentPoints(globeRadius * 1.02);
    const landGeometry = new THREE.BufferGeometry();
    landGeometry.setAttribute("position", new THREE.BufferAttribute(landPositions, 3));

    const landMaterial = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.105,
      map: dotTexture,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const landDots = new THREE.Points(landGeometry, landMaterial);
    landDots.renderOrder = 2;
    globeGroup.add(landDots);

    // 5. Three Distinct Glowing Neon Orbital Rings (Exact Geometry to Reference Image)
    // Ring 1: Diagonal loop tilted bottom-left to top-right across the globe face
    const ring1Group = new THREE.Group();
    ring1Group.rotation.set(0.92, 0.38, 0.35);
    const ring1 = createGlowingRing(2.36, 0.014, 0x00f0ff, 0.98);
    ring1Group.add(ring1);

    // Ring 2: Diagonal loop crossing from top-left to bottom-right across the globe face
    const ring2Group = new THREE.Group();
    ring2Group.rotation.set(-0.85, 0.52, -0.38);
    const ring2 = createGlowingRing(2.44, 0.014, 0x00d2ff, 0.92);
    ring2Group.add(ring2);

    // Ring 3: Lower-mid encircling elliptical loop
    const ring3Group = new THREE.Group();
    ring3Group.rotation.set(1.34, -0.22, 0.12);
    const ring3 = createGlowingRing(2.55, 0.012, 0x00e8ff, 0.88);
    ring3Group.add(ring3);

    root.add(ring1Group, ring2Group, ring3Group);

    // 6. Four Glowing Satellite Nodes on the Rings (Matching Reference Image Positions)
    const orbitalNodes: OrbitalNode[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.048, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
    });
    const haloMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x00f0ff,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.98,
      depthWrite: false,
    });

    const addSatellite = (
      group: THREE.Group,
      radius: number,
      initialAngle: number,
      speed: number,
      haloScale = 0.65,
    ) => {
      const nodeGroup = new THREE.Group();
      const coreNode = new THREE.Mesh(nodeGeo, nodeMat);
      const haloSprite = new THREE.Sprite(haloMat.clone());
      haloSprite.scale.set(haloScale, haloScale, 1);
      nodeGroup.add(coreNode, haloSprite);
      group.add(nodeGroup);

      orbitalNodes.push({
        mesh: coreNode,
        halo: haloSprite,
        orbitRadius: radius,
        speed,
        angle: initialAngle,
        orbitGroup: nodeGroup,
      });
    };

    // Node 1: Top-Right on Ring 1 (Matching reference image position)
    addSatellite(ring1Group, 2.36, 0.82, 0.005, 0.68);
    // Node 2: Bottom-Left on Ring 1 (Matching reference image position)
    addSatellite(ring1Group, 2.36, Math.PI + 0.65, 0.005, 0.62);
    // Node 3: Far-Left on Ring 2 (Matching reference image position)
    addSatellite(ring2Group, 2.44, Math.PI * 0.92, -0.004, 0.62);
    // Node 4: Bottom-Center on Ring 3 (Matching reference image position)
    addSatellite(ring3Group, 2.55, -0.32, 0.006, 0.58);

    // 7. Ambient Cyber Grid Floor (Faint Perspective Floor at Base)
    const gridHelper = new THREE.GridHelper(12, 28, 0x00e1ff, 0x002244);
    gridHelper.position.set(0, -2.4, 0);
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.22;
    root.add(gridHelper);

    // 8. Dynamic Lights
    const keyLight = new THREE.DirectionalLight(0x00f0ff, 3.5);
    keyLight.position.set(0, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x0077ff, 14, 12);
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
      camera.position.z = compact ? 10.2 : 8.1;
      root.scale.setScalar(compact ? 0.74 : 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.45;
      pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.28;

      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        dragVelocity.x = deltaX * 0.005;
        dragVelocity.y = deltaY * 0.005;
        root.rotation.y += dragVelocity.x;
        root.rotation.x += dragVelocity.y;
        previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
      dragVelocity.x = 0;
      dragVelocity.y = 0;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    observer.observe(shell);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerdown", onPointerDown);
    resize();

    const animate = () => {
      if (!active) return;
      frame = requestAnimationFrame(animate);
      if (!visible) return;

      const elapsed = clock.getElapsedTime();

      // Inertia drag damping
      if (!isDragging) {
        dragVelocity.x *= 0.94;
        dragVelocity.y *= 0.94;
        root.rotation.y += dragVelocity.x;
        root.rotation.x += dragVelocity.y;
      }

      // Smooth pointer parallax
      pointer.x += (pointerTarget.x - pointer.x) * 0.05;
      pointer.y += (pointerTarget.y - pointer.y) * 0.05;

      if (!isDragging) {
        root.rotation.y = pointer.x * 0.6;
        root.rotation.x = -pointer.y * 0.45;
      }

      // Smooth futuristic globe rotation
      if (!reduceMotion) {
        globeGroup.rotation.y += 0.0016;

        // Subtle dynamic breath/pulse in continent dots size
        landMaterial.size = 0.105 + Math.sin(elapsed * 2.2) * 0.008;

        // Gentle floating wobble in rings
        ring1Group.rotation.z = 0.35 + Math.sin(elapsed * 0.8) * 0.03;
        ring2Group.rotation.x = -0.85 + Math.cos(elapsed * 0.7) * 0.025;
        ring3Group.rotation.y = -0.22 + Math.sin(elapsed * 0.6) * 0.03;
      }

      // Orbit satellite nodes along their rings
      for (let i = 0; i < orbitalNodes.length; i++) {
        const node = orbitalNodes[i];
        if (!reduceMotion) {
          node.angle += node.speed;
        }
        const x = Math.cos(node.angle) * node.orbitRadius;
        const y = Math.sin(node.angle) * node.orbitRadius;
        node.orbitGroup.position.set(x, y, 0);

        // Pulse flare halo
        const pulse = 1.0 + Math.sin(elapsed * 4.0 + i * 1.5) * 0.12;
        node.halo.scale.set(0.65 * pulse, 0.65 * pulse, 1);
      }

      renderer.render(scene, camera);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      disposeObject(root);
      glowTexture.dispose();
      dotTexture.dispose();
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
    <div ref={shellRef} className="hero-three" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
