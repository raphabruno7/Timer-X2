/**
 * 🌍💧🔥🌬️✨ MEMÓRIA ELEMENTAL
 * 
 * Timeline visual e animada da jornada do usuário através dos elementos.
 * Registra cada transição com data, hora e símbolo colorido.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MemoriaElementalProps {
  usuarioId: string;
}

interface ElementoConfig {
  icone: string;
  nome: string;
  cor: string;
  corGradiente: string;
}

const ELEMENTOS: Record<string, ElementoConfig> = {
  terra: {
    icone: "🌍",
    nome: "Terra",
    cor: "#8B5E3C",
    corGradiente: "#A0784F",
  },
  agua: {
    icone: "💧",
    nome: "Água",
    cor: "#00C2FF",
    corGradiente: "#5DADE2",
  },
  fogo: {
    icone: "🔥",
    nome: "Fogo",
    cor: "#FF4500",
    corGradiente: "#FF6347",
  },
  ar: {
    icone: "🌬️",
    nome: "Ar",
    cor: "#C0E6E9",
    corGradiente: "#A8DADC",
  },
  eter: {
    icone: "✨",
    nome: "Éter",
    cor: "#FFD700",
    corGradiente: "#FFA500",
  },
};

export function MemoriaElemental({ usuarioId }: MemoriaElementalProps) {
  const memorias = useQuery(api.ciclos.listarMemoria, { usuarioId, limite: 50 });

  if (!memorias || memorias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Sua jornada está começando
          </h3>
          <p className="text-sm text-gray-500">
            Complete ciclos para ver sua evolução através dos elementos
          </p>
        </motion.div>
      </div>
    );
  }

  // Inverter para mostrar do mais antigo ao mais recente (timeline crescente)
  const memoriasOrdenadas = [...memorias].reverse();

  return (
    <ScrollArea className="h-full max-h-[70vh] px-4 py-6">
      <div className="relative">
        {/* Linha vertical da timeline */}
        <div 
          className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-gray-700 to-transparent"
          style={{ opacity: 0.3 }}
        />

        <AnimatePresence>
          {memoriasOrdenadas.map((memoria, index) => {
            const config = ELEMENTOS[memoria.elemento] || ELEMENTOS.terra;
            const data = new Date(memoria.timestamp);
            const isFirst = index === 0;
            const isLast = index === memoriasOrdenadas.length - 1;

            return (
              <motion.div
                key={memoria._id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.1, 0.5), // Máximo 0.5s de delay
                  ease: "easeOut",
                }}
                className="relative flex items-start gap-4 mb-8 last:mb-0"
              >
                {/* Ponto da timeline */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                    style={{
                      background: `linear-gradient(135deg, ${config.cor}, ${config.corGradiente})`,
                      boxShadow: `0 0 20px ${config.cor}60`,
                    }}
                    animate={{
                      boxShadow: [
                        `0 0 20px ${config.cor}60`,
                        `0 0 30px ${config.cor}80`,
                        `0 0 20px ${config.cor}60`,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span
                      className="text-2xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: isLast ? [0, 360] : 0,
                      }}
                      transition={{
                        duration: isLast ? 20 : 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      {config.icone}
                    </motion.span>
                  </motion.div>

                  {/* Badge "Início" para primeiro elemento */}
                  {isFirst && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                    >
                      Início
                    </motion.div>
                  )}

                  {/* Badge "Atual" para último elemento */}
                  {isLast && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse"
                    >
                      Atual
                    </motion.div>
                  )}
                </div>

                {/* Conteúdo do card */}
                <motion.div
                  className="flex-1 p-4 rounded-lg backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${config.cor}15, ${config.corGradiente}10)`,
                    border: `1px solid ${config.cor}30`,
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 0 25px ${config.cor}40`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Header do card */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 
                      className="text-lg font-bold"
                      style={{ color: config.cor }}
                    >
                      {config.nome}
                    </h4>
                    <span 
                      className="text-xs font-mono opacity-70"
                      style={{ color: config.cor }}
                    >
                      {memoria.totalCiclos} ciclo{memoria.totalCiclos !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Data e hora */}
                  <div className="flex flex-col gap-1 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{data.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕐</span>
                      <span>{data.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>

                  {/* Descrição baseada no elemento */}
                  <p className="mt-3 text-xs text-gray-500 italic">
                    {getDescricaoElemento(memoria.elemento)}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Indicador de "Mais por vir" no final */}
        {memorias.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex items-center justify-center gap-2 py-4 text-gray-500 text-sm"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              ✨
            </motion.div>
            <span className="italic">Continue sua jornada...</span>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  );
}

/**
 * Retorna descrição poética baseada no elemento
 */
function getDescricaoElemento(elemento: string): string {
  const descricoes: Record<string, string> = {
    terra: "Fundação estabelecida. O solo firme onde tudo começa.",
    agua: "Fluidez alcançada. Adaptando-se aos fluxos da vida.",
    fogo: "Transformação ativa. Poder e paixão em movimento.",
    ar: "Leveza conquistada. Clareza mental e liberdade.",
    eter: "Maestria transcendente. União com o infinito.",
  };
  
  return descricoes[elemento] || "Um passo importante na jornada.";
}

/**
 * Variante compacta para visualização rápida
 */
export function MemoriaElementalCompacta({ usuarioId }: MemoriaElementalProps) {
  const memorias = useQuery(api.ciclos.listarMemoria, { usuarioId, limite: 5 });

  if (!memorias || memorias.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-4">
        Nenhuma evolução registrada
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center py-2">
      {memorias.reverse().map((memoria) => {
        const config = ELEMENTOS[memoria.elemento] || ELEMENTOS.terra;
        
        return (
          <motion.div
            key={memoria._id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
            style={{
              background: `linear-gradient(135deg, ${config.cor}, ${config.corGradiente})`,
              boxShadow: `0 0 10px ${config.cor}40`,
            }}
            title={`${config.nome} - ${new Date(memoria.timestamp).toLocaleDateString()}`}
          >
            {config.icone}
          </motion.div>
        );
      })}
    </div>
  );
}

