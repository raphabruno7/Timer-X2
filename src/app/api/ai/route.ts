import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { presetName, duration } = await request.json();

    // Validar API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Preparar mensagens
    const systemPrompt = "Você é um coach de foco holístico. Ao final de uma sessão, ofereça uma frase curta de encorajamento baseada no preset e duração.";
    const userMessage = `Sessão concluída:\n- Preset: ${presetName}\n- Duração: ${Math.floor(duration / 60)} minutos\n\nDê uma mensagem motivacional curta (máximo 15 palavras).`;

    // Chamar OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 50,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content || "Parabéns pelo foco! Continue assim! 🌿";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error in AI route:", error);
    return NextResponse.json(
      { message: "Parabéns pelo foco! Continue assim! 🌿" }, // Fallback message
      { status: 200 }
    );
  }
}

