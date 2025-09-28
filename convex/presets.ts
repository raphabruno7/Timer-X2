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
    name: v.string(),
    duration: v.number(),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const presetId = await ctx.db.insert("presets", {
      name: args.name,
      duration: args.duration,
      isDefault: args.isDefault || false,
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
    name: v.optional(v.string()),
    duration: v.optional(v.number()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Query para buscar presets padrão
export const getDefaults = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("presets")
      .filter((q) => q.eq(q.field("isDefault"), true))
      .collect();
  },
});
