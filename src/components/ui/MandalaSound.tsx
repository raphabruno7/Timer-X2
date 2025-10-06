"use client";

import { useEffect, useRef } from "react";

// TODO: Integrar geração de som via IA (Magenta ou OpenAI Audio API)
// Prompt base: "Generate a harmonic tone matching the [mood] and energy level [intensity]."

interface MandalaSoundProps {
  mood: "foco" | "criatividade" | "relaxamento" | "energia";
  intensity: number; // 0-1
  playing: boolean;
}

export function MandalaSound({ mood, intensity, playing }: MandalaSoundProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (playing) {
      // Criar Web Audio Context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Mapear frequências por mood
      const moodFrequencies = {
        foco: 432, // A4 = 432Hz (harmônico natural)
        criatividade: 528, // C = 528Hz (transformação)
        relaxamento: 396, // G = 396Hz (libertação)
        energia: 639, // D# = 639Hz (conexão)
      };

      // Criar oscillator (tom senoidal)
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(
        moodFrequencies[mood], 
        audioContext.currentTime
      );

      // Criar gain node para controle de volume
      const gainNode = audioContext.createGain();
      const maxVolume = 0.2 + intensity * 0.2; // Volume entre 0.2 e 0.4
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);

      // Conectar oscillator → gainNode → speakers
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Fade-in suave (0 → maxVolume em 1s)
      gainNode.gain.exponentialRampToValueAtTime(
        maxVolume, 
        audioContext.currentTime + 1
      );
      
      // Manter volume por 6s
      gainNode.gain.exponentialRampToValueAtTime(
        maxVolume, 
        audioContext.currentTime + 7
      );
      
      // Fade-out suave (maxVolume → 0.001 em 1s)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001, 
        audioContext.currentTime + 8
      );

      // Iniciar som
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 8);

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      // Vibração mobile baseada no mood
      if (navigator.vibrate) {
        const vibrationPatterns = {
          foco: [300, 100, 300], // Pulsos curtos e precisos
          criatividade: [150, 50, 150, 50, 150], // Rápido e variado
          relaxamento: [500, 200, 500], // Longo e suave
          energia: [200, 50, 200, 50, 200, 50, 200], // Intenso
        };
        
        navigator.vibrate(vibrationPatterns[mood]);
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
  }, [playing, mood, intensity]);

  return null; // Componente sem renderização visual
}

