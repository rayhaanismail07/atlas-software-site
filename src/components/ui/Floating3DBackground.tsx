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
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 1000);
    camera.position.set(0, 0, 22);

    const spaceGroup = new THREE.Group();
    scene.add(spaceGroup);

    // 1. Deep Spatial Multi-Tier Starfield (5,500 Stars)
    const starCount = 5500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0x00e1ff), // Atlas Cyan
      new THREE.Color(0x0077ff), // Electric Cobalt
      new THREE.Color(0x00f5b8), // Neon Mint
      new THREE.Color(0xa78bfa), // Quantum Violet
      new THREE.Color(0xfbbf24), // Solar Amber
      new THREE.Color(0xffffff), // Starlight White
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 480;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 12;

      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const starField = new THREE.Points(starGeo, starMat);
    spaceGroup.add(starField);

    // 2. Cosmic Nebulae Auras (Layered across all page sections)
    const nebulaeGroup = new THREE.Group();
    spaceGroup.add(nebulaeGroup);

    const nebulaeSpecs = [
      { color: 0x00e1ff, size: 24, pos: [-14, 20, -18], opacity: 0.18 }, // Hero
      { color: 0x0077ff, size: 28, pos: [16, -25, -22], opacity: 0.18 }, // Section 1 & 2
      { color: 0x00f5b8, size: 32, pos: [-18, -80, -25], opacity: 0.22 }, // Section 3: Systems
      { color: 0x00e1ff, size: 30, pos: [18, -120, -22], opacity: 0.20 }, // Section 3: Architecture
      { color: 0xa78bfa, size: 34, pos: [-15, -170, -24], opacity: 0.24 }, // Section 4: Process
      { color: 0x00e1ff, size: 30, pos: [16, -220, -22], opacity: 0.20 }, // Section 5: Studio
      { color: 0xfbbf24, size: 28, pos: [-12, -270, -25], opacity: 0.18 }, // Section 5: Principles & Tech
      { color: 0x0077ff, size: 32, pos: [14, -330, -20], opacity: 0.22 }, // Final CTA & Footer
    ];

    nebulaeSpecs.forEach((spec) => {
      const geo = new THREE.SphereGeometry(spec.size, 24, 24);
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
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
            gl_FragColor = vec4(uColor, intensity * uOpacity);
          }
        `,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      nebulaeGroup.add(mesh);
    });

    // 3. SECTION 3 SPECIFIC 3D ANIMATIONS: Cybernetic Kinetic Network (y: -65 to -130)
    const section3Group = new THREE.Group();
    spaceGroup.add(section3Group);

    // Floating 3D Wireframe Cyber Cube Arrays & Gyro Rings
    const sysGeos = [
      new THREE.BoxGeometry(1.4, 1.4, 1.4),
      new THREE.OctahedronGeometry(1.2, 0),
      new THREE.IcosahedronGeometry(1.1, 0),
      new THREE.TorusGeometry(1.6, 0.018, 8, 48),
    ];

    const sysMats = [
      new THREE.LineBasicMaterial({ color: 0x00e1ff, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending }),
      new THREE.LineBasicMaterial({ color: 0x00f5b8, transparent: true, opacity: 0.40, blending: THREE.AdditiveBlending }),
      new THREE.LineBasicMaterial({ color: 0x0077ff, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending }),
    ];

    const dynamic3DMeshes: Array<{
      mesh: THREE.Object3D;
      rotX: number;
      rotY: number;
      rotZ: number;
      baseY: number;
      driftSpeed: number;
      driftAmp: number;
    }> = [];

    // 18 Floating 3D Architectural Nodes around Section 3
    for (let i = 0; i < 18; i++) {
      const geo = sysGeos[i % sysGeos.length];
      const mat = sysMats[i % sysMats.length];
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), mat);

      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (12 + (i % 4) * 3.5);
      const y = -70 - i * 3.5;
      const z = -6 - (i % 3) * 4;

      wire.position.set(x, y, z);
      wire.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      section3Group.add(wire);

      dynamic3DMeshes.push({
        mesh: wire,
        rotX: (Math.random() - 0.5) * 0.015,
        rotY: (Math.random() - 0.5) * 0.018,
        rotZ: (Math.random() - 0.5) * 0.01,
        baseY: y,
        driftSpeed: 0.6 + Math.random() * 0.6,
        driftAmp: 0.5 + Math.random() * 0.4,
      });
    }

    // 4. SECTION 4 SPECIFIC 3D ANIMATIONS: Flowing 3D Quantum Pipeline (y: -145 to -205)
    const section4Group = new THREE.Group();
    spaceGroup.add(section4Group);

    // 4 Sequential Process Energy Gyroscopes with Orbital Quantum Rings
    const processSteps = [
      { y: -150, x: -14, color: 0x00e1ff, label: "01" },
      { y: -165, x: 14, color: 0x0077ff, label: "02" },
      { y: -180, x: -14, color: 0xa78bfa, label: "03" },
      { y: -195, x: 14, color: 0x00f5b8, label: "04" },
    ];

    processSteps.forEach((step, idx) => {
      // Nested Dual-Axis Gimbal Rings
      const ringOuterGeo = new THREE.TorusGeometry(1.8, 0.02, 8, 64);
      const ringInnerGeo = new THREE.TorusGeometry(1.3, 0.018, 8, 48);
      const coreGeo = new THREE.IcosahedronGeometry(0.5, 0);

      const outerMat = new THREE.MeshBasicMaterial({ color: step.color, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
      const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.30, blending: THREE.AdditiveBlending });
      const coreMat = new THREE.LineBasicMaterial({ color: step.color, transparent: true, opacity: 0.60, blending: THREE.AdditiveBlending });

      const outerRing = new THREE.Mesh(ringOuterGeo, outerMat);
      const innerRing = new THREE.Mesh(ringInnerGeo, innerMat);
      const core = new THREE.LineSegments(new THREE.WireframeGeometry(coreGeo), coreMat);

      const gyroGroup = new THREE.Group();
      gyroGroup.position.set(step.x, step.y, -8);
      gyroGroup.add(outerRing);
      gyroGroup.add(innerRing);
      gyroGroup.add(core);

      section4Group.add(gyroGroup);

      dynamic3DMeshes.push({
        mesh: gyroGroup,
        rotX: 0.008 + idx * 0.003,
        rotY: 0.012 - idx * 0.002,
        rotZ: 0.006,
        baseY: step.y,
        driftSpeed: 0.7 + idx * 0.15,
        driftAmp: 0.4,
      });
    });

    // 5. SECTION 5 SPECIFIC 3D ANIMATIONS: Studio & Brand Geometric Constellation (y: -215 to -310)
    const section5Group = new THREE.Group();
    spaceGroup.add(section5Group);

    // 24 Floating Polyhedra Shards & Stellar Lattices behind Studio & Technology Stack
    const studioGeos = [
      new THREE.DodecahedronGeometry(1.3, 0),
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.TetrahedronGeometry(1.0, 0),
      new THREE.TorusGeometry(1.5, 0.02, 8, 40),
    ];

    const studioColors = [0x00e1ff, 0xa78bfa, 0xfbbf24, 0x00f5b8, 0x0077ff];

    for (let i = 0; i < 24; i++) {
      const geo = studioGeos[i % studioGeos.length];
      const color = studioColors[i % studioColors.length];
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.40, blending: THREE.AdditiveBlending });
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), mat);

      const side = (i % 2 === 0 ? 1 : -1);
      const x = side * (10 + (i % 5) * 3.2);
      const y = -220 - i * 3.8;
      const z = -6 - (i % 4) * 3.5;

      wire.position.set(x, y, z);
      wire.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      section5Group.add(wire);

      dynamic3DMeshes.push({
        mesh: wire,
        rotX: (Math.random() - 0.5) * 0.016,
        rotY: (Math.random() - 0.5) * 0.02,
        rotZ: (Math.random() - 0.5) * 0.012,
        baseY: y,
        driftSpeed: 0.5 + Math.random() * 0.7,
        driftAmp: 0.5,
      });
    }

    // 6. Cybernetic Orbital Infinity Rings Across All Sections
    const cyberRingsGroup = new THREE.Group();
    spaceGroup.add(cyberRingsGroup);

    for (let i = 0; i < 12; i++) {
      const ringGeo = new THREE.TorusGeometry(8 + (i % 3) * 3, 0.018, 8, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00e1ff : 0xa78bfa,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set((i % 2 === 0 ? -1 : 1) * 9, -i * 28, -25 - (i % 4) * 3);
      ringMesh.rotation.set(Math.PI / 3 + i * 0.3, 0.4, i * 0.35);
      cyberRingsGroup.add(ringMesh);
    }

    // 7. Scroll Physics & Inertia Engine
    let active = true;
    let frame = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;
    let scrollVelocity = 0;
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
      camera.position.z = 22 - Math.min(Math.abs(scrollVelocity) * 0.08, 4);
      camera.rotation.z = scrollVelocity * 0.0003;

      // Animate all dynamic 3D meshes (Sections 3, 4, 5)
      dynamic3DMeshes.forEach((item, idx) => {
        item.mesh.rotation.x += item.rotX;
        item.mesh.rotation.y += item.rotY;
        item.mesh.rotation.z += item.rotZ;

        const floatOffset = Math.sin(elapsed * item.driftSpeed + idx) * item.driftAmp;
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
