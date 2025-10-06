"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DynamicMandala } from "./DynamicMandala";
import { MandalaSound } from "./MandalaSound";

interface MandalaRewardProps {
  visible: boolean;
  mood?: "foco" | "criatividade" | "relaxamento" | "energia";
  intensity?: number;
}

export function MandalaReward({ visible, mood = "foco", intensity = 0.5 }: MandalaRewardProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Som sincronizado com mandala */}
          <MandalaSound mood={mood} intensity={intensity} playing={visible} />
          
          {/* Tela de Recompensa Completa */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-lg"
          >
            {/* Dynamic Mandala baseada em mood */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <DynamicMandala mood={mood} intensity={intensity} />
            </motion.div>

            {/* Mensagem de celebração */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-yellow-400 mt-8 text-lg animate-pulse text-center px-6"
            >
              ✨ Ciclo concluído. Respire e receba. ✨
            </motion.p>

            {/* TODO: Integrar resposta da IA baseada no preset concluído. */}
            {/* Exemplo: "Você concluiu um ciclo de foco. Quer iniciar um momento de criatividade ou pausa guiada?" */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

