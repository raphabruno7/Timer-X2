"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, Clock, Sparkles, Settings, Leaf, Check, Plus, Trash2 } from "lucide-react";

export default function Home() {
  const [tempoInicial, setTempoInicial] = useState(1500); // 25 minutos em segundos
  const [tempo, setTempo] = useState(tempoInicial);
  const [rodando, setRodando] = useState(false);
  const [inputManual, setInputManual] = useState("");
  const [erroInput, setErroInput] = useState("");

  // Convex hooks
  const presets = useQuery(api.presets.listar) || [];
  const adicionarPreset = useMutation(api.presets.adicionar);
  const removerPreset = useMutation(api.presets.remover);

  // Presets estáticos como fallback
  const presetsEstaticos = [
    { label: "25 min", value: 1500 },
    { label: "45 min", value: 2700 },
    { label: "60 min", value: 3600 },
  ];

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
    setTempo(tempoInicial);
  };

  // Função para lidar com mudança de preset
  const handlePresetChange = (value: string) => {
    const novoValor = parseInt(value);
    setTempoInicial(novoValor);
    setTempo(novoValor);
    setRodando(false);
    setInputManual("");
    setErroInput("");
  };

  // Função para validar entrada manual
  const validarInput = (valor: string) => {
    const minutos = parseInt(valor);
    if (isNaN(minutos) || minutos < 1) {
      return "Mínimo 1 minuto";
    }
    if (minutos > 180) {
      return "Máximo 180 minutos";
    }
    return "";
  };

  // Função para aplicar tempo manual
  const aplicarTempoManual = () => {
    const erro = validarInput(inputManual);
    if (erro) {
      setErroInput(erro);
      return;
    }
    
    const minutos = parseInt(inputManual);
    const segundos = minutos * 60;
    
    setTempoInicial(segundos);
    setTempo(segundos);
    setRodando(false);
    setInputManual("");
    setErroInput("");
  };

  // Função para lidar com Enter no input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      aplicarTempoManual();
    }
  };

  // Função para adicionar preset
  const handleAdicionarPreset = async () => {
    const nome = window.prompt("Nome do preset:");
    if (!nome) return;

    const minutosStr = window.prompt("Minutos:");
    if (!minutosStr) return;

    const minutos = parseInt(minutosStr);
    if (isNaN(minutos) || minutos < 1 || minutos > 180) {
      alert("Minutos deve ser entre 1 e 180");
      return;
    }

    try {
      await adicionarPreset({ nome, minutos });
    } catch (error) {
      console.error("Erro ao adicionar preset:", error);
      alert("Erro ao adicionar preset");
    }
  };

  // Função para remover preset
  const handleRemoverPreset = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este preset?")) {
      try {
        await removerPreset({ id });
      } catch (error) {
        console.error("Erro ao remover preset:", error);
        alert("Erro ao remover preset");
      }
    }
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
            <h1 className="text-2xl font-bold text-[#F9F9F9] flex items-center justify-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-[#2ECC71]" />
              Timer X2
            </h1>
            
            {/* Preset Selector */}
            <div className="flex justify-center mb-4">
              <Select value={tempoInicial.toString()} onValueChange={handlePresetChange}>
                <SelectTrigger className="w-32 bg-[#2ECC71]/10 border-[#2ECC71]/30 text-[#F9F9F9] focus:ring-[#2ECC71]/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1C1C1C] border-[#2ECC71]/30">
                  {presetsEstaticos.map((preset) => (
                    <SelectItem 
                      key={preset.value} 
                      value={preset.value.toString()}
                      className="text-[#F9F9F9] focus:bg-[#2ECC71]/20 focus:text-[#F9F9F9]"
                    >
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lista de Presets do Convex */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[#F9F9F9]/70">Presets Salvos</h3>
                <Button
                  onClick={handleAdicionarPreset}
                  size="sm"
                  className="h-8 px-3 bg-[#2ECC71] hover:bg-[#2ECC71]/80 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {presets.length === 0 ? (
                  <p className="text-xs text-[#F9F9F9]/50 text-center py-2">
                    Nenhum preset salvo
                  </p>
                ) : (
                  presets.map((preset) => (
                    <div
                      key={preset._id}
                      className="flex items-center justify-between p-2 bg-[#2ECC71]/5 rounded-lg border border-[#2ECC71]/20"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#F9F9F9]">
                          {preset.nome}
                        </div>
                        <div className="text-xs text-[#F9F9F9]/70">
                          {preset.minutos} min
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => {
                            const segundos = preset.minutos * 60;
                            setTempoInicial(segundos);
                            setTempo(segundos);
                            setRodando(false);
                          }}
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs border-[#2ECC71]/30 text-[#2ECC71] hover:bg-[#2ECC71]/10"
                        >
                          Usar
                        </Button>
                        <Button
                          onClick={() => handleRemoverPreset(preset._id)}
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Input Manual */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Minutos"
                  value={inputManual}
                  onChange={(e) => {
                    setInputManual(e.target.value);
                    setErroInput("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="w-24 h-8 text-center bg-[#2ECC71]/10 border-[#2ECC71]/30 text-[#F9F9F9] placeholder:text-[#F9F9F9]/50 focus:ring-[#2ECC71]/50"
                  min="1"
                  max="180"
                />
                <Button
                  onClick={aplicarTempoManual}
                  size="sm"
                  className="h-8 px-3 bg-[#2ECC71] hover:bg-[#2ECC71]/80 text-white"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
              {erroInput && (
                <p className="text-xs text-red-400">{erroInput}</p>
              )}
            </div>
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
