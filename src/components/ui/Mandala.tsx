"use client";

import { motion } from "framer-motion";

interface MandalaProps {
  progresso: number; // 0 a 1 (porcentagem de progresso)
  intensidade?: 'leve' | 'media' | 'forte';
  pausado?: boolean; // Timer está pausado?
}

/**
 * Retorna cor baseada na intensidade energética
 */
function energiaCor(intensidade: 'leve' | 'media' | 'forte'): string {
  return intensidade === 'forte' 
    ? '#FFD700'  // Dourado vibrante
    : intensidade === 'media' 
    ? '#2ECC71'  // Verde vida
    : '#F9F9F9'; // Branco suave
}

export function Mandala({ progresso, intensidade = 'media', pausado = false }: MandalaProps) {
  // Configurações de intensidade
  const intensidadeConfig = {
    leve: {
      pulseScale: 1.02,
      glowOpacity: 0.3,
      duration: 3,
      rotationDuration: 60, // Rotação muito lenta
    },
    media: {
      pulseScale: 1.05,
      glowOpacity: 0.5,
      duration: 2,
      rotationDuration: 40, // Rotação moderada
    },
    forte: {
      pulseScale: 1.08,
      glowOpacity: 0.7,
      duration: 1.5,
      rotationDuration: 25, // Rotação mais rápida
    },
  }[intensidade];

  // Ajustar velocidade quando pausado
  const velocidadeRotacao = pausado 
    ? intensidadeConfig.rotationDuration * 3 // 3x mais lento quando pausado
    : intensidadeConfig.rotationDuration;
  
  const brilhoAtual = pausado
    ? intensidadeConfig.glowOpacity * 0.5 // 50% do brilho quando pausado
    : intensidadeConfig.glowOpacity;

  // Cor dinâmica baseada na energia
  const corPrincipal = energiaCor(intensidade);

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

        {/* Anel externo (pulso energético rítmico) */}
        <motion.circle
          cx="96"
          cy="96"
          r="90"
          fill="url(#externalGradient)"
          opacity={brilhoAtual}
          animate={{
            scale: pausado 
              ? [1, 1.01, 1] // Pulso mínimo quando pausado
              : [1, intensidadeConfig.pulseScale, 1],
            opacity: pausado
              ? [brilhoAtual, brilhoAtual * 0.8, brilhoAtual] // Variação reduzida quando pausado
              : [brilhoAtual, brilhoAtual * 0.7, brilhoAtual],
          }}
          transition={{
            duration: pausado ? intensidadeConfig.duration * 2 : intensidadeConfig.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: '96px 96px' }}
        />

        {/* Anel médio - fundo (cinza) com rotação lenta */}
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke={corPrincipal}
          strokeWidth="8"
          strokeOpacity="0.2"
          animate={{
            rotate: pausado ? 0 : 360,
          }}
          transition={{
            duration: velocidadeRotacao,
            repeat: pausado ? 0 : Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: '96px 96px' }}
        />

        {/* Anel médio - progresso (cor dinâmica) com rotação */}
        <motion.g
          animate={{
            rotate: pausado ? 0 : 360,
          }}
          transition={{
            duration: velocidadeRotacao,
            repeat: pausado ? 0 : Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: '96px 96px' }}
        >
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            fill="none"
            stroke={corPrincipal}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 96 96)"
            filter="url(#glow)"
            animate={{
              opacity: pausado ? [0.5, 0.6, 0.5] : [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.g>

        {/* Círculo interno (centro da energia) */}
        <motion.circle
          cx="96"
          cy="96"
          r="45"
          fill="url(#centerGradient)"
          filter="url(#glow)"
          animate={{
            scale: pausado ? [1, 1.01, 1] : [1, 1.03, 1],
          }}
          transition={{
            duration: pausado 
              ? intensidadeConfig.duration * 3 
              : intensidadeConfig.duration * 1.5,
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

        {/* Detalhes decorativos - pontos de energia com rotação reversa */}
        <motion.g
          animate={{
            rotate: pausado ? 0 : -360, // Rotação reversa para contraste
          }}
          transition={{
            duration: velocidadeRotacao * 1.5, // Um pouco mais lento que o anel
            repeat: pausado ? 0 : Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: '96px 96px' }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const x = 96 + 70 * Math.cos((angle * Math.PI) / 180);
            const y = 96 + 70 * Math.sin((angle * Math.PI) / 180);
            
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={corPrincipal}
                opacity={pausado ? 0.3 : 0.6}
                animate={{
                  scale: pausado ? [1, 1.1, 1] : [1, 1.5, 1],
                  opacity: pausado 
                    ? [0.2, 0.4, 0.2] 
                    : [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: pausado ? 3 : 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              />
            );
          })}
        </motion.g>
      </svg>

      {/* Indicador de intensidade (halo externo adaptativo) */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, transparent 40%, ${corPrincipal}${Math.round(brilhoAtual * 25.5).toString(16).padStart(2, '0')} 100%)`,
        }}
        animate={{
          opacity: pausado ? [0.2, 0.3, 0.2] : [0.5, 1, 0.5],
          scale: pausado ? [1, 1.01, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: pausado 
            ? intensidadeConfig.duration * 3
            : intensidadeConfig.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

