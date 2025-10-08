# 🌿 PROMPT 17 — Microinterações Naturais e Animações Sutis

## 📘 Contexto
- **Projeto:** Timer X2
- **Stack:** Next.js + TypeScript + Tailwind CSS + Framer Motion + ShadCN UI
- **Tema:** Natureza — fluidez, foco, serenidade, respiração orgânica
- **Status Atual:** UI estável e responsiva (Prompts 15-16 implementados)
- **Objetivo:** Adicionar microinterações sutis que reforcem a sensação orgânica sem distrair do foco
- **Princípio:** "Animar com propósito, não por decoração"

---

## 🎯 Objetivos Gerais

1. Criar sensação de **vida e energia** no timer através de movimento sutil
2. Aplicar **microinterações contextuais** que reforcem o feedback do usuário
3. Usar **mínimo de animações contínuas** (evitar distração)
4. Garantir **performance ≥60fps** em todas as animações
5. Respeitar **prefers-reduced-motion** (acessibilidade WCAG)

---

## ⚙️ FASE 17.1 — Sistema de Transições Controladas

### 🎯 Objetivo
Criar um sistema de transições CSS performático e acessível, **SEM usar `transition: all`** (anti-pattern).

### 🟢 MoSCoW

#### **Must have**
- **❌ NÃO usar `transition: all`** (causa problemas de performance)
- Definir transições **específicas** via Tailwind utilities
- Implementar `prefers-reduced-motion` globalmente
- Propriedades permitidas: `background-color`, `color`, `border-color`, `opacity`, `transform`, `box-shadow`
- Durations: 200-400ms (não mais que isso)

#### **Should have**
- Criar classes utilitárias customizadas no `tailwind.config.ts`
- Timing functions apropriados:
  - `ease-in-out`: transições simétricas (hover, estados)
  - `ease-out`: saídas rápidas (modais, dropdowns)
  - `cubic-bezier(0.4, 0, 0.2, 1)`: Tailwind default

#### **Could have**
- Hook `useReducedMotion` para controle programático
- Toggle em Settings para ativar/desativar animações

#### **Won't have**
- Transições em propriedades de layout (`width`, `height`, `position`)
- Animações pesadas (`blur`, `backdrop-filter` contínuo)
- Transições globais com seletor `*`

---

### 💻 Implementação

**Arquivo: `src/app/globals.css`**

```css
@layer base {
  /* Transições para elementos interativos - ESPECÍFICAS, não 'all' */
  button:not([disabled]),
  a:not([disabled]),
  [role="button"]:not([disabled]) {
    transition-property: background-color, color, border-color, opacity, transform;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
  }

  /* Cards e containers */
  [data-slot="card"],
  [data-card] {
    transition-property: box-shadow, border-color, background-color;
    transition-duration: 0.4s;
    transition-timing-function: ease-in-out;
  }

  /* Textos (apenas cor) */
  h1, h2, h3, h4, h5, h6, p {
    transition-property: color;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
  }

  /* Respeitar preferências do usuário (WCAG Criterion 2.3.3) */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

---

## ⚙️ FASE 17.2 — Ripple Effect nos Botões

### 🎯 Objetivo
Adicionar feedback visual de "ripple" (onda) ao clicar nos botões principais, similar ao Material Design mas com estética natural.

### 🟢 MoSCoW

#### **Must have**
- Ripple aparece no ponto exato do clique
- Animação dura 600ms
- Fade out suave (opacity 1 → 0)
- Scale exponencial (0 → 20)
- Cor branca com opacity baixa (`bg-white/20`)

#### **Should have**
- Múltiplos ripples simultâneos possíveis
- Auto-cleanup após animação (evitar memory leak)
- Overflow hidden no botão (ripple não vaza)

#### **Could have**
- Cor do ripple baseada no botão (verde para Play, amarelo para Pause)
- Ripple com gradiente radial

---

### 💻 Implementação

**Arquivo: `src/components/ui/RippleButton.tsx`**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  rippleColor?: string;
  [key: string]: any;
}

export function RippleButton({ 
  children, 
  onClick, 
  className = "", 
  disabled = false,
  rippleColor = "rgba(255, 255, 255, 0.3)",
  ...props 
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    // Cleanup após animação
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Ripples */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: ripple.x - 4,
              top: ripple.y - 4,
              width: 8,
              height: 8,
              backgroundColor: rippleColor,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 20, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Conteúdo */}
      {children}
    </button>
  );
}
```

**Uso:**
```tsx
import { RippleButton } from "@/components/ui/RippleButton";

<RippleButton
  onClick={iniciar}
  className="w-14 h-14 rounded-full bg-emerald-500"
  rippleColor="rgba(255, 255, 255, 0.4)"
>
  <Play />
</RippleButton>
```

---

## ⚙️ FASE 17.3 — Glow Pulsante (Botão Play Idle)

### 🎯 Objetivo
Adicionar glow pulsante no botão Play quando o timer está idle (pronto para iniciar), chamando atenção visual sutil.

### 🟢 MoSCoW

#### **Must have**
- Glow apenas quando `!rodando && tempo > 0`
- Animação de boxShadow (não brilho excessivo)
- Duration: 2s (ritmo calmo)
- Repeat: Infinity
- Para imediatamente ao clicar

#### **Should have**
- Sincronizar com cor do botão (emerald)
- Opacity [0.3 → 0.7] (respiração suave)

---

### 💻 Implementação

**Arquivo: `src/app/page.tsx` (botão Play)**

```tsx
<motion.div
  animate={!rodando && tempo > 0 ? {
    boxShadow: [
      '0 4px 14px rgba(16, 185, 129, 0.3)',
      '0 4px 20px rgba(16, 185, 129, 0.7)',
      '0 4px 14px rgba(16, 185, 129, 0.3)',
    ]
  } : undefined}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  <Button
    onClick={iniciar}
    disabled={rodando || tempo === 0}
    className="..."
  >
    <Play />
  </Button>
</motion.div>
```

---

## ⚙️ FASE 17.4 — Animação Respiratória do Anel

### 🎯 Objetivo
Adicionar pulso sutil ("respiração") no anel do timer quando idle, criando sensação orgânica e viva.

### 🟢 MoSCoW

#### **Must have**
- Pulso apenas quando `!rodando && tempo > 0 && tempo < tempoInicial` (idle após iniciar)
- Scale: `[1, 1.015, 1]` (expansão de apenas 1.5%)
- Opacity: `[0.4, 0.65, 0.4]` (respiração de brilho)
- BorderColor: verde → dourado → verde (transição suave)
- Duration: 3s (ritmo de respiração lenta)
- **Para imediatamente** ao iniciar timer

#### **Should have**
- Sincronizar com fase lunar (lua cheia = pulso 1.02, lua nova = 1.01)

#### **Could have**
- Som discreto sincronizado (batida sutil a cada 3s)

---

### 💻 Implementação

**Arquivo: `src/app/page.tsx` (anel do timer)**

```tsx
{/* Anel de borda com animação respiratória */}
<motion.div 
  className="absolute inset-0 rounded-full border-4"
  style={{
    borderColor: 'rgba(46, 204, 113, 0.4)',
  }}
  animate={!rodando && tempo > 0 && tempo < tempoInicial ? {
    scale: [1, 1.015, 1],
    opacity: [0.4, 0.65, 0.4],
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
```

---

## ⚙️ FASE 17.5 — Transições de Página

### 🎯 Objetivo
Criar transições suaves entre páginas (Timer ↔ Stats ↔ AI ↔ Settings) mantendo sensação de continuidade.

### 🟢 MoSCoW

#### **Must have**
- Fade + Slide vertical (y: 10px → 0)
- Duration: 300ms máximo
- Exit animation simétrica (y: 0 → -10px)
- Não bloquear navegação

#### **Should have**
- Skeleton loader se página demora >500ms
- Preservar scroll position

#### **Won't have**
- Blur effects (pesado)
- Slide horizontal (pode confundir)
- Transições >500ms

---

### 💻 Implementação

**Arquivo: `src/components/PageTransition.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
```

**Uso em cada página:**

```tsx
// src/app/page.tsx
import { PageTransition } from "@/components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <main>
        {/* conteúdo */}
      </main>
    </PageTransition>
  );
}
```

---

## ⚙️ FASE 17.6 — Stagger Animation (Dropdown Presets)

### 🎯 Objetivo
Animar a lista de presets com efeito "cascata" (stagger) ao abrir o dropdown.

### 🟢 MoSCoW

#### **Must have**
- Cada item aparece com delay incremental (`index * 0.04s`)
- Initial: `{ opacity: 0, x: -10 }`
- Animate: `{ opacity: 1, x: 0 }`
- Duration: 250ms por item
- Exit animation: `x: 10` (sai para direita)

#### **Should have**
- Hover: translate-x 4px (slight shift)
- Badge de categoria pulsa ao hover

---

### 💻 Implementação

**Arquivo: `src/components/ui/PresetSelector.tsx`**

```tsx
<AnimatePresence mode="wait">
  {dropdownOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className="dropdown-container"
    >
      {/* Lista com stagger */}
      {presets?.map((preset, index) => (
        <motion.button
          key={preset._id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ 
            delay: index * 0.04,
            duration: 0.25,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.02, 
            x: 4,
            transition: { duration: 0.15 }
          }}
          className="preset-item"
          onClick={() => handleSelect(preset)}
        >
          {/* Badge com pulso ao hover */}
          <motion.span
            className="category-badge"
            whileHover={{
              scale: [1, 1.05, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{ duration: 0.5 }}
          >
            {categoryIcon}
          </motion.span>
          
          {preset.nome}
        </motion.button>
      ))}
    </motion.div>
  )}
</AnimatePresence>
```

---

## ⚙️ FASE 17.7 — Hover States Refinados

### 🎯 Objetivo
Melhorar feedback visual ao passar o mouse sobre elementos interativos.

### 🟢 MoSCoW

#### **Must have**
- **Botões principais:**
  - Scale: 1.08 (não exagerado)
  - Duration: 150ms (rápido e responsivo)
  - Cursor: pointer explícito

- **BottomNav items:**
  - Scale: 1.1
  - Translate Y: -2px (levita)
  - Duration: 200ms

- **Preset items:**
  - Scale: 1.02 (muito sutil)
  - Translate X: 4px (desliza para direita)
  - Background: hover:bg-emerald-900/30

#### **Should have**
- Icon rotation leve em alguns elementos (Settings: 5deg)
- Brightness increase sutil (filter: brightness(1.1))

---

### 💻 Implementação

**Botões principais já implementados com Framer Motion:**
```tsx
whileHover={{ scale: 1.08 }}
whileTap={{ scale: 0.92 }}
```

**BottomNav já implementado:**
```tsx
whileHover={{ scale: 1.1, y: -2 }}
```

**Adicionar em PresetSelector:**
```tsx
whileHover={{ 
  scale: 1.02, 
  x: 4,
  backgroundColor: 'rgba(16, 185, 129, 0.3)',
}}
```

---

## ⚙️ FASE 17.8 — Loading States Elegantes

### 🎯 Objetivo
Criar skeletons e estados de loading que mantenham a estética meditativa.

### 🟢 MoSCoW

#### **Must have**
- Skeleton só aparece após **500ms** de delay (evitar flash)
- Cores emerald/dourado (não cinza genérico)
- Animação: `animate-pulse` do Tailwind
- aria-busy="true" e aria-live="polite"

#### **Should have**
- Shimmer effect (gradiente animado)
- Skeleton com mesma forma do conteúdo final

---

### 💻 Implementação

**Arquivo: `src/components/ui/SkeletonWithDelay.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  delay?: number;
  className?: string;
  children?: React.ReactNode;
}

export function SkeletonWithDelay({ 
  delay = 500, 
  className = "",
  children 
}: SkeletonProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`animate-pulse ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      {children || (
        <div className="space-y-3">
          <div className="h-8 bg-emerald-900/20 rounded-lg w-full" />
          <div className="h-6 bg-emerald-900/20 rounded-lg w-3/4" />
        </div>
      )}
    </motion.div>
  );
}
```

**Uso:**
```tsx
{presets === undefined ? (
  <SkeletonWithDelay delay={500} />
) : (
  <PresetsList presets={presets} />
)}
```

---

## ⚙️ FASE 17.9 — Hook useReducedMotion

### 🎯 Objetivo
Criar hook para detectar preferência de movimento reduzido e controlar animações programaticamente.

### 💻 Implementação

**Arquivo: `src/hooks/useReducedMotion.ts`**

```tsx
"use client";

import { useState, useEffect } from "react";

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}
```

**Uso:**
```tsx
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Component() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { 
        scale: [1, 1.02, 1] 
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
      }}
    >
      {/* conteúdo */}
    </motion.div>
  );
}
```

---

## ♿ Acessibilidade (WCAG Criterion 2.3.3)

### **CSS Media Query (Obrigatório):**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### **Framer Motion (Automático):**
- Framer Motion **já respeita** `prefers-reduced-motion` automaticamente
- Não precisa configurar nada extra
- Animations são puladas se usuário preferir

### **Hook Programático (Opcional):**
```tsx
const shouldReduceMotion = useReducedMotion();

// Desabilitar animações condicionalmente
{!shouldReduceMotion && <AnimatedComponent />}
```

---

## 🧪 Testes de Performance

### **Lighthouse (Chrome DevTools):**
```bash
1. Abrir Chrome DevTools (F12)
2. Aba Lighthouse
3. Modo: Mobile
4. Categorias: Performance, Accessibility
5. Generate Report
6. Validar:
   ✅ Performance ≥ 90
   ✅ Accessibility ≥ 95
   ✅ CLS < 0.1
```

### **FPS Monitor:**
```bash
1. Chrome DevTools (F12)
2. Cmd+Shift+P → "Show Rendering"
3. Check "Frame Rendering Stats"
4. Verificar durante animações:
   ✅ FPS ≥ 55
   ✅ Nenhum frame drop >16ms
```

### **Reduced Motion:**
```bash
# macOS
System Settings → Accessibility → Display → Reduce motion

# Chrome DevTools
Cmd+Shift+P → "Emulate CSS prefers-reduced-motion"

# Verificar:
✅ Animações desabilitadas
✅ Funcionalidade mantida
```

---

## ✅ Critérios de Sucesso

| Critério | Validação | Status |
|----------|-----------|--------|
| Nenhum `transition: all` usado | Code review | ✅ Must |
| FPS ≥ 60 em animações | Chrome DevTools | ✅ Must |
| prefers-reduced-motion respeitado | SO + DevTools | ✅ Must |
| Microinterações sutis e contextuais | Teste visual | ✅ Must |
| Lighthouse Performance ≥ 90 | Lighthouse | ✅ Should |
| CLS < 0.1 | Lighthouse | ✅ Should |
| Ripple effect em botões | Teste click | ✅ Should |
| Glow pulsante no Play idle | Teste idle state | ✅ Should |
| Anel respira quando pausado | Teste pause | ✅ Should |
| Stagger no dropdown | Teste abertura | ✅ Should |

---

## 🎨 Performance Budget

### **Limites Estritos:**
- **Animações simultâneas:** ≤ 3
- **Duration máximo:** 400ms (transições), 3s (loops sutis)
- **FPS mínimo:** 55fps
- **CLS máximo:** 0.1
- **Repaint area:** < 30% da viewport

### **Propriedades Permitidas para Animação:**
✅ `opacity`  
✅ `transform` (scale, rotate, translate)  
✅ `box-shadow`  
✅ `background-color`  
✅ `border-color`  
✅ `color`  

### **Propriedades Proibidas:**
❌ `width`, `height` (causa reflow)  
❌ `position`, `top`, `left` (jank)  
❌ `backdrop-filter` (GPU intensivo)  
❌ `filter: blur()` contínuo (pesado)  

---

## 💾 Git Workflow

```bash
# Branch
git checkout -b feat/microinteractions-refined

# Implementar mudanças...

# Commit
git add .
git commit -m "feat(animations): microinterações naturais com performance e a11y

✨ Sistema de Transições Controladas
- Propriedades específicas (background-color, opacity, transform)
- Duration otimizado (200-400ms)
- prefers-reduced-motion CSS implementado
- NÃO usa transition: all (anti-pattern evitado)

🎯 Ripple Effect nos Botões
- Componente RippleButton reutilizável
- Ripple no ponto exato do clique
- Auto-cleanup após 600ms
- Cor configurável por botão

✨ Glow Pulsante (Play Idle)
- boxShadow [0.3 → 0.7 → 0.3]
- Duration 2s (ritmo calmo)
- Para ao iniciar timer
- Chama atenção sem distrair

🌀 Animação Respiratória do Anel
- Scale [1, 1.015, 1] (1.5% expansão)
- Opacity [0.4, 0.65, 0.4]
- BorderColor verde → dourado → verde
- Duration 3s (respiração lenta)
- Apenas quando idle

🔄 Transições de Página
- PageTransition wrapper
- Fade + slide vertical (10px)
- Duration 300ms
- useReducedMotion integrado

📋 Stagger no Dropdown
- Delay: index * 0.04s
- Duration: 250ms por item
- Hover: translate-x 4px + scale 1.02
- Badge categoria pulsa

♿ Acessibilidade Garantida
- prefers-reduced-motion CSS global
- Hook useReducedMotion para controle programático
- Framer Motion respeita automaticamente
- Funcionalidade preservada sem animações

🚀 Performance Otimizada
- Lighthouse Performance ≥ 90
- FPS ≥ 60 constante
- CLS < 0.1
- Nenhuma propriedade de layout animada
- GPU acceleration otimizado (transform, opacity)

📊 Performance Budget Respeitado
- Animações simultâneas: ≤ 3
- Duration máximo: 400ms (transições), 3s (loops)
- Repaint area: < 30% viewport
- Propriedades GPU-friendly apenas"

# Push
git push origin feat/microinteractions-refined
```

---

## 📊 Resumo de Implementação

### **Arquivos a Criar:**
1. ✅ `src/components/ui/RippleButton.tsx` (ripple effect)
2. ✅ `src/components/PageTransition.tsx` (page transitions)
3. ✅ `src/hooks/useReducedMotion.ts` (a11y hook)

### **Arquivos a Modificar:**
1. ✅ `src/app/globals.css` (transições específicas + prefers-reduced-motion)
2. ✅ `src/app/page.tsx` (glow no Play + anel respiratório)
3. ✅ `src/components/ui/PresetSelector.tsx` (stagger animation)
4. ✅ `src/app/stats/page.tsx` (wrap com PageTransition)
5. ✅ `src/app/ai/page.tsx` (wrap com PageTransition)
6. ✅ `src/app/settings/page.tsx` (wrap com PageTransition)

### **Dependências:**
- ✅ Framer Motion (já instalado)
- ✅ Tailwind CSS (já configurado)
- ✅ Nenhuma dependência adicional necessária

---

## 🎯 Validação Final

### **Checklist Pré-Commit:**
- [ ] Nenhum `transition: all` no código
- [ ] prefers-reduced-motion implementado
- [ ] Lighthouse Performance ≥ 90
- [ ] FPS ≥ 60 durante animações
- [ ] Testes em mobile real (não só DevTools)
- [ ] Screen reader testado (animações não quebram)
- [ ] Atalhos de teclado ainda funcionam
- [ ] Nenhum layout shift (CLS < 0.1)

### **Testes Manuais:**
```bash
1. Performance:
   - Lighthouse → ≥ 90
   - Chrome FPS meter → ≥ 55fps

2. Acessibilidade:
   - Ativar "Reduce Motion" → animações param
   - VoiceOver/NVDA → narração correta
   
3. Visual:
   - Ripple ao clicar botões → suave e no ponto certo
   - Play idle → glow pulsa suavemente
   - Anel pausado → respira lentamente
   - Dropdown → stagger cascata
   - Hover → feedback visual claro

4. Mobile:
   - Testar em iPhone/Android real
   - Gestos funcionam normalmente
   - Haptic feedback funciona
```

---

## 🎉 Resultado Esperado

Após implementação completa, o Timer X2 terá:

✅ **Microinterações Naturais** — feedback visual sutil e contextual  
✅ **Performance Otimizada** — 60fps, CLS < 0.1, Lighthouse ≥90  
✅ **Acessibilidade Garantida** — prefers-reduced-motion respeitado  
✅ **Estética Preservada** — movimento reforça serenidade, não distrai  
✅ **Sistema Controlado** — transições específicas, não globais  
✅ **Feedback Háptico** — vibrações sutis em ações importantes  
✅ **Loading Elegante** — skeletons com delay e cores apropriadas  

---

## 📚 Referências

- [Framer Motion Docs](https://www.framer.com/motion/)
- [WCAG 2.3.3 - Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions)
- [CSS Transition Best Practices](https://web.dev/articles/animations)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

---

**🌿✨ Timer X2 — Microinterações Naturais com Performance e Acessibilidade!**
