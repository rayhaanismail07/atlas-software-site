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

    renderer.setClearColor(0x070809, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    camera.position.z = 18;

    const spaceGroup = new THREE.Group();
    scene.add(spaceGroup);

    // 1. Multi-Layer Deep Space Starfield (2,800 Stars)
    const starCount = 2800;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const palette = [
      new THREE.Color(0x00e1ff), // Atlas Cyan
      new THREE.Color(0x0077ff), // Electric Blue
      new THREE.Color(0xc0c0c8), // Metallic Silver
      new THREE.Color(0xffffff), // Deep Pure White
      new THREE.Color(0x4080ff), // Stellar Blue
    ];

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 0.06 + 0.02;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const starField = new THREE.Points(starGeo, starMat);
    spaceGroup.add(starField);

    // 2. Cosmic Nebulae Clouds (3D Volumetric Glow Spheres)
    const nebulaeGroup = new THREE.Group();
    spaceGroup.add(nebulaeGroup);

    const nebulaeSpecs = [
      { color: 0x00e1ff, size: 14, pos: [-12, 8, -15], opacity: 0.12 },
      { color: 0x0077ff, size: 18, pos: [14, -12, -18], opacity: 0.14 },
      { color: 0x1a0933, size: 22, pos: [0, 15, -25], opacity: 0.25 },
      { color: 0x00e1ff, size: 12, pos: [10, 20, -20], opacity: 0.08 },
    ];

    nebulaeSpecs.forEach((spec) => {
      const geo = new THREE.SphereGeometry(spec.size, 32, 32);
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

    // 3. Floating 3D Geometric Shards in Deep Space
    const shardsGroup = new THREE.Group();
    spaceGroup.add(shardsGroup);

    const shardGeometries = [
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.OctahedronGeometry(0.4, 0),
      new THREE.TetrahedronGeometry(0.35, 0),
    ];

    const shardMaterial = new THREE.LineBasicMaterial({
      color: 0x00e1ff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < 18; i++) {
      const geo = shardGeometries[i % shardGeometries.length];
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), shardMaterial);
      wire.position.set(
        (Math.random() - 0.5) * 36,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 20 - 5,
      );
      wire.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      shardsGroup.add(wire);
    }

    let active = true;
    let frame = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;
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

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    resize();

    const render = () => {
      frame = window.requestAnimationFrame(render);
      if (!active) return;

      const elapsed = clock.getElapsedTime();
      currentScrollY += (targetScrollY - currentScrollY) * 0.05;

      // Scroll-driven 3D space camera navigation
      const scrollRatio = currentScrollY * 0.0012;
      spaceGroup.rotation.y = elapsed * 0.02 + scrollRatio * 0.25;
      spaceGroup.rotation.x = Math.sin(elapsed * 0.01) * 0.03 + scrollRatio * 0.15;
      spaceGroup.position.y = scrollRatio * 3.5;

      // Subtle rotation of background shards & nebulae
      nebulaeGroup.rotation.z = elapsed * 0.01;
      shardsGroup.children.forEach((shard, idx) => {
        shard.rotation.x += 0.003 * (idx % 2 === 0 ? 1 : -1);
        shard.rotation.y += 0.004 * (idx % 3 === 0 ? 1 : -1);
      });

      renderer.render(scene, camera);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
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
