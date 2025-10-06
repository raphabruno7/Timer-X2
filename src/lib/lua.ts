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
  // Data de referência: Lua Nova em 1 de janeiro de 2000 às 18:14 UTC
  const luaNovaReferencia = new Date('2000-01-06T18:14:00Z');
  
  // Ciclo sinódico lunar (período entre duas luas novas)
  const cicloLunar = 29.53058867; // dias
  
  // Calcular diferença em milissegundos
  const diferencaMs = date.getTime() - luaNovaReferencia.getTime();
  
  // Converter para dias
  const diferencaDias = diferencaMs / (1000 * 60 * 60 * 24);
  
  // Calcular posição no ciclo atual (0 a 29.53)
  const posicaoCiclo = diferencaDias % cicloLunar;
  
  // Normalizar para 0-1 (porcentagem do ciclo)
  const porcentagemCiclo = posicaoCiclo / cicloLunar;
  
  // Mapear para as 4 fases principais
  // 0-0.25: Nova → Crescente
  // 0.25-0.5: Crescente → Cheia
  // 0.5-0.75: Cheia → Minguante
  // 0.75-1.0: Minguante → Nova
  
  if (porcentagemCiclo < 0.125 || porcentagemCiclo >= 0.875) {
    return 'nova'; // Lua Nova
  } else if (porcentagemCiclo >= 0.125 && porcentagemCiclo < 0.375) {
    return 'crescente'; // Quarto Crescente
  } else if (porcentagemCiclo >= 0.375 && porcentagemCiclo < 0.625) {
    return 'cheia'; // Lua Cheia
  } else {
    return 'minguante'; // Quarto Minguante
  }
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
      brilho: 0.3,      // Brilho mínimo
      saturacao: 0.5,   // Cores dessaturadas
      velocidade: 1.5,  // Mais lento
      cor: '#E8E8F0',   // Prata escura
      descricao: 'Escuridão contemplativa',
    },
    crescente: {
      brilho: 0.6,      // Brilho médio-baixo
      saturacao: 0.75,  // Cores suaves
      velocidade: 1.2,  // Levemente lento
      cor: '#B8C5D6',   // Azul-prata
      descricao: 'Luz emergindo',
    },
    cheia: {
      brilho: 1.0,      // Brilho máximo
      saturacao: 1.0,   // Cores vibrantes
      velocidade: 0.8,  // Mais rápido
      cor: '#F0E68C',   // Amarelo lunar brilhante
      descricao: 'Plenitude radiante',
    },
    minguante: {
      brilho: 0.5,      // Brilho médio
      saturacao: 0.6,   // Cores frias
      velocidade: 1.3,  // Lento
      cor: '#C8D5E8',   // Azul-prata frio
      descricao: 'Quietude introspectiva',
    },
  };
  
  return estilos[fase];
}

