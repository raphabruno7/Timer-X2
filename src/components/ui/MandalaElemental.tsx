/**
 * 🌍💧🔥🌬️✨ MANDALA ELEMENTAL
 * 
 * Visualização artística e simbólica do progresso espiritual do usuário
 * através dos 5 elementos. Cada anel concêntrico representa um elemento,
 * com cor e intensidade baseadas nos ciclos completados.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MandalaElementalProps {
  usuarioId: string;
  tamanho?: number; // Tamanho em pixels (padrão: 400)
}

interface ElementoStats {
  elemento: string;
  icone: string;
  nome: string;
  cor: string;
  corGradiente: string;
  ciclos: number;
  intensidade: number; // 0-1
  ultimaData?: Date;
}

const ELEMENTOS_CONFIG = {
  terra: {
    icone: "🌍",
    nome: "Terra",
    cor: "#8B5E3C",
    corGradiente: "#A0784F",
    ordem: 4, // Anel mais externo
  },
  agua: {
    icone: "💧",
    nome: "Água",
    cor: "#00C2FF",
    corGradiente: "#5DADE2",
    ordem: 3,
  },
  fogo: {
    icone: "🔥",
    nome: "Fogo",
    cor: "#FF4500",
    corGradiente: "#FF6347",
    ordem: 2,
  },
  ar: {
    icone: "🌬️",
    nome: "Ar",
    cor: "#C0E6E9",
    corGradiente: "#A8DADC",
    ordem: 1,
  },
  eter: {
    icone: "✨",
    nome: "Éter",
    cor: "#FFD700",
    corGradiente: "#FFA500",
    ordem: 0, // Núcleo central
  },
};

export function MandalaElemental({ usuarioId, tamanho = 400 }: MandalaElementalProps) {
  const memorias = useQuery(api.ciclos.listarMemoria, { usuarioId, limite: 100 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [pulsingElement, setPulsingElement] = useState<string | null>(null);
  
  // Calcular estatísticas por elemento
  const elementosStats: ElementoStats[] = useMemo(() => {
    if (!memorias || memorias.length === 0) {
      return Object.entries(ELEMENTOS_CONFIG).map(([key, config]) => ({
        elemento: key,
        icone: config.icone,
        nome: config.nome,
        cor: config.cor,
        corGradiente: config.corGradiente,
        ciclos: 0,
        intensidade: 0,
      }));
    }

    // Agrupar por elemento
    const gruposPorElemento: Record<string, typeof memorias> = {};
    memorias.forEach((m) => {
      if (!gruposPorElemento[m.elemento]) {
        gruposPorElemento[m.elemento] = [];
      }
      gruposPorElemento[m.elemento].push(m);
    });

    // Calcular stats
    return Object.entries(ELEMENTOS_CONFIG).map(([key, config]) => {
      const registros = gruposPorElemento[key] || [];
      const ciclos = registros.length;
      
      // Intensidade baseada em ciclos (máximo 10 ciclos = 100%)
      const intensidade = Math.min(ciclos / 10, 1);
      
      // Última data
      const ultimaData = registros.length > 0
        ? new Date(registros[0].timestamp) // Já vem ordenado DESC
        : undefined;

      return {
        elemento: key,
        icone: config.icone,
        nome: config.nome,
        cor: config.cor,
        corGradiente: config.corGradiente,
        ciclos,
        intensidade,
        ultimaData,
      };
    });
  }, [memorias]);

  // Detectar novos elementos para animação
  useEffect(() => {
    if (!memorias || memorias.length === 0) return;
    
    const ultimoElemento = memorias[0].elemento;
    setPulsingElement(ultimoElemento);
    
    const timeout = setTimeout(() => {
      setPulsingElement(null);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [memorias]);

  const centro = tamanho / 2;
  const raioMax = tamanho / 2 - 20; // Margem de 20px
  const espessuraAnel = raioMax / 5; // 5 elementos = 5 anéis

  return (
    <TooltipProvider>
      <div className="relative flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
          style={{ width: tamanho, height: tamanho }}
        >
          <svg
            width={tamanho}
            height={tamanho}
            viewBox={`0 0 ${tamanho} ${tamanho}`}
            className="drop-shadow-2xl"
          >
            {/* Fundo da mandala */}
            <defs>
              <radialGradient id="mandala-bg" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#111111" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
              </radialGradient>
              
              {/* Gradientes para cada elemento */}
              {elementosStats.map((elem) => (
                <linearGradient
                  key={`grad-${elem.elemento}`}
                  id={`gradient-${elem.elemento}`}
                  x1="0%" y1="0%" x2="100%" y2="100%"
                >
                  <stop offset="0%" stopColor={elem.cor} stopOpacity={elem.intensidade * 0.7} />
                  <stop offset="100%" stopColor={elem.corGradiente} stopOpacity={elem.intensidade * 0.9} />
                </linearGradient>
              ))}
            </defs>

            {/* Círculo de fundo */}
            <circle
              cx={centro}
              cy={centro}
              r={raioMax}
              fill="url(#mandala-bg)"
            />

            {/* Anéis dos elementos (de fora para dentro) */}
            {elementosStats
              .sort((a, b) => 
                ELEMENTOS_CONFIG[b.elemento as keyof typeof ELEMENTOS_CONFIG].ordem - 
                ELEMENTOS_CONFIG[a.elemento as keyof typeof ELEMENTOS_CONFIG].ordem
              )
              .map((elem, index) => {
                const config = ELEMENTOS_CONFIG[elem.elemento as keyof typeof ELEMENTOS_CONFIG];
                const ordem = config.ordem;
                
                // Calcular raios (de fora para dentro)
                const raioExterno = raioMax - (ordem * espessuraAnel);
                const raioInterno = raioExterno - espessuraAnel + 2; // +2 para overlap
                
                const isHovered = hoveredElement === elem.elemento;
                const isPulsing = pulsingElement === elem.elemento;

                return (
                  <Tooltip key={elem.elemento}>
                    <TooltipTrigger asChild>
                      <g>
                        {/* Anel externo */}
                        <motion.circle
                          cx={centro}
                          cy={centro}
                          r={raioExterno}
                          fill="none"
                          stroke={`url(#gradient-${elem.elemento})`}
                          strokeWidth={espessuraAnel}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: elem.intensidade > 0 ? 0.7 : 0.2,
                            scale: isHovered ? 1.05 : isPulsing ? [1, 1.1, 1] : 1,
                          }}
                          transition={{
                            duration: isPulsing ? 1 : 0.3,
                            repeat: isPulsing ? 2 : 0,
                          }}
                          style={{ cursor: "pointer" }}
                          onMouseEnter={() => setHoveredElement(elem.elemento)}
                          onMouseLeave={() => setHoveredElement(null)}
                          className="transition-all"
                        />

                        {/* Glow effect quando hover ou pulsing */}
                        {(isHovered || isPulsing) && (
                          <motion.circle
                            cx={centro}
                            cy={centro}
                            r={raioExterno}
                            fill="none"
                            stroke={elem.cor}
                            strokeWidth={espessuraAnel + 4}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: [0, 0.3, 0],
                              scale: [1, 1.08, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                            style={{ pointerEvents: "none" }}
                          />
                        )}

                        {/* Ícone do elemento */}
                        {elem.intensidade > 0 && (
                          <motion.text
                            x={centro}
                            y={centro}
                            dy={-(raioInterno + raioExterno) / 2 + 8}
                            textAnchor="middle"
                            fontSize={espessuraAnel * 0.6}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: isHovered ? 1 : 0.8,
                              scale: isHovered ? 1.2 : 1,
                            }}
                            transition={{ duration: 0.2 }}
                            style={{ pointerEvents: "none", userSelect: "none" }}
                          >
                            {elem.icone}
                          </motion.text>
                        )}

                        {/* Padrões decorativos nos anéis */}
                        {elem.intensidade > 0.3 && (
                          <>
                            {Array.from({ length: Math.floor(12 * elem.intensidade) }).map((_, i) => {
                              const angulo = (i * 360) / Math.floor(12 * elem.intensidade);
                              const rad = (angulo * Math.PI) / 180;
                              const raioMedio = (raioExterno + raioInterno) / 2;
                              const px = centro + raioMedio * Math.cos(rad);
                              const py = centro + raioMedio * Math.sin(rad);

                              return (
                                <motion.circle
                                  key={`dot-${elem.elemento}-${i}`}
                                  cx={px}
                                  cy={py}
                                  r={2}
                                  fill={elem.cor}
                                  opacity={0.4}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    delay: i * 0.05,
                                    duration: 0.3,
                                  }}
                                />
                              );
                            })}
                          </>
                        )}
                      </g>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      className="bg-black/90 border"
                      style={{
                        borderColor: elem.cor,
                      }}
                    >
                      <div className="text-center">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{elem.icone}</span>
                          <span 
                            className="font-bold"
                            style={{ color: elem.cor }}
                          >
                            {elem.nome}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          <div>Ciclos: {elem.ciclos}</div>
                          {elem.ultimaData && (
                            <div>
                              Última: {elem.ultimaData.toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

            {/* Núcleo central (Éter) com efeito especial */}
            <motion.circle
              cx={centro}
              cy={centro}
              r={espessuraAnel * 0.8}
              fill="url(#gradient-eter)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: elementosStats.find(e => e.elemento === 'eter')?.intensidade || 0.1,
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Brilho central */}
            <motion.circle
              cx={centro}
              cy={centro}
              r={espessuraAnel * 0.6}
              fill="#FFD700"
              opacity={0.3}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>

          {/* Legenda central */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">✨</div>
              <div className="text-sm text-gray-400 font-light">
                {memorias && memorias.length > 0 ? (
                  <>
                    <div className="font-semibold text-[#FFD700]">
                      {memorias.length} transições
                    </div>
                    <div className="text-xs mt-1">
                      Jornada espiritual
                    </div>
                  </>
                ) : (
                  <div className="text-xs">Inicie sua jornada</div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Instruções */}
        <AnimatePresence>
          {!hoveredElement && memorias && memorias.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 2, duration: 0.6 }}
              className="absolute bottom-0 text-xs text-gray-500 text-center italic"
            >
              Passe o mouse sobre os anéis para ver detalhes
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}

/**
 * Versão compacta para visualização rápida
 */
export function MandalaElementalCompacta({ usuarioId }: { usuarioId: string }) {
  return (
    <div className="flex items-center justify-center p-4">
      <MandalaElemental usuarioId={usuarioId} tamanho={200} />
    </div>
  );
}

