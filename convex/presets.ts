import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query para listar todos os presets ordenados por createdAt desc
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("presets").order("desc").collect();
  },
});

// Query para listar os 3 presets mais usados (Top 3)
export const topUsados = query({
  args: {},
  handler: async (ctx) => {
    const presets = await ctx.db.query("presets").collect();
    return presets
      .sort((a, b) => (b.uses || 0) - (a.uses || 0))
      .slice(0, 3);
  },
});

// Mutation para adicionar um novo preset
export const adicionar = mutation({
  args: {
    nome: v.string(),
    minutos: v.number(),
    categoria: v.optional(v.union(
      v.literal("breathwork"),
      v.literal("foco"),
      v.literal("criatividade"),
      v.literal("neural"),
      v.literal("sound"),
      v.literal("binaural")
    )),
  },
  handler: async (ctx, args) => {
    const presetId = await ctx.db.insert("presets", {
      nome: args.nome,
      minutos: args.minutos,
      categoria: args.categoria || "foco",
      uses: 0,
      createdAt: Date.now(),
    });
    return presetId;
  },
});

// Mutation para criar preset rápido (novo nome conforme prompt)
export const createQuick = mutation({
  args: {
    name: v.string(),
    minutes: v.number(),
    category: v.optional(v.union(
      v.literal("breathwork"),
      v.literal("foco"),
      v.literal("criatividade"),
      v.literal("neural"),
      v.literal("sound"),
      v.literal("binaural")
    )),
  },
  handler: async (ctx, args) => {
    const preset = {
      nome: args.name,
      minutos: args.minutes,
      categoria: args.category || "foco",
      uses: 0,
      createdAt: Date.now(),
    };
    const presetId = await ctx.db.insert("presets", preset);
    return { _id: presetId, ...preset };
  },
});

// Mutation para registrar uso de preset
export const use = mutation({
  args: {
    id: v.id("presets"),
  },
  handler: async (ctx, args) => {
    const preset = await ctx.db.get(args.id);
    if (preset) {
      await ctx.db.patch(args.id, { 
        uses: (preset.uses || 0) + 1 
      });
    }
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

