/**
 * Sistema de Som Sincronizado com Timer
 * Gera tons meditativos baseados nos 5 elementos
 * Uso: Web Audio API para síntese de áudio em tempo real
 */

// Configuração de volume global (0 a 1)
let volumeGeral = 0.5;

// Contexto de áudio (inicializado sob demanda)
let audioContext: AudioContext | null = null;

// Mapeamento de elementos para frequências (em Hz)
const frequenciasElementos: Record<string, number> = {
  terra: 60,    // Tom grave - enraizamento
  agua: 432,    // Tom médio - fluidez e harmonia
  fogo: 528,    // Tom agudo - energia e transformação
  ar: 800,      // Sino cristalino - clareza mental
  eter: 1080,   // Harmônico alto - conexão espiritual
};

// Duração padrão dos sons (em segundos)
const duracoes = {
  inicio: 0.8,     // Som de início rápido
  ciclo: 0.3,      // Som de ciclo mais curto
  fim: 1.5,        // Som de fim mais longo e celebratório
};

/**
 * Inicializa o AudioContext (chamado apenas uma vez, quando necessário)
 */
function inicializarAudioContext(): AudioContext {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    } else {
      throw new Error('AudioContext não suportado neste navegador');
    }
  }
  return audioContext;
}

/**
 * Toca um tom puro com a frequência especificada
 * @param frequencia - Frequência em Hz
 * @param duracao - Duração do som em segundos
 * @param envelope - Configuração de envelope ADSR (attack, decay, sustain, release)
 */
function tocarTom(
  frequencia: number,
  duracao: number,
  envelope: { attack: number; decay: number; sustain: number; release: number } = {
    attack: 0.05,
    decay: 0.1,
    sustain: 0.7,
    release: 0.2,
  }
) {
  try {
    const ctx = inicializarAudioContext();
    const now = ctx.currentTime;

    // Criar oscilador (gerador de tom)
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine'; // Onda senoidal para tom puro e suave
    oscillator.frequency.value = frequencia;

    // Criar ganho (controle de volume)
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;

    // Conectar oscilador -> ganho -> saída
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Aplicar envelope ADSR
    const { attack, decay, sustain, release } = envelope;
    const peakVolume = volumeGeral;
    const sustainVolume = peakVolume * sustain;

    // Attack: subida rápida
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(peakVolume, now + attack);

    // Decay: descida para sustain
    gainNode.gain.linearRampToValueAtTime(sustainVolume, now + attack + decay);

    // Sustain: mantém volume
    gainNode.gain.setValueAtTime(sustainVolume, now + duracao - release);

    // Release: fade out
    gainNode.gain.linearRampToValueAtTime(0, now + duracao);

    // Iniciar e parar oscilador
    oscillator.start(now);
    oscillator.stop(now + duracao);

    console.info(`[Som Sincronizado] 🎵 Tocando ${frequencia}Hz por ${duracao}s (volume: ${volumeGeral})`);
  } catch (error) {
    console.error('[Som Sincronizado] Erro ao tocar tom:', error);
  }
}

/**
 * Toca acorde (múltiplas frequências simultâneas)
 * @param frequencias - Array de frequências em Hz
 * @param duracao - Duração do som em segundos
 */
function tocarAcorde(frequencias: number[], duracao: number) {
  frequencias.forEach((freq) => {
    tocarTom(freq, duracao, {
      attack: 0.1,
      decay: 0.15,
      sustain: 0.6,
      release: 0.3,
    });
  });
}

/**
 * Obtém a frequência do elemento atual
 * @param elemento - Nome do elemento (terra, agua, fogo, ar, eter)
 * @returns Frequência em Hz
 */
function obterFrequencia(elemento: string): number {
  const elementoLower = elemento.toLowerCase();
  return frequenciasElementos[elementoLower] || frequenciasElementos.terra;
}

/**
 * Toca som de início de sessão
 * Som ascendente e energizante
 * @param elemento - Elemento atual do ciclo vital
 */
export function tocarSomInicio(elemento: string) {
  const freq = obterFrequencia(elemento);
  
  // Tom principal + harmônico superior (oitava acima)
  tocarTom(freq, duracoes.inicio, {
    attack: 0.05,
    decay: 0.15,
    sustain: 0.7,
    release: 0.2,
  });
  
  // Harmônico (5ª justa acima = freq * 1.5)
  setTimeout(() => {
    tocarTom(freq * 1.5, duracoes.inicio * 0.8, {
      attack: 0.08,
      decay: 0.12,
      sustain: 0.6,
      release: 0.25,
    });
  }, 100);

  console.info(`[Som Sincronizado] ▶️  Início de sessão (${elemento})`);
}

/**
 * Toca som de ciclo (marcador a cada minuto)
 * Som curto e discreto
 * @param elemento - Elemento atual do ciclo vital
 */
export function tocarSomCiclo(elemento: string) {
  const freq = obterFrequencia(elemento);
  
  // Tom curto e suave
  tocarTom(freq, duracoes.ciclo, {
    attack: 0.02,
    decay: 0.05,
    sustain: 0.5,
    release: 0.15,
  });

  console.info(`[Som Sincronizado] ⏱️  Marcador de ciclo (${elemento})`);
}

/**
 * Toca som de finalização de sessão
 * Som celebratório e harmonioso
 * @param elemento - Elemento atual do ciclo vital
 */
export function tocarSomFim(elemento: string) {
  const freq = obterFrequencia(elemento);
  
  // Acorde triunfal: fundamental + terça maior + quinta justa
  const acorde = [
    freq,              // Fundamental
    freq * 1.25,       // Terça maior
    freq * 1.5,        // Quinta justa
  ];
  
  tocarAcorde(acorde, duracoes.fim);

  console.info(`[Som Sincronizado] ✅ Fim de sessão (${elemento})`);
}

/**
 * Define o volume global dos sons
 * @param volume - Valor entre 0 (mudo) e 1 (máximo)
 */
export function setVolume(volume: number) {
  volumeGeral = Math.max(0, Math.min(1, volume));
  console.info(`[Som Sincronizado] 🔊 Volume ajustado: ${Math.round(volumeGeral * 100)}%`);
}

/**
 * Obtém o volume atual
 * @returns Volume entre 0 e 1
 */
export function getVolume(): number {
  return volumeGeral;
}

/**
 * Toca som de teste para o elemento especificado
 * Útil para preview dos sons
 * @param elemento - Elemento a testar
 */
export function testarSom(elemento: string) {
  const freq = obterFrequencia(elemento);
  console.info(`[Som Sincronizado] 🔊 Testando som: ${elemento} (${freq}Hz)`);
  tocarTom(freq, 1.0, {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.6,
    release: 0.3,
  });
}
