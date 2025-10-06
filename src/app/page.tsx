"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Play, Pause, RotateCcw, Clock, Sparkles, Settings, Leaf, Check, Plus, Trash2, TrendingUp, History, Trophy, LineChart as LineChartIcon } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MandalaReward } from "@/components/ui/MandalaReward";
import { motion } from "framer-motion";

export default function Home() {
  const [tempoInicial, setTempoInicial] = useState(1500); // 25 minutos em segundos
  const [tempo, setTempo] = useState(tempoInicial);
  const [tempoRestante, setTempoRestante] = useState(tempoInicial); // Estado global do tempo restante
  const [rodando, setRodando] = useState(false);
  const [inputManual, setInputManual] = useState("");
  const [erroInput, setErroInput] = useState("");
  const [presetAtivo, setPresetAtivo] = useState<Id<"presets"> | null>(null); // ID do preset ativo
  const [abaAtiva, setAbaAtiva] = useState<"presets" | "historico">("presets"); // Controle de abas
  const [tempoInicio, setTempoInicio] = useState<number | null>(null); // Para calcular duração
  const [periodoSelecionado, setPeriodoSelecionado] = useState<"hoje" | "semana" | "mes">("hoje");
  const [rewardTriggered, setRewardTriggered] = useState(false); // Evitar múltiplos triggers
  const [mandalaActive, setMandalaActive] = useState(false); // Estado da mandala
  const [aiMessage, setAiMessage] = useState<string>(""); // Mensagem da AI
  const [mandalaMood, setMandalaMood] = useState<"foco" | "criatividade" | "relaxamento" | "energia">("foco");

  // Convex hooks
  const presets = useQuery(api.presets.listar) || [];
  const adicionarPreset = useMutation(api.presets.adicionar);
  const removerPreset = useMutation(api.presets.remover);
  const registrarUso = useMutation(api.historico.registrarUso);
  const registrarMandala = useMutation(api.mandalas.registrarMandala);
  const historico = useQuery(api.historico.listarHistorico, {}) || [];
  const estatisticasPorPeriodo = useQuery(api.historico.estatisticasPorPeriodo, { periodo: periodoSelecionado });
  const estatisticasSemanais = useQuery(api.historico.estatisticasSemanais);
  const historicoDetalhado = useQuery(api.historico.historicoDetalhado);
  const rankingPresets = useQuery(api.historico.rankingPresets);
  const estatisticasGerais = useQuery(api.historico.estatisticasGerais);
  const estatisticasPorDia = useQuery(api.historico.estatisticasPorDia);

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

  // Função para formatar data e hora
  const formatarDataHora = (timestamp: number) => {
    const data = new Date(timestamp);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Função para formatar dia da semana abreviado
  const formatarDiaSemana = (dataStr: string) => {
    const data = new Date(dataStr + 'T00:00:00');
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias[data.getDay()];
  };

  // Função para formatar tempo em horas e minutos
  const formatarTempoTotal = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    if (horas === 0) {
      return `${minutosRestantes}min`;
    }
    return `${horas}h ${minutosRestantes}min`;
  };

  // Função para formatar data curta (DD/MM)
  const formatarDataCurta = (dataStr: string) => {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}`;
  };

  // Função para iniciar o timer
  const iniciar = () => {
    setRodando(true);
    setTempoInicio(Date.now());
    setMandalaActive(false); // Fechar mandala ao iniciar novo ciclo
    setRewardTriggered(false); // Permitir nova mandala ao fim do ciclo
  };

  // Função para pausar o timer
  const pausar = async () => {
    setRodando(false);
    
    // Registrar uso se houver preset ativo e tempo de início
    if (presetAtivo && tempoInicio) {
      const duracao = Math.floor((Date.now() - tempoInicio) / 1000);
      if (duracao > 0) {
        try {
          await registrarUso({ presetId: presetAtivo, duracao });
        } catch (error) {
          console.error("Erro ao registrar uso:", error);
        }
      }
    }
    
    setTempoInicio(null);
  };

  // Função para resetar o timer
  const resetar = () => {
    setRodando(false);
    setTempo(tempoInicial);
    setTempoRestante(tempoInicial);
    setPresetAtivo(null);
    setRewardTriggered(false); // Reset flag de recompensa
    setMandalaActive(false); // Fechar mandala se estiver aberta
  };

  // Função para lidar com mudança de preset
  const handlePresetChange = (value: string) => {
    const novoValor = parseInt(value);
    setTempoInicial(novoValor);
    setTempo(novoValor);
    setTempoRestante(novoValor);
    setRodando(false);
    setInputManual("");
    setErroInput("");
    setPresetAtivo(null); // Reset preset ativo para presets estáticos
    setMandalaActive(false); // Fechar mandala ao mudar preset
    setRewardTriggered(false); // Permitir nova mandala
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
    setTempoRestante(segundos);
    setRodando(false);
    setInputManual("");
    setErroInput("");
    setPresetAtivo(null); // Reset preset ativo para entrada manual
    setMandalaActive(false); // Fechar mandala ao aplicar tempo manual
    setRewardTriggered(false); // Permitir nova mandala
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
  const handleRemoverPreset = async (id: Id<"presets">) => {
    if (window.confirm("Tem certeza que deseja remover este preset?")) {
      try {
        await removerPreset({ id });
        // Se o preset removido era o ativo, resetar
        if (presetAtivo === id) {
          setPresetAtivo(null);
        }
      } catch (error) {
        console.error("Erro ao remover preset:", error);
        alert("Erro ao remover preset");
      }
    }
  };

  // Função para aplicar preset do Convex
  const aplicarPreset = (preset: { _id: Id<"presets">; nome: string; minutos: number; createdAt: number }) => {
    const segundos = preset.minutos * 60;
    setTempoInicial(segundos);
    setTempo(segundos);
    setTempoRestante(segundos);
    setRodando(false);
    setPresetAtivo(preset._id);
    setInputManual("");
    setErroInput("");
    setMandalaActive(false); // Fechar mandala ao aplicar preset
    setRewardTriggered(false); // Permitir nova mandala
  };

  // useEffect para decrementar o tempo quando rodando for true
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (rodando && tempoRestante > 0) {
      interval = setInterval(() => {
        setTempoRestante((tempoAtual) => {
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
  }, [rodando, tempoRestante]);

  // useEffect para registrar uso quando timer terminar
  useEffect(() => {
    if (!rodando && presetAtivo && tempoInicio && tempoRestante === 0 && !rewardTriggered) {
      const duracao = Math.floor((Date.now() - tempoInicio) / 1000);
      if (duracao > 0) {
        registrarUso({ presetId: presetAtivo, duracao }).catch(console.error);
        
        // Buscar nome do preset para registrar mandala
        const preset = presets.find(p => p._id === presetAtivo);
        const presetName = preset?.nome || "Preset desconhecido";
        const finishedAt = Date.now();
        
        // Determinar mood baseado no nome do preset
        let mood: "foco" | "criatividade" | "relaxamento" | "energia" = "foco";
        const nameLower = presetName.toLowerCase();
        if (nameLower.includes("criat") || nameLower.includes("inova")) {
          mood = "criatividade";
        } else if (nameLower.includes("relax") || nameLower.includes("medita")) {
          mood = "relaxamento";
        } else if (nameLower.includes("energia") || nameLower.includes("exerc")) {
          mood = "energia";
        }
        setMandalaMood(mood);
        
        // Registrar exibição da mandala
        registrarMandala({ 
          presetName, 
          duration: duracao 
        }).catch(console.error);
        
        // Buscar mensagem AI
        fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ presetName, duration: duracao, finishedAt })
        })
          .then(res => res.json())
          .then(data => {
            setAiMessage(data.message);
          })
          .catch(err => {
            console.error("Erro ao buscar mensagem AI:", err);
            setAiMessage(""); // Usar mensagem padrão
          });
        
        // Mostrar mandala de recompensa (apenas uma vez)
        setMandalaActive(true);
        setRewardTriggered(true);
      }
      setTempoInicio(null);
    }
  }, [rodando, presetAtivo, tempoInicio, tempoRestante, registrarUso, registrarMandala, presets, rewardTriggered]);

  // Sincronizar tempo com tempoRestante
  useEffect(() => {
    setTempo(tempoRestante);
  }, [tempoRestante]);

  return (
    <>
      {/* Mandala de Recompensa */}
      <MandalaReward 
        visible={mandalaActive}
        mood={mandalaMood}
        intensity={0.7}
      />
      
      <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4 gap-4">
      {/* General Statistics Panel */}
      {estatisticasGerais && (
        <Card className="w-full max-w-xs bg-[#1C1C1C] border-2 border-[#2ECC71]/20 rounded-3xl overflow-hidden shadow-2xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#F9F9F9] flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2ECC71]" />
              Estatísticas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tempo Total Focado */}
            <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-xs text-[#F9F9F9]/70 mb-2">Tempo total focado</div>
              <div className="text-xl font-bold text-[#2ECC71]">
                {formatarTempoTotal(estatisticasGerais.tempoTotalFocado)}
              </div>
            </div>

            {/* Sessões Concluídas */}
            <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🧘</div>
              <div className="text-xs text-[#F9F9F9]/70 mb-2">Sessões concluídas</div>
              <div className="text-xl font-bold text-[#FFD700]">
                {estatisticasGerais.sessoesCompletas}
              </div>
            </div>

            {/* Média por Sessão */}
            <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-xs text-[#F9F9F9]/70 mb-2">Média por sessão</div>
              <div className="text-xl font-bold text-[#2ECC71]">
                {estatisticasGerais.mediaPorSessao} min
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Statistics Card with Tabs */}
      {estatisticasPorPeriodo && (
        <Card className="w-full max-w-xs bg-[#1C1C1C] border-2 border-[#2ECC71]/20 rounded-3xl overflow-hidden shadow-2xl p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-[#F9F9F9] flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              Estatísticas
            </h2>
          </div>

          {/* Tabs para períodos */}
          <Tabs value={periodoSelecionado} onValueChange={(value) => setPeriodoSelecionado(value as "hoje" | "semana" | "mes")} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-3 bg-[#2ECC71]/10 border border-[#2ECC71]/20">
              <TabsTrigger 
                value="hoje" 
                className="text-[#F9F9F9]/70 data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white"
              >
                Hoje
              </TabsTrigger>
              <TabsTrigger 
                value="semana" 
                className="text-[#F9F9F9]/70 data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white"
              >
                Semana
              </TabsTrigger>
              <TabsTrigger 
                value="mes" 
                className="text-[#F9F9F9]/70 data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white"
              >
                Mês
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-4">
            {/* Total de minutos focados */}
            <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-xl p-4">
              <div className="text-sm text-[#F9F9F9]/70 mb-1">Total de minutos focados</div>
              <div className="text-3xl font-bold text-[#2ECC71]">
                {estatisticasPorPeriodo.totalMinutosFocados}
              </div>
              <div className="text-xs text-[#F9F9F9]/50 mt-1">minutos</div>
            </div>

            {/* Preset mais usado */}
            <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4">
              <div className="text-sm text-[#F9F9F9]/70 mb-1">Preset mais usado</div>
              <div className="text-xl font-bold text-[#FFD700]">
                {estatisticasPorPeriodo.presetMaisUsado}
              </div>
            </div>

            {/* Total de sessões */}
            <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-xl p-4">
              <div className="text-sm text-[#F9F9F9]/70 mb-1">Total de sessões</div>
              <div className="text-3xl font-bold text-[#2ECC71]">
                {estatisticasPorPeriodo.totalSessoes}
              </div>
              <div className="text-xs text-[#F9F9F9]/50 mt-1">sessões</div>
            </div>
          </div>
        </Card>
      )}

      {/* Daily Evolution Chart Card */}
      {estatisticasPorDia && estatisticasPorDia.length > 0 && (
        <Card className="w-full max-w-xs bg-[#1C1C1C] border-2 border-[#2ECC71]/20 rounded-3xl overflow-hidden shadow-2xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#F9F9F9] flex items-center justify-center gap-2">
              <LineChartIcon className="w-5 h-5 text-[#2ECC71]" />
              Evolução Diária
            </h2>
          </div>

          <div className="w-full h-64 overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%" minWidth={estatisticasPorDia.length * 50}>
              <LineChart
                data={estatisticasPorDia.map(item => ({
                  ...item,
                  dataFormatada: formatarDataCurta(item.data),
                }))}
                margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2ECC71" opacity={0.1} />
                <XAxis 
                  dataKey="dataFormatada" 
                  stroke="#F9F9F9"
                  opacity={0.7}
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#F9F9F9"
                  opacity={0.7}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1C1C',
                    border: '1px solid #2ECC71',
                    borderRadius: '8px',
                    color: '#F9F9F9',
                  }}
                  labelStyle={{ color: '#2ECC71' }}
                  formatter={(value: number) => [`${value} min`, 'Minutos']}
                  labelFormatter={(label) => `Dia: ${label}`}
                />
                <Line 
                  type="monotone"
                  dataKey="minutos" 
                  stroke="#2ECC71"
                  strokeWidth={3}
                  dot={{ fill: '#2ECC71', r: 4 }}
                  activeDot={{ r: 6, fill: '#FFD700' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Weekly Chart Card */}
      {estatisticasSemanais && (
        <Card className="w-full max-w-xs bg-[#1C1C1C] border-2 border-[#2ECC71]/20 rounded-3xl overflow-hidden shadow-2xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#F9F9F9] flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2ECC71]" />
              Evolução Semanal
            </h2>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={estatisticasSemanais.map(item => ({
                  ...item,
                  diaSemana: formatarDiaSemana(item.dia),
                }))}
                margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="diaSemana" 
                  stroke="#F9F9F9"
                  opacity={0.7}
                  fontSize={12}
                />
                <YAxis 
                  stroke="#F9F9F9"
                  opacity={0.7}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1C1C',
                    border: '1px solid #2ECC71',
                    borderRadius: '8px',
                    color: '#F9F9F9',
                  }}
                  labelStyle={{ color: '#2ECC71' }}
                  formatter={(value: number) => [`${value} min`, 'Minutos focados']}
                />
                <Bar 
                  dataKey="totalMinutosFocados" 
                  fill="#2ECC71"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Top Presets Ranking Card */}
      {rankingPresets && (
        <Card className="w-full max-w-xs bg-[#1C1C1C] border-2 border-[#2ECC71]/20 rounded-3xl overflow-hidden shadow-2xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#F9F9F9] flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFD700]" />
              Top Presets
            </h2>
          </div>

          <div className="space-y-4">
            {rankingPresets.length === 0 ? (
              <p className="text-center text-[#F9F9F9]/50 text-sm py-8">
                Nenhum preset usado ainda
              </p>
            ) : (
              rankingPresets.map((item, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                const colors = [
                  { text: '#FFD700', bg: 'bg-[#FFD700]/10', border: 'border-[#FFD700]/30' }, // Ouro
                  { text: '#C0C0C0', bg: 'bg-[#C0C0C0]/10', border: 'border-[#C0C0C0]/30' }, // Prata
                  { text: '#CD7F32', bg: 'bg-[#CD7F32]/10', border: 'border-[#CD7F32]/30' }, // Bronze
                ];
                const color = colors[index];

                return (
                  <div key={item.presetId}>
                    <div className={`${color.bg} border ${color.border} rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]`}>
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{medals[index]}</div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-[#F9F9F9] mb-1">
                            {item.nomePreset}
                          </div>
                          <div className="text-xs text-[#F9F9F9]/70">
                            {item.totalUsos} {item.totalUsos === 1 ? 'uso' : 'usos'}
                          </div>
                        </div>
                        <div className="text-2xl font-bold" style={{ color: color.text }}>
                          {index + 1}º
                        </div>
                      </div>
                    </div>
                    {index < rankingPresets.length - 1 && (
                      <Separator className="my-3 bg-[#2ECC71]/10" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* Detailed History Card */}
      {historicoDetalhado && (
        <Card className="w-full max-w-xs bg-[#1C1C1C] border-2 border-[#2ECC71]/20 rounded-3xl overflow-hidden shadow-2xl p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-[#F9F9F9] flex items-center justify-center gap-2">
              <History className="w-5 h-5 text-[#FFD700]" />
              Histórico
            </h2>
          </div>

          <ScrollArea className="h-80 w-full pr-4">
            <div className="space-y-3">
              {historicoDetalhado.length === 0 ? (
                <p className="text-center text-[#F9F9F9]/50 text-sm py-8">
                  Nenhuma sessão registrada ainda
                </p>
              ) : (
                historicoDetalhado.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#2ECC71]/5 border border-[#2ECC71]/20 rounded-lg p-3 transition-all duration-200 hover:bg-[#2ECC71]/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-xs text-[#F9F9F9]/50 mb-1">
                          {item.data}
                        </div>
                        <div className="text-sm font-medium text-[#F9F9F9]">
                          {item.nomePreset}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#2ECC71]">
                          {item.minutosFocados}
                        </div>
                        <div className="text-xs text-[#F9F9F9]/50">
                          min
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Phone Frame */}
      <motion.div 
        className="w-full max-w-sm mx-auto"
        animate={{ opacity: mandalaActive ? 0.3 : 1 }}
        transition={{ duration: 0.5 }}
      >
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

            {/* Conteúdo das Abas */}
            {abaAtiva === "presets" ? (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-[#F9F9F9]/70">Presets Salvos</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setMandalaActive(true)}
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10"
                      title="Testar Mandala"
                    >
                      ✨
                    </Button>
                  <Button
                    onClick={handleAdicionarPreset}
                    size="sm"
                    className="h-8 px-3 bg-[#2ECC71] hover:bg-[#2ECC71]/80 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {presets.length === 0 ? (
                    <p className="text-xs text-[#F9F9F9]/50 text-center py-2">
                      Nenhum preset salvo
                    </p>
                  ) : (
                    presets.map((preset) => {
                      const isAtivo = presetAtivo === preset._id;
                      return (
                        <div
                          key={preset._id}
                          onClick={() => aplicarPreset(preset)}
                          className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                            isAtivo
                              ? "bg-[#2ECC71]/20 border-[#2ECC71] shadow-lg shadow-[#2ECC71]/20"
                              : "bg-[#2ECC71]/5 border-[#2ECC71]/20 hover:bg-[#2ECC71]/10 hover:border-[#2ECC71]/40"
                          }`}
                        >
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${
                              isAtivo ? "text-[#2ECC71]" : "text-[#F9F9F9]"
                            }`}>
                              {preset.nome}
                              {isAtivo && " ✓"}
                            </div>
                            <div className={`text-xs ${
                              isAtivo ? "text-[#2ECC71]/80" : "text-[#F9F9F9]/70"
                            }`}>
                              {preset.minutos} min
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoverPreset(preset._id);
                              }}
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-[#F9F9F9]/70">Histórico de Uso</h3>
                  <span className="text-xs text-[#F9F9F9]/50">
                    {historico.length} registros
                  </span>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {historico.length === 0 ? (
                    <p className="text-xs text-[#F9F9F9]/50 text-center py-2">
                      Nenhum uso registrado
                    </p>
                  ) : (
                    historico.map((item) => {
                      const preset = presets.find(p => p._id === item.presetId);
                      return (
                        <div
                          key={item._id}
                          className="flex items-center justify-between p-2 bg-[#2ECC71]/5 rounded-lg border border-[#2ECC71]/20"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#F9F9F9]">
                              {preset?.nome || "Preset removido"}
                            </div>
                            <div className="text-xs text-[#F9F9F9]/70">
                              {formatarDataHora(item.usadoEm)} • {formatarTempo(item.duracao)}
                            </div>
                          </div>
                          <div className="text-xs text-[#2ECC71]/80">
                            {preset?.minutos}min
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

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
              <button 
                onClick={() => setAbaAtiva("presets")}
                className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 rounded-lg hover:bg-[#2ECC71]/10 ${
                  abaAtiva === "presets" 
                    ? "text-[#2ECC71]" 
                    : "text-[#F9F9F9]/70 hover:text-[#F9F9F9]"
                }`}
              >
                <Leaf className="w-5 h-5" />
                <span className="text-xs font-medium">Presets</span>
              </button>
              
              <button 
                onClick={() => setAbaAtiva("historico")}
                className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 rounded-lg hover:bg-[#2ECC71]/10 ${
                  abaAtiva === "historico" 
                    ? "text-[#2ECC71]" 
                    : "text-[#F9F9F9]/70 hover:text-[#F9F9F9]"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="text-xs font-medium">Histórico</span>
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
      </motion.div>
    </div>
    </>
  );
}
