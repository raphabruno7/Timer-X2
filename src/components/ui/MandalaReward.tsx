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
          
          {/* Mandala visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            {/* Dynamic Mandala baseada em mood */}
            <DynamicMandala mood={mood} intensity={intensity} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

