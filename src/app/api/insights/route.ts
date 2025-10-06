import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const { usageHistory } = await request.json();

    // Validar payload
    if (!usageHistory || !Array.isArray(usageHistory)) {
      return NextResponse.json(
        { error: "Invalid payload: usageHistory must be an array" },
        { status: 400 }
      );
    }

    // Validar API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Inicializar cliente OpenAI
    const openai = new OpenAI({
      apiKey,
    });

    // Montar prompt de análise
    const systemPrompt = `Você é uma IA sensível que interpreta padrões de foco humano.
Analise os seguintes dados de uso e descreva padrões sutis de energia, tempo e consistência.
Retorne apenas ajustes internos, nunca recomendações diretas ao usuário.

Estrutura esperada de retorno (JSON):
{
  "adjustments": {
    "palette": {
      "primary": "#HEXCOLOR",
      "accent": "#HEXCOLOR"
    },
    "tempoModifier": number (0.95 a 1.05),
    "mandalaVariance": "calm" | "default" | "vivid"
  }
}`;

    const userPrompt = `Histórico recente de uso:
${usageHistory
        ?.slice(-20)
        ?.map((item: { preset: string; duration: number; startedAt: number }, index: number) => {
          const data = new Date(item.startedAt);
          return `Sessão ${index + 1}: preset "${item.preset}", duração ${item.duration} min, iniciado em ${data.toISOString()}`;
        })
        ?.join("\n") || "Sem dados disponíveis"}

Analise o comportamento de uso acima e retorne ajustes sutis que harmonizem o app com o padrão do usuário.
Considere:
- Frequência e duração das sessões
- Tipos de presets escolhidos
- Horários de uso
- Consistência ao longo do tempo

Retorne apenas JSON válido com a chave 'adjustments'.`;

    // Chamar OpenAI com gpt-4-turbo
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 500,
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content from OpenAI");
    }

    const parsed = JSON.parse(content);
    
    console.info("[Insights IA] Ajustes gerados:", parsed);
    
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[Insights] Error:", error);

    return NextResponse.json({
      adjustments: {
        palette: {
          primary: "#2ECC71",
          accent: "#FFD700",
        },
        tempoModifier: 1,
        mandalaVariance: "default",
      },
    });
  }
}
