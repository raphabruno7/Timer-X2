import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  presets: defineTable({
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
    uses: v.optional(v.number()), // contagem de usos
    createdAt: v.number(), // timestamp
  }).index("by_categoria", ["categoria"]).index("by_uses", ["uses"]),
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
  ciclos: defineTable({
    usuarioId: v.string(),
    totalCiclos: v.number(), // número total de ciclos completados
    ultimoElemento: v.string(), // "terra" | "agua" | "fogo" | "ar" | "eter"
    ultimaAtualizacao: v.number(), // timestamp em ms
  })
    .index("by_usuario", ["usuarioId"]),
  memoria_elemental: defineTable({
    usuarioId: v.string(),
    elemento: v.string(), // "terra" | "agua" | "fogo" | "ar" | "eter"
    totalCiclos: v.number(), // número de ciclos quando alcançou este elemento
    timestamp: v.number(), // timestamp em ms
  })
    .index("by_usuario", ["usuarioId"])
    .index("by_timestamp", ["timestamp"]),
});
