"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/PageTransition";
import { TimePicker } from "@/components/ui/TimePicker";
import { TimerDisplay } from "@/components/ui/TimerDisplay";
import { TimerControls } from "@/components/ui/TimerControls";
import { useTimerStore } from "@/store/useTimerStore";
import { motion } from "framer-motion";
import { Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/ui/BottomNav";
import { useTranslations } from "@/hooks/useLanguage";

type ManualPageState = "ready" | "running" | "paused" | "completed";

export default function ManualTimerPage() {
  const [pageState, setPageState] = useState<ManualPageState>("ready");
  
  // Estados para controle inline do tempo
  const [selectedTime, setSelectedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  const { 
    timeRemaining, 
    isRunning, 
    isPaused, 
    presetName,
    setManualTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tick
  } = useTimerStore();
  
  const router = useRouter();
  const t = useTranslations();

  // Timer tick - decrementar tempo a cada segundo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, tick]);

  // Atualizar estado da página baseado no timer
  useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      setPageState("completed");
      toast.success("🎉 Tempo concluído!");
    } else if (isRunning && !isPaused) {
      setPageState("running");
    } else if (isPaused) {
      setPageState("paused");
    } else if (timeRemaining > 0 && !isRunning) {
      setPageState("ready");
    }
  }, [timeRemaining, isRunning, isPaused]);

  const handleConfirm = (hours: number, minutes: number, seconds: number) => {
    console.log("[Manual Page] Recebendo tempo:", { hours, minutes, seconds });
    
    // Atualizar estado local
    setSelectedTime({ hours, minutes, seconds });
    
    // Converter tudo para minutos para o timer
    const totalMinutes = hours * 60 + minutes + (seconds > 0 ? 1 : 0);
    
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
    
    // Ir para estado "ready"
    setPageState("ready");
  };

  const handleStart = () => {
    startTimer();
    toast.success("🚀 Timer iniciado!");
  };

  const handlePause = () => {
    pauseTimer();
    toast.info("⏸️ Timer pausado");
  };

  const handleResume = () => {
    resumeTimer();
    toast.success("▶️ Timer continuado");
  };

  const handleReset = () => {
    resetTimer();
    setPageState("ready");
    toast.info("🔄 Timer resetado");
  };

  const handleSettings = () => {
    setPageState("ready");
  };

  const formatTime = (h: number, m: number, s: number) => {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 pb-24 relative overflow-hidden bg-[#1A1A1A]">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-radial-gradient opacity-20" />
        
        <div className="relative z-10 text-center max-w-md w-full">
          {/* Estado: Ready - Rodas + Timer */}
          {pageState === "ready" && (
            <>
              {/* TimePicker Inline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <TimePicker
                  isOpen={true}
                  onClose={() => {}}
                  onConfirm={handleConfirm}
                  inline={true}
                />
              </motion.div>

              {/* Botão Começar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={() => {
                    const totalMinutes = selectedTime.hours * 60 + selectedTime.minutes + (selectedTime.seconds > 0 ? 1 : 0);
                    if (totalMinutes === 0) {
                      toast.error(t.manual.selectAtLeastOneMinute);
                      return;
                    }
                    handleConfirm(selectedTime.hours, selectedTime.minutes, selectedTime.seconds);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 text-lg rounded-full"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Começar Timer
                </Button>
              </motion.div>
            </>
          )}

          {/* Estados: Running, Paused, Completed */}
          {(pageState === "running" || pageState === "paused" || pageState === "completed") && (
            <>
              {/* Timer Display */}
              <TimerDisplay
                timeRemaining={timeRemaining}
                isRunning={isRunning}
                isPaused={isPaused}
                presetName={presetName}
              />

              {/* Timer Controls */}
              <TimerControls
                isRunning={isRunning}
                isPaused={isPaused}
                timeRemaining={timeRemaining}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onReset={handleReset}
                onSettings={handleSettings}
              />
            </>
          )}
        </div>

        <Toaster position="top-center" richColors />
        <BottomNav />
      </main>
    </PageTransition>
  );
}



