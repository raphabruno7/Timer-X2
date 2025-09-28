import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query para listar todos os presets
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("presets").order("desc").collect();
  },
});

// Mutation para criar um novo preset
export const create = mutation({
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

// Mutation para deletar um preset
export const remove = mutation({
  args: {
    id: v.id("presets"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Mutation para atualizar um preset
export const update = mutation({
  args: {
    id: v.id("presets"),
    nome: v.optional(v.string()),
    minutos: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

