"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/PageTransition";
import { TimePicker } from "@/components/ui/TimePicker";
import { useTimerStore } from "@/store/useTimerStore";
import { motion } from "framer-motion";
import { Clock, Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/ui/BottomNav";
import { useTranslations } from "@/hooks/useLanguage";

export default function ManualTimerPage() {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const { setManualTime } = useTimerStore();
  const router = useRouter();
  const t = useTranslations();

  // Abrir picker automaticamente ao entrar na página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPickerOpen(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = (hours: number, minutes: number, seconds: number) => {
    console.log("[Manual Page] Recebendo tempo:", { hours, minutes, seconds });
    setSelectedTime({ hours, minutes, seconds });
    
    // Converter tudo para minutos para o timer
    const totalMinutes = hours * 60 + minutes + (seconds > 0 ? 1 : 0); // Arredondar segundos para cima
    
    console.log("[Manual Page] Total minutos calculado:", totalMinutes);
    
    if (totalMinutes === 0) {
      toast.error(t.manual.selectAtLeastOneMinute);
      return;
    }
    
    // Aplicar ao timer usando método específico para tempo manual
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    setManualTime(totalMinutes, `⏱️ ${timeString}`);
    
    console.log("[Manual Page] Timer configurado:", { totalMinutes, timeString });
    
    toast.success(`${t.manual.timerSetTo} ${timeString}`);
    
    // Fechar o picker e permanecer na página manual
    setIsPickerOpen(false);
    
    // Voltar para home após 2 segundos para iniciar o timer
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  const handleClose = () => {
    // Apenas fechar o picker e permanecer na página manual
    setIsPickerOpen(false);
  };

  const formatTime = (h: number, m: number, s: number) => {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 pb-24 relative overflow-hidden bg-[#1A1A1A]">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-radial-gradient opacity-20" />
        
        <div className="relative z-10 text-center max-w-md">
          {/* Ícone grande */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-emerald-500/30">
              <Clock className="w-16 h-16 text-emerald-400" />
            </div>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-emerald-300 mb-4 uppercase tracking-wider"
          >
            {t.manual.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#F9F9F9]/70 mb-8 font-light"
          >
            {t.manual.subtitle}
          </motion.p>

          {/* Tempo selecionado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-emerald-950/40 rounded-2xl p-6 border border-emerald-700/30 mb-8"
          >
            <p className="text-sm text-[#F9F9F9]/60 mb-2 uppercase tracking-wide font-light">
              {t.manual.selectedTime}
            </p>
            <p
              className="text-5xl font-bold text-emerald-300 tracking-wider"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatTime(selectedTime.hours, selectedTime.minutes, selectedTime.seconds)}
            </p>
          </motion.div>

          {/* Botão abrir picker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => setIsPickerOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-6 text-lg rounded-full"
            >
              <Play className="w-5 h-5 mr-2" />
              {t.manual.setTime}
            </Button>
          </motion.div>
        </div>

        {/* TimePicker Modal */}
        {isPickerOpen && (
          <TimePicker
            isOpen={isPickerOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
          />
        )}

        <Toaster position="top-center" richColors />
        <BottomNav />
      </main>
    </PageTransition>
  );
}


