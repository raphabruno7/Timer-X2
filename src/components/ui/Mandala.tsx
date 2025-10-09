"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { faseDaLua, estiloLunar, type FaseLunar, emojiLunar } from "@/lib/lua";
import { tocarSomRespiracao, suportaSomTerapeutico } from "@/lib/soundHealing";
import { cerebroLunar, type ConfiguracaoCerebralLunar } from "@/lib/cerebroLunar";

interface MandalaProps {
  progresso: number; // 0 a 1 (porcentagem de progresso)
  intensidade?: 'leve' | 'media' | 'forte';
  pausado?: boolean; // Timer está pausado?
  ativo: boolean; // Timer está ativo/rodando?
  modoRespiracao?: boolean; // Ativa guia de respiração visual
  ciclo?: number; // Duração completa de uma respiração (em segundos), padrão: 8s
  emocao?: 'neutra' | 'alegria' | 'calma' | 'cansaço'; // Estado emocional do usuário
  estadoVisual?: 'foco-ativo' | 'reflexao' | 'conclusao' | 'idle'; // Estado visual adaptativo (Prompt 18)
}

/**
 * Retorna cor baseada na intensidade energética
 */
function energiaCor(intensidade: 'leve' | 'media' | 'forte'): string {
  switch (intensidade) {
    case 'forte':
      return '#FFD700'; // Dourado vibrante
    case 'media':
      return '#2ECC71'; // Verde vida
    default:
      return '#F9F9F9'; // Branco suave
  }
}

/**
 * Mistura duas cores hex com base em um fator de saturação
 * @param cor1 - Cor base (energia)
 * @param cor2 - Cor lunar
 * @param fator - Quanto de cor2 misturar (0-1)
 */
function blendColors(cor1: string, cor2: string, fator: number): string {
  // Converter hex para RGB
  const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const rgb1 = hex2rgb(cor1);
  const rgb2 = hex2rgb(cor2);
  
  // Misturar cores
  const r = Math.round(rgb1.r * (1 - fator * 0.3) + rgb2.r * (fator * 0.3));
  const g = Math.round(rgb1.g * (1 - fator * 0.3) + rgb2.g * (fator * 0.3));
  const b = Math.round(rgb1.b * (1 - fator * 0.3) + rgb2.b * (fator * 0.3));
  
  // Converter de volta para hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calcula cor adaptativa baseada em emoção, fase lunar, intensidade e progresso
 * Retorna gradiente HSL para transições suaves
 */
function calcularCor(
  fase: FaseLunar,
  emocao: 'neutra' | 'alegria' | 'calma' | 'cansaço' = 'neutra',
  intensidade: 'leve' | 'media' | 'forte' = 'media',
  progresso: number = 0
): { cor: string; brilho: number; saturacao: number; velocidade: number } {
  // Base de cores por emoção (em HSL para transições suaves)
  const coresEmocao = {
    alegria: { h: 45, s: 100, l: 60 },    // Dourado/laranja (45°)
    calma: { h: 160, s: 60, l: 50 },      // Verde-azulado (160°)
    cansaço: { h: 220, s: 30, l: 65 },    // Azul-cinza suave (220°)
    neutra: { h: 145, s: 70, l: 55 },     // Verde natureza (145°)
  };
  
  // Base de ajustes por fase lunar
  const ajustesFase = {
    nova: { hShift: -10, sShift: -20, lShift: -15 },       // Mais escuro e frio
    crescente: { hShift: 5, sShift: 10, lShift: 5 },       // Levemente mais claro
    cheia: { hShift: -5, sShift: 20, lShift: 15 },         // Mais saturado e brilhante
    minguante: { hShift: 10, sShift: -10, lShift: -5 },    // Tons mais frios
  };
  
  // Base de ajustes por intensidade
  const ajustesIntensidade = {
    leve: { brilho: 0.7, saturacao: 0.8, velocidade: 1.3 },
    media: { brilho: 1.0, saturacao: 1.0, velocidade: 1.0 },
    forte: { brilho: 1.2, saturacao: 1.1, velocidade: 0.8 },
  };
  
  // Combinar valores
  const baseEmocao = coresEmocao[emocao];
  const ajusteFase = ajustesFase[fase];
  const ajusteIntensidade = ajustesIntensidade[intensidade];
  
  // Calcular HSL final
  let h = baseEmocao.h + ajusteFase.hShift;
  const s = Math.max(0, Math.min(100, baseEmocao.s + ajusteFase.sShift * ajusteIntensidade.saturacao));
  const l = Math.max(0, Math.min(100, baseEmocao.l + ajusteFase.lShift + (progresso * 5))); // Progresso ilumina
  
  // Normalizar matiz (0-360)
  h = ((h % 360) + 360) % 360;
  
  const cor = `hsl(${h}, ${s}%, ${l}%)`;
  
  return {
    cor,
    brilho: ajusteIntensidade.brilho,
    saturacao: ajusteIntensidade.saturacao,
    velocidade: ajusteIntensidade.velocidade,
  };
}

/**
 * Hook personalizado para guia de respiração
 * Ciclo simplificado: inspirar → expirar (contínuo)
 */
function useRespiracao(ativo: boolean, duracaoCiclo: number) {
  const [faseRespiracao, setFaseRespiracao] = useState<'inspirar' | 'segurar' | 'expirar'>('inspirar');
  const [cicloAtual, setCicloAtual] = useState(0);
  
  useEffect(() => {
    if (!ativo) {
      setFaseRespiracao('inspirar');
      setCicloAtual(0);
      return;
    }
    
    // Duração de cada fase (metade do ciclo completo)
    const duracaoFase = (duracaoCiclo * 1000) / 2; // segundos → ms
    
    const intervalo = setInterval(() => {
      setCicloAtual((prev) => {
        const proximoCiclo = prev + 1;
        const fase = proximoCiclo % 2; // Alternar entre 0 e 1
        
        if (fase === 0) setFaseRespiracao('inspirar');
        else setFaseRespiracao('expirar');
        
        return proximoCiclo;
      });
    }, duracaoFase);
    
    return () => clearInterval(intervalo);
  }, [ativo, duracaoCiclo]);
  
  return { faseRespiracao, cicloAtual };
}

export function Mandala({ 
  progresso, 
  intensidade = 'media', 
  pausado = false, 
  ativo, 
  modoRespiracao = false, 
  ciclo = 8,
  emocao = 'neutra',
  estadoVisual = 'idle'
}: MandalaProps) {
  // Estado da fase lunar
  const [faseLunar, setFaseLunar] = useState<FaseLunar>('cheia');
  
  // 🌕 Estado do Cérebro Lunar
  const [configCerebralLunar, setConfigCerebralLunar] = useState<ConfiguracaoCerebralLunar | null>(null);
  
  // Estado da cor adaptativa (combina emoção + lua + intensidade + progresso)
  const [corAdaptativa, setCorAdaptativa] = useState({
    cor: 'hsl(145, 70%, 55%)',
    brilho: 1.0,
    saturacao: 1.0,
    velocidade: 1.0,
  });
  
  // 🌕 CÉREBRO LUNAR - Sincronização cósmica + emocional
  useEffect(() => {
    const atualizarCerebroLunar = () => {
      const config = cerebroLunar({
        emocao,
        data: new Date(),
      });
      
      setConfigCerebralLunar(config);
      setFaseLunar(config.fase as FaseLunar);
      
      console.info('🌕 [Cérebro Lunar] Configuração atualizada:', {
        fase: config.fase,
        emoji: config.emoji,
        tonalidade: config.tonalidade,
        frequencia: `${config.frequencia}Hz`,
        energia: config.energia.toFixed(2),
        iluminacao: `${config.iluminacao}%`,
      });
    };
    
    // Atualizar imediatamente
    atualizarCerebroLunar();
    
    // Atualizar a cada hora (caso usuário deixe app aberto por muito tempo)
    const intervalo = setInterval(atualizarCerebroLunar, 60 * 60 * 1000); // 1 hora
    
    return () => clearInterval(intervalo);
  }, [emocao]); // Reagir a mudanças de emoção
  
  // Calcular cor adaptativa baseada em múltiplos fatores
  // Agora usa o Cérebro Lunar como fonte principal de cor
  useEffect(() => {
    if (!ativo && !modoRespiracao) return;
    if (!configCerebralLunar) return;
    
    // Usar cores do Cérebro Lunar com ajustes de intensidade local
    const estadoCor = {
      cor: configCerebralLunar.tonalidade,
      brilho: configCerebralLunar.brilho,
      saturacao: configCerebralLunar.saturacao,
      velocidade: configCerebralLunar.velocidadePulso,
    };
    
    setCorAdaptativa(estadoCor);
    
    console.info('[Mandala Viva] 🎨 Cor adaptativa (Cérebro Lunar):', {
      fase: configCerebralLunar.fase,
      emocao,
      intensidade,
      progresso: `${Math.round(progresso * 100)}%`,
      cor: estadoCor.cor,
      energia: configCerebralLunar.energia.toFixed(2),
    });
    
  }, [ativo, emocao, progresso, intensidade, modoRespiracao, configCerebralLunar]);
  
  // Guia de respiração
  const { faseRespiracao } = useRespiracao(modoRespiracao, ciclo);
  
  // Sincronização sonora com respiração
  useEffect(() => {
    if (!modoRespiracao) return;
    if (!suportaSomTerapeutico()) {
      console.info('[Mandala] Navegador não suporta Web Audio API');
      return;
    }
    
    // Tocar som harmônico sincronizado com a fase
    tocarSomRespiracao(faseRespiracao as 'inspirar' | 'expirar')
      .catch(err => console.warn('[Mandala] Erro ao tocar som:', err));
    
  }, [faseRespiracao, modoRespiracao]);
  
  // Obter configurações lunares
  const configuracaoLunar = estiloLunar(faseLunar);
  // Configurações de intensidade
  const intensidadeConfig = {
    leve: {
      pulseScale: 1.02,
      glowOpacity: 0.3,
      duration: 3,
      rotationDuration: 60, // Rotação muito lenta
    },
    media: {
      pulseScale: 1.05,
      glowOpacity: 0.5,
      duration: 2,
      rotationDuration: 40, // Rotação moderada
    },
    forte: {
      pulseScale: 1.08,
      glowOpacity: 0.7,
      duration: 1.5,
      rotationDuration: 25, // Rotação mais rápida
    },
  }[intensidade];

  // Velocidade de animação baseada em emoção
  const velocidadeEmocional = emocao === 'alegria' 
    ? 0.7  // Mais rápido
    : emocao === 'cansaço'
    ? 1.8  // Muito mais lento
    : corAdaptativa.velocidade;

  // Ajustar velocidade quando pausado, inativo ou por emoção
  const velocidadeRotacao = (pausado || !ativo)
    ? 0 // Parar rotação quando pausado/inativo
    : intensidadeConfig.rotationDuration * configuracaoLunar.velocidade * velocidadeEmocional; // Ajuste lunar + emocional
  
  const brilhoAtual = (pausado || !ativo)
    ? intensidadeConfig.glowOpacity * 0.3 // 30% do brilho quando pausado
    : intensidadeConfig.glowOpacity * configuracaoLunar.brilho; // Ajuste lunar

  // Cores suaves para modo respiração
  const coresRespiracao = {
    inspirar: '#FFD700',  // Dourado (energia)
    segurar: '#F0E68C',   // Dourado difuso
    expirar: '#2ECC71',   // Verde (liberação)
  };
  
  // Cor dinâmica baseada em múltiplos fatores
  const corPrincipal = modoRespiracao 
    ? coresRespiracao[faseRespiracao]  // Modo respiração: cores fixas
    : corAdaptativa.cor;                // Modo normal: cor adaptativa (emoção + lua + intensidade)
  
  // Ajuste de escala de pulso baseado na lua, respiração ou emoção
  const pulseScaleAjustado = modoRespiracao
    ? (faseRespiracao === 'inspirar' ? 1.15 : faseRespiracao === 'segurar' ? 1.15 : 1.0)
    : emocao === 'alegria'
    ? intensidadeConfig.pulseScale * 1.3  // Pulso forte e rápido (alegria)
    : emocao === 'cansaço'
    ? intensidadeConfig.pulseScale * 0.7  // Pulso muito suave (cansaço)
    : faseLunar === 'cheia' 
    ? intensidadeConfig.pulseScale * 1.2  // Pulso mais forte na lua cheia
    : faseLunar === 'nova'
    ? intensidadeConfig.pulseScale * 0.8  // Pulso mais suave na lua nova
    : intensidadeConfig.pulseScale;
  
  // Ajuste de brilho para modo respiração ou emoção
  const brilhoRespiracao = modoRespiracao
    ? (faseRespiracao === 'inspirar' ? 0.9 : faseRespiracao === 'segurar' ? 1.0 : 0.6)
    : corAdaptativa.brilho;

  // Calcular circunferência para o anel de progresso
  const radius = 75; // Reduzido de 80 para 75 (melhor proporção)
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progresso * circumference);

  // Cálculo de valores para modo respiração
  const duracaoFaseRespiracao = (ciclo * 1000) / 2; // ms
  const scaleRespiracao = faseRespiracao === 'inspirar' ? 1.1 : 1.0;
  const brightnessRespiracao = faseRespiracao === 'inspirar' ? 1.25 : 1.0;
  const shadowRespiracao = faseRespiracao === 'inspirar' 
    ? 'drop-shadow(0 0 8px #FFD700)' 
    : 'drop-shadow(0 0 0px transparent)';

  return (
    <motion.div 
      className="relative flex items-center justify-center"
      style={{
        width: 'clamp(200px, 60vw, 280px)',
        height: 'clamp(200px, 60vw, 280px)',
        filter: modoRespiracao
          ? `brightness(${brightnessRespiracao}) saturate(0.9) ${shadowRespiracao}`
          : `brightness(${brilhoRespiracao}) saturate(${corAdaptativa.saturacao})`,
        transition: 'filter 2s ease-in-out, opacity 2s ease-in-out',
      }}
      animate={modoRespiracao ? {
        scale: scaleRespiracao,
      } : ativo ? {
        opacity: 1,
        scale: 1,
      } : {
        opacity: 0.5,
        scale: 0.95,
      }}
      transition={modoRespiracao ? {
        duration: duracaoFaseRespiracao / 1000,
        ease: "easeInOut",
        repeat: 0, // Controlado pelo hook
      } : {
        duration: 2,
        ease: "easeInOut",
      }}
    >
      {/* Gradiente dinâmico de fundo - Sinestesia Adaptativa (Prompt 18) */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-radial blur-3xl"
        animate={
          estadoVisual === 'foco-ativo'
            ? {
                // Foco Ativo: Verde intenso → suave, pulso ritmado
                background: [
                  "radial-gradient(circle at center, rgba(46, 204, 113, 0.2), transparent)",
                  "radial-gradient(circle at center, rgba(46, 204, 113, 0.15), transparent)",
                  "radial-gradient(circle at center, rgba(46, 204, 113, 0.2), transparent)",
                ],
                opacity: [0.8, 0.6, 0.8],
                scale: [1, 1.01, 1],
              }
            : estadoVisual === 'conclusao'
              ? {
                  // Conclusão: Brilho dourado intenso → fade out lento
                  background: "radial-gradient(circle at center, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.1), transparent)",
                  opacity: [1, 0],
                  scale: [1, 0.97, 1],
                }
              : estadoVisual === 'reflexao'
                ? {
                    // Reflexão: Dourado + verde, hue shift lento, pulso respiratório
                    background: [
                      "radial-gradient(circle at center, rgba(46, 204, 113, 0.12), rgba(255, 215, 0, 0.08), transparent)",
                      "radial-gradient(circle at center, rgba(255, 215, 0, 0.15), rgba(46, 204, 113, 0.1), transparent)",
                      "radial-gradient(circle at center, rgba(46, 204, 113, 0.12), rgba(255, 215, 0, 0.08), transparent)",
                    ],
                    opacity: [0.4, 0.7, 0.4],
                  }
                : {
                    // Idle: Estado padrão sutil
                    background: "radial-gradient(circle at center, rgba(46, 204, 113, 0.08), transparent)",
                    opacity: 0.3,
                  }
        }
        transition={{ 
          duration: estadoVisual === 'foco-ativo' 
            ? 1.5 
            : estadoVisual === 'conclusao' 
              ? 4 
              : estadoVisual === 'reflexao' 
                ? 3 
                : 2,
          repeat: estadoVisual === 'conclusao' ? 0 : Infinity, 
          ease: "easeInOut" 
        }}
      />
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 192 192"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 transition-all duration-700 ease-in-out rounded-full drop-shadow-md"
        style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))' }}
      >
        <defs>
          {/* Gradiente radial para anel externo */}
          <radialGradient id="externalGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1C1C1C" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2ECC71" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Gradiente para o centro - harmonia verde/dourado */}
          <radialGradient id="centerGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.25" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Filtro de glow */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Anel externo (pulso energético rítmico) */}
        <motion.circle
          cx="96"
          cy="96"
          r="90"
          fill="url(#externalGradient)"
          opacity={brilhoAtual}
          animate={{
            scale: (pausado || !ativo)
              ? 1 // Sem pulso quando pausado/inativo
              : [1, 1.05, 1], // Pulso evidente (1 a 1.05)
            opacity: (pausado || !ativo)
              ? brilhoAtual * 0.5
              : [brilhoAtual, brilhoAtual * 0.7, brilhoAtual],
          }}
          transition={{
            duration: (pausado || !ativo)
              ? 0
              : faseLunar === 'nova' 
                ? intensidadeConfig.duration * 1.5  // Respiração lenta na lua nova
                : faseLunar === 'cheia'
                ? intensidadeConfig.duration * 0.8  // Respiração rápida na lua cheia
                : intensidadeConfig.duration,
            repeat: (pausado || !ativo) ? 0 : Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: '96px 96px' }}
        />

        {/* Anel médio - fundo (cinza) com rotação lenta */}
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke={corPrincipal}
          strokeWidth="8"
          strokeOpacity="0.2"
          animate={{
            rotate: (pausado || !ativo) ? 0 : 360,
          }}
          transition={{
            duration: velocidadeRotacao || 1,
            repeat: (pausado || !ativo) ? 0 : Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: '96px 96px' }}
        />

        {/* Anel médio - progresso (cor dinâmica) com rotação */}
        <motion.g
          animate={{
            rotate: (pausado || !ativo) ? 0 : 360,
          }}
          transition={{
            duration: velocidadeRotacao || 1,
            repeat: (pausado || !ativo) ? 0 : Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: '96px 96px' }}
        >
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            fill="none"
            stroke={corPrincipal}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 96 96)"
            filter="url(#glow)"
            animate={{
              opacity: (pausado || !ativo) ? [0.3, 0.4, 0.3] : [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.g>

        {/* Círculo interno (centro da energia ou guia de respiração) - aumentado para 62px (83% do anel médio) */}
        <motion.circle
          cx="96"
          cy="96"
          r="68"
          fill={modoRespiracao 
            ? (faseRespiracao === 'inspirar' ? '#FFD700' : '#2ECC71') // Transição dourado → verde
            : "url(#centerGradient)"
          }
          filter="url(#glow)"
          animate={
            modoRespiracao
              ? {
                  // Modo respiração: ciclo inspirar/expirar simplificado
                  scale: faseRespiracao === 'inspirar' ? 1.15 : 1.0,
                  opacity: faseRespiracao === 'inspirar' ? 1.0 : 0.85,
                }
              : {
                  // Modo normal: baseado na lua
                  scale: (pausado || !ativo)
                    ? 1
                    : faseLunar === 'cheia'
                    ? [1, 1.05, 1]  // Pulso mais forte na lua cheia
                    : faseLunar === 'nova'
                    ? [1, 1.015, 1] // Pulso muito sutil na lua nova
                    : [1, 1.03, 1], // Pulso padrão
                  opacity: faseLunar === 'nova' 
                    ? [0.7, 0.85, 0.7]  // Mais escuro na lua nova
                    : [1, 1, 1],
                }
          }
          transition={
            modoRespiracao
              ? {
                  duration: duracaoFaseRespiracao / 1000,  // Duração configurável
                  repeat: 0,    // Sem repeat (controlado pelo hook)
                  ease: 'easeInOut',
                }
              : {
                  duration: (pausado || !ativo)
                    ? 0
                    : faseLunar === 'nova'
                    ? intensidadeConfig.duration * 2.5  // Muito lento na lua nova
                    : faseLunar === 'cheia'
                    ? intensidadeConfig.duration * 1.2  // Mais rápido na lua cheia
                    : intensidadeConfig.duration * 1.5,
                  repeat: (pausado || !ativo) ? 0 : Infinity,
                  ease: "easeInOut",
                }
          }
          style={{ 
            transformOrigin: '96px 96px',
            transition: modoRespiracao ? 'fill 0.7s ease-in-out' : 'none',
          }}
        />

        {/* Círculo interno - borda (ajustada para r=68) */}
        <circle
          cx="96"
          cy="96"
          r="68"
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          strokeOpacity="0.6"
        />

        {/* Detalhes decorativos - pontos de energia com rotação reversa */}
        <motion.g
          animate={{
            rotate: (pausado || !ativo) ? 0 : -360, // Rotação reversa para contraste
          }}
          transition={{
            duration: (velocidadeRotacao || 1) * 1.5, // Um pouco mais lento que o anel
            repeat: (pausado || !ativo) ? 0 : Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: '96px 96px' }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            // Arredondar para 2 casas decimais para evitar hydration mismatch
            const x = Math.round((96 + 70 * Math.cos((angle * Math.PI) / 180)) * 100) / 100;
            const y = Math.round((96 + 70 * Math.sin((angle * Math.PI) / 180)) * 100) / 100;
            
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={corPrincipal}
                opacity={(pausado || !ativo) ? 0.2 : 0.6}
                animate={{
                  scale: (pausado || !ativo) ? 1 : [1, 1.5, 1],
                  opacity: (pausado || !ativo)
                    ? 0.2
                    : [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: (pausado || !ativo) ? 0 : 2,
                  repeat: (pausado || !ativo) ? 0 : Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              />
            );
          })}
        </motion.g>
      </svg>

      {/* Indicador de intensidade (halo externo adaptativo) */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none transition-all duration-700 ease-in-out"
        style={{
          background: `radial-gradient(circle, transparent 40%, ${corPrincipal}${Math.round(brilhoAtual * 25.5).toString(16).padStart(2, '0')} 100%)`,
        }}
        animate={{
          opacity: (pausado || !ativo) ? 0.1 : [0.5, 1, 0.5],
          scale: (pausado || !ativo) ? 1 : [1, 1.05, 1], // Pulso 1 a 1.05
        }}
        transition={{
          duration: (pausado || !ativo)
            ? 0
            : faseLunar === 'nova'
            ? intensidadeConfig.duration * 1.8
            : faseLunar === 'cheia'
            ? intensidadeConfig.duration * 0.7
            : intensidadeConfig.duration,
          repeat: (pausado || !ativo) ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* 🌕 Indicador do Cérebro Lunar (canto superior direito) */}
      {!modoRespiracao && configCerebralLunar && (
        <motion.div
          className="absolute -top-1 -right-1 text-xs opacity-70 pointer-events-none transition-all duration-700 ease-in-out select-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.7, 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            opacity: { duration: 1, ease: "easeOut" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          title={`${configCerebralLunar.descricao}\nIluminação: ${configCerebralLunar.iluminacao}%\nFrequência: ${configCerebralLunar.frequencia}Hz`}
          style={{
            filter: `drop-shadow(0 0 4px ${configCerebralLunar.tonalidade})`,
          }}
        >
          {configCerebralLunar.emoji}
        </motion.div>
      )}
      
      {/* Guia de respiração (texto central) */}
      {modoRespiracao && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.p
            className="text-sm font-light tracking-widest uppercase transition-all duration-700 ease-in-out"
            style={{
              color: faseRespiracao === 'inspirar' ? '#FFD700' : '#2ECC71',
              textShadow: faseRespiracao === 'inspirar' 
                ? '0 0 20px rgba(255, 215, 0, 0.8)' 
                : '0 0 20px rgba(46, 204, 113, 0.8)',
              transition: 'color 0.7s ease-in-out, text-shadow 0.7s ease-in-out',
            }}
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: duracaoFaseRespiracao / 1000,
              repeat: 0,
              ease: "easeInOut",
            }}
          >
          {faseRespiracao === 'inspirar' && '✨ Inspirar ✨'}
          {faseRespiracao === 'expirar' && '🌿 Expirar 🌿'}
        </motion.p>
      </motion.div>
    )}
  </motion.div>
);
}

