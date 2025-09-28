"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Clock, Sparkles, Settings, Leaf } from "lucide-react";

export default function Home() {
  const [tempo, setTempo] = useState(1500); // 25 minutos em segundos
  const [rodando, setRodando] = useState(false);

  // Função para formatar tempo em mm:ss
  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  // Função para iniciar o timer
  const iniciar = () => {
    setRodando(true);
  };

  // Função para pausar o timer
  const pausar = () => {
    setRodando(false);
  };

  // Função para resetar o timer
  const resetar = () => {
    setRodando(false);
    setTempo(1500);
  };

  // useEffect para decrementar o tempo quando rodando for true
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (rodando && tempo > 0) {
      interval = setInterval(() => {
        setTempo((tempoAtual) => {
          if (tempoAtual <= 1) {
            setRodando(false);
            return 0;
          }
          return tempoAtual - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [rodando, tempo]);

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="w-full max-w-sm mx-auto">
        <Card className="bg-[#1C1C1C] border-2 border-[#2ECC71]/20 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-6 text-center border-b border-[#2ECC71]/10">
            <h1 className="text-2xl font-bold text-[#F9F9F9] flex items-center justify-center gap-2">
              <Leaf className="w-6 h-6 text-[#2ECC71]" />
              Timer X2
            </h1>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-8">
            {/* Timer Circle */}
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-[#2ECC71]/30 bg-gradient-to-br from-[#2ECC71]/10 to-[#FFD700]/10 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-[#F9F9F9] mb-2">
                    {formatarTempo(tempo)}
                  </div>
                  <div className="text-sm text-[#F9F9F9]/70">
                    {rodando ? "Running..." : tempo === 0 ? "Time's up!" : "Ready to begin"}
                  </div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4 relative z-10">
              <Button
                size="lg"
                onClick={iniciar}
                disabled={rodando || tempo === 0}
                className="w-14 h-14 rounded-full bg-[#2ECC71] hover:bg-[#2ECC71]/80 text-white shadow-lg transition-all duration-200 hover:scale-105 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ pointerEvents: 'auto' }}
              >
                <Play className="w-6 h-6 ml-1" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={pausar}
                disabled={!rodando}
                className="w-14 h-14 rounded-full border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all duration-200 hover:scale-105 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ pointerEvents: 'auto' }}
              >
                <Pause className="w-6 h-6" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={resetar}
                className="w-14 h-14 rounded-full border-[#F9F9F9]/30 text-[#F9F9F9] hover:bg-[#F9F9F9]/10 hover:border-[#F9F9F9]/50 transition-all duration-200 hover:scale-105 relative z-10"
                style={{ pointerEvents: 'auto' }}
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-[#2ECC71]/5 border-t border-[#2ECC71]/10 p-4">
            <div className="flex justify-around">
              <button className="flex flex-col items-center gap-1 p-2 text-[#2ECC71] hover:text-[#2ECC71]/80 transition-all duration-200 rounded-lg hover:bg-[#2ECC71]/10">
                <Leaf className="w-5 h-5" />
                <span className="text-xs font-medium">Presets</span>
              </button>
              
              <button className="flex flex-col items-center gap-1 p-2 text-[#F9F9F9]/70 hover:text-[#F9F9F9] transition-all duration-200 rounded-lg hover:bg-[#F9F9F9]/10">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-medium">Relógio</span>
              </button>
              
              <button className="flex flex-col items-center gap-1 p-2 text-[#F9F9F9]/70 hover:text-[#F9F9F9] transition-all duration-200 rounded-lg hover:bg-[#F9F9F9]/10">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-medium">AI</span>
              </button>
              
              <button className="flex flex-col items-center gap-1 p-2 text-[#F9F9F9]/70 hover:text-[#F9F9F9] transition-all duration-200 rounded-lg hover:bg-[#F9F9F9]/10">
                <Settings className="w-5 h-5" />
                <span className="text-xs font-medium">Config</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
