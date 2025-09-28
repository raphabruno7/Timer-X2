import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query para listar todos os presets ordenados por createdAt desc
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("presets").order("desc").collect();
  },
});

// Mutation para adicionar um novo preset
export const adicionar = mutation({
  args: {
    nome: v.string(),
    minutos: v.number(),
  },
  handler: async (ctx, args) => {
    const presetId = await ctx.db.insert("presets", {
      nome: args.nome,
      minutos: args.minutos,
      createdAt: Date.now(),
    });
    return presetId;
  },
});

// Mutation para remover um preset
export const remover = mutation({
  args: {
    id: v.id("presets"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

