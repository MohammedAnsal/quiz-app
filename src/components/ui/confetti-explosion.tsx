"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  scale: number;
  rotation: number;
}

interface ConfettiExplosionProps {
  particleCount?: number;
  duration?: number;
  colors?: string[];
  onComplete?: () => void;
}

export const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
  particleCount = 50,
  duration = 3000,
  colors = ["#FFC700", "#FF0000", "#2E3191", "#41BBC7", "#31D843"],
  onComplete,
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isExploding, setIsExploding] = useState(true);

  useEffect(() => {
    // Generate confetti pieces
    const pieces: ConfettiPiece[] = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50, // Random x position (-50 to 50)
      y: Math.random() * -100, // Start above the container
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: Math.random() * 0.6 + 0.4, // Random size (0.4 to 1)
      rotation: Math.random() * 360, // Random rotation
    }));

    setConfetti(pieces);

    // Set a timeout to clean up
    const timer = setTimeout(() => {
      setIsExploding(false);
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [particleCount, colors, duration, onComplete]);

  if (!isExploding) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            x: [0, piece.x * 2],
            y: [0, piece.y * 10],
            scale: [0, piece.scale],
            rotate: [0, piece.rotation * 2],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: duration / 1000,
            ease: ["easeOut", "easeIn"],
            times: [0, 0.7, 1],
          }}
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  );
};
