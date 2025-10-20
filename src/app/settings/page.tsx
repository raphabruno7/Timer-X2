"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Settings, Volume2, Moon, Bell, Palette, Sparkles } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { BottomNav } from "@/components/ui/BottomNav";
import { PageTransition } from "@/components/PageTransition";

export default function SettingsPage() {
  const [volumeSom, setVolumeSom] = useState(50);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(true);

  return (
    <PageTransition>
      <main 
        className="min-h-screen flex flex-col p-4 pb-24 relative overflow-x-hidden"
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(46, 204, 113, 0.08) 0%, rgba(255, 215, 0, 0.05) 50%, #1A1A1A 100%)',
        }}
        role="main"
        aria-label="Configurações - Timer X2"
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
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="inline-block mb-4"
            >
              <Settings className="w-16 h-16 text-[#2ECC71]" />
            </motion.div>
            <h1 className="text-4xl font-light text-[#F9F9F9] tracking-wider mb-2 uppercase">
              Configurações
            </h1>
            <p className="text-sm font-light text-[#F9F9F9]/70 tracking-wide">
              Personalize sua experiência de foco
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {/* Som e Áudio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-[#1A1A1A] border-2 border-[#2ECC71]/20 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-light text-[#F9F9F9] tracking-wide mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#2ECC71]" />
                Som e Áudio
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-light text-[#F9F9F9]/70 mb-2 block">
                    Volume dos Sons
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volumeSom}
                      onChange={(e) => {
                        setVolumeSom(Number(e.target.value));
                        toast.success(`Volume: ${e.target.value}%`);
                      }}
                      className="flex-1 h-2 bg-[#2ECC71]/20 rounded-full appearance-none cursor-pointer"
                      style={{
                        accentColor: '#2ECC71',
                      }}
                      aria-label="Controle de volume"
                    />
                    <span className="text-sm font-light text-[#2ECC71] w-12 text-right">
                      {volumeSom}%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-[#2ECC71]/5 border border-[#2ECC71]/20 rounded-xl">
                  <p className="text-xs font-light text-[#F9F9F9]/60">
                    Sons sincronizados com elementos (Terra, Água, Fogo, Ar, Éter)
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Notificações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-[#1A1A1A] border-2 border-[#FFD700]/20 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-light text-[#F9F9F9] tracking-wide mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#FFD700]" />
                Notificações
              </h2>
              <div className="space-y-4">
                <div 
                  className="flex items-center justify-between p-3 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl cursor-pointer hover:bg-[#FFD700]/15 transition-colors"
                  onClick={() => {
                    setNotificacoesAtivas(!notificacoesAtivas);
                    toast.success(notificacoesAtivas ? 'Notificações desativadas' : 'Notificações ativadas');
                  }}
                  role="switch"
                  aria-checked={notificacoesAtivas}
                  aria-label="Ativar ou desativar notificações"
                >
                  <span className="text-sm font-light text-[#F9F9F9]">
                    Alertas de Conclusão
                  </span>
                  <div className={`w-12 h-6 rounded-full transition-colors ${notificacoesAtivas ? 'bg-[#FFD700]' : 'bg-[#F9F9F9]/20'}`}>
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full m-0.5"
                      animate={{
                        x: notificacoesAtivas ? 24 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>
                <div className="p-3 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-xl">
                  <p className="text-xs font-light text-[#F9F9F9]/60">
                    Receba notificações quando uma sessão for concluída
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Aparência */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-[#1A1A1A] border-2 border-[#2ECC71]/20 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-light text-[#F9F9F9] tracking-wide mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#2ECC71]" />
                Aparência
              </h2>
              <div className="space-y-4">
                <div 
                  className="flex items-center justify-between p-3 bg-[#2ECC71]/10 border border-[#2ECC71]/20 rounded-xl cursor-pointer hover:bg-[#2ECC71]/15 transition-colors"
                  onClick={() => {
                    setTemaEscuro(!temaEscuro);
                    toast.info('Tema claro em breve!');
                  }}
                  role="switch"
                  aria-checked={temaEscuro}
                  aria-label="Alternar tema escuro"
                >
                  <span className="text-sm font-light text-[#F9F9F9] flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Modo Escuro
                  </span>
                  <div className={`w-12 h-6 rounded-full transition-colors ${temaEscuro ? 'bg-[#2ECC71]' : 'bg-[#F9F9F9]/20'}`}>
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full m-0.5"
                      animate={{
                        x: temaEscuro ? 24 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-light text-[#F9F9F9]/70 mb-2">Paleta de Cores</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#2ECC71] border-2 border-white/20" title="Verde Natureza"></div>
                    <div className="w-8 h-8 rounded-full bg-[#FFD700] border-2 border-white/20" title="Dourado"></div>
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border-2 border-white/20" title="Fundo Escuro"></div>
                    <div className="w-8 h-8 rounded-full bg-[#F9F9F9] border-2 border-white/20" title="Texto Claro"></div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sobre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-[#1A1A1A] border-2 border-[#FFD700]/20 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-light text-[#F9F9F9] tracking-wide mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                Sobre o Timer X2
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-xl">
                  <p className="text-sm font-light text-[#F9F9F9] mb-1">Versão</p>
                  <p className="text-xs text-[#F9F9F9]/60">2.0.0 Beta</p>
                </div>
                <div className="p-3 bg-[#2ECC71]/5 border border-[#2ECC71]/20 rounded-xl">
                  <p className="text-sm font-light text-[#F9F9F9] mb-1">Tecnologia</p>
                  <p className="text-xs text-[#F9F9F9]/60">Next.js 15 + Convex + Framer Motion</p>
                </div>
                <div className="p-3 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-xl">
                  <p className="text-sm font-light text-[#F9F9F9] mb-1">Tema</p>
                  <p className="text-xs text-[#F9F9F9]/60">Natureza, Respiração e Alquimia do Tempo</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Barra de Navegação Inferior Fixa */}
      <BottomNav />

      <Toaster position="top-center" richColors theme="dark" />
    </PageTransition>
  );
}
