import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  presets: defineTable({
    nome: v.string(),
    minutos: v.number(),
    createdAt: v.number(), // timestamp
  }),
  historico: defineTable({
    presetId: v.id("presets"),
    usadoEm: v.number(), // timestamp em ms
    duracao: v.number(), // em segundos usados
  }).index("by_preset", ["presetId"]),
});
