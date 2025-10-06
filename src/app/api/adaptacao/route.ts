/**
 * API Route para adaptação contextual silenciosa
 * Recebe logs de sessões e retorna ajustes da IA
 */

import { NextRequest, NextResponse } from "next/server";
import { analisarPadraoUsuario, type SessionLog } from "@/lib/adaptacaoAI";

export async function POST(request: NextRequest) {
  try {
    const { logs } = await request.json();

    // Validar payload
    if (!logs || !Array.isArray(logs)) {
      return NextResponse.json(
        { error: "Invalid payload: logs must be an array" },
        { status: 400 }
      );
    }

    if (logs.length === 0) {
      return NextResponse.json(
        { error: "No logs provided" },
        { status: 400 }
      );
    }

    console.info('[API Adaptação] 🧠 Recebendo análise...', {
      sessoes: logs.length,
    });

    // Analisar padrões
    const ajustes = await analisarPadraoUsuario(logs as SessionLog[]);

    if (!ajustes) {
      return NextResponse.json(
        { error: "Failed to generate adjustments" },
        { status: 500 }
      );
    }

    console.info('[API Adaptação] ✅ Ajustes gerados');

    return NextResponse.json({ ajustes });

  } catch (error) {
    console.error('[API Adaptação] Erro:', error);
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

