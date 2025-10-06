"use client";

import { motion } from "framer-motion";

interface MandalaProps {
  progresso: number; // 0 a 1 (porcentagem de progresso)
  intensidade?: 'leve' | 'media' | 'forte';
}

export function Mandala({ progresso, intensidade = 'media' }: MandalaProps) {
  // Configurações de intensidade
  const intensidadeConfig = {
    leve: {
      pulseScale: 1.02,
      glowOpacity: 0.3,
      duration: 3,
    },
    media: {
      pulseScale: 1.05,
      glowOpacity: 0.5,
      duration: 2,
    },
    forte: {
      pulseScale: 1.08,
      glowOpacity: 0.7,
      duration: 1.5,
    },
  }[intensidade];

  // Calcular circunferência para o anel de progresso
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progresso * circumference);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg
        width="192"
        height="192"
        viewBox="0 0 192 192"
        className="absolute inset-0"
        style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))' }}
      >
        <defs>
          {/* Gradiente radial para anel externo */}
          <radialGradient id="externalGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1C1C1C" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2ECC71" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Gradiente para o centro */}
          <radialGradient id="centerGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FFA500" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.3" />
          </radialGradient>

          {/* Filtro de glow */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Anel externo (pulso energético) */}
        <motion.circle
          cx="96"
          cy="96"
          r="90"
          fill="url(#externalGradient)"
          opacity={intensidadeConfig.glowOpacity}
          animate={{
            scale: [1, intensidadeConfig.pulseScale, 1],
            opacity: [intensidadeConfig.glowOpacity, intensidadeConfig.glowOpacity * 0.7, intensidadeConfig.glowOpacity],
          }}
          transition={{
            duration: intensidadeConfig.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: '96px 96px' }}
        />

        {/* Anel médio - fundo (cinza) */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke="#2ECC71"
          strokeWidth="8"
          strokeOpacity="0.2"
        />

        {/* Anel médio - progresso (verde vida) */}
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke="#2ECC71"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 96 96)"
          filter="url(#glow)"
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Círculo interno (centro da energia) */}
        <motion.circle
          cx="96"
          cy="96"
          r="45"
          fill="url(#centerGradient)"
          filter="url(#glow)"
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: intensidadeConfig.duration * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: '96px 96px' }}
        />

        {/* Círculo interno - borda */}
        <circle
          cx="96"
          cy="96"
          r="45"
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          strokeOpacity="0.6"
        />

        {/* Detalhes decorativos - pontos de energia */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const x = 96 + 70 * Math.cos((angle * Math.PI) / 180);
          const y = 96 + 70 * Math.sin((angle * Math.PI) / 180);
          
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#2ECC71"
              opacity="0.6"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
          );
        })}
      </svg>

      {/* Indicador de intensidade (invisível, apenas para efeito) */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, transparent 40%, rgba(255, 215, 0, ${intensidadeConfig.glowOpacity * 0.1}) 100%)`,
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: intensidadeConfig.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

