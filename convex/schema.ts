import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  presets: defineTable({
    nome: v.string(),
    minutos: v.number(),
    createdAt: v.number(), // timestamp
  }),
});
