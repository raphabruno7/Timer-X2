/**
 * 🌙 MODO MEDITAÇÃO DINÂMICA
 * 
 * Experiência imersiva onde a Mandala Elemental responde em tempo real
 * ao estado do Timer, simulando respiração e fluxo energético.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MandalaElemental } from "./MandalaElemental";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ModoMeditacaoProps {
  ativo: boolean;
  onFechar: () => void;
  timerRodando: boolean;
  timerPausado: boolean;
  tempoRestante: number;
  tempoTotal: number;
  presetNome?: string;
  usuarioId: string;
}

const CICLOS_RESPIRACAO: Record<string, number> = {
  foco: 6,
  criatividade: 4,
  breathwork: 8,
  som: 10,
  default: 6,
};

export function ModoMeditacao({
  ativo,
  onFechar,
  timerRodando,
  timerPausado,
  tempoRestante,
  tempoTotal,
  presetNome = "default",
  usuarioId,
}: ModoMeditacaoProps) {
  const [cicloAtual, setCicloAtual] = useState<"inspirar" | "expirar">("inspirar");
  const [showFinalizado, setShowFinalizado] = useState(false);
  
  // Determinar ciclo de respiração baseado no preset
  const duracaoCiclo = Object.entries(CICLOS_RESPIRACAO).find(
    ([key]) => presetNome.toLowerCase().includes(key)
  )?.[1] || CICLOS_RESPIRACAO.default;

  const progresso = tempoTotal > 0 ? 1 - (tempoRestante / tempoTotal) : 0;

  // Controlar ciclo de respiração
  useEffect(() => {
    if (!ativo || !timerRodando || timerPausado) return;

    const intervalo = setInterval(() => {
      setCicloAtual((prev) => (prev === "inspirar" ? "expirar" : "inspirar"));
    }, duracaoCiclo * 1000);

    return () => clearInterval(intervalo);
  }, [ativo, timerRodando, timerPausado, duracaoCiclo]);

  // Detectar finalização
  useEffect(() => {
    if (ativo && tempoRestante === 0 && !showFinalizado) {
      setShowFinalizado(true);
      
      // Auto-fechar após animação de finalização
      const timeout = setTimeout(() => {
        onFechar();
        setShowFinalizado(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [ativo, tempoRestante, showFinalizado, onFechar]);

  // Calcular escala da mandala baseada no estado
  const getMandalaScale = () => {
    if (showFinalizado) {
      return [1, 1.15, 1];
    }
    if (timerRodando && !timerPausado) {
      // Respiração ativa
      return cicloAtual === "inspirar" ? [1, 1.05, 1] : [1.05, 1, 1.05];
    }
    return 1;
  };

  const getMandalaOpacity = () => {
    if (showFinalizado) {
      return [1, 1, 0];
    }
    if (timerPausado) {
      return 0.7;
    }
    if (timerRodando) {
      return cicloAtual === "inspirar" ? [1, 0.95, 1] : [0.95, 1, 0.95];
    }
    return 0.9;
  };

  return (
    <AnimatePresence>
      {ativo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f0f0f]"
        >
          {/* Botão Fechar */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            onClick={onFechar}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6 text-white/70" />
          </motion.button>

          {/* Container da Mandala */}
          <div className="relative flex flex-col items-center justify-center gap-8">
            {/* Mandala Respirante */}
            <motion.div
              animate={{
                scale: getMandalaScale(),
                opacity: getMandalaOpacity(),
              }}
              transition={{
                duration: duracaoCiclo,
                repeat: timerRodando && !timerPausado && !showFinalizado ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <MandalaElemental usuarioId={usuarioId} tamanho={500} />
            </motion.div>

            {/* Glow Effect Finalizado */}
            {showFinalizado && (
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0.8, 1.5, 2],
                }}
                transition={{
                  duration: 4,
                  ease: "easeOut",
                }}
                style={{
                  background: "radial-gradient(circle, #FFD700 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
            )}

            {/* Informações do Timer */}
            <AnimatePresence>
              {!showFinalizado && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex flex-col items-center gap-4"
                >
                  {/* Tempo Restante */}
                  <div className="text-center">
                    <motion.div
                      className="text-6xl font-light text-white/90 font-mono tabular-nums"
                      animate={{
                        opacity: timerRodando && !timerPausado ? [0.9, 1, 0.9] : 0.7,
                      }}
                      transition={{
                        duration: duracaoCiclo,
                        repeat: timerRodando && !timerPausado ? Infinity : 0,
                      }}
                    >
                      {Math.floor(tempoRestante / 60)}
                      <span className="text-white/50">:</span>
                      {String(tempoRestante % 60).padStart(2, "0")}
                    </motion.div>
                    <div className="text-sm text-white/40 mt-2">
                      {timerPausado ? "Pausado" : timerRodando ? "Meditando..." : "Pronto"}
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#2ECC71] to-[#FFD700]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progresso * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Indicador de Respiração */}
                  {timerRodando && !timerPausado && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 text-white/60 text-sm"
                    >
                      <motion.div
                        animate={{
                          scale: cicloAtual === "inspirar" ? [1, 1.2, 1] : [1.2, 1, 1.2],
                        }}
                        transition={{
                          duration: duracaoCiclo,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-3 h-3 rounded-full bg-[#2ECC71]"
                      />
                      <span className="capitalize">
                        {cicloAtual === "inspirar" ? "✨ Inspirar" : "🌿 Expirar"}
                      </span>
                    </motion.div>
                  )}

                  {/* Nome do Preset */}
                  {presetNome && (
                    <div className="text-xs text-white/30 uppercase tracking-wider">
                      {presetNome}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mensagem de Finalização */}
            <AnimatePresence>
              {showFinalizado && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="absolute text-center"
                >
                  <div className="text-4xl mb-4">✨</div>
                  <div className="text-2xl text-[#FFD700] font-light mb-2">
                    Sessão Completa
                  </div>
                  <div className="text-sm text-white/50">
                    Voltando ao Timer...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Partículas de Fundo (Opcional) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

