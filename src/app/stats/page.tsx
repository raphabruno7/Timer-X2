"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowLeft, TrendingUp, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function StatsPage() {
  const router = useRouter();
  const estatisticasSemanais = useQuery(api.historico.estatisticasSemanais);
  const estatisticas = useQuery(api.historico.estatisticas);

  // Função para formatar dia da semana abreviado
  const formatarDiaSemana = (dataStr: string) => {
    const data = new Date(dataStr + 'T00:00:00');
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias[data.getDay()];
  };

  // Encontrar o dia com mais minutos
  const maxMinutos = estatisticasSemanais 
    ? Math.max(...estatisticasSemanais.map(d => d.totalMinutosFocados))
    : 0;

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="w-full max-w-sm mx-auto">
        <Card className="bg-[#1C1C1C] border-2 border-[#2ECC71]/20 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#2ECC71]/10">
            <div className="flex items-center gap-4 mb-4">
              <Button
                onClick={() => router.push('/')}
                variant="ghost"
                size="icon"
                className="text-[#F9F9F9] hover:bg-[#2ECC71]/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-[#F9F9F9] flex items-center gap-2 flex-1">
                <TrendingUp className="w-6 h-6 text-[#2ECC71]" />
                Estatísticas
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Gráfico de Barras - Últimos 7 dias */}
            {estatisticasSemanais && (
              <div>
                <h2 className="text-lg font-semibold text-[#F9F9F9] mb-4 text-center">
                  Últimos 7 dias
                </h2>
                <div className="w-full h-64 bg-[#2ECC71]/5 rounded-xl p-4 border border-[#2ECC71]/20">
                  <ResponsiveContainer width="100%" height="100%">
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
                        label={{ 
                          value: 'Minutos', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { fill: '#F9F9F9', opacity: 0.7, fontSize: 11 }
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1C1C1C',
                          border: '1px solid #2ECC71',
                          borderRadius: '8px',
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
                            fill={entry.totalMinutosFocados === maxMinutos && maxMinutos > 0 
                              ? '#2ECC71' 
                              : '#2ECC71'
                            }
                            opacity={entry.totalMinutosFocados === maxMinutos && maxMinutos > 0 
                              ? 1 
                              : 0.5
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Preset Mais Usado */}
            {estatisticas && (
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-[#FFD700]" />
                  <h3 className="text-sm font-medium text-[#F9F9F9]/70">
                    Preset mais usado
                  </h3>
                </div>
                <p className="text-2xl font-bold text-[#FFD700]">
                  {estatisticas.presetMaisUsado}
                </p>
              </div>
            )}

            {/* Informações Adicionais */}
            {estatisticas && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-xl p-4 text-center">
                  <div className="text-xs text-[#F9F9F9]/70 mb-2">Total de minutos</div>
                  <div className="text-xl font-bold text-[#2ECC71]">
                    {estatisticas.totalMinutosFocados}
                  </div>
                </div>
                <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-xl p-4 text-center">
                  <div className="text-xs text-[#F9F9F9]/70 mb-2">Total de sessões</div>
                  <div className="text-xl font-bold text-[#2ECC71]">
                    {estatisticas.totalSessoes}
                  </div>
                </div>
              </div>
            )}

            {/* Estado vazio */}
            {(!estatisticasSemanais || estatisticasSemanais.length === 0) && (
              <div className="text-center py-12">
                <p className="text-[#F9F9F9]/50 text-sm">
                  Nenhuma estatística disponível ainda.
                  <br />
                  Comece a usar o timer para ver seus dados aqui!
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

