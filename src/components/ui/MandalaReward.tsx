"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface MandalaRewardProps {
  onComplete?: () => void;
}

export function MandalaReward({ onComplete }: MandalaRewardProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000); // Desaparece após 5 segundos

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none"
    >
      <div className="relative w-[200px] h-[200px]">
        {/* SVG Container */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="absolute inset-0"
        >
          {/* Gradientes */}
          <defs>
            <radialGradient id="greenGradient">
              <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2ECC71" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="yellowGradient">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Camada 1: Círculo externo com gradiente verde (sem rotação) */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="url(#greenGradient)"
          />

          {/* Camada 2: Linhas radiais girando horário */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "100px 100px" }}
          >
            {[...Array(12)].map((_, i) => (
              <line
                key={`radial-${i}`}
                x1="100"
                y1="100"
                x2="100"
                y2="20"
                stroke="#2ECC71"
                strokeWidth="2"
                opacity="0.3"
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}
          </motion.g>

          {/* Camada 3: Círculo interno amarelo girando anti-horário */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "100px 100px" }}
          >
            <circle
              cx="100"
              cy="100"
              r="50"
              fill="url(#yellowGradient)"
            />
          </motion.g>
        </svg>

        {/* Texto de celebração */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="text-4xl mb-2">✨</div>
          <p className="text-xl font-bold text-white drop-shadow-lg">
            Parabéns!
          </p>
          <p className="text-sm text-white/80 drop-shadow-md">
            Ciclo completo
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

