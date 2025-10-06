/**
 * Convex mutations e queries para o Sistema Ciclo Vital
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Incrementa o contador de ciclos do usuário
 * Chamado quando um ciclo de timer é completado
 */
export const incrementarCiclo = mutation({
  args: {
    usuarioId: v.string(),
  },
  handler: async (ctx, args) => {
    // Buscar registro existente do usuário
    const registroExistente = await ctx.db
      .query("ciclos")
      .withIndex("by_usuario", (q) => q.eq("usuarioId", args.usuarioId))
      .first();

    if (registroExistente) {
      // Incrementar ciclo existente
      const novoTotal = registroExistente.totalCiclos + 1;
      const novoElemento = determinarElementoPorCiclos(novoTotal);

      await ctx.db.patch(registroExistente._id, {
        totalCiclos: novoTotal,
        ultimoElemento: novoElemento,
        ultimaAtualizacao: Date.now(),
      });

      return {
        totalCiclos: novoTotal,
        elemento: novoElemento,
        evoluiu: novoElemento !== registroExistente.ultimoElemento,
      };
    } else {
      // Criar novo registro (primeiro ciclo)
      await ctx.db.insert("ciclos", {
        usuarioId: args.usuarioId,
        totalCiclos: 1,
        ultimoElemento: "terra",
        ultimaAtualizacao: Date.now(),
      });

      return {
        totalCiclos: 1,
        elemento: "terra",
        evoluiu: true, // Primeira vez conta como evolução
      };
    }
  },
});

/**
 * Busca o progresso de ciclos do usuário
 */
export const obterCiclos = query({
  args: {
    usuarioId: v.string(),
  },
  handler: async (ctx, args) => {
    const registro = await ctx.db
      .query("ciclos")
      .withIndex("by_usuario", (q) => q.eq("usuarioId", args.usuarioId))
      .first();

    if (!registro) {
      return {
        totalCiclos: 0,
        elemento: "terra",
        ultimaAtualizacao: null,
      };
    }

    return {
      totalCiclos: registro.totalCiclos,
      elemento: registro.ultimoElemento,
      ultimaAtualizacao: registro.ultimaAtualizacao,
    };
  },
});

/**
 * Reseta o contador de ciclos (para testes ou reinício voluntário)
 */
export const resetarCiclos = mutation({
  args: {
    usuarioId: v.string(),
  },
  handler: async (ctx, args) => {
    const registro = await ctx.db
      .query("ciclos")
      .withIndex("by_usuario", (q) => q.eq("usuarioId", args.usuarioId))
      .first();

    if (registro) {
      await ctx.db.delete(registro._id);
      return { sucesso: true };
    }

    return { sucesso: false, mensagem: "Nenhum registro encontrado" };
  },
});

/**
 * Obter ranking global de usuários por ciclos (top 10)
 */
export const obterRanking = query({
  args: {},
  handler: async (ctx) => {
    const registros = await ctx.db
      .query("ciclos")
      .order("desc")
      .take(10);

    return registros.map((r) => ({
      usuarioId: r.usuarioId,
      totalCiclos: r.totalCiclos,
      elemento: r.ultimoElemento,
    }));
  },
});

/**
 * Estatísticas gerais do sistema
 */
export const obterEstatisticasGerais = query({
  args: {},
  handler: async (ctx) => {
    const todosRegistros = await ctx.db.query("ciclos").collect();

    if (todosRegistros.length === 0) {
      return {
        totalUsuarios: 0,
        totalCiclosGlobal: 0,
        mediaCiclosPorUsuario: 0,
        distribuicaoElementos: {
          terra: 0,
          agua: 0,
          fogo: 0,
          ar: 0,
          eter: 0,
        },
      };
    }

    const totalCiclosGlobal = todosRegistros.reduce(
      (sum, r) => sum + r.totalCiclos,
      0
    );
    const mediaCiclosPorUsuario = totalCiclosGlobal / todosRegistros.length;

    const distribuicaoElementos = {
      terra: 0,
      agua: 0,
      fogo: 0,
      ar: 0,
      eter: 0,
    };

    todosRegistros.forEach((r) => {
      const elemento = r.ultimoElemento as keyof typeof distribuicaoElementos;
      if (elemento in distribuicaoElementos) {
        distribuicaoElementos[elemento]++;
      }
    });

    return {
      totalUsuarios: todosRegistros.length,
      totalCiclosGlobal,
      mediaCiclosPorUsuario: Math.round(mediaCiclosPorUsuario * 10) / 10,
      distribuicaoElementos,
    };
  },
});

/**
 * Registra uma transição de elemento na memória
 */
export const registrarMemoria = mutation({
  args: {
    usuarioId: v.string(),
    elemento: v.string(),
    totalCiclos: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("memoria_elemental", {
      usuarioId: args.usuarioId,
      elemento: args.elemento,
      totalCiclos: args.totalCiclos,
      timestamp: Date.now(),
    });
    
    return { sucesso: true };
  },
});

/**
 * Busca o histórico de memórias elementais do usuário
 */
export const listarMemoria = query({
  args: {
    usuarioId: v.string(),
    limite: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limite = args.limite || 50;
    
    const memorias = await ctx.db
      .query("memoria_elemental")
      .withIndex("by_usuario", (q) => q.eq("usuarioId", args.usuarioId))
      .order("desc") // Mais recentes primeiro
      .take(limite);
    
    return memorias;
  },
});

/**
 * Helper: Determina elemento baseado no número de ciclos
 * (Mesma lógica do frontend, para consistência)
 */
function determinarElementoPorCiclos(totalCiclos: number): string {
  if (totalCiclos >= 31) return "eter";
  if (totalCiclos >= 16) return "ar";
  if (totalCiclos >= 8) return "fogo";
  if (totalCiclos >= 4) return "agua";
  return "terra";
}

