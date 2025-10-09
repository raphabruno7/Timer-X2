"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { EstadoEmocional } from "@/hooks/useRessonanciaEmocional";

type Props = {
  estado: EstadoEmocional;
  intensidadeModifier?: number; // 0.3–1.4 (do config.intensidadeModifier)
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * BackgroundEmocional — Overlay emocional com coerência luminosa
 * 
 * Conecta a luminosidade do fundo à energia da Mandala através
 * do intensidadeModifier, criando resposta visual unificada.
 * 
 * @param estado - Estado emocional (tensao | foco | reintegracao | realizacao | neutro)
 * @param intensidadeModifier - Modificador de intensidade da Mandala (0.3–1.4)
 * @param children - Conteúdo da página
 * 
 * Performance: Usa opacity (GPU-friendly), evita blur (CPU-intensivo)
 */
export function BackgroundEmocional({ 
  estado, 
  intensidadeModifier = 1.0,
  children, 
  className = "", 
  style 
}: Props) {
  // Overlay sutil (base colors)
  const coresOverlayBase: Record<EstadoEmocional, { r: number; g: number; b: number }> = {
    tensao: { r: 15, g: 61, b: 62 },        // Azul calmo
    foco: { r: 46, g: 204, b: 113 },        // Verde energia
    reintegracao: { r: 255, g: 215, b: 0 }, // Dourado acolhimento
    realizacao: { r: 255, g: 215, b: 0 },   // Dourado celebração
    neutro: { r: 28, g: 28, b: 28 },        // Cinza base
  };

  // Opacidade base por estado (ajustada por intensidadeModifier)
  const opacidadeBase: Record<EstadoEmocional, number> = {
    tensao: 0.04,        // Sutil (acalma)
    foco: 0.06,          // Moderado (energia)
    reintegracao: 0.05,  // Suave (acolhimento)
    realizacao: 0.08,    // Mais intenso (celebração)
    neutro: 0.02,        // Muito sutil
  };

  const reduce = useReducedMotion();

  // Normalizar intensidadeModifier (0.3–1.4) para fator de opacity (0.5–1.5)
  // Menor intensidade → menos overlay; Maior intensidade → mais overlay
  const fatorIntensidade = Math.min(1.5, Math.max(0.5, intensidadeModifier));
  
  const cor = coresOverlayBase[estado];
  const opacidadeFinal = opacidadeBase[estado] * fatorIntensidade;

  // Criar cor RGBA com opacity ajustada
  const corFinal = `rgba(${cor.r}, ${cor.g}, ${cor.b}, ${opacidadeFinal})`;

  // Animação de pulsação sutil (se motion não reduzido)
  const animate = reduce
    ? { opacity: 1 }
    : { 
        opacity: [
          0.85, 
          1.0, 
          0.85
        ]
      };

  return (
    <div className={`relative w-full min-h-screen ${className}`} style={style}>
      {/* Conteúdo da página */}
      <div className="relative z-10">{children}</div>

      {/* Overlay emocional com coerência luminosa */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundColor: corFinal }}
        animate={animate}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
}
