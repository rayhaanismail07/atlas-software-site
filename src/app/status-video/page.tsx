"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play, Square, Download, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function StatusVideoPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030712, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, aspectRatio === "9:16" ? 9 / 16 : 16 / 9, 0.1, 100);
    camera.position.set(0, 0, 8);

    // Glowing 3D Core
    const group = new THREE.Group();
    scene.add(group);

    const icosaGeo = new THREE.IcosahedronGeometry(1.6, 4);
    const icosaMat = new THREE.MeshPhysicalMaterial({
      color: 0x051a24,
      emissive: 0x085264,
      emissiveIntensity: 0.8,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
    });
    const core = new THREE.Mesh(icosaGeo, icosaMat);
    group.add(core);

    const wireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.68, 2));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x5eeaff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wire);

    // Orbiting Rings
    const ringGeo = new THREE.TorusGeometry(2.3, 0.012, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x78edff, transparent: true, opacity: 0.5 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // Lights
    const dirLight = new THREE.DirectionalLight(0x5eeaff, 3);
    dirLight.position.set(4, 5, 4);
    scene.add(dirLight);
    const ambientLight = new THREE.AmbientLight(0x0e2833, 1.5);
    scene.add(ambientLight);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const resize = () => {
      const width = aspectRatio === "9:16" ? 360 : 640;
      const height = aspectRatio === "9:16" ? 640 : 360;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      group.rotation.y = elapsed * 0.4;
      group.rotation.x = Math.sin(elapsed * 0.3) * 0.2;
      ring1.rotation.z = elapsed * 0.3;
      ring2.rotation.z = -elapsed * 0.4;

      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      icosaGeo.dispose();
      icosaMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
    };
  }, [aspectRatio]);

  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    recordedChunksRef.current = [];
    setVideoUrl(null);
    setProgress(0);
    setIsRecording(true);

    const stream = canvas.captureStream(60);
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm",
    });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setIsRecording(false);
      setProgress(100);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();

    // 10 second countdown timer
    let currentMs = 0;
    const durationMs = 10000;
    const interval = setInterval(() => {
      currentMs += 200;
      const pct = Math.min(100, (currentMs / durationMs) * 100);
      setProgress(pct);

      if (currentMs >= durationMs) {
        clearInterval(interval);
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      }
    }, 200);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Atlas Site
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Aspect Ratio:</span>
          <button
            onClick={() => setAspectRatio("9:16")}
            className={`px-3 py-1 text-xs rounded-full border ${aspectRatio === "9:16" ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "border-slate-800 text-slate-400"}`}
          >
            9:16 (Vertical Status)
          </button>
          <button
            onClick={() => setAspectRatio("16:9")}
            className={`px-3 py-1 text-xs rounded-full border ${aspectRatio === "16:9" ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "border-slate-800 text-slate-400"}`}
          >
            16:9 (Landscape)
          </button>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div
          ref={containerRef}
          className={`relative overflow-hidden rounded-2xl border border-cyan-500/20 shadow-2xl ${
            aspectRatio === "9:16" ? "w-[320px] h-[568px]" : "w-[600px] h-[337px]"
          }`}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Animated Status Text Overlays */}
          <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10 text-center">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                ATLAS SOFTWARE
              </span>
            </div>

            <div className="my-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
                We Engineer Software
              </h2>
              <p className="text-xs sm:text-sm text-cyan-300 font-medium">
                That Moves Business Forward
              </p>
            </div>

            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              STATUS: 100% OPERATIONAL
            </div>
          </div>

          {/* Recording Overlay Progress */}
          {isRecording && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-end p-6 z-20">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-mono text-cyan-300 animate-pulse">
                Recording 10s 60FPS Video ({Math.round(progress)}%)
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" /> Record 10s Status Video
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 fill-white" /> Stop Recording Early
            </button>
          )}

          {videoUrl && (
            <a
              href={videoUrl}
              download={`atlas_status_${aspectRatio.replace(":", "x")}.webm`}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Video File
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
