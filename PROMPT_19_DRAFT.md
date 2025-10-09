# 🎭 PROMPT 19 — Ressonância Emocional (Draft)

## 📘 Contexto
- **Projeto:** Timer X2
- **Stack:** Next.js + TypeScript + Tailwind CSS + Framer Motion + ShadCN UI
- **Base:** Prompt 18 (Sinestesia Adaptativa) concluído
- **Objetivo:** Evolução natural - adicionar resposta emocional baseada em padrões de uso

---

## 🎯 Conceito: Ressonância Emocional

A **Sinestesia Adaptativa** (Prompt 18) responde ao **estado técnico** do timer:
- ✅ Rodando → Verde pulsante
- ✅ Pausado → Dourado+verde respiratório
- ✅ Concluído → Fade out dourado

A **Ressonância Emocional** (Prompt 19) deve responder ao **estado emocional** do usuário:
- 🎭 Ansioso → Cores calmas, pulso lento
- 🎯 Focado → Cores vibrantes, pulso energético
- 😌 Relaxado → Cores suaves, transições lentas
- 😓 Cansado → Cores reduzidas, movimento mínimo

---

## 🧠 Sistema de Detecção Emocional

### **Entradas (Dados Existentes):**

1. **Padrões de Uso** (já rastreados):
   - `numeroPausas` - quantas vezes pausou
   - `tempoInicio` - quanto tempo levou para começar
   - `duracao` - tempo de sessão
   - `horario` - hora do dia
   - `sessoesHoje` - quantas sessões já fez

2. **Interações** (já rastreadas):
   - `interacoes.botaoPlay`
   - `interacoes.botaoPause`
   - `interacoes.botaoReset`

3. **IA Emocional** (já existe):
   - `/api/emocao` - detecta emoção pós-sessão
   - `estadoEmocional.emocao` - 'disperso' | 'centrado' | 'neutro'

### **Heurísticas Propostas:**

```typescript
function detectarEstadoEmocional(dados: {
  pausas: number;
  sessoesConcluidas: number;
  horario: number;
  ultimaSessaoDuracao?: number;
}): 'ansioso' | 'focado' | 'relaxado' | 'cansado' {
  
  // Cansaço: muitas sessões ou horário tardio
  if (dados.sessoesConcluidas > 5 || dados.horario > 22) {
    return 'cansado';
  }
  
  // Ansioso: muitas pausas (>3) ou sessões curtas (<50% do esperado)
  if (dados.pausas > 3 || (dados.ultimaSessaoDuracao && dados.ultimaSessaoDuracao < 300)) {
    return 'ansioso';
  }
  
  // Focado: poucas pausas, sessões completas
  if (dados.pausas <= 1 && dados.sessoesConcluidas <= 3) {
    return 'focado';
  }
  
  // Relaxado: estado padrão equilibrado
  return 'relaxado';
}
```

---

## 🎨 Mapeamento Emocional → Visual

### **1. Ansioso** 😰
```typescript
{
  cor: 'hsl(200, 50%, 60%)', // Azul calmo
  velocidadePulso: 0.7,       // Mais lento (2.5s)
  intensidade: 'leve',        // Movimento sutil
  sugestao: "Respire fundo. Vamos devagar."
}
```

### **2. Focado** 🎯
```typescript
{
  cor: 'hsl(145, 70%, 55%)', // Verde vibrante (atual)
  velocidadePulso: 1.0,       // Normal (1.5s)
  intensidade: 'media',       // Movimento padrão
  sugestao: null // Não interromper foco
}
```

### **3. Relaxado** 😌
```typescript
{
  cor: 'hsl(180, 60%, 50%)', // Verde-água
  velocidadePulso: 0.8,       // Levemente lento (2s)
  intensidade: 'media',       
  sugestao: "Você está em harmonia."
}
```

### **4. Cansado** 😓
```typescript
{
  cor: 'hsl(260, 30%, 60%)', // Roxo suave
  velocidadePulso: 0.5,       // Muito lento (3s)
  intensidade: 'leve',
  sugestao: "Considere uma pausa mais longa."
}
```

---

## 🏗️ Arquitetura Proposta

### **Opção A: Camada sobre Sinestesia (Recomendado)**

```typescript
// page.tsx
const estadoEmocional = useMemo(() => 
  detectarEstadoEmocional({
    pausas: numeroPausas,
    sessoesConcluidas: padrõesUsoRecentes?.length || 0,
    horario: new Date().getHours(),
    ultimaSessaoDuracao: padrõesUsoRecentes?.[0]?.duration,
  }), 
  [numeroPausas, padrõesUsoRecentes]
);

const configEmocional = mapearEmocaoParaVisual(estadoEmocional);

// Mandala.tsx
<Mandala
  estadoVisual={estadoVisualMandala}        // Sinestesia (estado técnico)
  estadoEmocional={estadoEmocional}         // Ressonância (estado emocional)
  configEmocional={configEmocional}         // Override de cor/velocidade
/>
```

**Hierarquia:**
```
Estado Técnico (Sinestesia) 
  ↓
Estado Emocional (Ressonância) [modifica cor/velocidade]
  ↓
Cérebro Lunar (já existe) [modifica tonalidade base]
```

### **Fluxo de Decisão:**

1. **Calcular estado visual** (foco-ativo | reflexao | conclusao | idle)
2. **Calcular estado emocional** (ansioso | focado | relaxado | cansado)
3. **Aplicar overrides emocionais** à animação base
4. **Manter compatibilidade** com Cérebro Lunar

---

## 🔄 Compatibilidade com Sistemas Existentes

### **Cérebro Lunar** (não conflita):
- Cérebro Lunar → define `tonalidade` base (fase da lua)
- Ressonância Emocional → **ajusta saturação/velocidade**
- Exemplo: Lua Cheia + Cansado = Dourado desaturado + pulso lento

### **Sinestesia Adaptativa** (complementa):
- Sinestesia → define `gradiente` e `opacity`
- Ressonância → **modifica `velocidade` e `cor base`**
- Exemplo: Foco Ativo + Ansioso = Verde pulsando mais lento

---

## 🧪 Testes de Validação

### **Cenário 1: Usuário Ansioso**
```
- Pausou 5 vezes
- Sessões curtas (<5min)
- Espera: Azul calmo, pulso 2.5s
```

### **Cenário 2: Usuário Focado**
```
- 0-1 pausas
- Sessões completas (25min)
- Espera: Verde vibrante, pulso 1.5s
```

### **Cenário 3: Usuário Cansado**
```
- 6+ sessões hoje
- Horário: 23h
- Espera: Roxo suave, pulso 3s
```

---

## 📊 Métricas de Sucesso

| Métrica | Esperado |
|---------|----------|
| Performance ≥60fps | ✅ Manter |
| Tempo de cálculo emocional | <5ms |
| Transições suaves | Sem "saltos" |
| Compatibilidade Cérebro Lunar | 100% |
| Log de estados emocionais | Console |

---

## 🚧 Questões em Aberto

1. **Quando recalcular estado emocional?**
   - A cada sessão concluída?
   - A cada pausa?
   - A cada hora?

2. **Sugestões visuais ou texto?**
   - Apenas visual (cores/velocidade)?
   - Toast sutil com mensagem?
   - Ambos?

3. **Persistência de preferências?**
   - Usuário pode desabilitar?
   - Salvar em localStorage?

4. **IA Emocional mais profunda?**
   - Integrar OpenAI para análise?
   - Ou heurísticas simples são suficientes?

---

## 🎯 Próximas Etapas

1. **Definir spec completa** (expandir este draft)
2. **Implementar `detectarEstadoEmocional()`**
3. **Criar mapeamento emocional → visual**
4. **Ajustar Mandala.tsx** para receber props emocionais
5. **Testar compatibilidade** com sistemas existentes
6. **Documentar** (PROMPT_19_RESSONANCIA_EMOCIONAL.md)

---

## 💭 Reflexões

Esta feature é a **evolução natural** do Prompt 18:

- Prompt 18: "O que está acontecendo?" (técnico)
- Prompt 19: "Como o usuário se sente?" (humano)

Deve ser **sutil e não intrusiva** - o usuário pode nem perceber conscientemente, mas sentirá que o app "entende" seu estado.

---

**🌿✨ Timer X2 — Rumo à Ressonância Emocional!**

---

_Draft criado em 09/10/2025_  
_Autor: Claude (AI Assistant)_  
_Status: Aguardando spec completa_

