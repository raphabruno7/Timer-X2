/**
 * Adaptive Engine - Camada de inteligência adaptativa para Timer X2
 * Analisa padrões de uso e faz microajustes sutis no comportamento do app
 */

export interface UsagePattern {
  preset: string;
  duration: number;
  startTime: number;
  mood?: string;
  createdAt: number;
}

export interface AdaptiveAdjustments {
  tempoAjustado: number; // Tempo ajustado em segundos
  intensidadeMandala: 'leve' | 'normal' | 'forte';
  recomendacao?: string; // Mensagem opcional sobre o ajuste
}

/**
 * Analisa padrões de uso e retorna ajustes adaptativos
 * @param padroes - Últimos padrões de uso (recomendado: 5-10 sessões)
 * @param tempoAtual - Tempo base atual em segundos
 * @returns Objeto com ajustes sugeridos
 */
export function analisarPadrao(
  padroes: UsagePattern[],
  tempoAtual: number = 1500 // 25 minutos por padrão
): AdaptiveAdjustments {
  // Se não há padrões suficientes, retornar valores padrão
  if (!padroes || padroes.length < 3) {
    return {
      tempoAjustado: tempoAtual,
      intensidadeMandala: 'normal',
      recomendacao: 'Coletando dados para personalização...',
    };
  }

  // 1. Calcular média de duração das sessões
  const mediaDuracao = padroes.reduce((acc, p) => acc + p.duration, 0) / padroes.length;
  const mediaDuracaoSegundos = mediaDuracao * 60;

  // 2. Detectar tendência: usuário encurta ou alonga sessões?
  let tendencia: 'encurta' | 'alonga' | 'mantém' = 'mantém';
  
  // Comparar com tempo base típico (25 min = 1500s)
  const tempoBaseMinutos = tempoAtual / 60;
  
  if (mediaDuracao < tempoBaseMinutos * 0.8) {
    tendencia = 'encurta';
  } else if (mediaDuracao > tempoBaseMinutos * 1.2) {
    tendencia = 'alonga';
  }

  // 3. Ajustar tempo inicial sutilmente (+/- 5%)
  let tempoAjustado = tempoAtual;
  let fatorAjuste = 1.0;

  if (tendencia === 'encurta') {
    // Usuário prefere sessões mais curtas → reduzir 3-5%
    fatorAjuste = 0.97; // -3%
    tempoAjustado = Math.round(tempoAtual * fatorAjuste);
  } else if (tendencia === 'alonga') {
    // Usuário prefere sessões mais longas → aumentar 3-5%
    fatorAjuste = 1.03; // +3%
    tempoAjustado = Math.round(tempoAtual * fatorAjuste);
  }

  // Garantir que o ajuste esteja dentro do limite de ±5%
  const limiteMinimo = tempoAtual * 0.95;
  const limiteMaximo = tempoAtual * 1.05;
  tempoAjustado = Math.max(limiteMinimo, Math.min(limiteMaximo, tempoAjustado));

  // 4. Determinar intensidade da mandala baseada em consistência
  const intensidadeMandala = calcularIntensidadeMandala(padroes, mediaDuracao);

  // 5. Gerar recomendação
  const recomendacao = gerarRecomendacao(tendencia, fatorAjuste, intensidadeMandala);

  console.log('[Adaptive Engine] 🧠 Análise concluída:', {
    padrões: padroes.length,
    mediaDuracao: `${Math.round(mediaDuracao)}min`,
    tendencia,
    ajuste: `${fatorAjuste > 1 ? '+' : ''}${Math.round((fatorAjuste - 1) * 100)}%`,
    tempoOriginal: `${tempoAtual}s`,
    tempoAjustado: `${tempoAjustado}s`,
    intensidadeMandala,
  });

  return {
    tempoAjustado,
    intensidadeMandala,
    recomendacao,
  };
}

/**
 * Calcula intensidade da mandala baseada em consistência e variação
 */
function calcularIntensidadeMandala(
  padroes: UsagePattern[],
  mediaDuracao: number
): 'leve' | 'normal' | 'forte' {
  if (padroes.length < 3) return 'normal';

  // Calcular variação (desvio padrão simplificado)
  const varianciaTotal = padroes.reduce((acc, p) => {
    return acc + Math.abs(p.duration - mediaDuracao);
  }, 0);
  
  const variacaoMedia = varianciaTotal / padroes.length;

  // Análise de consistência
  const ehConsistente = variacaoMedia < 5; // Menos de 5min de variação
  const ehMuitoVariado = variacaoMedia > 15; // Mais de 15min de variação

  // Análise de mood dominante
  const moods = padroes.filter(p => p.mood).map(p => p.mood);
  const moodDominante = moods.length > 0 ? moods[0] : null;

  // Determinar intensidade
  if (ehConsistente && mediaDuracao >= 40) {
    // Usuário focado e consistente → mandala forte
    return 'forte';
  } else if (ehMuitoVariado || mediaDuracao < 20) {
    // Usuário disperso ou sessões curtas → mandala leve
    return 'leve';
  } else if (moodDominante === 'relaxamento') {
    // Preferência por relaxamento → mandala leve
    return 'leve';
  } else if (moodDominante === 'foco' || moodDominante === 'energia') {
    // Preferência por foco/energia → mandala forte
    return 'forte';
  }

  return 'normal';
}

/**
 * Gera recomendação textual sobre os ajustes
 */
function gerarRecomendacao(
  tendencia: 'encurta' | 'alonga' | 'mantém',
  fatorAjuste: number,
  intensidade: 'leve' | 'normal' | 'forte'
): string {
  const ajustePercentual = Math.round((fatorAjuste - 1) * 100);
  
  if (tendencia === 'encurta') {
    return `Ajustando tempo base ${ajustePercentual}% para sessões mais curtas e eficientes.`;
  } else if (tendencia === 'alonga') {
    return `Ajustando tempo base +${ajustePercentual}% para sessões de foco profundo.`;
  } else {
    return `Mantendo ritmo atual com mandala ${intensidade}.`;
  }
}

/**
 * Calcula score de produtividade baseado em padrões
 * @param padroes - Padrões de uso
 * @returns Score de 0 a 100
 */
export function calcularScoreProdutividade(padroes: UsagePattern[]): number {
  if (padroes.length === 0) return 0;

  const ultimaSemana = padroes.filter(
    p => p.createdAt > Date.now() - 7 * 24 * 60 * 60 * 1000
  );

  if (ultimaSemana.length === 0) return 0;

  // Fatores de produtividade:
  // 1. Consistência (30%)
  const mediaDuracao = ultimaSemana.reduce((acc, p) => acc + p.duration, 0) / ultimaSemana.length;
  const variacoes = ultimaSemana.map(p => Math.abs(p.duration - mediaDuracao));
  const variacaoMedia = variacoes.reduce((a, b) => a + b, 0) / variacoes.length;
  const scoreConsistencia = Math.max(0, 30 - variacaoMedia);

  // 2. Frequência (40%)
  const sessoesNecessarias = 7; // 1 por dia
  const scoreFrequencia = Math.min(40, (ultimaSemana.length / sessoesNecessarias) * 40);

  // 3. Duração total (30%)
  const tempoTotal = ultimaSemana.reduce((acc, p) => acc + p.duration, 0);
  const tempoIdeal = 7 * 30; // 30min por dia
  const scoreDuracao = Math.min(30, (tempoTotal / tempoIdeal) * 30);

  return Math.round(scoreConsistencia + scoreFrequencia + scoreDuracao);
}

/**
 * Detecta melhor horário para foco baseado em padrões
 */
export function detectarMelhorHorario(padroes: UsagePattern[]): {
  hora: number;
  confianca: number;
} | null {
  if (padroes.length < 5) return null;

  // Agrupar por hora do dia
  const horarios: Record<number, number> = {};
  padroes.forEach(p => {
    const hora = new Date(p.startTime).getHours();
    horarios[hora] = (horarios[hora] || 0) + 1;
  });

  // Encontrar hora mais frequente
  const horaFrequente = Object.entries(horarios)
    .sort((a, b) => b[1] - a[1])[0];

  if (!horaFrequente) return null;

  const [hora, frequencia] = horaFrequente;
  const confianca = Math.min(100, (frequencia / padroes.length) * 100);

  return {
    hora: parseInt(hora),
    confianca: Math.round(confianca),
  };
}

