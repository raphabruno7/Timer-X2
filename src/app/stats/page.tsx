"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { TrendingUp, Trophy, History, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BottomNav } from "@/components/ui/BottomNav";

// Skeleton Loader Component
function SkeletonCard() {
  return (
    <div className="bg-[#1A1A1A] border-2 border-[#2ECC71]/20 rounded-3xl p-6 shadow-xl animate-pulse">
      <div className="h-6 bg-[#2ECC71]/10 rounded-lg w-32 mb-4"></div>
      <div className="space-y-3">
        <div className="h-8 bg-[#2ECC71]/10 rounded-lg w-full"></div>
        <div className="h-6 bg-[#2ECC71]/10 rounded-lg w-3/4"></div>
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [chartType, setChartType] = useState<"bar" | "line">("line");
  const [periodo, setPeriodo] = useState<"hoje" | "semana" | "mes">("semana");
  
  const estatisticasSemanais = useQuery(api.historico.estatisticasSemanais);
  const estatisticas = useQuery(api.historico.estatisticas);
  const estatisticasGerais = useQuery(api.historico.estatisticasGerais);
  const estatisticasPorDia = useQuery(api.historico.estatisticasPorDia);
  const estatisticasPorPeriodo = useQuery(api.historico.estatisticasPorPeriodo, { periodo });
  const rankingPresets = useQuery(api.historico.rankingPresets);
  const historicoDetalhado = useQuery(api.historico.historicoDetalhado);

  // Função para formatar dia da semana abreviado
  const formatarDiaSemana = (dataStr: string) => {
    const data = new Date(dataStr + 'T00:00:00');
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias[data.getDay()];
  };

  // Função para formatar tempo total
  const formatarTempoTotal = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    if (horas === 0) {
      return `${minutosRestantes}min`;
    }
    return `${horas}h ${minutosRestantes}min`;
  };

  // Função para formatar data curta
  const formatarDataCurta = (dataStr: string) => {
    const [, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}`;
  };

  // Encontrar o dia com mais minutos
  const maxMinutos = estatisticasSemanais 
    ? Math.max(...estatisticasSemanais.map(d => d.totalMinutosFocados))
    : 0;

  return (
    <>
      <main 
        className="min-h-screen flex flex-col p-4 pb-24 relative overflow-x-hidden"
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(46, 204, 113, 0.08) 0%, rgba(255, 215, 0, 0.05) 50%, #1A1A1A 100%)',
        }}
        role="main"
        aria-label="Estatísticas do Timer X2"
      >
        {/* Header Minimalista */}
        <div className="max-w-4xl mx-auto w-full mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-6"
          >
            <h1 className="text-3xl font-light text-[#F9F9F9] tracking-wide mb-2">
                Estatísticas
              </h1>
            <p className="text-sm font-light text-[#F9F9F9]/60 tracking-wide mb-4">
              Evolução do seu tempo
            </p>

            {/* Tabs de Período */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Tabs value={periodo} onValueChange={(value) => setPeriodo(value as "hoje" | "semana" | "mes")}>
                <TabsList className="bg-[#2ECC71]/10 border border-[#2ECC71]/20">
                  <TabsTrigger 
                    value="hoje" 
                    className="data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white text-[#F9F9F9]/70 text-sm"
                    aria-label="Estatísticas de hoje"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Hoje
                  </TabsTrigger>
                  <TabsTrigger 
                    value="semana" 
                    className="data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white text-[#F9F9F9]/70 text-sm"
                    aria-label="Estatísticas da semana"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Semana
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mes" 
                    className="data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white text-[#F9F9F9]/70 text-sm"
                    aria-label="Estatísticas do mês"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Mês
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {/* Resumo do Período Selecionado */}
          <AnimatePresence mode="wait">
            {estatisticasPorPeriodo === undefined ? (
              <motion.div
                key="loading-periodo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SkeletonCard />
              </motion.div>
            ) : estatisticasPorPeriodo ? (
              <motion.div
                key={`periodo-${periodo}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className="bg-[#1A1A1A] border-2 rounded-3xl p-6 shadow-xl relative overflow-hidden"
                  style={{
                    borderColor: estatisticasPorPeriodo.totalMinutosFocados > 120 ? '#FFD700' : 'rgba(46, 204, 113, 0.2)',
                  }}
                >
                  {/* Glow dourado para recordes */}
                  {estatisticasPorPeriodo.totalMinutosFocados > 120 && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-radial from-[#FFD700]/10 to-transparent"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  <div className="relative z-10">
                    <h2 className="text-lg font-light text-[#F9F9F9] tracking-wide mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#2ECC71]" />
                      {periodo === "hoje" ? "Hoje" : periodo === "semana" ? "Esta Semana" : "Este Mês"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-[#F9F9F9]/60 mb-1">Tempo Focado</p>
                        <p className="text-3xl font-light text-[#2ECC71] tracking-wide">
                          {formatarTempoTotal(estatisticasPorPeriodo.totalMinutosFocados)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-[#F9F9F9]/60 mb-1">Sessões</p>
                          <p className="text-2xl font-light text-[#FFD700]">
                            {estatisticasPorPeriodo.totalSessoes}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#F9F9F9]/60 mb-1">Preset +</p>
                          <p className="text-sm font-light text-[#FFD700] truncate">
                            {estatisticasPorPeriodo.presetMaisUsado}
                          </p>
                        </div>
                      </div>
            </div>
          </div>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Estatísticas Gerais */}
          {estatisticasGerais === undefined ? (
            <SkeletonCard />
          ) : estatisticasGerais && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-[#1A1A1A] border-2 border-[#FFD700]/20 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-light text-[#F9F9F9] tracking-wide mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#FFD700]" />
                  Resumo Geral
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[#F9F9F9]/60 mb-1">Tempo Total Focado</p>
                    <p className="text-2xl font-light text-[#2ECC71] tracking-wide">
                      {formatarTempoTotal(estatisticasGerais.tempoTotalFocado)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#F9F9F9]/60 mb-1">Sessões</p>
                      <p className="text-xl font-light text-[#FFD700]">
                        {estatisticasGerais.sessoesCompletas}
                      </p>
                    </div>
              <div>
                      <p className="text-xs text-[#F9F9F9]/60 mb-1">Média</p>
                      <p className="text-xl font-light text-[#FFD700]">
                        {estatisticasGerais.mediaPorSessao} min
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Gráfico Semanal */}
          {estatisticasSemanais === undefined ? (
            <div className="md:col-span-2">
              <SkeletonCard />
            </div>
          ) : estatisticasSemanais && estatisticasSemanais.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              <Card className="bg-[#1A1A1A] border-2 border-[#2ECC71]/20 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="grafico-semanal-titulo" className="text-lg font-light text-[#F9F9F9] tracking-wide flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#2ECC71]" />
                    Últimos 7 Dias
                  </h2>
                  <Tabs value={chartType} onValueChange={(value) => setChartType(value as "bar" | "line")}>
                    <TabsList className="bg-[#2ECC71]/10 border border-[#2ECC71]/20" aria-label="Tipo de gráfico">
                      <TabsTrigger 
                        value="bar" 
                        className="data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white text-[#F9F9F9]/70 text-xs"
                        aria-label="Gráfico de barras"
                      >
                        Barras
                      </TabsTrigger>
                      <TabsTrigger 
                        value="line" 
                        className="data-[state=active]:bg-[#2ECC71] data-[state=active]:text-white text-[#F9F9F9]/70 text-xs"
                        aria-label="Gráfico de linha"
                      >
                        Linha
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div 
                  className="w-full h-64"
                  role="img"
                  aria-labelledby="grafico-semanal-titulo"
                  aria-describedby="grafico-semanal-desc"
                >
                  <span id="grafico-semanal-desc" className="sr-only">
                    Gráfico mostrando minutos focados nos últimos 7 dias. 
                    Dia com mais foco: {formatarDiaSemana(estatisticasSemanais.find(d => d.totalMinutosFocados === maxMinutos)?.dia || '')} com {maxMinutos} minutos.
                  </span>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                      <BarChart
                        data={estatisticasSemanais.map(item => ({
                          ...item,
                          diaSemana: formatarDiaSemana(item.dia),
                        }))}
                        margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
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
                            backgroundColor: '#1A1A1A',
                            border: '1px solid #2ECC71',
                            borderRadius: '12px',
                            color: '#F9F9F9',
                          }}
                          labelStyle={{ color: '#2ECC71' }}
                          formatter={(value: number) => [`${value} min`, 'Focado']}
                        />
                        <Bar 
                          dataKey="totalMinutosFocados" 
                          radius={[8, 8, 0, 0]}
                        >
                          {estatisticasSemanais.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill="#2ECC71"
                              opacity={entry.totalMinutosFocados === maxMinutos && maxMinutos > 0 ? 1 : 0.6}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <LineChart
                        data={estatisticasSemanais.map(item => ({
                          ...item,
                          diaSemana: formatarDiaSemana(item.dia),
                        }))}
                        margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2ECC71" opacity={0.1} />
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
                            backgroundColor: '#1A1A1A',
                            border: '1px solid #2ECC71',
                            borderRadius: '12px',
                            color: '#F9F9F9',
                          }}
                          labelStyle={{ color: '#2ECC71' }}
                          formatter={(value: number) => [`${value} min`, 'Focado']}
                        />
                        <Line 
                          type="monotone"
                          dataKey="totalMinutosFocados" 
                          stroke="#2ECC71"
                          strokeWidth={3}
                          dot={{ fill: '#2ECC71', r: 5 }}
                          activeDot={{ r: 7, fill: '#FFD700' }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Top Presets */}
          {rankingPresets === undefined ? (
            <SkeletonCard />
          ) : rankingPresets && rankingPresets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="bg-[#1A1A1A] border-2 border-[#FFD700]/20 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-light text-[#F9F9F9] tracking-wide mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#FFD700]" />
                  Top Presets
                </h2>
                <div className="space-y-3" role="list" aria-label="Presets mais usados">
                  {rankingPresets.slice(0, 3).map((item, index) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    return (
                      <div
                        key={item.presetId}
                        className="flex items-center gap-3 p-3 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl"
                        role="listitem"
                      >
                        <span className="text-2xl" aria-hidden="true">{medals[index]}</span>
                        <div className="flex-1">
                          <p className="text-sm font-light text-[#F9F9F9]">{item.nomePreset}</p>
                          <p className="text-xs text-[#F9F9F9]/60">{item.totalUsos} {item.totalUsos === 1 ? 'uso' : 'usos'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Histórico Detalhado de Sessões */}
          {historicoDetalhado === undefined ? (
            <div className="col-span-full">
              <SkeletonCard />
            </div>
          ) : historicoDetalhado && historicoDetalhado.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="col-span-full"
            >
              <Card className="bg-[#1A1A1A] border-2 border-[#2ECC71]/20 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-light text-[#F9F9F9] tracking-wide mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-[#2ECC71]" />
                  Histórico de Sessões
                </h2>
                <ScrollArea className="h-80 w-full pr-4">
                  <div className="space-y-3" role="list" aria-label="Histórico de sessões concluídas">
                    {historicoDetalhado.slice(0, 20).map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className="bg-[#2ECC71]/5 border border-[#2ECC71]/20 rounded-xl p-4 hover:bg-[#2ECC71]/10 transition-colors"
                        role="listitem"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-light text-[#F9F9F9] mb-1">
                              {item.nomePreset}
                            </p>
                            <p className="text-xs text-[#F9F9F9]/50">
                              {item.data}
                </p>
              </div>
                          <div className="text-right">
                            <p className="text-2xl font-light text-[#2ECC71]">
                              {item.minutosFocados}
                            </p>
                            <p className="text-xs text-[#F9F9F9]/50">
                              minutos
                            </p>
                  </div>
                </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </motion.div>
          )}

          {/* Estado Vazio */}
          {(!estatisticasGerais || estatisticasGerais.sessoesCompletas === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-full"
            >
              <Card className="bg-[#1A1A1A] border-2 border-[#2ECC71]/20 rounded-3xl p-12 text-center shadow-xl">
                <p className="text-[#F9F9F9]/50 text-sm font-light tracking-wide">
                  Nenhuma estatística disponível ainda.
                  <br />
                  Comece a usar o timer para ver seus dados aqui!
                </p>
              </Card>
            </motion.div>
            )}
          </div>
      </main>

      {/* Barra de Navegação Inferior Fixa */}
      <BottomNav />

      <Toaster position="top-center" richColors theme="dark" />
    </>
  );
}

