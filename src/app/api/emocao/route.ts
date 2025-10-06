import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, tempo, pausas } = await request.json();

    // Conectar ao Convex
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("CONVEX_URL not configured");
    }

    const client = new ConvexHttpClient(convexUrl);
    
    // Chamar função detectarEmocao
    const resultado = await client.query(api.userSessions.detectarEmocao, {
      sessionId: sessionId || null,
      tempo: tempo || 0,
      pausas: pausas || 0,
    });

    console.info("[Emoção detectada]:", resultado);

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("[Detecção Emocional] Erro:", error);
    
    // Retornar valores padrão em caso de erro
    return NextResponse.json({
      emocao: "neutro",
      cor: "#2ECC71",
      pulsacao: 0.5,
    });
  }
}

