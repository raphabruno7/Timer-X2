"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DynamicMandala } from "./DynamicMandala";
import { MandalaSound } from "./MandalaSound";

interface MandalaRewardProps {
  visible: boolean;
  mood?: "foco" | "criatividade" | "relaxamento" | "energia";
  intensity?: number;
  iaSugestao?: { sugestao: string; descricao: string } | null;
  onIniciarSugestao?: () => void;
  corEmocional?: string;
}

export function MandalaReward({ 
  visible, 
  mood = "foco", 
  intensity = 0.5,
  iaSugestao,
  onIniciarSugestao,
  corEmocional = "#2ECC71"
}: MandalaRewardProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Som sincronizado com mandala */}
          <MandalaSound mood={mood} intensity={intensity} playing={visible} />
          
          {/* Tela de Recompensa Completa com cor emocional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-lg"
            style={{
              background: `radial-gradient(circle at center, ${corEmocional}15 0%, #000000E6 60%)`,
              transition: 'background 1s ease-in-out',
            }}
          >
            {/* Dynamic Mandala baseada em mood */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <DynamicMandala mood={mood} intensity={intensity} />
            </motion.div>

            {/* Mensagem de celebração com cor emocional */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-8 text-lg animate-pulse text-center px-6"
              style={{
                color: corEmocional,
                textShadow: `0 0 20px ${corEmocional}80`,
                transition: 'color 1s ease-in-out',
              }}
            >
              ✨ Ciclo concluído. Respire e receba. ✨
            </motion.p>

            {/* Sugestão da IA */}
            {iaSugestao && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-6 bg-neutral-900/80 p-5 rounded-xl border border-yellow-400/50 text-center max-w-sm backdrop-blur-sm"
              >
                <p className="text-green-400 text-lg font-semibold mb-2">
                  🌿 {iaSugestao.sugestao}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {iaSugestao.descricao}
                </p>
                {onIniciarSugestao && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onIniciarSugestao}
                    className="mt-4 px-6 py-2 bg-[#2ECC71] hover:bg-[#2ECC71]/80 text-white rounded-lg font-medium transition-colors"
                  >
                    Iniciar {iaSugestao.sugestao}
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

