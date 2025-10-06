/**
 * 🌑 CÉREBRO LUNAR 🌕
 * 
 * Módulo que sincroniza a Mandala Viva com os ciclos lunares e estados emocionais,
 * criando uma experiência bioluminescente e orgânica que vibra com o cosmos.
 * 
 * Combina:
 * - Fase lunar (energia cósmica)
 * - Estado emocional (energia pessoal)
 * - Tempo do dia (ritmo circadiano)
 * 
 * Retorna ajustes para cor, frequência sonora, intensidade e ritmo da Mandala.
 */

import { faseDaLua, iluminacaoLunar, type FaseLunar } from "./lua";

/**
 * Estado emocional do usuário
 */
export type EmocaoUsuario = 'neutra' | 'alegria' | 'calma' | 'cansaço';

/**
 * Configuração completa do Cérebro Lunar
 */
export interface ConfiguracaoCerebralLunar {
  tonalidade: string;           // Cor hex principal
  tonalidade2?: string;         // Cor secundária para gradiente
  frequencia: number;           // Frequência sonora (Hz): 396, 417, 432, 528, 639, 741, 852
  energia: number;              // Multiplicador de energia (0.5-1.5)
  fase: string;                 // Nome da fase lunar
  iluminacao: number;           // Porcentagem de iluminação (0-100)
  velocidadePulso: number;      // Velocidade do pulso (0.7-1.5)
  velocidadeRotacao: number;    // Velocidade de rotação (0.7-1.5)
  brilho: number;               // Brilho geral (0.5-1.3)
  saturacao: number;            // Saturação de cor (0.6-1.0)
  descricao: string;            // Descrição poética do estado
  emoji: string;                // Emoji representativo
}

/**
 * Parâmetros de entrada para o Cérebro Lunar
 */
export interface ParametrosCerebralLunar {
  emocao: EmocaoUsuario;
  data?: Date;
  horaAtual?: number; // 0-23, para modulação circadiana
}

/**
 * Frequências de Solfeggio usadas na terapia sonora
 * Cada uma tem um propósito terapêutico específico
 */
const FREQUENCIAS_SOLFEGGIO = {
  UT: 396,  // Liberação de culpa e medo
  RE: 417,  // Facilitação da mudança
  MI: 432,  // Afinação natural (substitui 528 tradicional)
  FA: 528,  // Transformação e DNA repair
  SOL: 639, // Conexão e relacionamentos
  LA: 741,  // Despertar da intuição
  SI: 852,  // Retorno à ordem espiritual
};

/**
 * 🌕 CÉREBRO LUNAR - Função Principal
 * 
 * Analisa fase lunar, emoção e horário para gerar configuração
 * completa da Mandala Viva
 * 
 * @param params - Emoção, data e hora
 * @returns Configuração completa do Cérebro Lunar
 */
export function cerebroLunar({
  emocao,
  data = new Date(),
  horaAtual,
}: ParametrosCerebralLunar): ConfiguracaoCerebralLunar {
  
  // 1. Detectar fase lunar e iluminação
  const fase = faseDaLua(data);
  const iluminacao = iluminacaoLunar(data);
  const hora = horaAtual ?? data.getHours();
  
  // 2. Base de energia (sempre começa em 1.0)
  let energia = 1.0;
  
  // 3. Base de tonalidade (dourado natureza)
  let tonalidade = "#FFD700";
  let tonalidade2 = "#FFA500"; // Gradiente padrão
  
  // 4. Base de frequência (432 Hz - afinação natural)
  let frequencia = FREQUENCIAS_SOLFEGGIO.MI; // 432 Hz
  
  // 5. Velocidades e intensidades base
  let velocidadePulso = 1.0;
  let velocidadeRotacao = 1.0;
  let brilho = 1.0;
  let saturacao = 0.9;
  let descricao = "Energia equilibrada";
  let emoji = "✨";
  
  // ========================================
  // 🌙 MODULAÇÃO POR FASE LUNAR
  // ========================================
  
  switch (fase) {
    case "nova":
      // 🌑 Lua Nova - Regeneração, Introspecção, Mistério
      tonalidade = "#2ECC71";    // Verde regenerativo
      tonalidade2 = "#1ABC9C";   // Verde-água
      frequencia = FREQUENCIAS_SOLFEGGIO.UT; // 396 Hz - liberar e recomeçar
      energia *= 0.7;            // Energia mais baixa
      velocidadePulso = 1.4;     // Pulso lento e profundo
      velocidadeRotacao = 0.8;   // Rotação suave
      brilho = 0.6;              // Brilho reduzido
      saturacao = 0.75;          // Cores mais suaves
      descricao = "Silêncio fértil, início misterioso";
      emoji = "🌑";
      break;
      
    case "crescente":
      // 🌓 Lua Crescente - Expansão, Crescimento, Ação
      tonalidade = "#00C2FF";    // Azul expansão
      tonalidade2 = "#5DADE2";   // Azul celeste
      frequencia = FREQUENCIAS_SOLFEGGIO.MI; // 432 Hz - harmonia natural
      energia *= 1.1;            // Energia crescente
      velocidadePulso = 1.0;     // Pulso normal
      velocidadeRotacao = 1.1;   // Rotação acelerando
      brilho = 0.85;             // Brilho aumentando
      saturacao = 0.9;           // Cores vibrantes
      descricao = "Luz que desperta, momentum crescente";
      emoji = "🌓";
      break;
      
    case "cheia":
      // 🌕 Lua Cheia - Plenitude, Poder, Clareza
      tonalidade = "#FFD700";    // Dourado energia máxima
      tonalidade2 = "#FFA500";   // Laranja radiante
      frequencia = FREQUENCIAS_SOLFEGGIO.FA; // 528 Hz - transformação
      energia *= 1.3;            // Energia máxima
      velocidadePulso = 0.7;     // Pulso rápido e forte
      velocidadeRotacao = 1.3;   // Rotação acelerada
      brilho = 1.2;              // Brilho máximo
      saturacao = 1.0;           // Saturação plena
      descricao = "Brilho pleno, potência ilimitada";
      emoji = "🌕";
      break;
      
    case "minguante":
      // 🌗 Lua Minguante - Reflexão, Liberação, Sabedoria
      tonalidade = "#BDA31A";    // Âmbar suave
      tonalidade2 = "#D4AF37";   // Dourado envelhecido
      frequencia = FREQUENCIAS_SOLFEGGIO.RE; // 417 Hz - mudança e liberação
      energia *= 0.9;            // Energia moderada
      velocidadePulso = 1.2;     // Pulso contemplativo
      velocidadeRotacao = 0.9;   // Rotação desacelerando
      brilho = 0.75;             // Brilho reduzindo
      saturacao = 0.8;           // Cores amadurecidas
      descricao = "Reflexão dourada, sabedoria introspectiva";
      emoji = "🌗";
      break;
  }
  
  // ========================================
  // 💫 MODULAÇÃO POR EMOÇÃO
  // ========================================
  
  switch (emocao) {
    case "calma":
      // 🧘 Calma - Tons verdes/azuis, frequências graves
      energia *= 0.8;
      velocidadePulso *= 1.3;    // Pulso mais lento
      velocidadeRotacao *= 0.85; // Rotação suave
      brilho *= 0.9;             // Brilho suave
      saturacao *= 0.9;          // Cores menos saturadas
      
      // Shift de cor para tons mais frios/verdes
      if (fase === "cheia" || fase === "crescente") {
        tonalidade = "#48C9B0";  // Verde-água
        tonalidade2 = "#5DADE2"; // Azul suave
      }
      
      // Preferir frequências mais baixas
      if (frequencia >= FREQUENCIAS_SOLFEGGIO.FA) {
        frequencia = FREQUENCIAS_SOLFEGGIO.MI; // 432 Hz
      }
      
      descricao = `${descricao} · respiração tranquila`;
      emoji = `${emoji} 🧘`;
      break;
      
    case "cansaço":
      // 😴 Cansaço - Energia baixa, tons escuros
      energia *= 0.6;
      velocidadePulso *= 1.5;    // Pulso muito lento
      velocidadeRotacao *= 0.75; // Rotação mínima
      brilho *= 0.7;             // Brilho reduzido
      saturacao *= 0.8;          // Cores dessaturadas
      
      // Shift para tons mais escuros e regenerativos
      if (fase !== "nova") {
        tonalidade = "#5D8AA8";  // Azul-cinza
        tonalidade2 = "#808080"; // Cinza suave
      }
      
      // Frequência de regeneração
      frequencia = FREQUENCIAS_SOLFEGGIO.UT; // 396 Hz - regenerar
      
      descricao = `${descricao} · descanso merecido`;
      emoji = `${emoji} 😴`;
      break;
      
    case "alegria":
      // 😊 Alegria - Cores quentes, energia alta
      energia *= 1.2;
      velocidadePulso *= 0.8;    // Pulso mais rápido
      velocidadeRotacao *= 1.15; // Rotação energética
      brilho *= 1.1;             // Brilho intenso
      saturacao *= 1.0;          // Cores vibrantes
      
      // Shift para tons mais quentes
      if (fase === "nova" || fase === "minguante") {
        tonalidade = "#F39C12";  // Laranja vibrante
        tonalidade2 = "#E67E22"; // Laranja queimado
      }
      
      // Frequência de celebração
      if (frequencia < FREQUENCIAS_SOLFEGGIO.FA) {
        frequencia = FREQUENCIAS_SOLFEGGIO.FA; // 528 Hz - transformação
      }
      
      descricao = `${descricao} · celebração radiante`;
      emoji = `${emoji} 😊`;
      break;
      
    case "neutra":
      // ✨ Neutro - Mantém as configurações base
      descricao = `${descricao} · equilíbrio presente`;
      break;
  }
  
  // ========================================
  // 🕐 MODULAÇÃO CIRCADIANA (HORA DO DIA)
  // ========================================
  
  // Madrugada (0-5h) - Reduzir energia e brilho
  if (hora >= 0 && hora < 5) {
    energia *= 0.8;
    brilho *= 0.7;
    velocidadePulso *= 1.2;
  }
  
  // Manhã (6-11h) - Energia crescente
  else if (hora >= 6 && hora < 12) {
    energia *= 1.05;
    brilho *= 1.0;
  }
  
  // Tarde (12-17h) - Energia plena
  else if (hora >= 12 && hora < 18) {
    energia *= 1.1;
    brilho *= 1.05;
  }
  
  // Noite (18-23h) - Energia decrescente
  else if (hora >= 18) {
    energia *= 0.9;
    brilho *= 0.85;
    velocidadePulso *= 1.1;
  }
  
  // ========================================
  // 🎯 LIMITES DE SEGURANÇA
  // ========================================
  
  energia = Math.max(0.5, Math.min(1.5, energia));
  velocidadePulso = Math.max(0.7, Math.min(1.5, velocidadePulso));
  velocidadeRotacao = Math.max(0.7, Math.min(1.5, velocidadeRotacao));
  brilho = Math.max(0.5, Math.min(1.3, brilho));
  saturacao = Math.max(0.6, Math.min(1.0, saturacao));
  
  // ========================================
  // 🌌 RETORNO DA CONFIGURAÇÃO COMPLETA
  // ========================================
  
  const config: ConfiguracaoCerebralLunar = {
    tonalidade,
    tonalidade2,
    frequencia,
    energia,
    fase,
    iluminacao,
    velocidadePulso,
    velocidadeRotacao,
    brilho,
    saturacao,
    descricao,
    emoji,
  };
  
  // Log para debug (silencioso no modo produção)
  if (process.env.NODE_ENV === 'development') {
    console.info('🌕 [Cérebro Lunar]', {
      fase,
      emocao,
      hora,
      iluminacao: `${iluminacao}%`,
      energia: energia.toFixed(2),
      frequencia: `${frequencia}Hz`,
      tonalidade,
    });
  }
  
  return config;
}

/**
 * 🎨 Gera gradiente CSS baseado nas tonalidades do Cérebro Lunar
 */
export function gradienteLunar(config: ConfiguracaoCerebralLunar): string {
  return `linear-gradient(135deg, ${config.tonalidade} 0%, ${config.tonalidade2 || config.tonalidade} 100%)`;
}

/**
 * 🌊 Calcula velocidade de animação baseada em múltiplos fatores
 * Útil para sincronizar animações com o estado lunar
 */
export function calcularVelocidadeAnimacao(
  velocidadeBase: number,
  multiplicadorEnergia: number
): number {
  return Math.max(0.5, Math.min(2.0, velocidadeBase * multiplicadorEnergia));
}

/**
 * 🎵 Retorna nome da nota musical baseado na frequência
 */
export function notaMusical(frequencia: number): string {
  const notas: Record<number, string> = {
    396: "Sol (UT)",
    417: "Ré♭ (RE)",
    432: "Lá (MI)",
    528: "Dó (FA)",
    639: "Mi♭ (SOL)",
    741: "Fá♯ (LA)",
    852: "Lá (SI)",
  };
  return notas[frequencia] || "Nota desconhecida";
}

