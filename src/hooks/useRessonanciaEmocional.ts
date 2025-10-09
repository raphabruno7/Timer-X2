"use client";

import { useEffect, useState, useMemo } from "react";

/**
 * Estados emocionais derivados de padrões de uso
 */
export type EstadoEmocional = 'tensao' | 'foco' | 'reintegracao' | 'realizacao' | 'neutro';

/**
 * Configuração visual para cada estado emocional
 */
export interface ConfiguracaoEmocional {
  estado: EstadoEmocional;
  cor: string;
  velocidadeModifier: number; // Multiplica velocidade base (1.0 = normal)
  intensidadeModifier: number; // Multiplica intensidade (1.0 = normal)
  saturacao: number; // 0-1
  descricao: string;
}

/**
 * Dados de sessão para análise
 */
interface DadosSessao {
  duracao: number; // minutos
  timestamp: number;
}

/**
 * Hook: Ressonância Emocional
 * 
 * Detecta estado emocional baseado em padrões de uso do timer:
 * - Tensão: Sessões curtas repetidas (alta frequência, baixo tempo)
 * - Foco: Sessões longas e constantes (25min+)
 * - Reintegração: Intervalos longos entre sessões (>2h)
 * - Realização: Finalização bem-sucedida de série
 * - Neutro: Estado equilibrado padrão
 * 
 * @param sessoes - Array de sessões recentes (últimas 10)
 * @returns Estado emocional atual e configuração visual
 */
export function useRessonanciaEmocional(sessoes: DadosSessao[] = []): {
  estado: EstadoEmocional;
  config: ConfiguracaoEmocional;
} {
  const [estado, setEstado] = useState<EstadoEmocional>('neutro');

  // Calcular estado emocional baseado em heurísticas
  useEffect(() => {
    if (sessoes.length === 0) {
      setEstado('neutro');
      return;
    }

    // Última sessão
    const ultimaSessao = sessoes[sessoes.length - 1];
    const agora = Date.now();
    
    // Tempo desde última sessão (em horas)
    const tempoDesdeUltimaSessao = (agora - ultimaSessao.timestamp) / (1000 * 60 * 60);
    
    // Média de duração das últimas 5 sessões
    const ultimasCinco = sessoes.slice(-5);
    const mediaDuracao = ultimasCinco.reduce((acc, s) => acc + s.duracao, 0) / ultimasCinco.length;
    
    // Sessões hoje (últimas 24h)
    const sessoesHoje = sessoes.filter(s => agora - s.timestamp < 24 * 60 * 60 * 1000);
    
    // Total de minutos focados hoje
    const minutosFocadosHoje = sessoesHoje.reduce((acc, s) => acc + s.duracao, 0);

    // === HEURÍSTICAS DE DETECÇÃO ===

    // 1. REALIZAÇÃO: Completou série de sessões (3+ hoje, média alta)
    if (sessoesHoje.length >= 3 && mediaDuracao >= 20 && minutosFocadosHoje >= 60) {
      setEstado('realizacao');
      console.info('[Ressonância Emocional] 🎉 Estado: REALIZAÇÃO', {
        sessõesHoje: sessoesHoje.length,
        médiaDuração: `${Math.round(mediaDuracao)}min`,
        totalFoco: `${minutosFocadosHoje}min`
      });
      return;
    }

    // 2. TENSÃO: Sessões curtas repetidas (<10min média, 2+ tentativas)
    if (ultimasCinco.length >= 2 && mediaDuracao < 10) {
      setEstado('tensao');
      console.info('[Ressonância Emocional] 😰 Estado: TENSÃO', {
        tentativas: ultimasCinco.length,
        médiaDuração: `${Math.round(mediaDuracao)}min`,
        sinal: 'sessões curtas repetidas'
      });
      return;
    }

    // 3. REINTEGRAÇÃO: Intervalo longo desde última sessão (>2h)
    if (tempoDesdeUltimaSessao > 2 && sessoes.length > 1) {
      setEstado('reintegracao');
      console.info('[Ressonância Emocional] 🌅 Estado: REINTEGRAÇÃO', {
        intervalo: `${Math.round(tempoDesdeUltimaSessao)}h`,
        sinal: 'retomando após pausa longa'
      });
      return;
    }

    // 4. FOCO: Sessões consistentes e longas (20min+ média)
    if (mediaDuracao >= 20 && ultimasCinco.length >= 2) {
      setEstado('foco');
      console.info('[Ressonância Emocional] 🎯 Estado: FOCO', {
        sessões: ultimasCinco.length,
        médiaDuração: `${Math.round(mediaDuracao)}min`,
        sinal: 'consistência alta'
      });
      return;
    }

    // 5. NEUTRO: Estado equilibrado padrão
    setEstado('neutro');
    console.info('[Ressonância Emocional] ⚖️ Estado: NEUTRO', {
      sessões: sessoes.length,
      médiaDuração: `${Math.round(mediaDuracao)}min`
    });

  }, [sessoes]);

  // Configuração visual para cada estado emocional
  const config = useMemo((): ConfiguracaoEmocional => {
    switch (estado) {
      case 'tensao':
        return {
          estado: 'tensao',
          cor: 'hsl(200, 50%, 60%)', // Azul calmo (acalmar ansiedade)
          velocidadeModifier: 0.7, // Mais lento (1.5s → 2.1s)
          intensidadeModifier: 0.8, // Movimento mais suave
          saturacao: 0.7,
          descricao: 'Respiração profunda ajuda a centrar',
        };

      case 'foco':
        return {
          estado: 'foco',
          cor: 'hsl(145, 70%, 55%)', // Verde vibrante (energia ativa)
          velocidadeModifier: 1.0, // Velocidade normal
          intensidadeModifier: 1.2, // Pulso mais evidente
          saturacao: 1.0,
          descricao: 'Fluxo ativo e consistente',
        };

      case 'reintegracao':
        return {
          estado: 'reintegracao',
          cor: 'hsl(45, 80%, 60%)', // Dourado suave (acolhimento)
          velocidadeModifier: 0.8, // Levemente mais lento
          intensidadeModifier: 0.9, // Suave
          saturacao: 0.85,
          descricao: 'Bem-vindo de volta',
        };

      case 'realizacao':
        return {
          estado: 'realizacao',
          cor: 'hsl(45, 100%, 55%)', // Dourado vibrante (celebração)
          velocidadeModifier: 0.9, // Levemente mais lento (dignidade)
          intensidadeModifier: 1.3, // Pulso celebrativo
          saturacao: 1.0,
          descricao: 'Jornada honrada',
        };

      case 'neutro':
      default:
        return {
          estado: 'neutro',
          cor: 'hsl(145, 70%, 55%)', // Verde padrão
          velocidadeModifier: 1.0,
          intensidadeModifier: 1.0,
          saturacao: 1.0,
          descricao: 'Estado equilibrado',
        };
    }
  }, [estado]);

  return { estado, config };
}

