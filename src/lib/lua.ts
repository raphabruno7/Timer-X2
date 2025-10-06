/**
 * Biblioteca para cálculo e interpretação das fases lunares
 * Baseado no ciclo sinódico lunar de 29.53 dias
 */

export type FaseLunar = 'nova' | 'crescente' | 'cheia' | 'minguante';

/**
 * Calcula a fase atual da lua baseada na data fornecida
 * 
 * Algoritmo:
 * - Usa uma data de referência conhecida de lua nova
 * - Calcula quantos dias se passaram desde então
 * - Divide pelo ciclo lunar (29.53 dias) e pega o resto
 * - Mapeia o resto para as 4 fases principais
 * 
 * @param date - Data para calcular a fase (padrão: agora)
 * @returns Fase lunar: 'nova' | 'crescente' | 'cheia' | 'minguante'
 */
export function faseDaLua(date: Date = new Date()): FaseLunar {
  const ciclo = 29.53; // duração média do ciclo lunar
  const ref = new Date('2000-01-06T18:14:00'); // referência da lua nova
  const diff = (date.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24);
  const fase = (diff % ciclo) / ciclo;
  
  if (fase < 0.25) return 'nova';
  if (fase < 0.5) return 'crescente';
  if (fase < 0.75) return 'cheia';
  return 'minguante';
}

/**
 * Retorna a porcentagem de iluminação da lua (0-100)
 * Útil para animações mais precisas
 */
export function iluminacaoLunar(date: Date = new Date()): number {
  const luaNovaReferencia = new Date('2000-01-06T18:14:00Z');
  const cicloLunar = 29.53058867;
  
  const diferencaMs = date.getTime() - luaNovaReferencia.getTime();
  const diferencaDias = diferencaMs / (1000 * 60 * 60 * 24);
  const posicaoCiclo = diferencaDias % cicloLunar;
  const porcentagemCiclo = posicaoCiclo / cicloLunar;
  
  // Calcular iluminação (0% na lua nova, 100% na lua cheia)
  // Usa função cosseno para transição suave
  const iluminacao = (1 - Math.cos(porcentagemCiclo * 2 * Math.PI)) / 2;
  
  return Math.round(iluminacao * 100);
}

/**
 * Retorna emoji da fase lunar atual
 */
export function emojiLunar(fase: FaseLunar): string {
  const emojis = {
    nova: '🌑',
    crescente: '🌓',
    cheia: '🌕',
    minguante: '🌗',
  };
  return emojis[fase];
}

/**
 * Retorna descrição poética da fase lunar
 */
export function descricaoLunar(fase: FaseLunar): string {
  const descricoes = {
    nova: 'Noite do mistério, início silencioso',
    crescente: 'Luz que desperta, energia crescente',
    cheia: 'Brilho pleno, poder máximo',
    minguante: 'Reflexão suave, energia introspectiva',
  };
  return descricoes[fase];
}

/**
 * Retorna configuração de cor/intensidade baseada na fase lunar
 */
export function estiloLunar(fase: FaseLunar) {
  const estilos = {
    nova: {
      brilho: 0.3,      // Brilho baixo
      saturacao: 0.5,   // Tons frios dessaturados
      velocidade: 1.5,  // Pulsar lento
      cor: '#4A4A4A',   // Cinza escuro (#1C1C1C + cinza)
      descricao: 'Noite silenciosa',
    },
    crescente: {
      brilho: 0.7,      // Luz suave
      saturacao: 0.8,   // Gradiente suave
      velocidade: 1.1,  // Moderado
      cor: '#A8C66C',   // Verde-amarelado (transição)
      descricao: 'Luz crescente',
    },
    cheia: {
      brilho: 1.0,      // Brilho máximo
      saturacao: 1.0,   // Cor dourada vibrante
      velocidade: 0.7,  // Pulsar forte e rápido
      cor: '#FFD700',   // Dourado (#FFD700)
      descricao: 'Plenitude lunar',
    },
    minguante: {
      brilho: 0.5,      // Tons moderados
      saturacao: 0.6,   // Tons azulados
      velocidade: 1.4,  // Pulsar lento
      cor: '#6B8CAE',   // Azul suave
      descricao: 'Reflexão azulada',
    },
  };
  
  return estilos[fase];
}

