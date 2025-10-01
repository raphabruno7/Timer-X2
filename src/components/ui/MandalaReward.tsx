"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface MandalaRewardProps {
  active: boolean;
  onClose?(): void;
}

export function MandalaReward({ active, onClose }: MandalaRewardProps) {
  useEffect(() => {
    if (active && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-fechar após 5 segundos

      return () => clearTimeout(timer);
    }
  }, [active, onClose]);

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer"
    >
      <div className="relative w-[200px] h-[200px]">
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

          {/* Círculo externo pulsando */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="url(#greenGradient)"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "100px 100px" }}
          />

          {/* Círculo médio girando */}
          <motion.circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="#2ECC71"
            strokeWidth="2"
            opacity="0.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "100px 100px" }}
          />

          {/* Círculo interno amarelo pulsando */}
          <motion.circle
            cx="100"
            cy="100"
            r="40"
            fill="url(#yellowGradient)"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{ transformOrigin: "100px 100px" }}
          />
        </svg>

        {/* Texto de celebração */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="text-4xl mb-2">✨</div>
          <p className="text-xl font-bold text-white drop-shadow-lg">
            Parabéns!
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

