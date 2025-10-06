"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { DynamicMandala } from "./DynamicMandala";

interface MandalaRewardProps {
  visible: boolean;
  mood?: "foco" | "criatividade" | "relaxamento" | "energia";
  intensity?: number;
}

export function MandalaReward({ visible, mood = "foco", intensity = 0.5 }: MandalaRewardProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (visible) {
      // Criar Web Audio Context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Criar oscillator (tom senoidal 432Hz)
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(432, audioContext.currentTime); // A4 = 432Hz

      // Criar gain node para controle de volume
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Começar do silêncio

      // Conectar oscillator → gainNode → speakers
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Fade-in suave (0 → 0.3 em 1s)
      gainNode.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 1);
      
      // Manter volume por 6s
      gainNode.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 7);
      
      // Fade-out suave (0.3 → 0.001 em 1s)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 8);

      // Iniciar som
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 8);

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      // Vibração mobile (se suportado)
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300]); // Vibra 300ms, pausa 100ms, vibra 300ms
      }

      // Cleanup ao desmontar
      return () => {
        if (oscillatorRef.current) {
          try {
            oscillatorRef.current.stop();
          } catch (e) {
            // Ignorar erro se já parou
          }
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        // Parar vibração
        if (navigator.vibrate) {
          navigator.vibrate(0);
        }
      };
    }
  }, [visible]);

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
          {/* Dynamic Mandala baseada em mood */}
          <DynamicMandala mood={mood} intensity={intensity} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

