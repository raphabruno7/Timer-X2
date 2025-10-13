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
import { Play, Pause, RotateCcw, Leaf, Check, Plus, Trash2 } from "lucide-react";
import { BottomNav } from "@/components/ui/BottomNav";
import { PresetSelector } from "@/components/ui/PresetSelector";
import { useTimerStore } from "@/store/useTimerStore";
import { PageTransition } from "@/components/PageTransition";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MandalaReward } from "@/components/ui/MandalaReward";
import { Mandala } from "@/components/ui/Mandala";
import { AlquimiaPanel } from "@/components/ui/AlquimiaPanel";
import { CicloVital, type Elemento } from "@/components/ui/CicloVital";
import { MemoriaElemental } from "@/components/ui/MemoriaElemental";
import { MandalaElemental } from "@/components/ui/MandalaElemental";
import { ModoMeditacao } from "@/components/ui/ModoMeditacao";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { analisarPadrao, calcularScoreProdutividade, detectarMelhorHorario } from "@/lib/adaptiveEngine";
import { ajustarAmbiente, detectarTendenciaCansaco, calcularVelocidadeMandala } from "@/lib/environmentFeedback";
import { faseDaLua } from "@/lib/lua";
import { tocarSomInicio, tocarSomCiclo, tocarSomFim, setVolume } from "@/lib/somSincronizado";
import { determinarElemento } from "@/components/ui/CicloVital";
import { vibrate, HapticPatterns } from "@/lib/haptics";
import { useRessonanciaEmocional } from "@/hooks/useRessonanciaEmocional";

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
  
  // Zustand store para presets
  const { minutes: storeMinutes } = useTimerStore();
  
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
  const [abaAtiva, setAbaAtiva] = useState<"presets" | "historico" | "memoria" | "mandala">("presets"); // Controle de abas
  const [tempoInicio, setTempoInicio] = useState<number | null>(null); // Para calcular duração
  const [periodoSelecionado, setPeriodoSelecionado] = useState<"hoje" | "semana" | "mes">("hoje");
  const [rewardTriggered, setRewardTriggered] = useState(false); // Evitar múltiplos triggers
  const [mandalaActive, setMandalaActive] = useState(false); // Estado da mandala
  const [mandalaMood, setMandalaMood] = useState<"foco" | "criatividade" | "relaxamento" | "energia">("foco");
  const [iaSugestao, setIaSugestao] = useState<{ sugestao: string; descricao: string } | null>(null);
  const [sessionId, setSessionId] = useState<Id<"user_sessions"> | null>(null);
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
  const [modoMeditacaoAtivo, setModoMeditacaoAtivo] = useState(false);
  const [ultimoMinutoTocado, setUltimoMinutoTocado] = useState<number | null>(null); // Para som de ciclo
  const [volumeSom, setVolumeSom] = useState(0.5); // Volume dos sons (0 a 1)

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

  // Estado visual da mandala (Prompt 18 - Sinestesia Adaptativa)
  const estadoVisualMandala = useMemo(() => {
    if (rodando) return 'foco-ativo';
    if (!rodando && tempo > 0 && tempo < tempoInicial) return 'reflexao';
    if (tempo === 0 && !rodando) return 'conclusao';
    return 'idle';
  }, [rodando, tempo, tempoInicial]) as 'foco-ativo' | 'reflexao' | 'conclusao' | 'idle';

  // Log de mudança de estado visual (debug)
  useEffect(() => {
    console.info('[Sinestesia Adaptativa] 🎨 Estado visual:', estadoVisualMandala);
  }, [estadoVisualMandala]);

  // Ressonância Emocional (Prompt 19): Preparar dados de sessões
  const dadosSessoesParaRessonancia = useMemo(() => {
    if (!sessoesRegistradas) return [];
    
    return sessoesRegistradas
      .slice(-10) // Últimas 10 sessões
      .map(sessao => ({
        duracao: sessao.duracao || 0,
        timestamp: sessao.timestamp || Date.now(),
      }));
  }, [sessoesRegistradas]);

  // Hook de Ressonância Emocional
  const { estado: estadoEmocionalRessonancia, config: configEmocional } = useRessonanciaEmocional(dadosSessoesParaRessonancia);

  // Log de mudança de estado emocional (debug)
  useEffect(() => {
    console.info('[Ressonância Emocional] 🎭 Estado emocional:', estadoEmocionalRessonancia, configEmocional);
  }, [estadoEmocionalRessonancia, configEmocional]);


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
    // Feedback háptico
    vibrate(HapticPatterns.medium);
    
    // Transição visual de início
    setMandalaState("starting");
    
    // Emoção de alegria ao iniciar foco
    setEmocaoMandala('alegria');
    
    // Tocar som de início baseado no elemento atual
    const elementoAtual = determinarElemento(ciclosQuery?.totalCiclos || 0);
    tocarSomInicio(elementoAtual);
    setUltimoMinutoTocado(null); // Resetar contador de minutos
    
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
    // Feedback háptico
    vibrate(HapticPatterns.light);
    
    setRodando(false);
    setTempo(tempoInicial);
    setTempoRestante(tempoInicial);
    setPresetAtivo(null);
    setRewardTriggered(false); // Reset flag de recompensa
    setMandalaActive(false); // Fechar mandala se estiver aberta
    setMandalaState("idle"); // Voltar ao estado inicial
    setUltimoMinutoTocado(null); // Resetar contador de minutos para sons
    
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
    setUltimoMinutoTocado(null); // Resetar contador de minutos
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
    setUltimoMinutoTocado(null); // Resetar contador de minutos
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
    setUltimoMinutoTocado(null); // Resetar contador de minutos
  };

  // useEffect para decrementar o tempo quando rodando for true
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (rodando && tempoRestante > 0) {
      interval = setInterval(() => {
        setTempoRestante((tempoAtual) => {
          const novoTempo = tempoAtual <= 1 ? 0 : tempoAtual - 1;
          
          // Tocar som de ciclo a cada minuto completo (exceto no início e no fim)
          if (novoTempo > 0 && novoTempo % 60 === 0 && novoTempo !== tempoInicial) {
            const minutoAtual = Math.floor(novoTempo / 60);
            if (ultimoMinutoTocado !== minutoAtual) {
              const elementoAtual = determinarElemento(ciclosQuery?.totalCiclos || 0);
              tocarSomCiclo(elementoAtual);
              setUltimoMinutoTocado(minutoAtual);
            }
          }
          
          // Tocar som de fim quando chegar a zero
          if (novoTempo === 0 && tempoAtual > 0) {
            const elementoAtual = determinarElemento(ciclosQuery?.totalCiclos || 0);
            tocarSomFim(elementoAtual);
            setRodando(false);
          }
          
          return novoTempo;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [rodando, tempoRestante, ultimoMinutoTocado, tempoInicial, ciclosQuery]);
  
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
          const tempoMinutos = preset?.minutos || 25;
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

  // Inicializar volume dos sons
  useEffect(() => {
    setVolume(volumeSom);
    console.info(`[Som Sincronizado] 🎵 Volume inicializado: ${Math.round(volumeSom * 100)}%`);
  }, [volumeSom]);

  // Sincronizar store Zustand com estados locais do timer
  useEffect(() => {
    if (storeMinutes > 0) {
      const segundos = storeMinutes * 60;
      setTempoInicial(segundos);
      setTempo(segundos);
      setTempoRestante(segundos);
      console.info(`[Preset Store] Timer atualizado: ${storeMinutes} minutos`);
    }
  }, [storeMinutes]);

  // Atalhos de teclado para controles do timer
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ignorar se estiver digitando em input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Spacebar ou Enter: Play/Pause toggle
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!rodando && tempo > 0) {
          iniciar();
        } else if (rodando) {
          pausar();
        }
      }

      // R: Reset
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetar();
      }

      // Esc: Fechar modais
      if (e.key === 'Escape') {
        setMandalaActive(false);
        setModoMeditacaoAtivo(false);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [rodando, tempo, tempoInicial]);

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
    <PageTransition>
    <main 
        className="min-h-screen flex flex-col items-center justify-between p-4 pb-24 relative overflow-hidden"
      style={{ 
          background: 'radial-gradient(ellipse at center, rgba(46, 204, 113, 0.08) 0%, rgba(255, 215, 0, 0.05) 50%, #1A1A1A 100%)',
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 6rem))',
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
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
      
      {/* Timer Frame centralizado */}
      <motion.div 
        className="w-full max-w-md mx-auto"
        animate={{ 
          opacity: mandalaActive ? 0.3 : 1,
          scale: ajustesAdaptativos.tendencia === "baixa" ? 0.98 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          className="rounded-3xl overflow-hidden shadow-2xl border-2 relative"
          style={{
            background: 'linear-gradient(to bottom, #1C1C1C 0%, #111111 100%)',
            borderColor: 'rgba(46, 204, 113, 0.2)',
            boxShadow: `0 0 ${30}px rgba(46, 204, 113, 0.15), 0 10px 40px rgba(0, 0, 0, 0.3)`,
          }}
        >
          {/* Header Minimalista */}
          <div className="p-6 pt-8 text-center relative">
            {/* Ícone de Configurações (discreto) */}
            <motion.a
              href="/settings"
              className="absolute top-8 right-6 text-[#F9F9F9]/40 hover:text-emerald-300 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Configurações"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </motion.a>

            <h1 className="text-3xl font-bold text-[#F9F9F9] tracking-wider mb-4 uppercase">
              TIMER X<span className="text-lg align-super">²</span>
            </h1>
            
            {/* Preset Selector */}
              <div className="mb-4">
              <PresetSelector />
                </div>
                </div>
                
          {/* Main Content - Timer Centralizado */}
          <div className="px-6 pb-6 mt-6 space-y-8 flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
            {/* Ícone de respiração discreto (ao pausar) */}
            <AnimatePresence>
              {!rodando && tempo > 0 && tempo < tempoInicial && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0.4, 0.7, 0.4],
                    scale: [0.9, 1, 0.9],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-2xl mb-2"
                  role="img"
                  aria-label="Respirar"
                >
                  🌬️
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timer Circle com estados visuais reativos (60% viewport) */}
            <div className="flex justify-center items-center relative w-full">
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
                        zIndex: 20,
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

              {/* Container do Timer com dimensões responsivas */}
              <motion.div 
                className="relative mx-auto rounded-full"
                style={{
                  width: 'clamp(240px, 70vw, 320px)',
                  height: 'clamp(240px, 70vw, 320px)',
                  maxWidth: 'min(80vw, 400px)',
                  maxHeight: 'min(70vh, 400px)',
                  aspectRatio: '1 / 1',
                  boxShadow: mandalaState === "starting"
                    ? '0 0 40px rgba(255, 215, 0, 0.4), 0 0 20px rgba(46, 204, 113, 0.2)'
                    : '0 0 30px rgba(46, 204, 113, 0.3)',
                }}
                animate={{
                  scale: mandalaState === "starting"
                    ? [1, 1.05, 1.02]
                    : mandalaState === "completing"
                    ? [1, 1.08, 1]
                    : rodando 
                    ? [1, 1.01, 1] 
                    : 1,
                  opacity: mandalaState === "completing" ? [1, 1, 0.9] : 1,
                }}
                transition={{
                  duration: mandalaState === "starting"
                    ? 0.8
                    : mandalaState === "completing"
                    ? 1.5
                    : rodando 
                    ? 3
                    : 0,
                  repeat: (mandalaState === "starting" || mandalaState === "completing") ? 0 : (rodando ? Infinity : 0),
                  ease: "easeInOut",
                }}
              >
                {/* Anel de borda com animação respiratória e brilho contextual */}
                <motion.div 
                  className="absolute inset-0 rounded-full border-4"
                  style={{
                    borderColor: mandalaState === "starting" 
                      ? '#FFD700'
                      : tempo === 0 
                        ? 'rgba(255, 215, 0, 0.6)' // Brilho dourado de conclusão
                        : 'rgba(46, 204, 113, 0.4)',
                    background: mandalaState === "starting"
                      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 215, 0, 0.15))'
                      : tempo === 0
                        ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.12), rgba(255, 215, 0, 0.06))' // Brilho de conclusão
                        : 'linear-gradient(135deg, rgba(46, 204, 113, 0.08), rgba(255, 215, 0, 0.03))',
                  }}
                  animate={!rodando && tempo > 0 && tempo < tempoInicial ? {
                    scale: [1, 1.015, 1],
                    opacity: [0.5, 0.75, 0.5],
                    borderColor: [
                      'rgba(46, 204, 113, 0.4)', 
                      'rgba(255, 215, 0, 0.35)', 
                      'rgba(46, 204, 113, 0.4)'
                    ],
                  } : undefined}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Brilho contextual por estado */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={
                    rodando
                      ? { opacity: 0.3, filter: "brightness(1.2)" } // Brilho suave esverdeado quando ativo
                      : tempo === 0
                        ? { opacity: 0.6, filter: "brightness(1.5)" } // Brilho dourado de conclusão
                        : { opacity: 0.2, filter: "brightness(0.8)" } // Brilho ameno quando pausado
                  }
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{
                    background: rodando
                      ? "radial-gradient(circle at center, rgba(46, 204, 113, 0.15), transparent)"
                      : tempo === 0
                        ? "radial-gradient(circle at center, rgba(255, 215, 0, 0.2), transparent)"
                        : "radial-gradient(circle at center, rgba(46, 204, 113, 0.08), transparent)"
                  }}
                />

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
                    modoRespiracao={!rodando && tempo === 0}
                    ciclo={8}
                    emocao={emocaoMandala}
                    estadoVisual={estadoVisualMandala}
                    ressonanciaEmocional={{
                      cor: configEmocional.cor,
                      velocidadeModifier: configEmocional.velocidadeModifier,
                      intensidadeModifier: configEmocional.intensidadeModifier,
                      saturacao: configEmocional.saturacao,
                    }}
                  />
                </div>

                {/* Conteúdo do timer sobre a mandala - Absolutamente centralizado */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
                  <motion.div 
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F9F9F9] tracking-wider mb-3"
                    style={{ 
                      textShadow: '0 2px 10px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.5)',
                      fontVariantNumeric: 'tabular-nums',
                      textAlign: 'center',
                      lineHeight: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      fontWeight: '700'
                    }}
                    animate={{
                      opacity: [1, 0.92, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    role="timer"
                    aria-label={`Tempo restante ${formatarTempo(tempo)}`}
                  >
                    {formatarTempo(tempo)}
                  </motion.div>
                  <div 
                    className="text-xs sm:text-sm font-semibold text-[#F9F9F9]/80 tracking-wide" 
                    style={{ 
                      textShadow: '0 1px 8px rgba(0,0,0,0.6)',
                      textAlign: 'center',
                      width: '100%'
                    }}
                  >
                    {rodando ? "EM FOCO" : tempo === 0 ? "SESSÃO CONCLUÍDA" : ""}
                  </div>
                  
                  {/* Região aria-live para anunciar apenas mudanças de estado */}
                  <div className="sr-only" aria-live="polite" aria-atomic="true">
                    {rodando && "Timer iniciado"}
                    {!rodando && tempo > 0 && tempo < tempoInicial && "Timer pausado"}
                    {tempo === 0 && "Sessão concluída"}
                    {tempo > 0 && tempo % 60 === 0 && `, ${Math.floor(tempo / 60)} minutos restantes`}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Control Buttons com animações suaves e acessibilidade */}
            <div className="flex justify-center gap-6 relative z-10 mt-8" role="group" aria-label="Controles do timer">
              {/* Botão Play */}
              <motion.div
                whileHover={{ scale: rodando || tempo === 0 ? 1 : 1.08 }}
                whileTap={{ scale: rodando || tempo === 0 ? 1 : 0.92 }}
                transition={{ 
                  scale: { type: "spring", stiffness: 400, damping: 17 }
                }}
              >
                <Button
                  size="lg"
                  onClick={iniciar}
                  disabled={rodando || tempo === 0}
                  className="play-button-no-shadow w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white transition-all duration-300 ease-in-out relative z-10 disabled:opacity-40 disabled:cursor-not-allowed focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 focus:outline-none shadow-none"
                  style={{ 
                    pointerEvents: 'auto',
                    boxShadow: 'none !important',
                    filter: 'none'
                  }}
                  aria-label="Iniciar sessão de foco"
                  aria-disabled={rodando || tempo === 0}
                  role="button"
                  tabIndex={0}
                >
                  <motion.div
                    animate={!rodando && tempo > 0 ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" aria-hidden="true" />
                  </motion.div>
                </Button>
              </motion.div>
              
              {/* Botão Pause */}
              <motion.div
                whileHover={{ scale: !rodando ? 1 : 1.08 }}
                whileTap={{ scale: !rodando ? 1 : 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  onClick={pausar}
                  disabled={!rodando}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all duration-300 ease-in-out relative z-10 disabled:opacity-40 disabled:cursor-not-allowed focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 focus:outline-none"
                  style={{ 
                    pointerEvents: 'auto',
                    boxShadow: !rodando ? 'none' : '0 4px 14px rgba(250, 204, 21, 0.5)'
                  }}
                  aria-label="Pausar sessão de foco"
                  aria-disabled={!rodando}
                  role="button"
                  tabIndex={0}
                >
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                </Button>
              </motion.div>
              
              {/* Botão Reset */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: -15 }}
                whileTap={{ scale: 0.92, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  onClick={resetar}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 ease-in-out relative z-10 focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 focus:outline-none"
                  style={{ 
                    pointerEvents: 'auto',
                    boxShadow: '0 4px 14px rgba(55, 65, 81, 0.4)'
                  }}
                  aria-label="Reiniciar timer e limpar sessão"
                  role="button"
                  tabIndex={0}
                >
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Barra de Navegação Inferior Fixa */}
      <BottomNav />
      
      {/* Modo Meditação Dinâmica */}
      <ModoMeditacao
        ativo={modoMeditacaoAtivo}
        onFechar={() => setModoMeditacaoAtivo(false)}
        timerRodando={rodando}
        timerPausado={!rodando && tempo > 0 && tempo < tempoInicial}
        tempoRestante={tempo}
        tempoTotal={tempoInicial}
        presetNome={presets.find(p => p._id === presetAtivo)?.nome}
        usuarioId="guest"
      />
      
      {/* Toaster para notificações de evolução */}
      <Toaster 
        position="top-center"
        richColors
        theme={isDarkMode ? "dark" : "light"}
      />
    </main>
    </PageTransition>
  );
}
