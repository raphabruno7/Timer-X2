import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { usageHistory } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `Você é uma inteligência adaptativa silenciosa. Analise padrões de uso do Timer X2 e retorne ajustes internos sutis (paleta, ritmo, animações) que ajudem o app a se harmonizar com o usuário sem que ele perceba recomendações.`;
    const userPrompt = `Histórico recente de uso:
${usageHistory
        ?.slice(-20)
        ?.map((item: { preset: string; duration: number; startedAt: number }, index: number) => `Sessão ${index + 1}: preset ${item.preset}, duração ${item.duration} minutos, iniciado em ${new Date(item.startedAt).toISOString()}`)
        ?.join("\n") || "Sem dados"}

Analise o comportamento de uso e descreva padrões sutis de foco.
Responda com sugestões de ajuste interno (nunca diretas para o usuário).
Retorne apenas JSON válido com chave 'adjustments'.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content from OpenAI");
    }

    const parsed = JSON.parse(content);
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
