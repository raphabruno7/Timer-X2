// Script para criar presets padrão no Timer X2
// Execute este script no Convex Dashboard ou via API

import { api } from "./convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const presetsPadrao = [
  {
    nome: "Foco Dinâmico",
    minutos: 25,
    categoria: "foco" as const,
  },
  {
    nome: "Deep Work",
    minutos: 45,
    categoria: "foco" as const,
  },
  {
    nome: "Criatividade",
    minutos: 30,
    categoria: "criatividade" as const,
  },
  {
    nome: "Breathwork",
    minutos: 15,
    categoria: "breathwork" as const,
  },
  {
    nome: "Estudo Intenso",
    minutos: 50,
    categoria: "neural" as const,
  },
  {
    nome: "Meditação",
    minutos: 20,
    categoria: "breathwork" as const,
  },
];

async function criarPresetsPadrao() {
  console.log("Criando presets padrão...");
  
  for (const preset of presetsPadrao) {
    try {
      const result = await client.mutation(api.presets.createQuick, preset);
      console.log(`✅ Preset criado: ${preset.nome} (${preset.minutos} min)`);
    } catch (error) {
      console.error(`❌ Erro ao criar preset ${preset.nome}:`, error);
    }
  }
  
  console.log("🎉 Presets padrão criados com sucesso!");
}

// Para executar no browser console:
// criarPresetsPadrao();
