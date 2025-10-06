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
  mandalas: defineTable({
    presetName: v.string(),
    finishedAt: v.number(), // timestamp em ms
    duration: v.number(), // em segundos
  }),
  sessions: defineTable({
    preset: v.string(),
    duracao: v.number(),
    timestamp: v.number(),
    resultadoIA: v.optional(v.string()), // sugestão retornada
    humor: v.optional(v.string()), // ex: "foco", "calmo", "energizado"
    energiaAntes: v.optional(v.string()), // ex: "baixa", "média", "alta"
    energiaDepois: v.optional(v.string()), // IA pode prever ou usuário informar
  }),
  user_sessions: defineTable({
    userId: v.union(v.string(), v.null()),
    presetAtivo: v.string(),
    duracaoMinutos: v.number(),
    iniciadoEm: v.number(),
    finalizadoEm: v.optional(v.number()),
    pausas: v.number(),
    interacoes: v.object({
      botaoPlay: v.number(),
      botaoPause: v.number(),
      botaoReset: v.number(),
    }),
    sentimento: v.optional(v.string()),
    idioma: v.string(),
    device: v.string(),
  }),
  usagePatterns: defineTable({
    userId: v.string(),
    preset: v.string(),
    startTime: v.number(), // timestamp em ms
    duration: v.number(), // duração em minutos
    mood: v.optional(v.string()), // ex: "foco", "criatividade", "relaxamento"
    createdAt: v.number(), // timestamp em ms
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),
});
