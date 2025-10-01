"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface MandalaRewardProps {
  active: boolean;
  onClose?(): void;
  aiMessage?: string;
}

export function MandalaReward({ active, onClose, aiMessage }: MandalaRewardProps) {
  useEffect(() => {
    if (active && onClose) {
      const timer = setTimeout(() => {
        console.log("Mandala concluída");
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md cursor-pointer"
    >
      <motion.div 
        className="relative w-[240px] h-[240px]"
        animate={{ 
          filter: [
            "drop-shadow(0 0 20px rgba(46, 204, 113, 0.4))",
            "drop-shadow(0 0 40px rgba(46, 204, 113, 0.6))",
            "drop-shadow(0 0 20px rgba(46, 204, 113, 0.4))",
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          className="absolute inset-0"
        >
          {/* Gradientes */}
          <defs>
            <radialGradient id="greenGradient">
              <stop offset="0%" stopColor="#2ECC71" stopOpacity="1" />
              <stop offset="50%" stopColor="#2ECC71" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2ECC71" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="yellowGradient">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
              <stop offset="50%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="greenGlow">
              <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2ECC71" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glow externo */}
          <motion.circle
            cx="120"
            cy="120"
            r="110"
            fill="url(#greenGlow)"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "120px 120px" }}
          />

          {/* Círculo externo verde pulsando */}
          <motion.circle
            cx="120"
            cy="120"
            r="95"
            fill="url(#greenGradient)"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "120px 120px" }}
          />

          {/* Círculos concêntricos decorativos */}
          <motion.circle
            cx="120"
            cy="120"
            r="75"
            fill="none"
            stroke="#2ECC71"
            strokeWidth="3"
            opacity="0.4"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            style={{ transformOrigin: "120px 120px" }}
          />

          {/* Linhas radiais girando */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "120px 120px" }}
          >
            {[...Array(12)].map((_, i) => (
              <line
                key={`radial-${i}`}
                x1="120"
                y1="120"
                x2="120"
                y2="25"
                stroke="#2ECC71"
                strokeWidth="2"
                opacity="0.25"
                strokeLinecap="round"
                transform={`rotate(${i * 30} 120 120)`}
              />
            ))}
          </motion.g>

          {/* Círculo médio amarelo */}
          <motion.circle
            cx="120"
            cy="120"
            r="55"
            fill="none"
            stroke="#FFD700"
            strokeWidth="3"
            opacity="0.5"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{ transformOrigin: "120px 120px" }}
          />

          {/* Círculo interno amarelo pulsando */}
          <motion.circle
            cx="120"
            cy="120"
            r="45"
            fill="url(#yellowGradient)"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            style={{ transformOrigin: "120px 120px" }}
          />

          {/* Círculo central sólido */}
          <motion.circle
            cx="120"
            cy="120"
            r="20"
            fill="#FFD700"
            opacity="0.8"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ transformOrigin: "120px 120px" }}
          />
        </svg>

        {/* Texto de celebração */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center px-8"
        >
          <div className="text-4xl mb-3">✨</div>
          <p className="text-xl font-bold text-white drop-shadow-lg mb-2">
            Parabéns!
          </p>
          {aiMessage ? (
            <p className="text-sm text-white/90 drop-shadow-md text-center leading-relaxed max-w-[200px]">
              {aiMessage}
            </p>
          ) : (
            <p className="text-sm text-white/80 drop-shadow-md">
              Ciclo completo
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

