/**
 * 🜂 PAINEL ALQUÍMICO 🜃
 * 
 * Converte dados objetivos (energia, foco, emoção, fase lunar)
 * em métricas simbólicas visuais e animadas.
 * 
 * Transforma o invisível em visual, sem palavras — apenas pura alquimia.
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlquimiaPanelProps {
  energia: number;     // 0-1 (energia geral do usuário)
  foco: number;        // 0-1 (progresso/foco atual)
  emocao: string;      // "neutra" | "alegria" | "calma" | "cansaço"
  fase: string;        // "nova" | "crescente" | "cheia" | "minguante"
}

/**
 * Símbolo alquímico para cada métrica
 */
const SIMBOLOS_ALQUIMICOS = {
  coerencia: "🜂",  // Terra (estabilidade, harmonia)
  fluidez: "🜄",    // Água (fluxo, adaptação)
  essencia: "🜁",   // Fogo (transformação, vitalidade)
  quintessencia: "🜃", // Éter (transcendência, integração)
};

/**
 * Cores para cada nível de intensidade
 */
const CORES_ALQUIMICAS = {
  baixo: "#6B7280",    // Cinza (dormência)
  medio: "#2ECC71",    // Verde (equilíbrio)
  alto: "#FFD700",     // Dourado (plenitude)
  transcendente: "#E57373", // Vermelho-rosa (transcendência)
};

/**
 * Calcula cor baseada no valor (0-1)
 */
function calcularCorAlquimica(valor: number): string {
  if (valor < 0.25) return CORES_ALQUIMICAS.baixo;
  if (valor < 0.5) return CORES_ALQUIMICAS.medio;
  if (valor < 0.85) return CORES_ALQUIMICAS.alto;
  return CORES_ALQUIMICAS.transcendente;
}

/**
 * Calcula descrição poética baseada no valor
 */
function descreverNivel(valor: number): string {
  if (valor < 0.25) return "Despertar";
  if (valor < 0.5) return "Crescimento";
  if (valor < 0.75) return "Florescimento";
  if (valor < 0.9) return "Plenitude";
  return "Transcendência";
}

export function AlquimiaPanel({ energia, foco, emocao, fase }: AlquimiaPanelProps) {
  // Métricas alquímicas calculadas
  const [coerencia, setCoerencia] = useState(0);      // Harmonia corpo-mente
  const [fluidez, setFluidez] = useState(0);          // Entrega ao fluxo natural
  const [essencia, setEssencia] = useState(0);        // Vitalidade transformadora
  const [quintessencia, setQuintessencia] = useState(0); // Integração total
  
  // Estado de visibilidade animada
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    // Delay para animação de entrada
    const timer = setTimeout(() => setMostrar(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 🜂 COERÊNCIA - Harmonia entre energia e foco
    // Modulada por emoção (calma aumenta, cansaço reduz)
    const baseCoerencia = (energia + foco) / 2;
    const moduladorEmocional = 
      emocao === "calma" ? 1.15 :
      emocao === "alegria" ? 1.05 :
      emocao === "cansaço" ? 0.85 :
      1.0; // neutra
    
    const coerenciaFinal = Math.min(1, Math.max(0, baseCoerencia * moduladorEmocional));
    setCoerencia(coerenciaFinal);

    // 🜄 FLUIDEZ - Entrega ao ciclo natural (foco + lua)
    // Fases crescente e cheia amplificam, nova e minguante suavizam
    const baseFluidez = (energia + foco) / 2;
    const moduladorLunar = 
      fase === "cheia" ? 1.25 :
      fase === "crescente" ? 1.15 :
      fase === "minguante" ? 0.95 :
      fase === "nova" ? 0.85 :
      1.0;
    
    const fluidezFinal = Math.min(1, Math.max(0, baseFluidez * moduladorLunar));
    setFluidez(fluidezFinal);

    // 🜁 ESSÊNCIA - Vitalidade transformadora (energia pura)
    // Combinação de energia bruta com alegria
    const essenciaBase = energia * 0.7 + foco * 0.3;
    const essenciaFinal = Math.min(1, Math.max(0, 
      essenciaBase * (emocao === "alegria" ? 1.2 : emocao === "cansaço" ? 0.7 : 1.0)
    ));
    setEssencia(essenciaFinal);

    // 🜃 QUINTESSÊNCIA - Integração total (alquimia completa)
    // Média ponderada de todas as métricas
    const quintessenciaFinal = Math.min(1, Math.max(0, 
      (coerenciaFinal * 0.3 + fluidezFinal * 0.3 + essenciaBase * 0.25 + foco * 0.15)
    ));
    setQuintessencia(quintessenciaFinal);

    // Log para debug
    if (process.env.NODE_ENV === 'development') {
      console.info('🜂 [Alquimia]', {
        coerencia: coerenciaFinal.toFixed(2),
        fluidez: fluidezFinal.toFixed(2),
        essencia: essenciaFinal.toFixed(2),
        quintessencia: quintessenciaFinal.toFixed(2),
        emocao,
        fase,
      });
    }
  }, [energia, foco, emocao, fase]);

  return (
    <AnimatePresence>
      {mostrar && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-[#1C1C1C]/90 to-[#0A0A0A]/90 border border-[#2ECC71]/20 backdrop-blur-sm shadow-2xl"
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-sm font-light text-[#FFD700] tracking-widest uppercase flex items-center justify-center gap-2">
              <motion.span
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                🜂
              </motion.span>
              Painel Alquímico
              <motion.span
                animate={{ 
                  rotate: [0, -360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                🜃
              </motion.span>
            </h3>
            <p className="text-[10px] text-gray-500 mt-1 italic">
              Transmutação do invisível em visual
            </p>
          </motion.div>

          {/* Grid de Métricas */}
          <div className="grid grid-cols-2 gap-4">
            {/* Coerência */}
            <MetricaAlquimica
              simbolo={SIMBOLOS_ALQUIMICOS.coerencia}
              nome="Coerência"
              valor={coerencia}
              delay={0.4}
              descricao="Harmonia corpo-mente"
            />

            {/* Fluidez */}
            <MetricaAlquimica
              simbolo={SIMBOLOS_ALQUIMICOS.fluidez}
              nome="Fluidez"
              valor={fluidez}
              delay={0.5}
              descricao="Entrega ao fluxo"
            />

            {/* Essência */}
            <MetricaAlquimica
              simbolo={SIMBOLOS_ALQUIMICOS.essencia}
              nome="Essência"
              valor={essencia}
              delay={0.6}
              descricao="Vitalidade pura"
            />

            {/* Quintessência */}
            <MetricaAlquimica
              simbolo={SIMBOLOS_ALQUIMICOS.quintessencia}
              nome="Quintessência"
              valor={quintessencia}
              delay={0.7}
              descricao="Integração total"
            />
          </div>

          {/* Estado Alquímico Geral */}
          <motion.div
            className="mt-4 pt-4 border-t border-[#2ECC71]/10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              Estado Atual
            </p>
            <motion.p 
              className="text-sm font-medium"
              style={{ 
                color: calcularCorAlquimica((coerencia + fluidez + essencia + quintessencia) / 4)
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {descreverNivel((coerencia + fluidez + essencia + quintessencia) / 4)}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Componente individual para cada métrica alquímica
 */
interface MetricaAlquimicaProps {
  simbolo: string;
  nome: string;
  valor: number;
  delay: number;
  descricao: string;
}

function MetricaAlquimica({ simbolo, nome, valor, delay, descricao }: MetricaAlquimicaProps) {
  const cor = calcularCorAlquimica(valor);
  const porcentagem = Math.round(valor * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      {/* Símbolo */}
      <motion.div
        className="text-2xl mb-1"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: `drop-shadow(0 0 8px ${cor}40)`,
        }}
      >
        {simbolo}
      </motion.div>

      {/* Nome */}
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2" title={descricao}>
        {nome}
      </p>

      {/* Barra de Progresso */}
      <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full relative"
          style={{ 
            background: `linear-gradient(90deg, ${cor}80, ${cor})`,
            boxShadow: `0 0 10px ${cor}60`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${porcentagem}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
        >
          {/* Brilho animado */}
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: delay + 1,
            }}
          />
        </motion.div>
      </div>

      {/* Porcentagem */}
      <motion.p 
        className="text-[10px] font-mono mt-1"
        style={{ color: cor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.4 }}
      >
        {porcentagem}%
      </motion.p>
    </motion.div>
  );
}

