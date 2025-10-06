# 🕉️ Timer X2 — Holistic Focus & Flow System

> **Framework:** Next.js 14 (App Router) + TypeScript  
> **UI/UX:** Tailwind CSS + ShadCN + Animate/Motion  
> **AI Engine:** OpenAI API (GPT-4o-mini)  
> **Database:** Convex Cloud  
> **Status:** Etapa 1 concluída (IA básica + registro de sessões)  

---

## 🌿 Conceito
Timer X2 é um **sistema holístico de foco** projetado para 2025-2026.  
Integra ciclos de **foco, respiração, criatividade e recuperação**, utilizando IA + Convex para adaptar-se ao ritmo do usuário.

---

## 🧩 Estrutura de Pastas

```
timer-x2/
├── app/
│   ├── api/
│   │   ├── ai/route.ts              → IA: interpretação do ciclo concluído
│   │   └── ia-next-mode/route.ts    → IA: sugestão do próximo modo (opcional)
│   ├── page.tsx                     → Tela principal do Timer
│   └── layout.tsx                   → Layout base (Tailwind + ShadCN)
│
├── components/
│   ├── ui/
│   │   ├── CircularTimer.tsx        → Cronômetro circular
│   │   ├── MandalaReward.tsx        → Mandala animada de premiação
│   │   ├── DynamicMandala.tsx       → Mandala generativa com gradientes
│   │   ├── MandalaSound.tsx         → Sons harmônicos (A4 em 432 Hz)
│   │   ├── ControlsRow.tsx          → Botões Play/Pause/Reset
│   │   └── AIFab.tsx                → Botão flutuante “AI”
│
├── convex/
│   ├── schema.ts                    → Estrutura do banco
│   ├── sessoes.ts                   → Mutations/queries para registrar sessões
│   └── _generated/                  → Código gerado automaticamente
│
├── public/
│   └── sounds/                      → Arquivos de áudio da mandala
│
├── styles/
│   └── globals.css                  → Tailwind base + animações custom
│
└── .env.local                       → OPENAI_API_KEY e CONVEX_DEPLOYMENT
```

---

## ⚙️ Principais Dependências

| Categoria | Pacotes |
|------------|----------|
| **UI** | `tailwindcss`, `@tailwindcss/forms`, `@tailwindcss/typography`, `tailwindcss-animate`, `shadcn-ui` |
| **IA** | `openai`, `axios` |
| **Banco** | `convex`, `convex/react` |
| **Utilitários** | `framer-motion`, `lucide-react` |

---

## 🔁 Fluxo de Dados

1. **Usuário inicia um ciclo** → Timer começa contagem.
2. **Ao zerar:**  
   - Exibe mandala (visual + som).  
   - IA interpreta o ciclo e retorna sugestão textual (Prompt 8).  
   - Sessão é registrada no Convex (Prompt 9).  
3. **Usuário pode reiniciar ou trocar preset.**
4. (Futuro – Prompt 10) IA analisa histórico e sugere rotinas personalizadas.

---

## 🧠 Modelos de IA Utilizados

- `gpt-4o-mini` → rápido, custo baixo, respostas curtas e contextuais.  
- Temperatura = 0.6 (padrão balanceado).  
- Prompts “system” definidos para tom holístico, motivacional e pragmático.  

---

## 🪶 Variáveis de Ambiente

```
OPENAI_API_KEY=sk-...
CONVEX_DEPLOYMENT=prod:acoustic-condor-654|eyJ2MiI6...
```

---

## 🎨 Tema de Cores — “Natureza”

| Elemento | Cor | Código |
|-----------|-----|--------|
| Fundo principal | Cinza escuro | `#1C1C1C` |
| Destaques | Verde | `#2ECC71` |
| Energia / Ação | Amarelo suave | `#FFD700` |
| Texto | Branco suave | `#F9F9F9` |

---

## 🔊 Experiência Sensorial

- **Som inicial:** leve sino de foco (A4 – 432 Hz)  
- **Som final:** harmônico ascendente com eco suave  
- **Mandala:** animação responsiva ao tempo restante (fade + rotacional)  

---

## 🧘 Próximos Passos (Etapa 2)

| Prioridade | Descrição |
|-------------|------------|
| 🌙 | Adicionar página de introdução / onboarding (perfil e áreas de foco) |
| 🔆 | Criar seção “Histórico” para exibir sessões armazenadas no Convex |
| 🔮 | Implementar IA preditiva (análise de padrões e sugestões) |
| 🪷 | Criar tema alternativo “Luz Solar” (para manhãs) |

---

## 🪄 Git Branches Importantes

| Branch | Descrição |
|---------|------------|
| `main` | Versão estável |
| `feat/radial-dial` | Experimentos de dial circular |
| `feat/mandala-integration` | Mandala visual + som |
| `feat/ia-context` | Integração IA |
| `feat/convex-db` | Banco de dados e histórico |

---

## 📸 Preview Esperado
- Layout mobile-first (PhoneFrame)  
- Timer circular central  
- Botões Play/Pause/Reset abaixo  
- Barra inferior com ícones → Presets, Relógio, AI, Config  
- Mandala visual ativa ao fim do ciclo  

---

## 💬 Comentário Final
> “A tecnologia deve respirar com o humano.  
> O Timer X2 é mais que produtividade — é um **ritual de presença**.” 🌿  
