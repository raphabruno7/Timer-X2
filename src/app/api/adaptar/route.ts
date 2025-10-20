import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export async function POST(request: NextRequest) {
  try {
    // Parse body de forma defensiva: pode vir vazio ou malformado
    let userId: string | null = null;
    try {
      if (request.headers.get("content-type")?.includes("application/json")) {
        const body = await request.json();
        userId = (body?.userId as string | undefined) ?? null;
      }
    } catch {
      userId = null;
    }

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

// Suporte opcional a GET para facilitar testes locais sem body
export async function GET() {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("CONVEX_URL not configured");
    }

    const client = new ConvexHttpClient(convexUrl);
    const resultado = await client.query(api.userSessions.analisarPadroes, {
      userId: null,
    });
    return NextResponse.json(resultado);
  } catch (error) {
    console.error("[IA Adaptativa][GET] Erro:", error);
    return NextResponse.json({
      tendencia: "media",
      estilo: "leve",
      sugestaoCor: "#2ECC71",
      ritmo: 25,
    });
  }
}

