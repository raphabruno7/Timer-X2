import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { preset, duracao, contexto } = await request.json();

    // Validar API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // System prompt
    const systemPrompt = `Você é um assistente holístico que analisa ritmos de foco e energia.
Com base no último ciclo, sugira qual modo ou preset é mais adequado agora (relaxamento, criatividade, respiração profunda, ou pausa curta).
Retorne sempre um JSON simples no formato: {"sugestao": "nomeDoModo", "descricao": "textoMotivacionalCurto"}.
A descrição deve ter no máximo 100 caracteres.`;

    // User message com contexto
    const userMessage = `Ciclo concluído:
- Preset: ${preset}
- Duração: ${duracao} minutos
- Ciclos concluídos hoje: ${contexto?.ciclosConcluidos || 1}
- Último mood: ${contexto?.ultimoMood || 'foco'}
- Energia atual: ${contexto?.energiaAtual || 'média'}

Sugira o próximo modo ideal e uma mensagem motivacional curta.`;

    // Chamar OpenAI API
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
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in response");
    }

    const resultado = JSON.parse(content);

    return NextResponse.json({
      sugestao: resultado.sugestao || "Pausa Curta",
      descricao: resultado.descricao || "Descanse um pouco antes do próximo ciclo.",
    });
  } catch (error) {
    console.error("Error in IA next mode route:", error);
    
    // Fallback inteligente
    return NextResponse.json({
      sugestao: "Respiração Profunda",
      descricao: "Sua mente esteve focada. Que tal 3 minutos de respiração?",
    }, { status: 200 });
  }
}

