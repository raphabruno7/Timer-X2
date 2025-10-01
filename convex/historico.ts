import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation para registrar uso de um preset
export const registrarUso = mutation({
  args: {
    presetId: v.id("presets"),
    duracao: v.number(),
  },
  handler: async (ctx, args) => {
    const historicoId = await ctx.db.insert("historico", {
      presetId: args.presetId,
      usadoEm: Date.now(),
      duracao: args.duracao,
    });
    return historicoId;
  },
});

// Query para listar histórico de uso
export const listarHistorico = query({
  args: {
    presetId: v.optional(v.id("presets")),
  },
  handler: async (ctx, args) => {
    if (args.presetId) {
      // Se presetId informado, retorna apenas daquele preset
      return await ctx.db
        .query("historico")
        .withIndex("by_preset", (q) => q.eq("presetId", args.presetId!))
        .order("desc")
        .collect();
    } else {
      // Senão, retorna todos ordenados por usadoEm decrescente
      return await ctx.db
        .query("historico")
        .order("desc")
        .collect();
    }
  },
});

// Query para obter estatísticas de um preset
export const obterEstatisticas = query({
  args: {
    presetId: v.id("presets"),
  },
  handler: async (ctx, args) => {
    const historicos = await ctx.db
      .query("historico")
      .withIndex("by_preset", (q) => q.eq("presetId", args.presetId))
      .collect();

    const totalUsos = historicos.length;
    const totalDuracao = historicos.reduce((sum, h) => sum + h.duracao, 0);
    const ultimoUso = historicos.length > 0 ? Math.max(...historicos.map(h => h.usadoEm)) : null;

    return {
      totalUsos,
      totalDuracao,
      ultimoUso,
      duracaoMedia: totalUsos > 0 ? Math.round(totalDuracao / totalUsos) : 0,
    };
  },
});

// Query para estatísticas gerais
export const estatisticas = query({
  args: {},
  handler: async (ctx) => {
    const historicos = await ctx.db.query("historico").collect();
    
    // Se não houver registros, retornar valores zerados
    if (historicos.length === 0) {
      return {
        totalMinutosFocados: 0,
        presetMaisUsado: "-",
        totalSessoes: 0,
      };
    }

    // Calcular total de minutos focados (duracao está em segundos)
    const totalMinutosFocados = Math.round(
      historicos.reduce((sum, h) => sum + h.duracao, 0) / 60
    );

    // Calcular preset mais usado
    const contagemPorPreset = new Map();
    for (const historico of historicos) {
      const presetId = historico.presetId;
      contagemPorPreset.set(presetId, (contagemPorPreset.get(presetId) || 0) + 1);
    }

    // Encontrar o preset com maior contagem
    let presetMaisUsadoId = null;
    let maxContagem = 0;
    for (const [presetId, contagem] of contagemPorPreset.entries()) {
      if (contagem > maxContagem) {
        maxContagem = contagem;
        presetMaisUsadoId = presetId;
      }
    }

    // Buscar o nome do preset mais usado
    let nomePresetMaisUsado = "-";
    if (presetMaisUsadoId) {
      try {
        const preset = await ctx.db.get(presetMaisUsadoId);
        if (preset && 'nome' in preset) {
          nomePresetMaisUsado = preset.nome;
        } else {
          nomePresetMaisUsado = "Preset removido";
        }
      } catch {
        nomePresetMaisUsado = "Preset removido";
      }
    }

    return {
      totalMinutosFocados,
      presetMaisUsado: nomePresetMaisUsado,
      totalSessoes: historicos.length,
    };
  },
});

// Query para estatísticas por período
export const estatisticasPorPeriodo = query({
  args: {
    periodo: v.union(v.literal("hoje"), v.literal("semana"), v.literal("mes")),
  },
  handler: async (ctx, args) => {
    // Calcular timestamp de início baseado no período
    const agora = new Date();
    let inicioTimestamp: number;

    if (args.periodo === "hoje") {
      // Início do dia atual (00:00:00)
      const inicioDia = new Date(agora);
      inicioDia.setHours(0, 0, 0, 0);
      inicioTimestamp = inicioDia.getTime();
    } else if (args.periodo === "semana") {
      // Início da semana atual (segunda-feira 00:00:00)
      const inicioSemana = new Date(agora);
      const diaSemana = inicioSemana.getDay(); // 0 = domingo, 1 = segunda, etc
      const diasAteSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
      inicioSemana.setDate(inicioSemana.getDate() + diasAteSegunda);
      inicioSemana.setHours(0, 0, 0, 0);
      inicioTimestamp = inicioSemana.getTime();
    } else {
      // Início do mês atual (dia 1, 00:00:00)
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
      inicioMes.setHours(0, 0, 0, 0);
      inicioTimestamp = inicioMes.getTime();
    }

    // Buscar históricos do período
    const todosHistoricos = await ctx.db.query("historico").collect();
    const historicos = todosHistoricos.filter(h => h.usadoEm >= inicioTimestamp);
    
    // Se não houver registros, retornar valores zerados
    if (historicos.length === 0) {
      return {
        totalMinutosFocados: 0,
        presetMaisUsado: "-",
        totalSessoes: 0,
      };
    }

    // Calcular total de minutos focados (duracao está em segundos)
    const totalMinutosFocados = Math.round(
      historicos.reduce((sum, h) => sum + h.duracao, 0) / 60
    );

    // Calcular preset mais usado
    const contagemPorPreset = new Map();
    for (const historico of historicos) {
      const presetId = historico.presetId;
      contagemPorPreset.set(presetId, (contagemPorPreset.get(presetId) || 0) + 1);
    }

    // Encontrar o preset com maior contagem
    let presetMaisUsadoId = null;
    let maxContagem = 0;
    for (const [presetId, contagem] of contagemPorPreset.entries()) {
      if (contagem > maxContagem) {
        maxContagem = contagem;
        presetMaisUsadoId = presetId;
      }
    }

    // Buscar o nome do preset mais usado
    let nomePresetMaisUsado = "-";
    if (presetMaisUsadoId) {
      try {
        const preset = await ctx.db.get(presetMaisUsadoId);
        if (preset && 'nome' in preset) {
          nomePresetMaisUsado = preset.nome;
        } else {
          nomePresetMaisUsado = "Preset removido";
        }
      } catch {
        nomePresetMaisUsado = "Preset removido";
      }
    }

    return {
      totalMinutosFocados,
      presetMaisUsado: nomePresetMaisUsado,
      totalSessoes: historicos.length,
    };
  },
});
