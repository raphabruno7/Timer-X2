"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MandalaRewardProps {
  visible: boolean;
}

export function MandalaReward({ visible }: MandalaRewardProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
        >
          <div className="relative w-64 h-64">
            {/* Círculo central com gradiente verde→amarelo (pulso de escala e brilho) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                rotate: 360,
              }}
              transition={{
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              <motion.div
                className="w-32 h-32 rounded-full shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #2ECC71 0%, #FFD700 100%)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(46, 204, 113, 0.5)",
                    "0 0 50px rgba(255, 215, 0, 0.7)",
                    "0 0 30px rgba(46, 204, 113, 0.5)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Anel externo pulsando */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-48 h-48 rounded-full border-4 border-[#2ECC71] opacity-40" />
            </motion.div>

            {/* Container dos 6 círculos girando lentamente */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...Array(6)].map((_, i) => {
                const angle = (i * 360) / 6;
                const x = 50 + Math.cos((angle * Math.PI) / 180) * 40;
                const y = 50 + Math.sin((angle * Math.PI) / 180) * 40;
                
                return (
                  <motion.div
                    key={i}
                    className="absolute w-8 h-8 rounded-full bg-[#2ECC71] shadow-lg"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      scale: [0.9, 1.1, 0.9],
                      opacity: [0.6, 0.9, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
            </motion.div>

            {/* Texto central com fade-in suave */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-4xl mb-2"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
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
                <motion.p
                  className="text-sm text-white/80 drop-shadow-md mt-1"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Ciclo completo
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

