/**
 * Environment Feedback - Sistema de feedback ambiental sutil
 * Ajusta cores, luz e atmosfera do app baseado no contexto do usuário
 */

export interface ContextoUsuario {
  horario: number; // Hora atual (0-23)
  sessoesConcluidas: number; // Número de sessões hoje
  ultimaSessaoDuracao?: number; // Duração da última sessão em minutos
  tendenciaCansaco?: boolean; // Detecta se há sinais de cansaço
  mediaDuracao?: number; // Média de duração das últimas sessões
  totalPausas?: number; // Total de pausas nas últimas sessões
}

export interface AmbienteAdaptativo {
  corFundo: string; // Cor de fundo principal
  corMandala: string; // Cor da mandala/timer
  corAccent: string; // Cor de destaque
  transicao: string; // Tempo de transição CSS
  intensidadeLuz: number; // Intensidade do glow (0-1)
  descricao: string; // Descrição do ambiente
}

/**
 * Ajusta o ambiente visual baseado no contexto do usuário
 */
export function ajustarAmbiente(contexto: ContextoUsuario): AmbienteAdaptativo {
  const { horario, sessoesConcluidas, tendenciaCansaco, ultimaSessaoDuracao, totalPausas } = contexto;

  // 1. Determinar período do dia
  const periodo = detectarPeriodoDia(horario);
  
  // 2. Detectar nível de energia do usuário
  const nivelEnergia = detectarNivelEnergia(
    sessoesConcluidas,
    ultimaSessaoDuracao,
    totalPausas,
    tendenciaCansaco
  );

  // 3. Selecionar paleta de cores baseada em período e energia
  const paleta = selecionarPaleta(periodo, nivelEnergia);

  // 4. Ajustar intensidade da luz
  const intensidadeLuz = calcularIntensidadeLuz(periodo, nivelEnergia);

  // 5. Definir velocidade de transição
  const transicao = nivelEnergia === 'baixa' ? '2s ease-in-out' : '1.5s ease-in-out';

  console.log('[Environment Feedback] 🌍 Ambiente ajustado:', {
    periodo,
    nivelEnergia,
    paleta: paleta.descricao,
    intensidadeLuz: `${Math.round(intensidadeLuz * 100)}%`,
  });

  return {
    corFundo: paleta.fundo,
    corMandala: paleta.mandala,
    corAccent: paleta.accent,
    transicao,
    intensidadeLuz,
    descricao: paleta.descricao,
  };
}

/**
 * Detecta o período do dia baseado na hora
 */
function detectarPeriodoDia(horario: number): 'madrugada' | 'aurora' | 'manha' | 'tarde' | 'entardecer' | 'noite' {
  if (horario >= 0 && horario < 5) return 'madrugada';
  if (horario >= 5 && horario < 7) return 'aurora';
  if (horario >= 7 && horario < 12) return 'manha';
  if (horario >= 12 && horario < 17) return 'tarde';
  if (horario >= 17 && horario < 20) return 'entardecer';
  return 'noite'; // 20-23h
}

/**
 * Detecta nível de energia do usuário
 */
function detectarNivelEnergia(
  sessoesConcluidas: number,
  ultimaSessaoDuracao?: number,
  totalPausas?: number,
  tendenciaCansaco?: boolean
): 'alta' | 'media' | 'baixa' {
  // Sinais de energia baixa
  if (tendenciaCansaco) return 'baixa';
  if (totalPausas && totalPausas > 5) return 'baixa';
  if (ultimaSessaoDuracao && ultimaSessaoDuracao < 15) return 'baixa';
  if (sessoesConcluidas > 6) return 'baixa'; // Muitas sessões = cansaço

  // Sinais de energia alta
  if (sessoesConcluidas <= 2 && ultimaSessaoDuracao && ultimaSessaoDuracao >= 30) return 'alta';
  if (totalPausas !== undefined && totalPausas <= 1) return 'alta';

  // Energia média (padrão)
  return 'media';
}

/**
 * Seleciona paleta de cores baseada em período e energia
 */
function selecionarPaleta(
  periodo: 'madrugada' | 'aurora' | 'manha' | 'tarde' | 'entardecer' | 'noite',
  nivelEnergia: 'alta' | 'media' | 'baixa'
): { fundo: string; mandala: string; accent: string; descricao: string } {
  // Paletas por período do dia
  const paletasPeriodo = {
    madrugada: {
      alta: { fundo: '#0A0E1A', mandala: '#4A90E2', accent: '#7B68EE', descricao: 'Azul profundo noturno' },
      media: { fundo: '#0D1117', mandala: '#5B8DBE', accent: '#8A7CC7', descricao: 'Azul-cinza suave' },
      baixa: { fundo: '#121212', mandala: '#6B7280', accent: '#9CA3AF', descricao: 'Cinza-azulado tranquilo' },
    },
    aurora: {
      alta: { fundo: '#1A1625', mandala: '#FF6B9D', accent: '#FFB347', descricao: 'Rosa-alaranjado aurora' },
      media: { fundo: '#1C1C1C', mandala: '#E07B9D', accent: '#F4A460', descricao: 'Rosa suave amanhecer' },
      baixa: { fundo: '#1E1E1E', mandala: '#B39DDB', accent: '#CE93D8', descricao: 'Lavanda aurora' },
    },
    manha: {
      alta: { fundo: '#1A1F1A', mandala: '#4CAF50', accent: '#FFD700', descricao: 'Verde-dourado matinal' },
      media: { fundo: '#1C1C1C', mandala: '#66BB6A', accent: '#FDD835', descricao: 'Verde fresco manhã' },
      baixa: { fundo: '#1E1E1E', mandala: '#81C784', accent: '#FFEB3B', descricao: 'Verde-claro suave' },
    },
    tarde: {
      alta: { fundo: '#1C1A16', mandala: '#2ECC71', accent: '#F39C12', descricao: 'Verde-âmbar vibrante' },
      media: { fundo: '#1C1C1C', mandala: '#27AE60', accent: '#E67E22', descricao: 'Verde-laranja equilibrado' },
      baixa: { fundo: '#1E1E1E', mandala: '#52C77B', accent: '#F0B27A', descricao: 'Verde-pêssego calmo' },
    },
    entardecer: {
      alta: { fundo: '#1A1016', mandala: '#FF6B6B', accent: '#FFA07A', descricao: 'Vermelho-coral pôr do sol' },
      media: { fundo: '#1C1418', mandala: '#E57373', accent: '#FFB74D', descricao: 'Salmão-dourado entardecer' },
      baixa: { fundo: '#1E1C1E', mandala: '#CE93D8', accent: '#FFAB91', descricao: 'Roxo-salmão suave' },
    },
    noite: {
      alta: { fundo: '#0F0F1A', mandala: '#9B59B6', accent: '#3498DB', descricao: 'Roxo-azul noturno' },
      media: { fundo: '#121212', mandala: '#8E44AD', accent: '#5DADE2', descricao: 'Índigo noite' },
      baixa: { fundo: '#161616', mandala: '#7E57C2', accent: '#64B5F6', descricao: 'Lavanda-azul tranquilo' },
    },
  };

  return paletasPeriodo[periodo][nivelEnergia];
}

/**
 * Calcula intensidade da luz/glow
 */
function calcularIntensidadeLuz(
  periodo: 'madrugada' | 'aurora' | 'manha' | 'tarde' | 'entardecer' | 'noite',
  nivelEnergia: 'alta' | 'media' | 'baixa'
): number {
  // Intensidade base por período
  const intensidadeBase = {
    madrugada: 0.4,
    aurora: 0.6,
    manha: 0.8,
    tarde: 0.7,
    entardecer: 0.5,
    noite: 0.3,
  }[periodo];

  // Modificador por energia
  const modificadorEnergia = {
    alta: 1.2,
    media: 1.0,
    baixa: 0.7,
  }[nivelEnergia];

  return Math.min(1, intensidadeBase * modificadorEnergia);
}

/**
 * Detecta tendência de cansaço baseado em padrões
 */
export function detectarTendenciaCansaco(
  sessoes: Array<{ duration: number; startTime: number }>
): boolean {
  if (sessoes.length < 3) return false;

  // Últimas 3 sessões
  const ultimas3 = sessoes.slice(-3);

  // 1. Sessões ficando progressivamente mais curtas
  const duracoes = ultimas3.map(s => s.duration);
  const decrescendo = duracoes[0] > duracoes[1] && duracoes[1] > duracoes[2];

  // 2. Todas as sessões curtas (< 20min)
  const todasCurtas = ultimas3.every(s => s.duration < 20);

  // 3. Sessões muito próximas no tempo (sem descanso adequado)
  const intervalos = [];
  for (let i = 1; i < ultimas3.length; i++) {
    const intervalo = (ultimas3[i].startTime - ultimas3[i - 1].startTime) / (1000 * 60);
    intervalos.push(intervalo);
  }
  const semDescanso = intervalos.some(i => i < 10); // Menos de 10min entre sessões

  return decrescendo || todasCurtas || semDescanso;
}

/**
 * Sugere cor adaptativa para elementos específicos
 */
export function sugerirCorElemento(
  elemento: 'botao' | 'texto' | 'borda',
  ambiente: AmbienteAdaptativo
): string {
  switch (elemento) {
    case 'botao':
      return ambiente.corMandala;
    case 'texto':
      // Garantir contraste mínimo
      return '#F5F5F5';
    case 'borda':
      return `${ambiente.corMandala}33`; // 20% opacity
    default:
      return ambiente.corMandala;
  }
}

/**
 * Calcula velocidade de animação da mandala baseada em energia
 */
export function calcularVelocidadeMandala(nivelEnergia: 'alta' | 'media' | 'baixa'): number {
  const velocidades = {
    alta: 1.0,   // Velocidade normal
    media: 0.8,  // 20% mais lenta
    baixa: 0.6,  // 40% mais lenta
  };

  return velocidades[nivelEnergia];
}

