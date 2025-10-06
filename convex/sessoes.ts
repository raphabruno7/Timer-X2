import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const registrar = mutation({
  args: {
    preset: v.string(),
    duracao: v.number(),
    resultadoIA: v.optional(v.string()),
    humor: v.optional(v.string()),
    energiaAntes: v.optional(v.string()),
    energiaDepois: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sessions", {
      ...args,
      timestamp: Date.now(),
    });
    return { ok: true };
  },
});

export const listar = query({
  args: {},
  handler: async (ctx) => {
    const dados = await ctx.db.query("sessions").collect();
    return dados.sort((a, b) => b.timestamp - a.timestamp);
  },
});

// Query para obter insights do histórico
export const obterInsights = query({
  args: {},
  handler: async (ctx) => {
    const sessoes = await ctx.db.query("sessions").collect();
    
    if (sessoes.length === 0) {
      return {
        totalSessoes: 0,
        tempoTotal: 0,
        presetMaisUsado: null,
        humorDominante: null,
      };
    }

    // Calcular métricas
    const totalSessoes = sessoes.length;
    const tempoTotal = sessoes.reduce((acc, s) => acc + s.duracao, 0);
    
    // Contar presets
    const presetCounts: Record<string, number> = {};
    sessoes.forEach(s => {
      presetCounts[s.preset] = (presetCounts[s.preset] || 0) + 1;
    });
    
    const presetMaisUsado = Object.entries(presetCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    
    // Contar humores
    const humorCounts: Record<string, number> = {};
    sessoes.forEach(s => {
      if (s.humor) {
        humorCounts[s.humor] = (humorCounts[s.humor] || 0) + 1;
      }
    });
    
    const humorDominante = Object.entries(humorCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    
    return {
      totalSessoes,
      tempoTotal: Math.floor(tempoTotal / 60), // em minutos
      presetMaisUsado,
      humorDominante,
    };
  },
});

