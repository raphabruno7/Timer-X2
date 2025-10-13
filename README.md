# ⏱️ Timer X2 — Foco e Respiração para Alta Produtividade

**Versão:** v1.0 (Provisional) · **Data:** 09/10/2025  
**Stack:** Next.js + TypeScript + Tailwind + ShadCN + Framer Motion + Convex  

---

## 💡 Propósito

O **Timer X2** é um **sistema de foco e produtividade** que combina técnicas de **gestão do tempo** (como Pomodoro e Deep Work) com **exercícios de respiração (breathwork)** para restaurar energia e concentração entre sessões de trabalho.

> "Produtividade real é quando o corpo e a mente respiram no mesmo ritmo."  

---

## 🎯 O que o Timer X2 faz

- ⏳ Cronômetro Inteligente (play, pause, reset)  
- 🌬️ Sessões de Respiração Guiada para pausas energéticas  
- 🎧 Modos de Foco: Deep Work, Estudo, Criatividade, Leitura  
- 📊 Histórico e Estatísticas de produtividade  
- ⚙️ Interface fluida e responsiva  

---

## 🧱 Arquitetura

src/
├── app/
│   ├── page.tsx              # Timer principal
│   ├── settings/page.tsx     # Configurações
│   └── stats/page.tsx        # Estatísticas
│
├── components/
│   ├── ui/
│   │   ├── TimerCircle.tsx   # Visual do timer
│   │   ├── RippleButton.tsx  # Botões com feedback
│   │   └── PresetSelector.tsx# Modos de foco
│   └── BackgroundEmocional.tsx
│
├── hooks/
│   ├── useTimer.ts
│   ├── useFocusStats.ts
│   └── useBreathwork.ts
│
├── convex/
│   ├── schema.ts
│   └── functions/
│
└── public/
    ├── logo.svg
    └── favicon.ico

---

## ⚙️ Configuração

1️⃣ Instalar dependências  
```bash
npm install
```

2️⃣ Configurar Convex (.env.local)  
```bash
CONVEX_DEPLOYMENT=dev:glorious-moose-396
NEXT_PUBLIC_CONVEX_URL=https://glorious-moose-396.convex.cloud
```

3️⃣ Rodar em modo dev  
```bash
npm run dev
```  
➡️ http://localhost:3000

---

## 🧘 Filosofia

Cada ciclo do **Timer X2** combina **foco intenso** com **recuperação ativa**, permitindo que o cérebro e o corpo mantenham um ritmo produtivo sem exaustão.

Métodos integrados:
- Pomodoro (25/5)
- Deep Focus (45/10)
- Micro-Pausa (10/2)
- Breath Reset (respiração 4-4-4)
- Respiração Alternada (Nadi Shodhana)

---

## 🎨 Design System

| Elemento | Cor | Significado |
|-----------|------|-------------|
| Fundo principal | #1C1C1C | Foco |
| Verde primário | #2ECC71 | Energia |
| Dourado acento | #FFD700 | Clareza |
| Branco suave | #F9F9F9 | Leveza |

---

## 📊 Performance

| Métrica | Valor |
|----------|--------|
| FPS | 60 |
| CLS | <0.1 |
| Lighthouse Perf | ≥ 90 |
| Lighthouse A11y | ≥ 95 |
| prefers-reduced-motion | OK |

---

## 🚀 Deploy

```bash
git checkout -b release/v1.0
npm run lint
npm run build
vercel --prod
convex deploy
```

---

## 🧩 Roadmap Futuro

| Fase | Recurso | Objetivo |
|------|----------|-----------|
| v1.1 | Ajustes de foco avançado | Melhorar fluxo de timers |
| v1.2 | Relatórios semanais | Insights de performance |
| v1.3 | Integração com Sunni AI | Música e som adaptativo |
| v2.0 | Comunidade e desafios | Sessões de foco colaborativas |

---

## 👤 Créditos

| Área | Responsável |
|------|--------------|
| Concepção | Raphael Bruno Dantas Moreira |
| Desenvolvimento | GPT-5 Agentic Coding |
| Design | Minimal Productivity Lab |
| Infraestrutura | Convex + Vercel |

---

## 📄 Licença
MIT License © 2025 — Timer X2 Project  
Uso livre para fins educacionais e de produtividade pessoal.

---

## 💬 Mensagem Final

> O **Timer X2** é mais do que um cronômetro.  
> É um instrumento de energia, foco e clareza — para quem trabalha com presença.

---

**Status:** *Provisional build – refinamento em andamento* 🌱
