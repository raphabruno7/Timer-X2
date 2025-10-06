"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { faseDaLua, estiloLunar, type FaseLunar } from "@/lib/lua";
import { tocarSomRespiracao, suportaSomTerapeutico } from "@/lib/soundHealing";

interface MandalaProps {
  progresso: number; // 0 a 1 (porcentagem de progresso)
  intensidade?: 'leve' | 'media' | 'forte';
  pausado?: boolean; // Timer está pausado?
  ativo?: boolean; // Timer está ativo/rodando?
  modoRespiracao?: boolean; // Ativa guia de respiração visual
  ciclo?: number; // Duração completa de uma respiração (em segundos), padrão: 8s
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
 * Hook personalizado para guia de respiração
 * Ciclo simplificado: inspirar → expirar (contínuo)
 */
function usarRespiracao(ativo: boolean, duracaoCiclo: number) {
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

export function Mandala({ progresso, intensidade = 'media', pausado = false, ativo = true, modoRespiracao = false, ciclo = 8 }: MandalaProps) {
  // Estado da fase lunar
  const [faseLunar, setFaseLunar] = useState<FaseLunar>('cheia');
  
  // Calcular fase lunar ao montar componente
  useEffect(() => {
    const fase = faseDaLua();
    setFaseLunar(fase);
    
    // Atualizar a cada hora (caso usuário deixe app aberto por muito tempo)
    const intervalo = setInterval(() => {
      setFaseLunar(faseDaLua());
    }, 60 * 60 * 1000); // 1 hora
    
    return () => clearInterval(intervalo);
  }, []);
  
  // Guia de respiração
  const { faseRespiracao } = usarRespiracao(modoRespiracao, ciclo);
  
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

  // Ajustar velocidade quando pausado ou inativo
  const velocidadeRotacao = (pausado || !ativo)
    ? 0 // Parar rotação quando pausado/inativo
    : intensidadeConfig.rotationDuration * configuracaoLunar.velocidade; // Ajuste lunar
  
  const brilhoAtual = (pausado || !ativo)
    ? intensidadeConfig.glowOpacity * 0.3 // 30% do brilho quando pausado
    : intensidadeConfig.glowOpacity * configuracaoLunar.brilho; // Ajuste lunar

  // Cores suaves para modo respiração
  const coresRespiracao = {
    inspirar: '#87CEEB',  // Azul-claro (céu)
    segurar: '#F0E68C',   // Dourado difuso
    expirar: '#F9F9F9',   // Branco suave
  };
  
  // Cor dinâmica baseada na energia e fase lunar (ou respiração)
  const corEnergia = energiaCor(intensidade);
  const corPrincipal = modoRespiracao 
    ? coresRespiracao[faseRespiracao]
    : blendColors(corEnergia, configuracaoLunar.cor, configuracaoLunar.saturacao);
  
  // Ajuste de escala de pulso baseado na lua ou respiração
  const pulseScaleAjustado = modoRespiracao
    ? (faseRespiracao === 'inspirar' ? 1.15 : faseRespiracao === 'segurar' ? 1.15 : 1.0)
    : faseLunar === 'cheia' 
    ? intensidadeConfig.pulseScale * 1.2  // Pulso mais forte na lua cheia
    : faseLunar === 'nova'
    ? intensidadeConfig.pulseScale * 0.8  // Pulso mais suave na lua nova
    : intensidadeConfig.pulseScale;
  
  // Ajuste de brilho para modo respiração
  const brilhoRespiracao = modoRespiracao
    ? (faseRespiracao === 'inspirar' ? 0.9 : faseRespiracao === 'segurar' ? 1.0 : 0.6)
    : 1.0;

  // Calcular circunferência para o anel de progresso
  const radius = 80;
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
      className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] flex items-center justify-center"
      animate={modoRespiracao ? {
        scale: scaleRespiracao,
      } : {}}
      transition={modoRespiracao ? {
        duration: duracaoFaseRespiracao / 1000,
        ease: "easeInOut",
        repeat: 0, // Controlado pelo hook
      } : {}}
      style={{
        filter: modoRespiracao
          ? `brightness(${brightnessRespiracao}) saturate(0.9) ${shadowRespiracao}`
          : `brightness(${configuracaoLunar.brilho}) saturate(${configuracaoLunar.saturacao})`,
        transition: 'filter 0.7s ease-in-out',
      }}
    >
      <svg
        width="192"
        height="192"
        viewBox="0 0 192 192"
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

          {/* Gradiente para o centro */}
          <radialGradient id="centerGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FFA500" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.3" />
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

        {/* Círculo interno (centro da energia ou guia de respiração) */}
        <motion.circle
          cx="96"
          cy="96"
          r="45"
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

        {/* Círculo interno - borda */}
        <circle
          cx="96"
          cy="96"
          r="45"
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
            const x = 96 + 70 * Math.cos((angle * Math.PI) / 180);
            const y = 96 + 70 * Math.sin((angle * Math.PI) / 180);
            
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
      
      {/* Indicador sutil da fase lunar (canto superior direito) */}
      {!modoRespiracao && (
        <motion.div
          className="absolute -top-1 -right-1 text-xs opacity-60 pointer-events-none transition-all duration-700 ease-in-out"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          title={configuracaoLunar.descricao}
        >
          {faseLunar === 'cheia' && '🌕'}
          {faseLunar === 'nova' && '🌑'}
          {faseLunar === 'crescente' && '🌓'}
          {faseLunar === 'minguante' && '🌗'}
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
    </div>
  );
}

