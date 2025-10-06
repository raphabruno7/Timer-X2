"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Mandala } from "@/components/ui/Mandala";
import { AlquimiaPanel } from "@/components/ui/AlquimiaPanel";
import { CicloVital, type Elemento } from "@/components/ui/CicloVital";
import { MemoriaElemental } from "@/components/ui/MemoriaElemental";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { analisarPadrao, calcularScoreProdutividade, detectarMelhorHorario } from "@/lib/adaptiveEngine";
import { ajustarAmbiente, detectarTendenciaCansaco, calcularVelocidadeMandala } from "@/lib/environmentFeedback";
import { faseDaLua } from "@/lib/lua";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Hook para detectar modo escuro baseado em horário e preferência do sistema
function useAutoDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      const isNightTime = hour >= 19 || hour <= 6;
      
      // Verificar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Modo escuro se: horário noturno OU preferência do sistema
      setIsDarkMode(isNightTime || prefersDark);
    };

    updateTheme();
    
    // Atualizar a cada hora
    const interval = setInterval(updateTheme, 60 * 60 * 1000);
    
    // Listener para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateTheme();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      clearInterval(interval);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isDarkMode;
}

export default function Home() {
  // Hook de tema automático
  const isDarkMode = useAutoDarkMode();
  
  // Cores do tema baseadas no modo
  const themeColors = useMemo(() => ({
    background: isDarkMode ? '#121212' : '#1C1C1C',
    text: '#F9F9F9',
    textSecondary: isDarkMode ? '#E0E0E0' : '#F9F9F9',
    border: isDarkMode ? 'rgba(46, 204, 113, 0.15)' : 'rgba(46, 204, 113, 0.2)',
  }), [isDarkMode]);

  const [tempoInicial, setTempoInicial] = useState(1500); // 25 minutos em segundos
  const [tempo, setTempo] = useState(tempoInicial);
  const [tempoRestante, setTempoRestante] = useState(tempoInicial); // Estado global do tempo restante
  const [rodando, setRodando] = useState(false);
  const [emocaoMandala, setEmocaoMandala] = useState<'neutra' | 'alegria' | 'calma' | 'cansaço'>('neutra');
  const [inputManual, setInputManual] = useState("");
  const [erroInput, setErroInput] = useState("");
  const [presetAtivo, setPresetAtivo] = useState<Id<"presets"> | null>(null); // ID do preset ativo
  const [abaAtiva, setAbaAtiva] = useState<"presets" | "historico" | "memoria">("presets"); // Controle de abas
  const [tempoInicio, setTempoInicio] = useState<number | null>(null); // Para calcular duração
  const [periodoSelecionado, setPeriodoSelecionado] = useState<"hoje" | "semana" | "mes">("hoje");
  const [rewardTriggered, setRewardTriggered] = useState(false); // Evitar múltiplos triggers
  const [mandalaActive, setMandalaActive] = useState(false); // Estado da mandala
  const [mandalaMood, setMandalaMood] = useState<"foco" | "criatividade" | "relaxamento" | "energia">("foco");
  const [iaSugestao, setIaSugestao] = useState<{ sugestao: string; descricao: string } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [interacoes, setInteracoes] = useState({ botaoPlay: 0, botaoPause: 0, botaoReset: 0 });
  const [numeroPausas, setNumeroPausas] = useState(0);
  const [ajustesAdaptativos, setAjustesAdaptativos] = useState({
    tendencia: "media" as "alta" | "media" | "baixa",
    estilo: "leve" as "intenso" | "leve" | "ritualistico",
    sugestaoCor: "#2ECC71",
    ritmo: 25,
  });
  const [estadoEmocional, setEstadoEmocional] = useState({
    emocao: "neutro" as "disperso" | "centrado" | "neutro",
    cor: "#2ECC71",
    pulsacao: 0.5,
  });
  const [contadorSessoesIA, setContadorSessoesIA] = useState(0);
  const [carregandoInsights, setCarregandoInsights] = useState(false);
  const [paletaAdaptativa, setPaletaAdaptativa] = useState({
    primary: "#2ECC71",
    accent: "#FFD700",
  });
  const [mandalaIntensityModifier, setMandalaIntensityModifier] = useState(1);
  const [mandalaState, setMandalaState] = useState<"idle" | "starting" | "running" | "completing">("idle");
  const [ambienteAdaptativo, setAmbienteAdaptativo] = useState({
    corFundo: '#1C1C1C',
    corMandala: '#2ECC71',
    corAccent: '#FFD700',
    transicao: '1.5s ease-in-out',
    intensidadeLuz: 0.7,
  });

  // Convex hooks
  const presetsQuery = useQuery(api.presets.listar);
  const adicionarPreset = useMutation(api.presets.adicionar);
  const removerPreset = useMutation(api.presets.remover);
  const registrarUso = useMutation(api.historico.registrarUso);
  const registrarMandala = useMutation(api.mandalas.registrarMandala);
  const registrarSessao = useMutation(api.sessoes.registrar);
  const iniciarSessaoConvex = useMutation(api.userSessions.iniciarSessao);
  const finalizarSessaoConvex = useMutation(api.userSessions.finalizarSessao);
  const registrarPadraoUso = useMutation(api.usagePatterns.registrar);
  const padrõesUsoRecentes = useQuery(api.usagePatterns.listarRecentes, { userId: "guest", limit: 10 });
  const analisesPadroes = useQuery(api.usagePatterns.analisarPadroes, { userId: "guest", limit: 10 });
  const historicoQuery = useQuery(api.historico.listarHistorico, {});
  const estatisticasPorPeriodo = useQuery(api.historico.estatisticasPorPeriodo, { periodo: periodoSelecionado });
  const estatisticasSemanais = useQuery(api.historico.estatisticasSemanais);
  const historicoDetalhado = useQuery(api.historico.historicoDetalhado);
  const rankingPresets = useQuery(api.historico.rankingPresets);
  const estatisticasGerais = useQuery(api.historico.estatisticasGerais);
  const estatisticasPorDia = useQuery(api.historico.estatisticasPorDia);
  const sessoesRegistradasQuery = useQuery(api.sessoes.listar);
  
  // Ciclo Vital hooks
  const incrementarCiclo = useMutation(api.ciclos.incrementarCiclo);
  const ciclosQuery = useQuery(api.ciclos.obterCiclos, { usuarioId: "guest" });
  const registrarMemoriaElemental = useMutation(api.ciclos.registrarMemoria);

  // Memoize queries to prevent re-renders
  const presets = useMemo(() => presetsQuery || [], [presetsQuery]);
  const historico = useMemo(() => historicoQuery || [], [historicoQuery]);
  const sessoesRegistradas = useMemo(() => sessoesRegistradasQuery || [], [sessoesRegistradasQuery]);

  const adaptivePrimary = paletaAdaptativa.primary ?? estadoEmocional.cor;
  const adaptiveAccent = paletaAdaptativa.accent ?? "#FFD700";
  const mandalaAdaptiveIntensity = clamp(
    estadoEmocional.pulsacao * mandalaIntensityModifier,
    0.3,
    1.4
  );


  // Função para aplicar ajustes adaptativos da IA
  const applyAdaptiveAdjustments = useCallback((adjustments: Record<string, unknown>) => {
    if (!adjustments) return;

    console.info("[Adaptive IA] 🎨 Aplicando ajustes adaptativos...", adjustments);

    // 1. Ajustar paleta de cores sutilmente
    if (adjustments.palette && typeof adjustments.palette === "object") {
      const palette = adjustments.palette as { primary?: string; accent?: string; secondary?: string };
      setPaletaAdaptativa((prev) => {
        const newPalette = {
          primary: palette.primary || prev.primary,
          accent: palette.accent || palette.secondary || prev.accent,
        };
        console.info("[Adaptive IA] 🎨 Paleta atualizada:", { anterior: prev, nova: newPalette });
        return newPalette;
      });
    }

    // 2. Ajustar tempo base em ±5%
    if (typeof adjustments.tempoModifier === "number" && !Number.isNaN(adjustments.tempoModifier)) {
      const modifier = clamp(adjustments.tempoModifier, 0.95, 1.05);
      if (rodando) {
        setTempoRestante((prev) => {
          const novoTempo = clamp(Math.round(prev * modifier), 60, 7200);
          console.info(`[Adaptive IA] ⏱️  Tempo ajustado durante execução: ${prev}s → ${novoTempo}s (${modifier}x)`);
          return novoTempo;
        });
      } else {
        const novoTempo = clamp(Math.round(tempoInicial * modifier), 300, 7200);
        console.info(`[Adaptive IA] ⏱️  Tempo base ajustado: ${tempoInicial}s → ${novoTempo}s (${modifier}x)`);
        setTempoInicial(novoTempo);
        setTempo(novoTempo);
        setTempoRestante(novoTempo);
      }
    }

    // 3. Ajustar intensidade da mandala
    if (adjustments.mandalaVariance) {
      const varianceMap: Record<string, number> = {
        calm: 0.85,
        default: 1,
        vivid: 1.15,
      };
      let intensityValue = 1;
      if (typeof adjustments.mandalaVariance === "number") {
        intensityValue = clamp(adjustments.mandalaVariance, 0.7, 1.3);
      } else {
        intensityValue = varianceMap[adjustments.mandalaVariance as string] ?? 1;
      }
      console.info(`[Adaptive IA] 🌸 Mandala ajustada: ${adjustments.mandalaVariance} (intensidade: ${intensityValue})`);
      setMandalaIntensityModifier(intensityValue);
    }

    console.info("[Adaptive IA] ✅ Ajustes aplicados com sucesso");
  }, [rodando, tempoInicial]);

  // Função para buscar insights adaptativos da IA
  const fetchAdaptiveInsights = useCallback(async () => {
    if (carregandoInsights) return;
    if (!sessoesRegistradas || sessoesRegistradas.length === 0) return;

    try {
      setCarregandoInsights(true);
      console.info("[Adaptive IA] 🧠 Buscando insights... (após 3 sessões)");
      
      const usageHistoryPayload = sessoesRegistradas
        .slice(0, 12) // Pegar últimas 12 sessões
        .map((sessao) => ({
          preset: sessao.preset,
          duration: sessao.duracao,
          startedAt: sessao.timestamp,
        }))
        .reverse(); // Ordem cronológica

      console.info(`[Adaptive IA] 📊 Enviando ${usageHistoryPayload.length} sessões para análise`);

      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usageHistory: usageHistoryPayload }),
      });

      if (!response.ok) {
        throw new Error(`API insights status ${response.status}`);
      }

      const data = await response.json();
      if (data?.adjustments) {
        applyAdaptiveAdjustments(data.adjustments);
        setContadorSessoesIA(0); // Resetar contador após aplicar ajustes
        console.info("[Adaptive IA] 🔄 Contador resetado. Próximos ajustes em 3 sessões.");
      }
    } catch (error) {
      console.error("[Adaptive IA] ❌ Erro ao buscar insights:", error);
    } finally {
      setCarregandoInsights(false);
    }
  }, [carregandoInsights, sessoesRegistradas, applyAdaptiveAdjustments]);

  useEffect(() => {
    if (
      sessoesRegistradas &&
      sessoesRegistradas.length >= 3 &&
      contadorSessoesIA >= 3
    ) {
      fetchAdaptiveInsights();
    }
  }, [sessoesRegistradas, contadorSessoesIA, fetchAdaptiveInsights]);

  // Exibir análise de padrões de uso quando disponível
  useEffect(() => {
    if (analisesPadroes && analisesPadroes.totalSessoes > 0) {
      console.log("[Usage Patterns] 📊 Análise de padrões:", {
        totalSessoes: analisesPadroes.totalSessoes,
        mediaDuracao: `${analisesPadroes.mediaDuracao} min`,
        horarioMaisFrequente: analisesPadroes.horarioMaisFrequente,
        presetMaisUsado: analisesPadroes.presetMaisUsado,
        moodDominante: analisesPadroes.moodDominante,
      });
    }
  }, [analisesPadroes]);

  // Aplicar ajustes adaptativos baseados em padrões de uso
  useEffect(() => {
    if (!padrõesUsoRecentes || padrõesUsoRecentes.length < 3) return;

    // Analisar padrões e obter ajustes
    const ajustes = analisarPadrao(padrõesUsoRecentes, tempoInicial);
    
    // Aplicar ajuste de tempo (apenas se não estiver rodando)
    if (!rodando && ajustes.tempoAjustado !== tempoInicial) {
      const diferencaSegundos = ajustes.tempoAjustado - tempoInicial;
      const diferencaMinutos = Math.round(diferencaSegundos / 60);
      
      console.log(`[Adaptive Engine] ⚙️ Ajustando tempo base: ${diferencaMinutos > 0 ? '+' : ''}${diferencaMinutos} min`);
      
      setTempoInicial(ajustes.tempoAjustado);
      setTempo(ajustes.tempoAjustado);
      setTempoRestante(ajustes.tempoAjustado);
    }
    
    // Aplicar ajuste de intensidade da mandala
    const intensidadeMap = {
      leve: 0.7,
      normal: 1.0,
      forte: 1.3,
    };
    
    const novaIntensidade = intensidadeMap[ajustes.intensidadeMandala];
    if (novaIntensidade !== mandalaIntensityModifier) {
      console.log(`[Adaptive Engine] 🌸 Ajustando intensidade da mandala: ${ajustes.intensidadeMandala}`);
      setMandalaIntensityModifier(novaIntensidade);
    }

    // Calcular e exibir score de produtividade
    const score = calcularScoreProdutividade(padrõesUsoRecentes);
    console.log(`[Adaptive Engine] 🎯 Score de produtividade: ${score}/100`);

    // Detectar melhor horário
    const melhorHorario = detectarMelhorHorario(padrõesUsoRecentes);
    if (melhorHorario) {
      console.log(`[Adaptive Engine] ⏰ Melhor horário para foco: ${melhorHorario.hora}:00 (${melhorHorario.confianca}% confiança)`);
    }

    // Exibir recomendação
    if (ajustes.recomendacao) {
      console.log(`[Adaptive Engine] 💡 ${ajustes.recomendacao}`);
    }
  }, [padrõesUsoRecentes, rodando, tempoInicial, mandalaIntensityModifier]);

  // Ajustar ambiente visual baseado em contexto e padrões
  useEffect(() => {
    const atualizarAmbiente = () => {
      const horaAtual = new Date().getHours();
      const sessõesHoje = padrõesUsoRecentes?.filter(p => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return p.createdAt >= hoje.getTime();
      }) || [];

      // Detectar tendência de cansaço
      const tendenciaCansaco = padrõesUsoRecentes && padrõesUsoRecentes.length >= 3
        ? detectarTendenciaCansaco(padrõesUsoRecentes)
        : false;

      // Calcular média de duração e total de pausas
      const mediaDuracao = padrõesUsoRecentes && padrõesUsoRecentes.length > 0
        ? padrõesUsoRecentes.reduce((acc, p) => acc + p.duration, 0) / padrõesUsoRecentes.length
        : undefined;

      const ultimaSessao = padrõesUsoRecentes?.[0];

      // Ajustar ambiente
      const novoAmbiente = ajustarAmbiente({
        horario: horaAtual,
        sessoesConcluidas: sessõesHoje.length,
        ultimaSessaoDuracao: ultimaSessao?.duration,
        tendenciaCansaco,
        mediaDuracao,
        totalPausas: numeroPausas,
      });

      setAmbienteAdaptativo(novoAmbiente);

      // Ajustar velocidade da animação da mandala
      const nivelEnergia = tendenciaCansaco ? 'baixa' 
        : sessõesHoje.length > 5 ? 'baixa'
        : sessõesHoje.length <= 2 ? 'alta'
        : 'media';
      
      const velocidade = calcularVelocidadeMandala(nivelEnergia);
      console.log(`[Environment Feedback] 🎭 Velocidade mandala: ${velocidade}x`);
    };

    atualizarAmbiente();

    // Atualizar a cada hora para ajuste de período do dia
    const interval = setInterval(atualizarAmbiente, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [padrõesUsoRecentes, numeroPausas]);

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
    const [, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}`;
  };

  // Função para iniciar o timer
  const iniciar = async () => {
    // Transição visual de início
    setMandalaState("starting");
    
    // Emoção de alegria ao iniciar foco
    setEmocaoMandala('alegria');
    
    setTimeout(() => {
      setMandalaState("running");
      setRodando(true);
      // Emoção neutra após iniciar
      setTimeout(() => setEmocaoMandala('neutra'), 2000);
    }, 800); // Dar tempo para animação de expansão
    
    setTempoInicio(Date.now());
    setMandalaActive(false); // Fechar mandala ao iniciar novo ciclo
    setRewardTriggered(false); // Permitir nova mandala ao fim do ciclo
    
    // Incrementar contador de play
    const novasInteracoes = { ...interacoes, botaoPlay: interacoes.botaoPlay + 1 };
    setInteracoes(novasInteracoes);
    
    // Detectar device e idioma
    const device = /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
    const idioma = navigator.language || 'pt-BR';
    
    // Iniciar sessão no Convex (silencioso)
    try {
      const preset = presets.find(p => p._id === presetAtivo);
      const presetNome = preset?.nome || "Manual";
      const duracaoMinutos = Math.floor(tempoInicial / 60);
      
      const newSessionId = await iniciarSessaoConvex({
        presetAtivo: presetNome,
        duracaoMinutos,
        idioma,
        device,
        userId: null,
      });
      
      setSessionId(newSessionId);
      console.log("[Tracking] Sessão iniciada:", newSessionId);
      
      // Registrar padrão de uso
      const mood = presetNome.toLowerCase().includes("foco") 
        ? "foco"
        : presetNome.toLowerCase().includes("criat")
        ? "criatividade"
        : presetNome.toLowerCase().includes("relax")
        ? "relaxamento"
        : presetNome.toLowerCase().includes("energia")
        ? "energia"
        : undefined;
      
      await registrarPadraoUso({
        userId: "guest", // Futuramente pode usar ID real do usuário
        preset: presetNome,
        startTime: Date.now(),
        duration: duracaoMinutos,
        mood,
      });
      
      console.log("[Usage Patterns] Padrão de uso registrado");
    } catch (error) {
      console.error("[Tracking] Erro ao iniciar sessão:", error);
    }
  };

  // Função para pausar o timer
  const pausar = async () => {
    setRodando(false);
    
    // Emoção de calma ao pausar
    setEmocaoMandala('calma');
    
    // Incrementar contador de pause
    setInteracoes(prev => ({ ...prev, botaoPause: prev.botaoPause + 1 }));
    setNumeroPausas(prev => prev + 1);
    
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
  const resetar = async () => {
    setRodando(false);
    setTempo(tempoInicial);
    setTempoRestante(tempoInicial);
    setPresetAtivo(null);
    setRewardTriggered(false); // Reset flag de recompensa
    setMandalaActive(false); // Fechar mandala se estiver aberta
    setMandalaState("idle"); // Voltar ao estado inicial
    
    // Emoção neutra ao resetar
    setEmocaoMandala('neutra');
    
    // Incrementar contador de reset
    const novasInteracoes = { ...interacoes, botaoReset: interacoes.botaoReset + 1 };
    setInteracoes(novasInteracoes);
    
    // Finalizar sessão no Convex se existir
    if (sessionId) {
      try {
        await finalizarSessaoConvex({
          sessionId,
          pausas: numeroPausas,
          interacoes: novasInteracoes,
        });
        console.log("[Tracking] Sessão finalizada no reset");
      } catch (error) {
        console.error("[Tracking] Erro ao finalizar sessão:", error);
      }
      
      setSessionId(null);
      setNumeroPausas(0);
      setInteracoes({ botaoPlay: 0, botaoPause: 0, botaoReset: 0 });
    }
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
  
  // useEffect para ajustar emoção baseada no progresso
  useEffect(() => {
    if (!rodando) return;
    
    const progressoAtual = tempoRestante / tempoInicial;
    
    // Quando tempo estiver abaixo de 20% → cansaço
    if (progressoAtual < 0.2 && progressoAtual > 0) {
      setEmocaoMandala('cansaço');
      console.info('[Mandala Viva] 😴 Emoção: cansaço (progresso < 20%)');
    }
    // Entre 20% e 100% → neutra (foco)
    else if (progressoAtual >= 0.2 && emocaoMandala !== 'neutra' && emocaoMandala !== 'alegria') {
      setEmocaoMandala('neutra');
      console.info('[Mandala Viva] 🌿 Emoção: neutra (foco ativo)');
    }
    // Quando zerar → neutra (descanso)
    if (tempoRestante === 0) {
      setEmocaoMandala('neutra');
      console.info('[Mandala Viva] 🧘 Emoção: neutra (sessão concluída)');
    }
  }, [rodando, tempoRestante, tempoInicial, emocaoMandala]);

  // Detectar emoção quando sessão finaliza
  const detectarEmocaoSessao = useCallback(async (tempoMinutos: number, pausasCount: number) => {
    try {
      const response = await fetch('/api/emocao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId,
          tempo: tempoMinutos,
          pausas: pausasCount,
        }),
      });
      
      const resultado = await response.json();
      setEstadoEmocional(resultado);
      console.info("Emoção detectada:", resultado.emocao);
    } catch (error) {
      console.error("[Detecção Emocional] Erro:", error);
    }
  }, [sessionId]);

  // useEffect para registrar uso quando timer terminar
  useEffect(() => {
    if (!rodando && presetAtivo && tempoInicio && tempoRestante === 0 && !rewardTriggered) {
      // Transição visual de conclusão
      setMandalaState("completing");
      
      const duracao = Math.floor((Date.now() - tempoInicio) / 1000);
      if (duracao > 0) {
        registrarUso({ presetId: presetAtivo, duracao }).catch(console.error);
        
        // Buscar nome do preset para registrar mandala
        const preset = presets.find(p => p._id === presetAtivo);
        const presetName = preset?.nome || "Preset desconhecido";
        
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
          body: JSON.stringify({ presetName, duration: duracao })
        })
          .then(res => res.json())
          .then(() => {
            // Mensagem AI processada (não exibida diretamente)
          })
          .catch(err => {
            console.error("Erro ao buscar mensagem AI:", err);
          });

        // Buscar sugestão de próximo modo da IA
        const ciclosHoje = historico.filter(h => {
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          return h.usadoEm >= hoje.getTime();
        }).length;

        fetch('/api/ia-next-mode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            preset: presetName,
            duracao: Math.floor(duracao / 60),
            contexto: {
              ciclosConcluidos: ciclosHoje + 1,
              ultimoMood: mood,
              energiaAtual: duracao >= 2700 ? 'média' : 'alta',
            }
          })
        })
          .then(res => res.json())
          .then(data => {
            setIaSugestao(data);
            
            // Registrar sessão completa no Convex
            registrarSessao({
              preset: presetName,
              duracao: Math.floor(duracao / 60),
              resultadoIA: data.sugestao,
              humor: mood,
              energiaAntes: duracao >= 2700 ? 'média' : 'alta',
              energiaDepois: 'calma',
            }).catch(console.error);
            
            // Incrementar ciclo vital
            incrementarCiclo({ usuarioId: "guest" })
              .then((resultado) => {
                console.info('[Ciclo Vital] Ciclo incrementado:', resultado);
                
                // Se evoluiu, registrar na memória elemental
                if (resultado?.evoluiu) {
                  const elementos: Record<string, { nome: string; icone: string }> = {
                    terra: { nome: "Terra", icone: "🌍" },
                    agua: { nome: "Água", icone: "💧" },
                    fogo: { nome: "Fogo", icone: "🔥" },
                    ar: { nome: "Ar", icone: "🌬️" },
                    eter: { nome: "Éter", icone: "✨" },
                  };
                  
                  const elementoAtual = elementos[resultado.elemento as keyof typeof elementos] || { nome: resultado.elemento, icone: "✨" };
                  
                  // Registrar na Memória Elemental
                  registrarMemoriaElemental({
                    usuarioId: "guest",
                    elemento: resultado.elemento,
                    totalCiclos: resultado.totalCiclos,
                  }).catch(err => {
                    console.error('[Memória Elemental] Erro ao registrar:', err);
                  });
                  
                  // Mostrar toast de evolução
                  toast(`Você evoluiu para o Elemento ${elementoAtual.nome}! ${elementoAtual.icone}`, {
                    description: `${resultado.totalCiclos} ciclos completados`,
                    duration: 5000,
                  });
                }
              })
              .catch(err => {
                console.error('[Ciclo Vital] Erro ao incrementar:', err);
              });
          })
          .catch(err => {
            console.error("Erro ao buscar sugestão IA:", err);
          });
        
        // Finalizar sessão no Convex
        if (sessionId) {
          finalizarSessaoConvex({
            sessionId,
            pausas: numeroPausas,
            interacoes,
            sentimento: mood,
          }).catch(err => console.error("[Tracking] Erro ao finalizar:", err));
          
          console.log("[Tracking] Sessão concluída com sucesso");
          
          const preset = presets.find(p => p._id === presetAtivo);
          const tempoMinutos = preset?.tempoMinutos || 25;
          detectarEmocaoSessao(tempoMinutos, numeroPausas);
          
          // Incrementar contador de sessões para IA adaptativa
          setContadorSessoesIA((prev) => {
            const novoContador = prev + 1;
            console.info(`[Adaptive IA] 📈 Sessões completas: ${novoContador}/3`);
            return novoContador;
          });
        }
        
        // Mostrar mandala de recompensa (apenas uma vez)
        setMandalaActive(true);
        setRewardTriggered(true);
      }
      setTempoInicio(null);
    }
  }, [rodando, presetAtivo, tempoInicio, tempoRestante, registrarUso, registrarMandala, registrarSessao, finalizarSessaoConvex, presets, historico, rewardTriggered, sessionId, numeroPausas, interacoes, detectarEmocaoSessao]);

  // Sincronizar tempo com tempoRestante
  useEffect(() => {
    setTempo(tempoRestante);
  }, [tempoRestante]);

  // Buscar ajustes adaptativos ao carregar o app
  useEffect(() => {
    const buscarAjustes = async () => {
      try {
        const response = await fetch('/api/adaptar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: null }),
        });
        
        const resultado = await response.json();
        setAjustesAdaptativos(resultado);
        console.info("[Ajuste IA]", resultado);
      } catch (error) {
        console.error("[Ajuste IA] Erro ao buscar:", error);
      }
    };
    
    buscarAjustes();
  }, []);

  // Atualizar ajustes após sessão concluída
  useEffect(() => {
    if (!mandalaActive && rewardTriggered) {
      const buscarAjustes = async () => {
        try {
          const response = await fetch('/api/adaptar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: null }),
          });
          
          const resultado = await response.json();
          setAjustesAdaptativos(resultado);
          console.info("[Ajuste IA] Atualizado após sessão:", resultado);
        } catch (error) {
          console.error("[Ajuste IA] Erro:", error);
        }
      };
      
      buscarAjustes();
    }
  }, [mandalaActive, rewardTriggered]);

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-4 gap-4"
      style={{ 
        backgroundColor: ambienteAdaptativo.corFundo,
        transition: `background-color ${ambienteAdaptativo.transicao}`,
      }}
      role="application"
      aria-label="Timer X2 - Aplicativo de foco e produtividade"
    >
      {/* Mandala de Recompensa com feedback emocional */}
      <MandalaReward 
        visible={mandalaActive}
        mood={mandalaMood}
        intensity={mandalaAdaptiveIntensity}
        iaSugestao={iaSugestao}
        corEmocional={adaptivePrimary}
        onIniciarSugestao={() => {
          // Fechar mandala e resetar timer
          setMandalaActive(false);
          setIaSugestao(null);
          resetar();
          // TODO: Criar preset automaticamente com nome sugerido pela IA
          console.log("Iniciar modo sugerido:", iaSugestao?.sugestao);
        }}
      />
      
      <div className="flex items-center justify-center gap-4 w-full">
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

      {/* Phone Frame com ajustes adaptativos, emocionais, tema e ambiente */}
      <motion.div 
        className="w-full max-w-sm mx-auto"
        animate={{ 
          opacity: mandalaActive ? 0.3 : 1,
          scale: ajustesAdaptativos.tendencia === "baixa" ? 0.98 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: ambienteAdaptativo.corFundo,
            borderWidth: '2px',
            borderColor: `${ambienteAdaptativo.corMandala}33`,
            transition: `all ${ambienteAdaptativo.transicao}`,
            boxShadow: `0 0 ${18 * mandalaAdaptiveIntensity * ambienteAdaptativo.intensidadeLuz}px ${ambienteAdaptativo.corAccent}40`,
          }}
        >
          {/* Header */}
          <div className="p-6 text-center border-b border-[#2ECC71]/10">
            {/* Ciclo Vital - discreto no topo */}
            <div className="flex justify-center mb-3">
              {ciclosQuery && (
                <CicloVital
                  totalCiclos={ciclosQuery.totalCiclos}
                  mostrarDetalhes={false}
                />
              )}
            </div>
            
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
            ) : abaAtiva === "historico" ? (
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
            ) : abaAtiva === "memoria" ? (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-[#FFD700]">🌍💧🔥🌬️✨ Memória Elemental</h3>
                </div>
                
                <div className="bg-[#1C1C1C]/50 rounded-lg p-2 border border-[#FFD700]/20">
                  <MemoriaElemental usuarioId="guest" />
                </div>
              </div>
            ) : null}

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
            {/* 🌕 Marcador Lunar (topo) */}
            <motion.div 
              className="absolute top-4 right-4 text-xs text-gray-400 select-none z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                <span className="text-base" role="img" aria-label="Fase lunar">
                  {faseDaLua() === 'cheia' && '🌕'}
                  {faseDaLua() === 'nova' && '🌑'}
                  {faseDaLua() === 'crescente' && '🌓'}
                  {faseDaLua() === 'minguante' && '🌗'}
                </span>
                <span className="text-[10px] font-medium tracking-wide capitalize opacity-80">
                  {faseDaLua()}
                </span>
              </div>
            </motion.div>
            
            {/* Timer Circle com estados visuais reativos */}
            <div className="flex justify-center relative">
              {/* Partículas de conclusão (apenas no estado completing) */}
              {mandalaState === "completing" && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full bg-[#2ECC71]"
                      style={{
                        top: "50%",
                        left: "50%",
                      }}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos((i * Math.PI) / 4) * 120,
                        y: Math.sin((i * Math.PI) / 4) * 120,
                        opacity: 0,
                        scale: [0, 1, 0.5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </>
              )}

              <motion.div 
                className="w-48 h-48 rounded-full border-4 flex items-center justify-center shadow-lg relative"
                style={{
                  borderColor: mandalaState === "starting" 
                    ? ambienteAdaptativo.corAccent
                    : `${ambienteAdaptativo.corMandala}66`,
                  background: mandalaState === "starting"
                    ? `linear-gradient(135deg, ${ambienteAdaptativo.corAccent}1A, ${ambienteAdaptativo.corAccent}30)`
                    : `linear-gradient(135deg, ${ambienteAdaptativo.corMandala}1A, ${ambienteAdaptativo.corAccent}10)`,
                  transition: `all ${ambienteAdaptativo.transicao}`,
                  boxShadow: mandalaState === "starting"
                    ? `0 0 ${40 * ambienteAdaptativo.intensidadeLuz}px ${ambienteAdaptativo.corAccent}80`
                    : `0 0 ${28 * mandalaAdaptiveIntensity * ambienteAdaptativo.intensidadeLuz}px ${ambienteAdaptativo.corAccent}60`,
                }}
                animate={{
                  scale: mandalaState === "starting"
                    ? [1, 1.15, 1.05]
                    : mandalaState === "completing"
                    ? [1, 1.2, 0.95]
                    : rodando 
                    ? [1, 1.03, 1] 
                    : [1, 1 + (0.02 * mandalaAdaptiveIntensity), 1],
                  opacity: mandalaState === "completing" ? [1, 1, 0.7] : 1,
                  boxShadow: mandalaState === "starting"
                    ? [
                        '0 0 30px #FFD70060',
                        '0 0 50px #FFD700A0',
                        '0 0 35px #FFD70070',
                      ]
                    : mandalaState === "completing"
                    ? [
                        `0 0 ${28 * mandalaAdaptiveIntensity}px ${adaptiveAccent}60`,
                        `0 0 60px #2ECC71A0`,
                        `0 0 80px #2ECC7160`,
                      ]
                    : rodando
                    ? [
                        `0 0 ${28 * mandalaAdaptiveIntensity}px ${adaptiveAccent}60`,
                        `0 0 ${35 * mandalaAdaptiveIntensity}px ${adaptiveAccent}80`,
                        `0 0 ${28 * mandalaAdaptiveIntensity}px ${adaptiveAccent}60`,
                      ]
                    : `0 0 ${28 * mandalaAdaptiveIntensity}px ${adaptiveAccent}60`,
                }}
                transition={{
                  duration: mandalaState === "starting"
                    ? 0.8
                    : mandalaState === "completing"
                    ? 1.5
                    : rodando 
                    ? 1 
                    : (estadoEmocional.emocao === "disperso" ? 1.5 : 3),
                  repeat: mandalaState === "starting" || mandalaState === "completing" ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Mandala viva de fundo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mandala 
                    progresso={tempo > 0 ? 1 - (tempo / tempoInicial) : 1}
                    intensidade={
                      rodando
                        ? (mandalaIntensityModifier >= 1.2 ? 'forte' : 'media')
                        : (mandalaIntensityModifier <= 0.8 ? 'leve' : 'media')
                    }
                    pausado={!rodando}
                    ativo={rodando}
                    modoRespiracao={!rodando && tempo === 0} // Respiração apenas após conclusão
                    ciclo={8}
                    emocao={emocaoMandala}
                  />
                </div>

                {/* Conteúdo do timer sobre a mandala */}
                <div className="text-center relative z-10">
                  <motion.div 
                    className="text-3xl font-mono font-bold text-[#F9F9F9] mb-2"
                    style={{ textShadow: '0 0 20px rgba(0,0,0,0.8)' }}
                    animate={{
                      opacity: [1, 0.85, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {formatarTempo(tempo)}
                  </motion.div>
                  <div className="text-sm text-[#F9F9F9]/70" style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
                    {rodando ? "Running..." : tempo === 0 ? "Time's up!" : "Ready to begin"}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Control Buttons com animações suaves e acessibilidade */}
            <div className="flex justify-center gap-4 relative z-10" role="group" aria-label="Controles do timer">
              <motion.div
                whileHover={{ scale: rodando || tempo === 0 ? 1 : 1.1 }}
                whileTap={{ scale: rodando || tempo === 0 ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  onClick={iniciar}
                  disabled={rodando || tempo === 0}
                  className="w-14 h-14 rounded-full bg-[#2ECC71] hover:bg-[#2ECC71]/80 text-white shadow-lg transition-all duration-300 ease-in-out relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ pointerEvents: 'auto' }}
                  aria-label="Iniciar timer"
                  aria-disabled={rodando || tempo === 0}
                  title="Iniciar sessão de foco"
                >
                  <motion.div
                    animate={!rodando && tempo > 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Play className="w-6 h-6 ml-1" aria-hidden="true" />
                  </motion.div>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: !rodando ? 1 : 1.1 }}
                whileTap={{ scale: !rodando ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={pausar}
                  disabled={!rodando}
                  className="w-14 h-14 rounded-full border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 hover:border-[#FFD700] transition-all duration-300 ease-in-out relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ pointerEvents: 'auto' }}
                  aria-label="Pausar timer"
                  aria-disabled={!rodando}
                  title="Pausar sessão de foco"
                >
                  <Pause className="w-6 h-6" aria-hidden="true" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: -15 }}
                whileTap={{ scale: 0.95, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={resetar}
                  className="w-14 h-14 rounded-full border-[#F9F9F9]/30 text-[#F9F9F9] hover:bg-[#F9F9F9]/10 hover:border-[#F9F9F9]/50 transition-all duration-300 ease-in-out relative z-10"
                  style={{ pointerEvents: 'auto' }}
                  aria-label="Resetar timer"
                  title="Resetar timer e limpar sessão"
                >
                  <RotateCcw className="w-6 h-6" aria-hidden="true" />
                </Button>
              </motion.div>
            </div>

            {/* 🜂 Painel Alquímico - Conversão simbólica de métricas */}
            {rodando && (
              <AlquimiaPanel
                energia={mandalaAdaptiveIntensity} // Usa intensidade da mandala como proxy de energia
                foco={tempo > 0 ? 1 - (tempo / tempoInicial) : 1} // Progresso do foco
                emocao={emocaoMandala}
                fase={faseDaLua()}
              />
            )}
          </div>

          {/* Bottom Navigation com animações suaves */}
          <div className="bg-[#2ECC71]/5 border-t border-[#2ECC71]/10 p-4">
            <div className="flex justify-around">
              <motion.button 
                onClick={() => setAbaAtiva("presets")}
                className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ease-in-out rounded-lg hover:bg-[#2ECC71]/10 ${
                  abaAtiva === "presets" 
                    ? "text-[#2ECC71]" 
                    : "text-[#F9F9F9]/70 hover:text-[#F9F9F9]"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Leaf className="w-5 h-5" />
                <span className="text-xs font-medium">Presets</span>
              </motion.button>
              
              <motion.button 
                onClick={() => setAbaAtiva("historico")}
                className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ease-in-out rounded-lg hover:bg-[#2ECC71]/10 ${
                  abaAtiva === "historico" 
                    ? "text-[#2ECC71]" 
                    : "text-[#F9F9F9]/70 hover:text-[#F9F9F9]"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Clock className="w-5 h-5" />
                <span className="text-xs font-medium">Histórico</span>
              </motion.button>

              <motion.button 
                onClick={() => setAbaAtiva("memoria")}
                className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ease-in-out rounded-lg hover:bg-[#2ECC71]/10 ${
                  abaAtiva === "memoria" 
                    ? "text-[#FFD700]" 
                    : "text-[#F9F9F9]/70 hover:text-[#F9F9F9]"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-medium">Memória</span>
              </motion.button>

              <motion.button
                className="flex flex-col items-center gap-1 p-2 text-[#F9F9F9]/70 hover:text-[#F9F9F9] transition-all duration-300 ease-in-out rounded-lg hover:bg-[#F9F9F9]/10"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-medium">AI</span>
              </motion.button>
              
              <motion.button 
                className="flex flex-col items-center gap-1 p-2 text-[#F9F9F9]/70 hover:text-[#F9F9F9] transition-all duration-300 ease-in-out rounded-lg hover:bg-[#F9F9F9]/10"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs font-medium">Config</span>
              </motion.button>
            </div>
          </div>
        </Card>
      </motion.div>
      </div>
      
      {/* Toaster para notificações de evolução */}
      <Toaster 
        position="top-center"
        richColors
        theme={isDarkMode ? "dark" : "light"}
      />
    </main>
  );
}
