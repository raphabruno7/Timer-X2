"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles, Brain, Zap, Target, TrendingUp } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/ui/BottomNav";

export default function AIPage() {
  return (
    <>
      <main 
        className="min-h-screen flex flex-col p-4 pb-24 relative overflow-x-hidden"
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(46, 204, 113, 0.08) 0%, rgba(255, 215, 0, 0.05) 50%, #1A1A1A 100%)',
        }}
        role="main"
        aria-label="Inteligência Artificial - Timer X2"
      >
        {/* Header Minimalista */}
        <div className="max-w-4xl mx-auto w-full mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-6"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-16 h-16 text-[#FFD700]" />
            </motion.div>
            <h1 className="text-3xl font-light text-[#F9F9F9] tracking-wide mb-2">
              Inteligência Artificial
            </h1>
            <p className="text-sm font-light text-[#F9F9F9]/60 tracking-wide">
              Insights adaptativos para otimizar seu foco
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {/* Análise Inteligente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-[#1A1A1A] border-2 border-[#FFD700]/20 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-light text-[#F9F9F9] tracking-wide mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#FFD700]" />
                Análise de Padrões
              </h2>
              <p className="text-sm font-light text-[#F9F9F9]/70 mb-4">
                A IA analisa seus hábitos de foco e sugere ajustes personalizados para maximizar sua produtividade.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl">
                  <Zap className="w-5 h-5 text-[#FFD700]" />
                  <div>
                    <p className="text-sm font-light text-[#F9F9F9]">Detecção de Energia</p>
                    <p className="text-xs text-[#F9F9F9]/60">Identifica seus melhores horários</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#2ECC71]/10 border border-[#2ECC71]/20 rounded-xl">
                  <Target className="w-5 h-5 text-[#2ECC71]" />
                  <div>
                    <p className="text-sm font-light text-[#F9F9F9]">Ajuste Adaptativo</p>
                    <p className="text-xs text-[#F9F9F9]/60">Ritmo personalizado automaticamente</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sugestões Inteligentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-[#1A1A1A] border-2 border-[#2ECC71]/20 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-light text-[#F9F9F9] tracking-wide mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#2ECC71]" />
                Próximas Funcionalidades
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-[#2ECC71]/5 border border-[#2ECC71]/20 rounded-xl">
                  <p className="text-sm font-light text-[#F9F9F9] mb-2">
                    🧠 Sugestão de Modo Ideal
                  </p>
                  <p className="text-xs text-[#F9F9F9]/60">
                    Baseado em contexto, horário e histórico
                  </p>
                </div>
                <div className="p-4 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-xl">
                  <p className="text-sm font-light text-[#F9F9F9] mb-2">
                    ⏰ Melhor Horário para Foco
                  </p>
                  <p className="text-xs text-[#F9F9F9]/60">
                    Análise de produtividade por período
                  </p>
                </div>
                <div className="p-4 bg-[#2ECC71]/5 border border-[#2ECC71]/20 rounded-xl">
                  <p className="text-sm font-light text-[#F9F9F9] mb-2">
                    🎯 Previsão de Cansaço
                  </p>
                  <p className="text-xs text-[#F9F9F9]/60">
                    Alertas preventivos e pausas sugeridas
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Estado em Desenvolvimento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="bg-[#1A1A1A] border-2 border-[#FFD700]/20 rounded-3xl p-8 text-center shadow-xl">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block mb-4"
              >
                <Sparkles className="w-12 h-12 text-[#FFD700]" />
              </motion.div>
              <h3 className="text-xl font-light text-[#F9F9F9] tracking-wide mb-2">
                Em Breve
              </h3>
              <p className="text-sm font-light text-[#F9F9F9]/60 tracking-wide max-w-2xl mx-auto">
                A IA está aprendendo com seus padrões de uso. Em breve você receberá insights personalizados 
                e sugestões adaptativas para otimizar ainda mais seu foco e produtividade.
              </p>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Barra de Navegação Inferior Fixa */}
      <BottomNav />

      <Toaster position="top-center" richColors theme="dark" />
    </>
  );
}
