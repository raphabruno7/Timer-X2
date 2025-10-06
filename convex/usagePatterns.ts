import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Registrar um novo padrão de uso
export const registrar = mutation({
  args: {
    userId: v.string(),
    preset: v.string(),
    startTime: v.number(),
    duration: v.number(),
    mood: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patternId = await ctx.db.insert("usagePatterns", {
      ...args,
      createdAt: Date.now(),
    });
    
    console.log("[Usage Patterns] Padrão registrado:", patternId);
    return patternId;
  },
});

// Listar últimos N padrões de uso de um usuário
export const listarRecentes = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const patterns = await ctx.db
      .query("usagePatterns")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
    
    return patterns;
  },
});

// Analisar padrões de uso e retornar estatísticas
export const analisarPadroes = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const patterns = await ctx.db
      .query("usagePatterns")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
    
    if (patterns.length === 0) {
      return {
        totalSessoes: 0,
        mediaDuracao: 0,
        horarioMaisFrequente: null,
        presetMaisUsado: null,
        moodDominante: null,
      };
    }
    
    // Calcular média de duração
    const totalDuracao = patterns.reduce((acc, p) => acc + p.duration, 0);
    const mediaDuracao = Math.round(totalDuracao / patterns.length);
    
    // Identificar horário mais frequente (agrupado por hora do dia)
    const horarios: Record<number, number> = {};
    patterns.forEach((p) => {
      const hora = new Date(p.startTime).getHours();
      horarios[hora] = (horarios[hora] || 0) + 1;
    });
    
    const horarioMaisFrequente = Object.entries(horarios)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    
    // Identificar preset mais usado
    const presets: Record<string, number> = {};
    patterns.forEach((p) => {
      presets[p.preset] = (presets[p.preset] || 0) + 1;
    });
    
    const presetMaisUsado = Object.entries(presets)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    
    // Identificar mood dominante
    const moods: Record<string, number> = {};
    patterns.forEach((p) => {
      if (p.mood) {
        moods[p.mood] = (moods[p.mood] || 0) + 1;
      }
    });
    
    const moodDominante = Object.entries(moods)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    
    return {
      totalSessoes: patterns.length,
      mediaDuracao,
      horarioMaisFrequente: horarioMaisFrequente ? `${horarioMaisFrequente}:00` : null,
      presetMaisUsado,
      moodDominante,
      distribuicaoHorarios: horarios,
      distribuicaoPresets: presets,
      distribuicaoMoods: moods,
    };
  },
});

// Obter insights sobre produtividade baseado em padrões
export const obterInsights = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Buscar últimos 30 dias
    const trintaDiasAtras = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    const todosPatterns = await ctx.db
      .query("usagePatterns")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    const patternsRecentes = todosPatterns.filter(
      (p) => p.createdAt >= trintaDiasAtras
    );
    
    if (patternsRecentes.length === 0) {
      return {
        mensagem: "Sem dados suficientes para gerar insights",
        totalSessoes: 0,
        tempoTotalMinutos: 0,
      };
    }
    
    const totalSessoes = patternsRecentes.length;
    const tempoTotalMinutos = patternsRecentes.reduce((acc, p) => acc + p.duration, 0);
    const mediaSessoesPorDia = totalSessoes / 30;
    const mediaDuracaoSessao = tempoTotalMinutos / totalSessoes;
    
    // Detectar tendência (últimos 7 dias vs 7 dias anteriores)
    const seteDiasAtras = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const quatorzeDiasAtras = Date.now() - (14 * 24 * 60 * 60 * 1000);
    
    const sessoesUltimos7 = patternsRecentes.filter(
      (p) => p.createdAt >= seteDiasAtras
    ).length;
    
    const sessoes7a14 = patternsRecentes.filter(
      (p) => p.createdAt >= quatorzeDiasAtras && p.createdAt < seteDiasAtras
    ).length;
    
    let tendencia: "crescente" | "estavel" | "decrescente";
    if (sessoesUltimos7 > sessoes7a14 * 1.2) {
      tendencia = "crescente";
    } else if (sessoesUltimos7 < sessoes7a14 * 0.8) {
      tendencia = "decrescente";
    } else {
      tendencia = "estavel";
    }
    
    return {
      totalSessoes,
      tempoTotalMinutos,
      mediaSessoesPorDia: Math.round(mediaSessoesPorDia * 10) / 10,
      mediaDuracaoSessao: Math.round(mediaDuracaoSessao),
      tendencia,
      sessoesUltimos7Dias: sessoesUltimos7,
      sessoes7a14Dias: sessoes7a14,
    };
  },
});

