import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation para registrar exibição de mandala
export const registrarMandala = mutation({
  args: {
    presetName: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const mandalaId = await ctx.db.insert("mandalas", {
      presetName: args.presetName,
      finishedAt: Date.now(),
      duration: args.duration,
    });
    
    console.log("Mandala registrada no histórico");
    return mandalaId;
  },
});

// Query para listar mandalas registradas
export const listarMandalas = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("mandalas").order("desc").collect();
  },
});

