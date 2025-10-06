"use client";

import { motion } from "framer-motion";

// TODO: Integrar geração de padrões via API de IA (ex: OpenAI Image ou Replicate)
// Prompt base: "Generate a symmetrical geometric mandala representing [mood] energy in soft motion."

interface DynamicMandalaProps {
  mood: "foco" | "criatividade" | "relaxamento" | "energia";
  intensity: number; // 0-1
}

export function DynamicMandala({ mood, intensity }: DynamicMandalaProps) {
  // Mapear cores e configurações por mood
  const moodConfig = {
    foco: {
      colors: {
        primary: "#2ECC71",
        secondary: "#3498DB",
        accent: "#1ABC9C",
      },
      animationSpeed: 1, // Lento
      pattern: "concentric",
      glow: "rgba(46, 204, 113, 0.5)",
    },
    criatividade: {
      colors: {
        primary: "#FF6B6B",
        secondary: "#FFA500",
        accent: "#FF1493",
      },
      animationSpeed: 0.5, // Dinâmico
      pattern: "spiral",
      glow: "rgba(255, 107, 107, 0.6)",
    },
    relaxamento: {
      colors: {
        primary: "#9B59B6",
        secondary: "#E8E8E8",
        accent: "#B8A9C9",
      },
      animationSpeed: 1.5, // Muito lento
      pattern: "waves",
      glow: "rgba(155, 89, 182, 0.4)",
    },
    energia: {
      colors: {
        primary: "#FFD700",
        secondary: "#FF4500",
        accent: "#FFA500",
      },
      animationSpeed: 0.3, // Rápido
      pattern: "rays",
      glow: "rgba(255, 215, 0, 0.7)",
    },
  };

  const config = moodConfig[mood];
  const scaleFactor = 1 + intensity * 0.1; // 0-10% variação

  return (
    <div className="relative w-64 h-64">
      {/* Glow externo pulsante */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4 / config.animationSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className="w-56 h-56 rounded-full"
          style={{
            boxShadow: `0 0 60px ${config.glow}`,
          }}
        />
      </motion.div>

      {/* Padrão específico por mood */}
      {config.pattern === "concentric" && (
        <>
          {/* Círculos concêntricos (foco) */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3 / config.animationSpeed,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            >
              <div
                className="rounded-full border-2"
                style={{
                  width: `${140 - i * 25}px`,
                  height: `${140 - i * 25}px`,
                  borderColor: i % 2 === 0 ? config.colors.primary : config.colors.secondary,
                  opacity: 0.5,
                }}
              />
            </motion.div>
          ))}
        </>
      )}

      {config.pattern === "spiral" && (
        <>
          {/* Espiral de pontos (criatividade) */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 15 / config.animationSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12;
              const radius = 30 + i * 8;
              const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
              const y = 50 + Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={`spiral-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${12 + i * 2}px`,
                    height: `${12 + i * 2}px`,
                    backgroundColor: i % 2 === 0 ? config.colors.primary : config.colors.accent,
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{
                    scale: [0.9, 1.2, 0.9],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </motion.div>
        </>
      )}

      {config.pattern === "waves" && (
        <>
          {/* Ondas concêntricas (relaxamento) */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut",
              }}
            >
              <div
                className="rounded-full border-2"
                style={{
                  width: "120px",
                  height: "120px",
                  borderColor: config.colors.primary,
                }}
              />
            </motion.div>
          ))}
        </>
      )}

      {config.pattern === "rays" && (
        <>
          {/* Raios de energia */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10 / config.animationSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              const x = 50 + Math.cos((angle * Math.PI) / 180) * 45;
              const y = 50 + Math.sin((angle * Math.PI) / 180) * 45;

              return (
                <motion.div
                  key={`ray-${i}`}
                  className="absolute w-1 h-16 rounded-full"
                  style={{
                    backgroundColor: i % 2 === 0 ? config.colors.primary : config.colors.secondary,
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                  }}
                  animate={{
                    scaleY: [0.8, 1.3, 0.8],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </motion.div>
        </>
      )}

      {/* Círculo central sempre presente */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, scaleFactor, 1],
          rotate: 360,
        }}
        transition={{
          scale: {
            duration: 4 / config.animationSpeed,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 60 / config.animationSpeed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        <motion.div
          className="w-24 h-24 rounded-full shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
          }}
          animate={{
            boxShadow: [
              `0 0 30px ${config.glow}`,
              `0 0 60px ${config.glow}`,
              `0 0 30px ${config.glow}`,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Texto central */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="text-center">
          <motion.div
            className="text-4xl mb-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.div>
          <p className="text-xl font-bold text-white drop-shadow-lg">
            Parabéns!
          </p>
        </div>
      </motion.div>
    </div>
  );
}

