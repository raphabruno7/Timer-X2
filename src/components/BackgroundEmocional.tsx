"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { EstadoEmocional } from "@/hooks/useRessonanciaEmocional";

type Props = {
  estado: EstadoEmocional;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function BackgroundEmocional({ estado, children, className = "", style }: Props) {
  // Overlay sutil (não substitui fundo base do app)
  const coresOverlay: Record<EstadoEmocional, string> = {
    tensao: "rgba(15, 61, 62, 0.06)",
    foco: "rgba(46, 204, 113, 0.08)",
    reintegracao: "rgba(255, 215, 0, 0.07)",
    realizacao: "rgba(255, 215, 0, 0.1)",
    neutro: "transparent",
  };

  const reduce = useReducedMotion();
  const animate = reduce
    ? { opacity: 1 }
    : { opacity: [0.9, 1, 0.9] };

  return (
    <div className={`relative w-full min-h-screen ${className}`} style={style}>
      {/* Conteúdo da página */}
      <div className="relative z-10">{children}</div>

      {/* Overlay emocional decorativo */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundColor: coresOverlay[estado] }}
        animate={animate}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );
}
