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

// Query para análise de padrões
export const analisarPadroes = query({
  args: {},
  handler: async (ctx) => {
    const sessoes = await ctx.db.query("user_sessions").collect();
    
    if (sessoes.length === 0) {
      return {
        totalSessoes: 0,
        tempoTotalMinutos: 0,
        taxaConclusao: 0,
        mediaInteracoes: 0,
      };
    }

    const sessoesFinalizadas = sessoes.filter(s => s.finalizadoEm);
    const totalSessoes = sessoes.length;
    const tempoTotalMinutos = sessoes.reduce((sum, s) => sum + s.duracaoMinutos, 0);
    const taxaConclusao = (sessoesFinalizadas.length / totalSessoes) * 100;
    
    const totalInteracoes = sessoes.reduce((sum, s) => 
      sum + s.interacoes.botaoPlay + s.interacoes.botaoPause + s.interacoes.botaoReset, 0
    );
    const mediaInteracoes = totalInteracoes / totalSessoes;

    return {
      totalSessoes,
      tempoTotalMinutos,
      taxaConclusao: Math.round(taxaConclusao),
      mediaInteracoes: Math.round(mediaInteracoes * 10) / 10,
      presetsPopulares: sessoes
        .reduce((acc: Record<string, number>, s) => {
          acc[s.presetAtivo] = (acc[s.presetAtivo] || 0) + 1;
          return acc;
        }, {}),
    };
  },
});

