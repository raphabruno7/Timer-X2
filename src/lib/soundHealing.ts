/**
 * Sound Healing Library
 * Frequências terapêuticas baseadas em afinação 432Hz
 * para sincronização com modo de respiração da Mandala
 */

/**
 * Toca um som harmônico sincronizado com a fase da respiração
 * 
 * @param fase - 'inspirar' (432Hz) ou 'expirar' (216Hz - uma oitava abaixo)
 * @returns Promise que resolve quando o som termina
 */
export async function tocarSomRespiracao(fase: 'inspirar' | 'expirar'): Promise<void> {
  try {
    // Criar contexto de áudio (com fallback para Safari)
    const AudioContextClass = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('AudioContext não suportado');
    }
    const audioCtx = new AudioContextClass();
    
    // Criar oscilador (gerador de frequência)
    const osc = audioCtx.createOscillator();
    
    // Criar controle de ganho (volume)
    const gain = audioCtx.createGain();
    
    // Configurar frequências baseadas em 432Hz (afinação natural)
    // Inspirar: 432Hz (nota A4 - frequência harmônica da natureza)
    // Expirar: 216Hz (uma oitava abaixo - mais grave e relaxante)
    osc.frequency.value = fase === 'inspirar' ? 432 : 216;
    
    // Configurar volume (inspirar mais alto, expirar mais suave)
    const volume = fase === 'inspirar' ? 0.2 : 0.1;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    
    // Fade out suave nos últimos 0.5s
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);
    
    // Tipo de onda: senoidal (mais suave e pura)
    osc.type = 'sine';
    
    // Conectar oscilador → ganho → saída
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Iniciar som
    osc.start(audioCtx.currentTime);
    
    // Parar após 2.5s (duração curta e não invasiva)
    osc.stop(audioCtx.currentTime + 2.5);
    
    // Aguardar conclusão
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Fechar contexto para liberar recursos
    await audioCtx.close();
    
  } catch (error) {
    // Silenciosamente ignorar erros (ex: navegador não suporta Web Audio API)
    console.warn('[Sound Healing] Erro ao tocar som:', error);
  }
}

/**
 * Toca sons binaurais para relaxamento profundo (expansão futura)
 * 
 * @param frequenciaBase - Frequência base em Hz
 * @param diferenca - Diferença entre ouvido esquerdo e direito
 */
export async function tocarSomBinaural(frequenciaBase: number = 432, diferenca: number = 4): Promise<void> {
  try {
    const AudioContextClass = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('AudioContext não suportado');
    }
    const audioCtx = new AudioContextClass();
    
    // Criar dois osciladores (um para cada ouvido)
    const oscLeft = audioCtx.createOscillator();
    const oscRight = audioCtx.createOscillator();
    
    // Criar panner para separar canais
    const pannerLeft = audioCtx.createStereoPanner();
    const pannerRight = audioCtx.createStereoPanner();
    
    // Posicionar no espaço estéreo
    pannerLeft.pan.value = -1; // Esquerda total
    pannerRight.pan.value = 1; // Direita total
    
    // Controle de ganho
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 5);
    
    // Configurar frequências (diferença cria batimento binaural)
    oscLeft.frequency.value = frequenciaBase;
    oscRight.frequency.value = frequenciaBase + diferenca; // Ex: 432Hz e 436Hz = 4Hz theta
    
    oscLeft.type = 'sine';
    oscRight.type = 'sine';
    
    // Conectar circuito de áudio
    oscLeft.connect(pannerLeft);
    oscRight.connect(pannerRight);
    pannerLeft.connect(gain);
    pannerRight.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Iniciar
    oscLeft.start(audioCtx.currentTime);
    oscRight.start(audioCtx.currentTime);
    
    // Parar após 6s
    oscLeft.stop(audioCtx.currentTime + 6);
    oscRight.stop(audioCtx.currentTime + 6);
    
    await new Promise(resolve => setTimeout(resolve, 6000));
    await audioCtx.close();
    
  } catch (error) {
    console.warn('[Sound Healing] Erro ao tocar som binaural:', error);
  }
}

/**
 * Verifica se o navegador suporta Web Audio API
 */
export function suportaSomTerapeutico(): boolean {
  return !!(window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
}

