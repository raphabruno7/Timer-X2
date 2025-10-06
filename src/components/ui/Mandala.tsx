"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { faseDaLua, estiloLunar, type FaseLunar } from "@/lib/lua";

interface MandalaProps {
  progresso: number; // 0 a 1 (porcentagem de progresso)
  intensidade?: 'leve' | 'media' | 'forte';
  pausado?: boolean; // Timer está pausado?
  modoRespiracao?: boolean; // Ativa guia de respiração visual
}

/**
 * Retorna cor baseada na intensidade energética
 */
function energiaCor(intensidade: 'leve' | 'media' | 'forte'): string {
  return intensidade === 'forte' 
    ? '#FFD700'  // Dourado vibrante
    : intensidade === 'media' 
    ? '#2ECC71'  // Verde vida
    : '#F9F9F9'; // Branco suave
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
 * Ciclo: 4s inspirar → 4s segurar → 4s expirar
 */
function usarRespiracao(ativo: boolean) {
  const [faseRespiracao, setFaseRespiracao] = useState<'inspirar' | 'segurar' | 'expirar'>('inspirar');
  const [cicloAtual, setCicloAtual] = useState(0);
  
  useEffect(() => {
    if (!ativo) {
      setFaseRespiracao('inspirar');
      setCicloAtual(0);
      return;
    }
    
    const duracaoFase = 4000; // 4 segundos por fase
    
    const intervalo = setInterval(() => {
      setCicloAtual((prev) => {
        const proximoCiclo = prev + 1;
        const fase = proximoCiclo % 3;
        
        if (fase === 0) setFaseRespiracao('inspirar');
        else if (fase === 1) setFaseRespiracao('segurar');
        else setFaseRespiracao('expirar');
        
        return proximoCiclo;
      });
    }, duracaoFase);
    
    return () => clearInterval(intervalo);
  }, [ativo]);
  
  return { faseRespiracao, cicloAtual };
}

export function Mandala({ progresso, intensidade = 'media', pausado = false, modoRespiracao = false }: MandalaProps) {
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
  const { faseRespiracao } = usarRespiracao(modoRespiracao);
  
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

  // Ajustar velocidade quando pausado
  const velocidadeRotacao = pausado 
    ? intensidadeConfig.rotationDuration * 3 // 3x mais lento quando pausado
    : intensidadeConfig.rotationDuration * configuracaoLunar.velocidade; // Ajuste lunar
  
  const brilhoAtual = pausado
    ? intensidadeConfig.glowOpacity * 0.5 // 50% do brilho quando pausado
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

  return (
    <div 
      className="relative w-48 h-48 flex items-center justify-center transition-all duration-700 ease-in-out"
      style={{
        filter: modoRespiracao
          ? `brightness(${brilhoRespiracao}) saturate(0.8) blur(0.5px)`
          : `brightness(${configuracaoLunar.brilho}) saturate(${configuracaoLunar.saturacao})`,
      }}
    >
      <svg
        width="192"
        height="192"
        viewBox="0 0 192 192"
        className="absolute inset-0 transition-all duration-700 ease-in-out"
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
            scale: pausado 
              ? [1, 1.01, 1] // Pulso mínimo quando pausado
              : [1, pulseScaleAjustado, 1], // Pulso ajustado pela lua
            opacity: pausado
              ? [brilhoAtual, brilhoAtual * 0.8, brilhoAtual]
              : [brilhoAtual, brilhoAtual * 0.7, brilhoAtual],
          }}
          transition={{
            duration: pausado 
              ? intensidadeConfig.duration * 2 
              : faseLunar === 'nova' 
                ? intensidadeConfig.duration * 1.5  // Respiração lenta na lua nova
                : faseLunar === 'cheia'
                ? intensidadeConfig.duration * 0.8  // Respiração rápida na lua cheia
                : intensidadeConfig.duration,
            repeat: Infinity,
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
            rotate: pausado ? 0 : 360,
          }}
          transition={{
            duration: velocidadeRotacao,
            repeat: pausado ? 0 : Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: '96px 96px' }}
        />

        {/* Anel médio - progresso (cor dinâmica) com rotação */}
        <motion.g
          animate={{
            rotate: pausado ? 0 : 360,
          }}
          transition={{
            duration: velocidadeRotacao,
            repeat: pausado ? 0 : Infinity,
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
              opacity: pausado ? [0.5, 0.6, 0.5] : [0.8, 1, 0.8],
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
          fill="url(#centerGradient)"
          filter="url(#glow)"
          animate={
            modoRespiracao
              ? {
                  // Modo respiração: sincronizado com ciclo respiratório
                  scale: faseRespiracao === 'inspirar' 
                    ? [1, 1.3]  // Expandir ao inspirar
                    : faseRespiracao === 'segurar'
                    ? [1.3, 1.3]  // Segurar expandido
                    : [1.3, 1],  // Contrair ao expirar
                  opacity: faseRespiracao === 'inspirar'
                    ? [0.8, 1]
                    : faseRespiracao === 'segurar'
                    ? [1, 1]
                    : [1, 0.7],
                }
              : {
                  // Modo normal: baseado na lua
                  scale: pausado 
                    ? [1, 1.01, 1] 
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
                  duration: 4,  // 4 segundos por fase
                  repeat: 0,    // Sem repeat (controlado pelo hook)
                  ease: faseRespiracao === 'segurar' ? 'linear' : 'easeInOut',
                }
              : {
                  duration: pausado 
                    ? intensidadeConfig.duration * 3 
                    : faseLunar === 'nova'
                    ? intensidadeConfig.duration * 2.5  // Muito lento na lua nova
                    : faseLunar === 'cheia'
                    ? intensidadeConfig.duration * 1.2  // Mais rápido na lua cheia
                    : intensidadeConfig.duration * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          style={{ transformOrigin: '96px 96px' }}
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
            rotate: pausado ? 0 : -360, // Rotação reversa para contraste
          }}
          transition={{
            duration: velocidadeRotacao * 1.5, // Um pouco mais lento que o anel
            repeat: pausado ? 0 : Infinity,
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
                opacity={pausado ? 0.3 : 0.6}
                animate={{
                  scale: pausado ? [1, 1.1, 1] : [1, 1.5, 1],
                  opacity: pausado 
                    ? [0.2, 0.4, 0.2] 
                    : [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: pausado ? 3 : 2,
                  repeat: Infinity,
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
          opacity: pausado ? [0.2, 0.3, 0.2] : [0.5, 1, 0.5],
          scale: pausado ? [1, 1.01, 1] : [1, pulseScaleAjustado * 0.5, 1],
        }}
        transition={{
          duration: pausado 
            ? intensidadeConfig.duration * 3
            : faseLunar === 'nova'
            ? intensidadeConfig.duration * 1.8
            : faseLunar === 'cheia'
            ? intensidadeConfig.duration * 0.7
            : intensidadeConfig.duration,
          repeat: Infinity,
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
              color: corPrincipal,
              textShadow: `0 0 20px ${corPrincipal}80`,
            }}
            animate={{
              opacity: faseRespiracao === 'segurar' ? [1, 0.7, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: faseRespiracao === 'segurar' ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            {faseRespiracao === 'inspirar' && '✨ Inspirar ✨'}
            {faseRespiracao === 'segurar' && '🌟 Segurar 🌟'}
            {faseRespiracao === 'expirar' && '🌙 Expirar 🌙'}
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}

