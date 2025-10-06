/**
 * Sistema de Adaptação Contextual Silenciosa
 * A IA observa padrões de uso e ajusta parâmetros sutilmente,
 * sem emitir mensagens ou recomendações diretas ao usuário.
 */

import OpenAI from "openai";

// Cliente OpenAI configurado
const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Interface para logs de sessão
 */
export interface SessionLog {
  duracao: number;      // Em minutos
  emocao: string;       // 'neutra' | 'alegria' | 'calma' | 'cansaço'
  data: number;         // Timestamp
  progresso?: number;   // 0-1
  pausas?: number;      // Quantidade de pausas
}

/**
 * Interface para ajustes retornados pela IA
 */
export interface AjustesIA {
  corBase?: string;           // Cor HSL ou HEX
  intensidadeLuz?: number;    // 0-1
  velocidadePulsar?: number;  // Multiplicador (0.5-2.0)
  frequenciaSom?: number;     // Hz (216, 432, etc)
  velocidadeRotacao?: number; // Multiplicador (0.5-2.0)
  saturacao?: number;         // 0-1
  brilho?: number;            // 0-1
  cicloRespiracao?: number;   // Segundos (6-12)
}

/**
 * Analisa padrões de uso do usuário e retorna ajustes sutis
 * Não envia mensagens ao usuário - apenas dados de ajuste interno
 * 
 * @param logs - Array de logs de sessões recentes (últimas 5-10 sessões)
 * @returns Objeto com ajustes ou null em caso de erro
 */
export async function analisarPadraoUsuario(logs: SessionLog[]): Promise<AjustesIA | null> {
  try {
    // Validação básica
    if (!logs || logs.length === 0) {
      console.warn('[Adaptação IA] Sem logs disponíveis');
      return null;
    }

    // Verificar se API key está configurada
    if (!process.env.OPENAI_API_KEY) {
      console.warn('[Adaptação IA] OpenAI API key não configurada');
      return null;
    }

    // Preparar resumo dos dados para a IA
    const resumo = logs.map(l => ({
      duracao: l.duracao,
      emocao: l.emocao,
      data: new Date(l.data).toLocaleDateString(),
      hora: new Date(l.data).getHours(),
      progresso: l.progresso || 1,
      pausas: l.pausas || 0,
    }));

    // Calcular estatísticas básicas
    const duracaoMedia = logs.reduce((acc, l) => acc + l.duracao, 0) / logs.length;
    const emocoesFrequentes = logs.reduce((acc: Record<string, number>, l) => {
      acc[l.emocao] = (acc[l.emocao] || 0) + 1;
      return acc;
    }, {});
    const emocaoDominante = Object.entries(emocoesFrequentes).sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutra';

    // Prompt para a IA (sistema de percepção silencioso)
    const systemPrompt = `Você é um sistema de percepção emocional e rítmica para um timer meditativo.
Analise padrões de uso e retorne APENAS ajustes técnicos sutis (JSON puro).
NÃO envie mensagens, conselhos ou recomendações diretas ao usuário.
NUNCA use markdown ou explicações - apenas JSON válido.

Regras:
- corBase: cor HSL (ex: "hsl(145, 70%, 55%)") baseada na emoção dominante
- intensidadeLuz: 0.5-1.0 (mais baixo para cansaço, mais alto para alegria)
- velocidadePulsar: 0.7-1.3 (mais lento para calma, mais rápido para energia)
- frequenciaSom: 216, 432 ou 528 Hz (mais grave para relaxamento)
- velocidadeRotacao: 0.7-1.5 (harmonia com o ritmo do usuário)
- saturacao: 0.6-1.0 (mais baixa para fadiga)
- brilho: 0.6-1.2 (adaptado ao padrão emocional)
- cicloRespiracao: 6-12 segundos (mais longo para usuários calmos)

Retorne APENAS o JSON, sem explicações:
{
  "corBase": "hsl(h, s%, l%)",
  "intensidadeLuz": number,
  "velocidadePulsar": number,
  "frequenciaSom": number,
  "velocidadeRotacao": number,
  "saturacao": number,
  "brilho": number,
  "cicloRespiracao": number
}`;

    const userPrompt = `Padrão de uso:
${JSON.stringify(resumo, null, 2)}

Estatísticas:
- Duração média: ${Math.round(duracaoMedia)}min
- Emoção dominante: ${emocaoDominante}
- Total de sessões: ${logs.length}

Retorne ajustes sutis em JSON puro.`;

    console.info('[Adaptação IA] 🧠 Analisando padrões...', {
      sessoes: logs.length,
      duracaoMedia: `${Math.round(duracaoMedia)}min`,
      emocaoDominante,
    });

    // Chamar OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      console.warn('[Adaptação IA] Resposta vazia da OpenAI');
      return null;
    }

    // Parse da resposta
    const ajustes: AjustesIA = JSON.parse(content);

    // Validar e sanitizar ajustes
    const ajustesSanitizados: AjustesIA = {
      corBase: ajustes.corBase,
      intensidadeLuz: Math.max(0.5, Math.min(1.0, ajustes.intensidadeLuz || 0.8)),
      velocidadePulsar: Math.max(0.7, Math.min(1.3, ajustes.velocidadePulsar || 1.0)),
      frequenciaSom: [216, 432, 528].includes(ajustes.frequenciaSom || 432) ? ajustes.frequenciaSom : 432,
      velocidadeRotacao: Math.max(0.7, Math.min(1.5, ajustes.velocidadeRotacao || 1.0)),
      saturacao: Math.max(0.6, Math.min(1.0, ajustes.saturacao || 0.9)),
      brilho: Math.max(0.6, Math.min(1.2, ajustes.brilho || 1.0)),
      cicloRespiracao: Math.max(6, Math.min(12, ajustes.cicloRespiracao || 8)),
    };

    console.info('[Adaptação IA] ✅ Ajustes gerados:', ajustesSanitizados);

    return ajustesSanitizados;

  } catch (error) {
    console.error('[Adaptação IA] Erro ao analisar padrão:', error);
    return null;
  }
}

/**
 * Retorna ajustes padrão seguros (fallback)
 */
export function ajustesPadrao(): AjustesIA {
  return {
    corBase: 'hsl(145, 70%, 55%)',
    intensidadeLuz: 0.8,
    velocidadePulsar: 1.0,
    frequenciaSom: 432,
    velocidadeRotacao: 1.0,
    saturacao: 0.9,
    brilho: 1.0,
    cicloRespiracao: 8,
  };
}

