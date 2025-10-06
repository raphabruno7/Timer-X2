import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    // Conectar ao Convex
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("CONVEX_URL not configured");
    }

    const client = new ConvexHttpClient(convexUrl);
    
    // Chamar função analisarPadroes
    const resultado = await client.query(api.userSessions.analisarPadroes, {
      userId: userId || null,
    });

    console.info("[IA Adaptativa] Padrões analisados:", resultado);

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("[IA Adaptativa] Erro:", error);
    
    // Retornar valores padrão em caso de erro
    return NextResponse.json({
      tendencia: "media",
      estilo: "leve",
      sugestaoCor: "#2ECC71",
      ritmo: 25,
    });
  }
}

