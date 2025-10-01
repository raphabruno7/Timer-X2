"use client";

import { motion, AnimatePresence } from "framer-motion";
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
      <div className="relative w-72 h-72">
        {/* SVG Container */}
        <svg
          width="288"
          height="288"
          viewBox="0 0 288 288"
          className="absolute inset-0"
        >
          {/* Camada Externa - Círculo com pétalas (gira anti-horário) */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "144px 144px" }}
          >
            {/* Pétalas externas */}
            {[...Array(12)].map((_, i) => (
              <motion.ellipse
                key={`petal-outer-${i}`}
                cx="144"
                cy="60"
                rx="18"
                ry="35"
                fill="#2ECC71"
                opacity="0.3"
                transform={`rotate(${i * 30} 144 144)`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              />
            ))}
          </motion.g>

          {/* Camada Média - Estrela (gira horário) */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "144px 144px" }}
          >
            {/* Pontas da estrela */}
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={`star-${i}`}
                cx="144"
                cy="80"
                r="12"
                fill="#FFD700"
                opacity="0.6"
                transform={`rotate(${i * 45} 144 144)`}
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  delay: i * 0.08,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.g>

          {/* Camada Interna - Flores (gira anti-horário devagar) */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "144px 144px" }}
          >
            {/* Pétalas internas */}
            {[...Array(6)].map((_, i) => (
              <motion.ellipse
                key={`petal-inner-${i}`}
                cx="144"
                cy="100"
                rx="15"
                ry="25"
                fill="#2ECC71"
                opacity="0.5"
                transform={`rotate(${i * 60} 144 144)`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            ))}
          </motion.g>

          {/* Círculos concêntricos centrais */}
          <motion.circle
            cx="144"
            cy="144"
            r="45"
            fill="none"
            stroke="#2ECC71"
            strokeWidth="2"
            opacity="0.4"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.circle
            cx="144"
            cy="144"
            r="35"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            opacity="0.6"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Círculo central sólido com gradiente */}
          <defs>
            <radialGradient id="centerGradient">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.6" />
            </radialGradient>
          </defs>
          
          <motion.circle
            cx="144"
            cy="144"
            r="25"
            fill="url(#centerGradient)"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Linhas radiais */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "144px 144px" }}
          >
            {[...Array(16)].map((_, i) => (
              <motion.line
                key={`radial-${i}`}
                x1="144"
                y1="144"
                x2="144"
                y2="44"
                stroke="#2ECC71"
                strokeWidth="1"
                opacity="0.2"
                transform={`rotate(${i * 22.5} 144 144)`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.03, duration: 0.8 }}
              />
            ))}
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

