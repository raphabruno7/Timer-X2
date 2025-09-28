import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  presets: defineTable({
    name: v.string(),
    duration: v.number(), // em segundos
    isDefault: v.optional(v.boolean()),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),
});
