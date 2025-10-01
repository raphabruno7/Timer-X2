"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface MandalaRewardProps {
  onComplete?: () => void;
  intensity?: 'low' | 'high';
  colors?: string[];
}

export function MandalaReward({ 
  onComplete, 
  intensity = 'low',
  colors = ['#2ECC71', '#FFD700', '#3498DB']
}: MandalaRewardProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const [color1, color2, color3] = colors;
  const isHigh = intensity === 'high';
  const size = isHigh ? 300 : 200;
  const center = size / 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
        >
          <defs>
            <radialGradient id="gradient1">
              <stop offset="0%" stopColor={color1} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color1} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="gradient2">
              <stop offset="0%" stopColor={color2} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color2} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color1} />
              <stop offset="100%" stopColor={color3} />
            </linearGradient>
          </defs>

          {/* Camada 1: Partículas pulsando */}
          {isHigh && (
            <motion.g>
              {[...Array(24)].map((_, i) => {
                const angle = (i * 360) / 24;
                const x = center + Math.cos((angle * Math.PI) / 180) * (center * 0.7);
                const y = center + Math.sin((angle * Math.PI) / 180) * (center * 0.7);
                return (
                  <motion.circle
                    key={`particle-${i}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={color1}
                    opacity="0.6"
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.05,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </motion.g>
          )}

          {/* Camada 2: Linhas radiais com gradiente e espessura variável */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          >
            {[...Array(isHigh ? 16 : 12)].map((_, i) => (
              <line
                key={`radial-${i}`}
                x1={center}
                y1={center}
                x2={center}
                y2={center * 0.2}
                stroke="url(#lineGradient)"
                strokeWidth={i % 2 === 0 ? 3 : 1}
                opacity="0.4"
                transform={`rotate(${i * (360 / (isHigh ? 16 : 12))} ${center} ${center})`}
              />
            ))}
          </motion.g>

          {/* Camada 3: Círculos concêntricos pulsando (ondas) */}
          {isHigh && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.circle
                  key={`wave-${i}`}
                  cx={center}
                  cy={center}
                  r={center * 0.3 + i * 15}
                  fill="none"
                  stroke={color1}
                  strokeWidth="2"
                  opacity="0.3"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}

          {/* Camada 4: Pétalas abstratas com rotação lenta */}
          {isHigh && (
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `${center}px ${center}px` }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.ellipse
                  key={`petal-${i}`}
                  cx={center}
                  cy={center * 0.4}
                  rx="12"
                  ry="35"
                  fill={color2}
                  opacity="0.4"
                  transform={`rotate(${i * 45} ${center} ${center})`}
                  animate={{
                    opacity: [0.4, 0, 0.4]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.g>
          )}

          {/* Base: Círculo com gradiente */}
          <circle
            cx={center}
            cy={center}
            r={center * 0.9}
            fill="url(#gradient1)"
          />

          {/* Centro: Círculo interno girando */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          >
            <circle
              cx={center}
              cy={center}
              r={center * 0.5}
              fill="url(#gradient2)"
            />
          </motion.g>

          {/* Camada 5: Overlay fractal/mosaico */}
          {isHigh && (
            <motion.g opacity="0.1">
              {[...Array(6)].map((_, ring) => (
                <g key={`mosaic-ring-${ring}`}>
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 360) / 12;
                    const radius = (ring + 1) * 20;
                    const x = center + Math.cos((angle * Math.PI) / 180) * radius;
                    const y = center + Math.sin((angle * Math.PI) / 180) * radius;
                    return (
                      <rect
                        key={`mosaic-${ring}-${i}`}
                        x={x - 3}
                        y={y - 3}
                        width="6"
                        height="6"
                        fill={i % 2 === 0 ? color1 : color3}
                        transform={`rotate(${angle} ${x} ${y})`}
                      />
                    );
                  })}
                </g>
              ))}
            </motion.g>
          )}
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

