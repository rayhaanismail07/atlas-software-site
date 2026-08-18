"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Floating3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return undefined;
    }

    renderer.setClearColor(0x05070a, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    camera.position.set(0, 0, 20);

    const spaceGroup = new THREE.Group();
    scene.add(spaceGroup);

    // 1. Multi-Tier Deep Spatial Starfield (5,000 Stars with Depth Layers)
    const starCount = 5000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const palette = [
      new THREE.Color(0x00e1ff), // Atlas Cyan
      new THREE.Color(0x0077ff), // Electric Cobalt
      new THREE.Color(0x00f5b8), // Neon Mint
      new THREE.Color(0xd0d4dc), // Stellar Silver
      new THREE.Color(0xffffff), // Pure Starlight White
      new THREE.Color(0x8066ff), // Quantum Violet
    ];

    for (let i = 0; i < starCount; i++) {
      // Wide distribution across full scroll depth (y from -300 to +80)
      starPositions[i * 3] = (Math.random() - 0.5) * 110;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 450;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 70 - 10;

      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;

      starSizes[i] = 0.04 + Math.random() * 0.08;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const starField = new THREE.Points(starGeo, starMat);
    spaceGroup.add(starField);

    // 2. Cosmic Nebulae Aura Spheres (Layered along page height)
    const nebulaeGroup = new THREE.Group();
    spaceGroup.add(nebulaeGroup);

    const nebulaeSpecs = [
      { color: 0x00e1ff, size: 20, pos: [-14, 15, -18], opacity: 0.16 },
      { color: 0x0077ff, size: 26, pos: [16, -30, -22], opacity: 0.18 },
      { color: 0x8066ff, size: 30, pos: [-8, -90, -28], opacity: 0.20 },
      { color: 0x00e1ff, size: 22, pos: [14, -150, -20], opacity: 0.15 },
      { color: 0x0077ff, size: 28, pos: [-16, -210, -24], opacity: 0.18 },
      { color: 0x00f5b8, size: 24, pos: [10, -280, -20], opacity: 0.14 },
    ];

    nebulaeSpecs.forEach((spec) => {
      const geo = new THREE.SphereGeometry(spec.size, 28, 28);
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: new THREE.Color(spec.color) },
          uOpacity: { value: spec.opacity },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
            gl_FragColor = vec4(uColor, intensity * uOpacity);
          }
        `,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      nebulaeGroup.add(mesh);
    });

    // 3. Floating 3D Geometric Polyhedra Crystals (Drifting in deep space)
    const shardsGroup = new THREE.Group();
    spaceGroup.add(shardsGroup);

    const shardGeometries = [
      new THREE.IcosahedronGeometry(0.75, 0),
      new THREE.OctahedronGeometry(0.65, 0),
      new THREE.DodecahedronGeometry(0.6, 0),
      new THREE.TetrahedronGeometry(0.55, 0),
      new THREE.TorusGeometry(0.65, 0.015, 8, 32),
    ];

    const shardMaterials = [
      new THREE.LineBasicMaterial({
        color: 0x00e1ff,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      }),
      new THREE.LineBasicMaterial({
        color: 0x0077ff,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      }),
      new THREE.LineBasicMaterial({
        color: 0xc0c0c8,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      }),
    ];

    const shardMeshes: Array<{
      mesh: THREE.Object3D;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      baseY: number;
      driftSpeed: number;
    }> = [];

    for (let i = 0; i < 48; i++) {
      const geo = shardGeometries[i % shardGeometries.length];
      const mat = shardMaterials[i % shardMaterials.length];
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), mat);

      const x = (Math.random() - 0.5) * 52;
      const y = (Math.random() - 0.5) * 380;
      const z = (Math.random() - 0.5) * 35 - 5;

      wire.position.set(x, y, z);
      wire.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      shardsGroup.add(wire);

      shardMeshes.push({
        mesh: wire,
        rotSpeedX: (Math.random() - 0.5) * 0.012,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        rotSpeedZ: (Math.random() - 0.5) * 0.008,
        baseY: y,
        driftSpeed: 0.4 + Math.random() * 0.8,
      });
    }

    // 4. Subtle 3D Energy Rings in deep background
    const cyberRingsGroup = new THREE.Group();
    spaceGroup.add(cyberRingsGroup);

    for (let i = 0; i < 8; i++) {
      const ringGeo = new THREE.TorusGeometry(6 + i * 3.5, 0.018, 8, 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00e1ff : 0x0077ff,
        transparent: true,
        opacity: 0.09,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set((i % 2 === 0 ? -1 : 1) * 8, -i * 45, -30 - i * 5);
      ringMesh.rotation.set(Math.PI / 3 + i * 0.2, 0.3, i * 0.4);
      cyberRingsGroup.add(ringMesh);
    }

    // 5. Scroll & Pointer Interaction Physics
    let active = true;
    let frame = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;
    let scrollVelocity = 0;
    let lastScrollY = 0;
    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    const onPointerMove = (e: MouseEvent) => {
      pointerTarget.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      pointerTarget.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", () => {
      active = document.visibilityState === "visible";
    });

    resize();

    const render = () => {
      frame = window.requestAnimationFrame(render);
      if (!active) return;

      const elapsed = clock.getElapsedTime();

      // Smooth inertia lerp for scroll position
      const prevScrollY = currentScrollY;
      currentScrollY += (targetScrollY - currentScrollY) * 0.055;
      scrollVelocity = currentScrollY - prevScrollY;

      pointer.lerp(pointerTarget, 0.04);

      // Deep 3D Camera Travel & Spatial Parallax
      const scrollUnit = currentScrollY * 0.0015;
      spaceGroup.position.y = currentScrollY * 0.016; // Smooth upward parallax
      spaceGroup.rotation.y = elapsed * 0.02 + scrollUnit * 0.3 + pointer.x;
      spaceGroup.rotation.x = Math.sin(elapsed * 0.015) * 0.025 + scrollUnit * 0.12 - pointer.y;

      // Dynamic 3D camera forward-tilt on scrolling velocity
      camera.position.z = 20 - Math.min(Math.abs(scrollVelocity) * 0.08, 4);
      camera.rotation.z = scrollVelocity * 0.0003;

      // Animate floating polyhedra shards
      shardMeshes.forEach((item, idx) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.rotation.z += item.rotSpeedZ;

        // Subtle floating bobbing + dynamic scroll shift
        const floatOffset = Math.sin(elapsed * item.driftSpeed + idx) * 0.4;
        item.mesh.position.y = item.baseY + floatOffset;
      });

      // Ambient nebulae and cyber ring rotation
      nebulaeGroup.rotation.z = elapsed * 0.008;
      cyberRingsGroup.rotation.z = -elapsed * 0.012;

      renderer.render(scene, camera);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onPointerMove);
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
