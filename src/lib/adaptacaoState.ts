/**
 * Hook React para adaptação silenciosa baseada em IA
 * Analisa logs de sessões e retorna ajustes para aplicar na Mandala
 */

"use client";

import { useEffect, useState } from "react";
import { type AjustesIA, type SessionLog, ajustesPadrao } from "./adaptacaoAI";

/**
 * Hook para adaptação silenciosa baseada em padrões de uso
 * 
 * @param logs - Logs de sessões recentes do Convex
 * @param habilitado - Se a adaptação está ativa (padrão: true)
 * @returns Ajustes da IA ou null
 */
export function useAdaptacaoSilenciosa(
  logs: SessionLog[] | undefined,
  habilitado: boolean = true
): AjustesIA | null {
  const [ajustes, setAjustes] = useState<AjustesIA | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [ultimaAnalise, setUltimaAnalise] = useState<number>(0);

  useEffect(() => {
    // Verificações básicas
    if (!habilitado) {
      console.info('[Adaptação Silenciosa] Desabilitada');
      return;
    }

    if (!logs || logs.length === 0) {
      console.info('[Adaptação Silenciosa] Aguardando logs...');
      return;
    }

    // Evitar análises muito frequentes (mínimo 5 minutos entre análises)
    const agora = Date.now();
    const intervaloMinimo = 5 * 60 * 1000; // 5 minutos
    if (agora - ultimaAnalise < intervaloMinimo) {
      console.info('[Adaptação Silenciosa] Aguardando intervalo mínimo');
      return;
    }

    // Mínimo de 3 sessões para análise significativa
    if (logs.length < 3) {
      console.info('[Adaptação Silenciosa] Mínimo de 3 sessões necessário');
      setAjustes(ajustesPadrao());
      return;
    }

    // Executar análise
    const analisar = async () => {
      try {
        setCarregando(true);
        console.info('[Adaptação Silenciosa] 🧠 Iniciando análise...', {
          sessoes: logs.length,
        });

        // Chamar API route ao invés de chamar OpenAI diretamente
        const response = await fetch('/api/adaptacao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logs: logs.slice(-10) }), // Últimas 10 sessões
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.ajustes) {
          setAjustes(data.ajustes);
          setUltimaAnalise(agora);
          console.info('[Adaptação Silenciosa] ✅ Ajustes aplicados');
        } else {
          console.warn('[Adaptação Silenciosa] Sem ajustes retornados');
          setAjustes(ajustesPadrao());
        }

      } catch (error) {
        console.error('[Adaptação Silenciosa] Erro:', error);
        // Em caso de erro, usar ajustes padrão
        setAjustes(ajustesPadrao());
      } finally {
        setCarregando(false);
      }
    };

    analisar();

  }, [logs, habilitado, ultimaAnalise]);

  return ajustes;
}

/**
 * Hook simplificado que retorna apenas os ajustes prontos para uso
 */
export function useAjustesMandala(logs: SessionLog[] | undefined) {
  const ajustes = useAdaptacaoSilenciosa(logs);
  
  // Retornar ajustes padrão enquanto carrega
  return ajustes || ajustesPadrao();
}

