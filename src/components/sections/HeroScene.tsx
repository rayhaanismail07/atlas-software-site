"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type OrbitalNode = {
  mesh: THREE.Mesh;
  orbitRadius: number;
  speed: number;
  angle: number;
  orbitGroup: THREE.Group;
};

type CityNode = {
  name: string;
  lat: number;
  lon: number;
};

type DataPacket = {
  curve: THREE.CatmullRomCurve3;
  mesh: THREE.Mesh;
  progress: number;
  speed: number;
};

type PingRing = {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  phaseOffset: number;
};

// Generates procedural soft circular glow texture for additive lighting
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const center = 64;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.18, "rgba(180, 245, 255, 0.95)");
    gradient.addColorStop(0.42, "rgba(0, 225, 255, 0.65)");
    gradient.addColorStop(0.72, "rgba(0, 119, 255, 0.2)");
    gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Converts Latitude / Longitude to Cartesian 3D Vector
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Global Tech Hubs
const CITY_NODES: CityNode[] = [
  { name: "San Francisco", lat: 37.77, lon: -122.42 },
  { name: "New York", lat: 40.71, lon: -74.01 },
  { name: "London", lat: 51.51, lon: -0.13 },
  { name: "Frankfurt", lat: 50.11, lon: 8.68 },
  { name: "Tokyo", lat: 35.68, lon: 139.65 },
  { name: "Singapore", lat: 1.35, lon: 103.82 },
  { name: "Sydney", lat: -33.87, lon: 151.21 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "São Paulo", lat: -23.55, lon: -46.63 },
  { name: "Stockholm", lat: 59.33, lon: 18.07 },
];

const ARC_CONNECTIONS: [number, number][] = [
  [0, 2], // SF -> London
  [1, 3], // NY -> Frankfurt
  [2, 4], // London -> Tokyo
  [3, 7], // Frankfurt -> Dubai
  [7, 5], // Dubai -> Singapore
  [4, 5], // Tokyo -> Singapore
  [5, 6], // Singapore -> Sydney
  [1, 8], // NY -> São Paulo
  [0, 4], // SF -> Tokyo
  [2, 9], // London -> Stockholm
];

// Generates high-density continental landmass point cloud with uniform sphere distribution
function generateContinentPoints(radius: number, totalTarget = 2800) {
  const positions: number[] = [];
  const scales: number[] = [];
  const phases: number[] = [];

  const isInLand = (lat: number, lon: number) => {
    // North America & Central America
    if (lat >= 10 && lat <= 72 && lon >= -168 && lon <= -52) return true;
    // South America
    if (lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34) return true;
    // Europe & UK & Scandinavia
    if (lat >= 36 && lat <= 71 && lon >= -12 && lon <= 45) return true;
    // Africa & Madagascar
    if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 51) return true;
    // Asia & Middle East & India & China & Japan
    if (lat >= 5 && lat <= 75 && lon >= 35 && lon <= 180) return true;
    // Southeast Asia & Indonesia
    if (lat >= -10 && lat <= 20 && lon >= 95 && lon <= 135) return true;
    // Australia & New Zealand
    if (lat >= -47 && lat <= -10 && lon >= 112 && lon <= 178) return true;
    return false;
  };

  let count = 0;
  let attempts = 0;
  const maxAttempts = totalTarget * 12;

  while (count < totalTarget && attempts < maxAttempts) {
    attempts++;
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const lat = 90 - (phi * 180) / Math.PI;
    const lon = (theta * 180) / Math.PI - 180;

    if (isInLand(lat, lon)) {
      const r = radius + (Math.random() - 0.5) * 0.025;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions.push(x, y, z);
      scales.push(0.85 + Math.random() * 0.55);
      phases.push(Math.random() * Math.PI * 2);
      count++;
    }
  }

  return {
    positions: new Float32Array(positions),
    scales: new Float32Array(scales),
    phases: new Float32Array(phases),
  };
}

function createGlowingRing(radius: number, thickness: number, colorHex: number, opacity: number) {
  const geometry = new THREE.TorusGeometry(radius, thickness, 16, 220);
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
    camera.position.set(0, 0.2, 8.2);

    const root = new THREE.Group();
    scene.add(root);

    const glowTexture = createGlowTexture();
    const globeRadius = 1.68;

    // 1. Dark Glossy Core Shell (Translucent deep Obsidian Glass)
    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius, 64, 64),
      new THREE.MeshPhysicalMaterial({
        color: 0x03060a,
        roughness: 0.08,
        metalness: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.92,
      }),
    );
    root.add(coreMesh);

    // 2. Internal Pulsating Cyber Energy Core
    const globeGroup = new THREE.Group();
    root.add(globeGroup);

    const innerCoreGeo = new THREE.SphereGeometry(globeRadius * 0.7, 32, 32);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x0055ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    globeGroup.add(innerCore);

    // 3. Internal Counter-Rotating Holographic Geodesic Lattice (Neural Core)
    const latticeGeo = new THREE.IcosahedronGeometry(globeRadius * 0.88, 2);
    const latticeMat = new THREE.LineBasicMaterial({
      color: 0x00e1ff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const innerLattice = new THREE.LineSegments(new THREE.WireframeGeometry(latticeGeo), latticeMat);
    globeGroup.add(innerLattice);

    // 4. Volumetric Outer Atmospheric Corona Glow (Additive Shader Halo)
    const coronaGeo = new THREE.SphereGeometry(globeRadius * 1.25, 48, 48);
    const coronaMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uGlowColor: { value: new THREE.Color(0x00e1ff) },
        uDeepColor: { value: new THREE.Color(0x0044ff) },
      },
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
        uniform vec3 uGlowColor;
        uniform vec3 uDeepColor;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewPosition)), 0.0), 2.4);
          vec3 color = mix(uDeepColor, uGlowColor, fresnel * 1.3);
          gl_FragColor = vec4(color, fresnel * 0.95);
        }
      `,
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    root.add(corona);

    // 5. Inner Surface Rim Fresnel (Luminous Edge Highlight)
    const rimGeo = new THREE.SphereGeometry(globeRadius * 1.008, 48, 48);
    const rimMat = new THREE.ShaderMaterial({
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
          float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewPosition)), 0.0), 3.0);
          gl_FragColor = vec4(0.0, 0.92, 1.0, fresnel * 0.75);
        }
      `,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    root.add(rimMesh);

    // 6. Continental Landmass Point Matrix with Shimmering Waves & Scanning Crest
    const { positions: landPositions, scales: landScales, phases: landPhases } =
      generateContinentPoints(globeRadius * 1.015, 2800);

    const landGeometry = new THREE.BufferGeometry();
    landGeometry.setAttribute("position", new THREE.BufferAttribute(landPositions, 3));
    landGeometry.setAttribute("aScale", new THREE.BufferAttribute(landScales, 1));
    landGeometry.setAttribute("aPhase", new THREE.BufferAttribute(landPhases, 1));

    const landMaterial = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTexture: { value: glowTexture },
        uTime: { value: 0 },
        uScanY: { value: 0 },
      },
      vertexShader: `
        attribute float aScale;
        attribute float aPhase;
        uniform float uTime;
        uniform float uScanY;
        varying float vIntensity;
        varying vec3 vPos;
        
        void main() {
          vPos = position;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Wave ripple passing across continents
          float wave = sin(position.y * 3.5 + position.x * 2.0 + uTime * 2.5 + aPhase) * 0.5 + 0.5;
          
          // Scanner wave highlight
          float distToScan = abs(position.y - uScanY);
          float scanHighlight = smoothstep(0.35, 0.0, distToScan) * 1.5;
          
          vIntensity = 0.55 + 0.45 * wave + scanHighlight;
          
          float pointSize = (0.052 * aScale * (1.0 + scanHighlight * 0.55)) * (360.0 / -mvPosition.z);
          gl_PointSize = clamp(pointSize, 2.5, 16.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying float vIntensity;
        
        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          if (tex.a < 0.03) discard;
          
          vec3 cyan = vec3(0.0, 0.88, 1.0);
          vec3 whiteHot = vec3(0.85, 0.98, 1.0);
          vec3 col = mix(cyan, whiteHot, clamp((vIntensity - 0.75) * 1.5, 0.0, 1.0));
          
          gl_FragColor = vec4(col, tex.a * min(vIntensity, 1.3));
        }
      `,
    });

    const landDots = new THREE.Points(landGeometry, landMaterial);
    globeGroup.add(landDots);

    // 7. Sweeping Holographic Latitude Scanner Ring
    const scannerGroup = new THREE.Group();
    const scannerRing = createGlowingRing(globeRadius * 1.035, 0.007, 0x00f5ff, 0.75);
    scannerRing.rotation.x = Math.PI / 2;
    scannerGroup.add(scannerRing);
    globeGroup.add(scannerGroup);

    // 8. Equatorial Cyber Telemetry Belt
    const eqGeo = new THREE.RingGeometry(globeRadius * 1.02, globeRadius * 1.026, 64);
    const eqMat = new THREE.MeshBasicMaterial({
      color: 0x00e1ff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const eqRing = new THREE.Mesh(eqGeo, eqMat);
    eqRing.rotation.x = Math.PI / 2;
    globeGroup.add(eqRing);

    // 9. Global Tech Hubs & Pulsing Sonar Ping Rings
    const pingRings: PingRing[] = [];
    CITY_NODES.forEach((city, index) => {
      const pos = latLonToVector3(city.lat, city.lon, globeRadius * 1.018);

      // Core Anchor Node
      const hubCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.032, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending }),
      );
      hubCore.position.copy(pos);
      globeGroup.add(hubCore);

      // Node Halo Sprite
      const hubGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color: 0x00f5ff,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.9,
        }),
      );
      hubGlow.position.copy(pos);
      hubGlow.scale.set(0.18, 0.18, 1);
      globeGroup.add(hubGlow);

      // Vertical Telemetry Pillar
      const beamTop = pos.clone().normalize().multiplyScalar(globeRadius * 1.018 + 0.18);
      const beamGeo = new THREE.BufferGeometry().setFromPoints([pos, beamTop]);
      const beamMat = new THREE.LineBasicMaterial({
        color: 0x00e1ff,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      globeGroup.add(new THREE.Line(beamGeo, beamMat));

      // Sonar Surface Ping Ring
      const pingMat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const pingRingMesh = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.038, 24), pingMat);
      pingRingMesh.position.copy(pos.clone().multiplyScalar(1.002));
      const q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
      pingRingMesh.quaternion.copy(q);
      globeGroup.add(pingRingMesh);

      pingRings.push({
        mesh: pingRingMesh,
        material: pingMat,
        phaseOffset: index * 0.45,
      });
    });

    // 10. 3D Flight Arcs & Traveling Photons (Data Packets)
    const dataPackets: DataPacket[] = [];
    ARC_CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const c1 = CITY_NODES[startIdx];
      const c2 = CITY_NODES[endIdx];
      if (!c1 || !c2) return;

      const v1 = latLonToVector3(c1.lat, c1.lon, globeRadius * 1.018);
      const v2 = latLonToVector3(c2.lat, c2.lon, globeRadius * 1.018);
      const dist = v1.distanceTo(v2);

      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const archAltitude = globeRadius * 1.018 + dist * 0.32 + 0.14;
      mid.normalize().multiplyScalar(archAltitude);

      const p1 = v1.clone().lerp(mid, 0.45).normalize().multiplyScalar(globeRadius * 1.018 + dist * 0.22);
      const p2 = v2.clone().lerp(mid, 0.55).normalize().multiplyScalar(globeRadius * 1.018 + dist * 0.22);

      const curve = new THREE.CatmullRomCurve3([v1, p1, mid, p2, v2]);
      const arcPoints = curve.getPoints(44);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x00e1ff,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      globeGroup.add(new THREE.Line(arcGeo, arcMat));

      // Animated Glowing Data Packet
      const packetGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
      });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);

      const packetHaloMat = new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0x00f5ff,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
      });
      const packetHalo = new THREE.Sprite(packetHaloMat);
      packetHalo.scale.set(0.2, 0.2, 1);
      packetMesh.add(packetHalo);

      globeGroup.add(packetMesh);

      dataPackets.push({
        curve,
        mesh: packetMesh,
        progress: Math.random(),
        speed: 0.0035 + Math.random() * 0.004,
      });
    });

    // 11. Ambient Floating Cyber Dust (Orbiting Micro-Particles)
    const dustCount = 220;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = globeRadius * 1.35 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPositions[i * 3 + 1] = r * Math.cos(phi);
      dustPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      map: glowTexture,
      color: 0x00e1ff,
      size: 0.065,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    root.add(dustPoints);

    // 12. Three Interlocking Glowing Orbital Rings
    const ring1Group = new THREE.Group();
    ring1Group.rotation.set(0.85, 0.35, 0.4);
    const ring1 = createGlowingRing(2.28, 0.012, 0x00e1ff, 0.88);
    ring1Group.add(ring1);

    const ring2Group = new THREE.Group();
    ring2Group.rotation.set(-0.75, 0.7, -0.3);
    const ring2 = createGlowingRing(2.42, 0.012, 0x0077ff, 0.8);
    ring2Group.add(ring2);

    const ring3Group = new THREE.Group();
    ring3Group.rotation.set(1.25, -0.45, 0.15);
    const ring3 = createGlowingRing(2.58, 0.01, 0x00e1ff, 0.7);
    ring3Group.add(ring3);

    root.add(ring1Group, ring2Group, ring3Group);

    // 13. Glowing Orbital Nodes (Satellites)
    const orbitalNodes: OrbitalNode[] = [];
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
    });
    const nodeGlowMat = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x00f5ff,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
    });

    const addNodesToOrbit = (group: THREE.Group, radius: number, count: number, baseSpeed: number) => {
      for (let i = 0; i < count; i++) {
        const nodeGroup = new THREE.Group();
        const coreNode = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), nodeMat);
        const glowSprite = new THREE.Sprite(nodeGlowMat);
        glowSprite.scale.set(0.24, 0.24, 1);
        nodeGroup.add(coreNode, glowSprite);
        group.add(nodeGroup);

        orbitalNodes.push({
          mesh: coreNode,
          orbitRadius: radius,
          speed: baseSpeed + i * 0.002,
          angle: (i * (Math.PI * 2)) / count,
          orbitGroup: nodeGroup,
        });
      }
    };

    addNodesToOrbit(ring1Group, 2.28, 2, 0.014);
    addNodesToOrbit(ring2Group, 2.42, 2, -0.012);
    addNodesToOrbit(ring3Group, 2.58, 1, 0.009);

    // 14. Perspective Cyber Grid Ground Plane
    const gridHelper = new THREE.GridHelper(12, 30, 0x00e1ff, 0x003355);
    gridHelper.position.set(0, -2.4, 0);
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.22;
    root.add(gridHelper);

    // 15. Dynamic Lights
    const keyLight = new THREE.DirectionalLight(0x00e1ff, 2.8);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x0077ff, 18, 14);
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
      camera.position.z = compact ? 10.2 : 8.0;
      root.scale.setScalar(compact ? 0.74 : 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.45;
      pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.28;

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
        // Continuous Globe Continental Rotation & Drag Inertia
        globeGroup.rotation.y += dragVelocity.x + 0.0045;
        globeGroup.rotation.x += dragVelocity.y + Math.sin(elapsed * 0.3) * 0.0004;
        dragVelocity.x *= 0.92;
        dragVelocity.y *= 0.92;

        // Sweeping Latitude Scanner Wave
        const scanY = Math.sin(elapsed * 1.3) * (globeRadius * 0.88);
        scannerGroup.position.y = scanY;

        // Update Shader Uniforms for Dynamic Continental Shimmer & Scan Crest
        landMaterial.uniforms.uTime.value = elapsed;
        landMaterial.uniforms.uScanY.value = scanY;

        // Inner Pulsating Plasma Core (Cyber Heartbeat)
        const pulse = 1.0 + Math.sin(elapsed * 2.2) * 0.05;
        innerCore.scale.setScalar(pulse);
        innerCoreMat.opacity = 0.28 + Math.sin(elapsed * 2.2) * 0.12;

        // Inner Geodesic Lattice Counter-Rotation (Parallax Depth)
        innerLattice.rotation.y = -elapsed * 0.08;
        innerLattice.rotation.x = Math.sin(elapsed * 0.4) * 0.12;

        // Equatorial Belt Rotation
        eqRing.rotation.z = elapsed * 0.12;

        // Surface Sonar Ping Ripples
        pingRings.forEach((p) => {
          const prog = (elapsed * 0.85 + p.phaseOffset) % 1.0;
          p.mesh.scale.setScalar(1.0 + prog * 4.2);
          p.material.opacity = Math.max(0, 0.8 * (1.0 - prog));
        });

        // Fast Traveling Data Packets along 3D Arcs
        dataPackets.forEach((pkt) => {
          pkt.progress = (pkt.progress + pkt.speed) % 1.0;
          const pt = pkt.curve.getPoint(pkt.progress);
          pkt.mesh.position.copy(pt);
        });

        // Ambient Floating Cyber Dust Rotation
        dustPoints.rotation.y = elapsed * 0.016;
        dustPoints.rotation.x = Math.sin(elapsed * 0.2) * 0.05;

        // Orbital Rings Smooth Revolution
        ring1Group.rotation.z = elapsed * 0.09;
        ring2Group.rotation.z = -elapsed * 0.07;
        ring3Group.rotation.z = elapsed * 0.045;

        // Orbital Satellites Positioning
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
      glowTexture.dispose();
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
