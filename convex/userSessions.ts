import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation para iniciar uma nova sessão
export const iniciarSessao = mutation({
  args: {
    presetAtivo: v.string(),
    duracaoMinutos: v.number(),
    idioma: v.string(),
    device: v.string(),
    userId: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("user_sessions", {
      userId: args.userId || null,
      presetAtivo: args.presetAtivo,
      duracaoMinutos: args.duracaoMinutos,
      iniciadoEm: Date.now(),
      pausas: 0,
      interacoes: {
        botaoPlay: 1,
        botaoPause: 0,
        botaoReset: 0,
      },
      idioma: args.idioma,
      device: args.device,
    });
    
    console.log("[Convex] Sessão iniciada:", sessionId);
    return sessionId;
  },
});

// Mutation para finalizar uma sessão
export const finalizarSessao = mutation({
  args: {
    sessionId: v.id("user_sessions"),
    pausas: v.number(),
    interacoes: v.object({
      botaoPlay: v.number(),
      botaoPause: v.number(),
      botaoReset: v.number(),
    }),
    sentimento: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      finalizadoEm: Date.now(),
      pausas: args.pausas,
      interacoes: args.interacoes,
      sentimento: args.sentimento,
    });
    
    console.log("[Convex] Sessão finalizada:", args.sessionId);
    return { ok: true };
  },
});

// Query para listar sessões
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("user_sessions").order("desc").collect();
  },
});

// Query para análise de padrões e adaptação da IA
export const analisarPadroes = query({
  args: {
    userId: v.union(v.string(), v.null()),
  },
  handler: async (ctx) => {
    // Buscar sessões recentes (últimos 7 dias)
    const seteDiasAtras = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const todasSessoes = await ctx.db.query("user_sessions").collect();
    const sessoes = todasSessoes.filter(s => s.iniciadoEm >= seteDiasAtras);
    
    if (sessoes.length === 0) {
      return {
        tendencia: "media" as const,
        estilo: "leve" as const,
        sugestaoCor: "#2ECC71",
        ritmo: 25, // minutos padrão
      };
    }

    // Calcular métricas
    const sessoesFinalizadas = sessoes.filter(s => s.finalizadoEm);
    const taxaConclusao = sessoesFinalizadas.length / sessoes.length;
    const mediaDuracao = sessoes.reduce((sum, s) => sum + s.duracaoMinutos, 0) / sessoes.length;
    const mediaPausas = sessoes.reduce((sum, s) => sum + s.pausas, 0) / sessoes.length;
    const frequenciaUso = sessoes.length / 7; // sessões por dia
    
    // Determinar tendência de foco
    let tendencia: "alta" | "media" | "baixa";
    if (taxaConclusao >= 0.8 && mediaDuracao >= 40) {
      tendencia = "alta";
    } else if (taxaConclusao >= 0.5 && mediaDuracao >= 25) {
      tendencia = "media";
    } else {
      tendencia = "baixa";
    }
    
    // Determinar estilo de uso
    let estilo: "intenso" | "leve" | "ritualistico";
    if (frequenciaUso >= 3 && mediaDuracao >= 45) {
      estilo = "intenso";
    } else if (frequenciaUso < 1.5) {
      estilo = "leve";
    } else {
      estilo = "ritualistico";
    }
    
    // Sugerir cor baseada em tendência
    const sugestaoCor = tendencia === "alta" 
      ? "#FFD700"  // Dourado para alta performance
      : tendencia === "media" 
        ? "#2ECC71"  // Verde para equilíbrio
        : "#9B59B6"; // Roxo para relaxamento
    
    // Calcular ritmo ideal (intervalo de micro-pausas)
    const ritmo = mediaPausas > 2 
      ? Math.max(15, mediaDuracao - 10)  // Mais pausas = ciclos mais curtos
      : Math.min(60, mediaDuracao + 5);   // Poucas pausas = pode estender
    
    return {
      tendencia,
      estilo,
      sugestaoCor,
      ritmo: Math.round(ritmo),
    };
  },
});

// Query para detectar emoção da sessão atual
export const detectarEmocao = query({
  args: {
    sessionId: v.union(v.id("user_sessions"), v.null()),
    tempo: v.number(), // em minutos
    pausas: v.number(),
  },
  handler: async (ctx, args) => {
    let emocao: "disperso" | "centrado" | "neutro";
    let cor: string;
    let pulsacao: number;

    // Algoritmo de inferência emocional
    if (args.pausas > 3 && args.tempo < 15) {
      emocao = "disperso";
      cor = "#00C2FF"; // Azul ciano - dispersão
      pulsacao = 0.8; // Alta vibração visual
    } else if (args.tempo >= 25 && args.pausas <= 1) {
      emocao = "centrado";
      cor = "#FFD700"; // Dourado - centramento
      pulsacao = 0.3; // Baixa vibração, estado calmo
    } else {
      emocao = "neutro";
      cor = "#2ECC71"; // Verde - equilíbrio
      pulsacao = 0.5; // Vibração moderada
    }

    // Se tiver sessionId, buscar dados da sessão real
    if (args.sessionId) {
      try {
        const sessao = await ctx.db.get(args.sessionId);
        if (sessao && sessao.finalizadoEm) {
          const duracaoReal = sessao.duracaoMinutos;
          const pausasReais = sessao.pausas;
          
          // Recalcular baseado nos dados reais
          if (pausasReais > 3 && duracaoReal < 15) {
            emocao = "disperso";
            cor = "#00C2FF";
            pulsacao = 0.8;
          } else if (duracaoReal >= 25 && pausasReais <= 1) {
            emocao = "centrado";
            cor = "#FFD700";
            pulsacao = 0.3;
          } else {
            emocao = "neutro";
            cor = "#2ECC71";
            pulsacao = 0.5;
          }
        }
      } catch (error) {
        // Se não encontrar a sessão, usar os valores passados
        console.error("Sessão não encontrada:", error);
      }
    }

    return {
      emocao,
      cor,
      pulsacao,
    };
  },
});

