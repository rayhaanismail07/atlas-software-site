"use client";

import React, { useRef, useState } from "react";

interface Interactive3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  glareOpacity?: number;
}

export function Interactive3DTilt({
  children,
  className = "",
  maxTilt = 12,
  scale = 1.02,
  perspective = 1000,
  glareOpacity = 0.15,
}: Interactive3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width;
    const yPct = mouseY / height;

    const tiltX = (0.5 - yPct) * maxTilt;
    const tiltY = (xPct - 0.5) * maxTilt;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: "transform 0.1s cubic-bezier(0.1, 0.2, 0.1, 1)",
    });

    const glareAngle = Math.atan2(mouseY - height / 2, mouseX - width / 2) * (180 / Math.PI) + 90;
    setGlareStyle({
      opacity: glareOpacity,
      background: `linear-gradient(${glareAngle}deg, rgba(255,255,255,${glareOpacity}) 0%, rgba(255,255,255,0) 80%)`,
      transition: "opacity 0.2s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
    });
    setGlareStyle({
      opacity: 0,
      transition: "opacity 0.5s ease-out",
    });
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-visible transition-all transform-gpu ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-10"
        style={glareStyle}
      />
    </div>
  );
}
