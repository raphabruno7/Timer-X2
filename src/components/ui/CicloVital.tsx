/**
 * 🌍💧🔥🌬️✨ CICLO VITAL
 * 
 * Sistema simbólico de progressão do usuário através dos 5 elementos.
 * Cada elemento representa um nível de maestria e dedicação.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export type Elemento = "terra" | "agua" | "fogo" | "ar" | "eter";

interface ElementoConfig {
  nome: string;
  icone: string;
  cor: string;
  corGradiente: string;
  descricao: string;
  nivelMinimo: number;
  nivelMaximo: number | null;
}

/**
 * Configuração dos 5 elementos do Ciclo Vital
 */
const ELEMENTOS: Record<Elemento, ElementoConfig> = {
  terra: {
    nome: "Terra",
    icone: "🌍",
    cor: "#8B5E3C",
    corGradiente: "#A0784F",
    descricao: "Fundação e início",
    nivelMinimo: 0,
    nivelMaximo: 3,
  },
  agua: {
    nome: "Água",
    icone: "💧",
    cor: "#00C2FF",
    corGradiente: "#5DADE2",
    descricao: "Fluidez e adaptação",
    nivelMinimo: 4,
    nivelMaximo: 7,
  },
  fogo: {
    nome: "Fogo",
    icone: "🔥",
    cor: "#FF4500",
    corGradiente: "#FF6347",
    descricao: "Transformação e poder",
    nivelMinimo: 8,
    nivelMaximo: 15,
  },
  ar: {
    nome: "Ar",
    icone: "🌬️",
    cor: "#C0E6E9",
    corGradiente: "#A8DADC",
    descricao: "Leveza e clareza",
    nivelMinimo: 16,
    nivelMaximo: 30,
  },
  eter: {
    nome: "Éter",
    icone: "✨",
    cor: "#FFD700",
    corGradiente: "#FFA500",
    descricao: "Transcendência e maestria",
    nivelMinimo: 31,
    nivelMaximo: null, // Infinito
  },
};

/**
 * Determina o elemento baseado no número de ciclos
 */
export function determinarElemento(totalCiclos: number): Elemento {
  if (totalCiclos >= 31) return "eter";
  if (totalCiclos >= 16) return "ar";
  if (totalCiclos >= 8) return "fogo";
  if (totalCiclos >= 4) return "agua";
  return "terra";
}

/**
 * Calcula progresso dentro do elemento atual (0-1)
 */
export function calcularProgressoElemento(totalCiclos: number, elemento: Elemento): number {
  const config = ELEMENTOS[elemento];
  
  if (config.nivelMaximo === null) {
    // Éter não tem máximo, sempre 100%
    return 1;
  }
  
  const ciclosDentroDoElemento = totalCiclos - config.nivelMinimo;
  const ciclosTotaisNoElemento = config.nivelMaximo - config.nivelMinimo + 1;
  
  return Math.min(1, Math.max(0, ciclosDentroDoElemento / ciclosTotaisNoElemento));
}

interface CicloVitalProps {
  totalCiclos: number;
  mostrarDetalhes?: boolean;
  onEvolucao?: (novoElemento: Elemento) => void;
}

export function CicloVital({ 
  totalCiclos, 
  mostrarDetalhes = false,
  onEvolucao,
}: CicloVitalProps) {
  const [elementoAtual, setElementoAtual] = useState<Elemento>("terra");
  const [elementoAnterior, setElementoAnterior] = useState<Elemento | null>(null);
  const [animandoEvolucao, setAnimandoEvolucao] = useState(false);
  
  const config = ELEMENTOS[elementoAtual];
  const progresso = calcularProgressoElemento(totalCiclos, elementoAtual);
  const proximoCiclo = config.nivelMaximo !== null ? config.nivelMaximo + 1 : null;

  // Detectar mudança de elemento
  useEffect(() => {
    const novoElemento = determinarElemento(totalCiclos);
    
    if (novoElemento !== elementoAtual) {
      // Evolução detectada!
      setElementoAnterior(elementoAtual);
      setAnimandoEvolucao(true);
      
      // Callback de evolução
      if (onEvolucao) {
        onEvolucao(novoElemento);
      }
      
      // Atualizar elemento após animação
      setTimeout(() => {
        setElementoAtual(novoElemento);
        setAnimandoEvolucao(false);
        setElementoAnterior(null);
      }, 2000); // 2s de animação
    } else {
      setElementoAtual(novoElemento);
    }
  }, [totalCiclos, elementoAtual, onEvolucao]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {animandoEvolucao && elementoAnterior ? (
          // Animação de Evolução
          <motion.div
            key="evolucao"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 1.5, 0],
              opacity: [1, 1, 0],
              rotate: [0, 180, 360],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div 
              className="text-6xl"
              style={{
                filter: `drop-shadow(0 0 20px ${ELEMENTOS[elementoAnterior].cor})`,
              }}
            >
              {ELEMENTOS[elementoAnterior].icone}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        key={elementoAtual}
        initial={animandoEvolucao ? { scale: 0, opacity: 0, rotate: -180 } : {}}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: animandoEvolucao ? 1.5 : 0 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${config.cor}20, ${config.corGradiente}30)`,
          borderColor: `${config.cor}40`,
          boxShadow: `0 0 15px ${config.cor}30`,
        }}
      >
        {/* Ícone do Elemento */}
        <motion.div
          className="text-lg"
          animate={{
            scale: [1, 1.1, 1],
            rotate: animandoEvolucao ? [0, 360] : 0,
          }}
          transition={{
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 2, ease: "easeInOut" },
          }}
          style={{
            filter: `drop-shadow(0 0 8px ${config.cor}80)`,
          }}
        >
          {config.icone}
        </motion.div>

        {/* Nome do Elemento */}
        <div className="flex flex-col">
          <span 
            className="text-xs font-semibold tracking-wide"
            style={{ color: config.cor }}
          >
            {config.nome}
          </span>
          
          {mostrarDetalhes && (
            <span className="text-[9px] text-gray-500">
              {totalCiclos} ciclo{totalCiclos !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Barra de Progresso */}
        {proximoCiclo !== null && (
          <div className="ml-1 flex flex-col items-end gap-0.5">
            <div className="w-16 h-1 bg-gray-800/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${config.cor}, ${config.corGradiente})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progresso * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            {mostrarDetalhes && (
              <span 
                className="text-[8px] font-mono"
                style={{ color: config.cor }}
              >
                {proximoCiclo - totalCiclos} até próximo
              </span>
            )}
          </div>
        )}

        {/* Indicador de Maestria (Éter) */}
        {elementoAtual === "eter" && (
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="ml-1"
          >
            <span className="text-xs">👑</span>
          </motion.div>
        )}
      </motion.div>

      {/* Tooltip com descrição (hover) */}
      {mostrarDetalhes && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <div 
            className="px-2 py-1 rounded text-[9px] whitespace-nowrap"
            style={{
              background: `${config.cor}20`,
              color: config.cor,
              border: `1px solid ${config.cor}40`,
            }}
          >
            {config.descricao}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Componente compacto para visualização mínima
 */
export function CicloVitalCompacto({ totalCiclos }: { totalCiclos: number }) {
  const elemento = determinarElemento(totalCiclos);
  const config = ELEMENTOS[elemento];

  return (
    <motion.div
      className="flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-sm"
      style={{
        background: `${config.cor}15`,
        border: `1px solid ${config.cor}30`,
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.span
        className="text-sm"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {config.icone}
      </motion.span>
      <span 
        className="text-[10px] font-semibold"
        style={{ color: config.cor }}
      >
        {config.nome}
      </span>
      <span className="text-[9px] text-gray-500">
        {totalCiclos}
      </span>
    </motion.div>
  );
}

/**
 * Componente de Notificação de Evolução (para usar com toast)
 */
interface NotificacaoEvolucaoProps {
  elemento: Elemento;
  totalCiclos: number;
}

export function NotificacaoEvolucao({ elemento, totalCiclos }: NotificacaoEvolucaoProps) {
  const config = ELEMENTOS[elemento];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-3 p-3 rounded-lg"
      style={{
        background: `linear-gradient(135deg, ${config.cor}20, ${config.corGradiente}30)`,
        border: `2px solid ${config.cor}60`,
      }}
    >
      <motion.div
        className="text-3xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
        }}
        style={{
          filter: `drop-shadow(0 0 10px ${config.cor})`,
        }}
      >
        {config.icone}
      </motion.div>

      <div className="flex flex-col">
        <span className="text-sm font-bold" style={{ color: config.cor }}>
          Evolução para {config.nome}!
        </span>
        <span className="text-xs text-gray-400">
          {config.descricao} · {totalCiclos} ciclos completados
        </span>
      </div>
    </motion.div>
  );
}

