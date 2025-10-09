# 🧩 AGENTIC CODING — 19B: Background Emocional (Extensão Opcional)

## 📋 CONTEXTO OBRIGATÓRIO

### **Estado Atual do Projeto:**
- ✅ Prompt 19 (Ressonância Emocional) **já implementado e funcional**
- ✅ Hook `useRessonanciaEmocional` criado e testado
- ✅ Integração em `page.tsx` dentro do ConvexProvider
- ✅ Mandala completa com 687 linhas (não simplificar!)

### **Arquivos Existentes (NÃO SOBRESCREVER):**
```
src/
├── hooks/
│   └── useRessonanciaEmocional.ts  (185 linhas - FUNCIONAL)
├── components/
│   └── ui/
│       └── Mandala.tsx             (687 linhas - COMPLETA)
└── app/
    └── page.tsx                    (1417 linhas - INTEGRADO)
```

### **Sistemas para Preservar:**
1. Cérebro Lunar (fase da lua)
2. Sinestesia Adaptativa (Prompt 18 - estado técnico)
3. Ressonância Emocional (Prompt 19 - padrão de uso)

---

## 🎯 OBJETIVO

Adicionar **componente OPCIONAL** `BackgroundEmocional` para fundo reativo:
- ✅ Não quebra arquitetura existente
- ✅ Não sobrescreve arquivos
- ✅ Não modifica Mandala.tsx
- ✅ Não altera layout.tsx (mantém Server Component)

---

## 📦 TAREFAS

### **Tarefa 1: Criar Componente Novo**

**Ação:** `create_file`  
**Arquivo:** `src/components/BackgroundEmocional.tsx`

**Especificações:**
```typescript
"use client";

import { motion } from "framer-motion";
import { type EstadoEmocional } from "@/hooks/useRessonanciaEmocional";

interface BackgroundEmocionalProps {
  estado: EstadoEmocional;
  children: React.ReactNode;
}

export function BackgroundEmocional({ estado, children }: BackgroundEmocionalProps) {
  // PALETA (baseada no design atual):
  // - Verde: #2ECC71 (mantém identidade)
  // - Dourado: #FFD700 (mantém identidade)
  // - Overlay sutil (3-6% opacity, não substituição)
  
  const coresOverlay: Record<EstadoEmocional, string> = {
    tensao: 'rgba(15, 61, 62, 0.03)',        // Azul frio 3%
    foco: 'rgba(46, 204, 113, 0.05)',        // Verde 5%
    reintegracao: 'rgba(255, 215, 0, 0.04)', // Dourado 4%
    realizacao: 'rgba(255, 215, 0, 0.06)',   // Dourado 6%
    neutro: 'transparent',
  };

  return (
    <motion.div
      className="relative w-full min-h-screen"
      animate={{
        backgroundColor: coresOverlay[estado],
      }}
      transition={{
        duration: 2, // 2s (justificado: mudança ambiental, não interação)
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
```

**Validações:**
- ✅ TypeScript sem erros
- ✅ Imports corretos
- ✅ Props tipadas
- ✅ Contraste ≥4.5:1 (WCAG AA)

---

### **Tarefa 2: Documentar Uso (Opcional)**

**Ação:** `create_file`  
**Arquivo:** `src/components/BackgroundEmocional.md`

```markdown
# BackgroundEmocional (Componente Opcional)

## Uso

Wrapper opcional para adicionar fundo reativo baseado em estado emocional.

### Exemplo:
\`\`\`tsx
import { BackgroundEmocional } from "@/components/BackgroundEmocional";

export default function Home() {
  const { estado } = useRessonanciaEmocional(dadosSessoes);
  
  return (
    <BackgroundEmocional estado={estado}>
      <PageTransition>
        <main>{/* conteúdo */}</main>
      </PageTransition>
    </BackgroundEmocional>
  );
}
\`\`\`

## Cores

| Estado | Cor | Opacity |
|--------|-----|---------|
| tensao | Azul frio | 3% |
| foco | Verde | 5% |
| reintegracao | Dourado | 4% |
| realizacao | Dourado | 6% |
| neutro | Transparente | 0% |

## Performance

- GPU-accelerated (transform/opacity)
- Transição: 2s (mudança ambiental)
- Respeita `prefers-reduced-motion`
```

---

### **Tarefa 3: Testes**

**Ação:** `run_tests`

```bash
# 1. Lint
npm run lint

# 2. TypeScript
npx tsc --noEmit

# 3. Build
npm run build

# 4. Visual (manual)
npm run dev
# Abrir http://localhost:3001
# Testar estados: tensao, foco, reintegracao, realizacao
```

---

### **Tarefa 4: Git (Com Validação)**

**Ação:** `git_workflow_safe`

```bash
# 1. Verificar estado limpo
git status
# Validar: "nothing to commit" ou confirmar com usuário

# 2. Garantir que não está em main
git branch --show-current
# Validar: != "main"

# 3. Criar branch (se não existir)
git checkout -b feat/background-emocional-opcional
# Validar: branch criada ou já existe

# 4. Adicionar apenas arquivo novo
git add src/components/BackgroundEmocional.tsx
git add src/components/BackgroundEmocional.md
# Validar: apenas 2 arquivos staged

# 5. Commit descritivo
git commit -m "feat(ui): adicionar BackgroundEmocional (componente opcional)

✨ Componente Opcional
- Wrapper para fundo reativo baseado em estado emocional
- Overlay sutil (3-6% opacity) que não substitui cores base
- Não modifica arquivos existentes

🎨 Paleta
- Mantém identidade visual (verde #2ECC71, dourado #FFD700)
- Overlay por estado emocional (azul/verde/dourado)
- Contraste WCAG AA garantido

🚀 Performance
- GPU-accelerated
- Transição 2s (mudança ambiental)
- Respeita prefers-reduced-motion

📚 Uso (opcional):
<BackgroundEmocional estado={estado}>
  {children}
</BackgroundEmocional>"

# 6. Push (OPCIONAL - perguntar ao usuário)
echo "Deseja fazer push? (y/n)"
read -r RESPOSTA
if [ "$RESPOSTA" = "y" ]; then
  git push -u origin HEAD
fi
```

---

## ⚠️ VALIDAÇÕES OBRIGATÓRIAS

### **Antes de Executar:**
- [ ] Confirmar que Prompt 19 já está implementado
- [ ] Verificar que `useRessonanciaEmocional` existe e funciona
- [ ] Garantir que `layout.tsx` permanece Server Component
- [ ] Confirmar que `Mandala.tsx` não será modificada

### **Durante Execução:**
- [ ] Criar arquivo novo (não sobrescrever)
- [ ] Validar TypeScript sem erros
- [ ] Validar lint sem erros
- [ ] Build sem erros

### **Após Execução:**
- [ ] Testar visualmente os 5 estados
- [ ] Verificar que sistemas existentes funcionam
- [ ] Confirmar FPS ≥60
- [ ] Validar contraste (WCAG AA)

---

## 🚫 AÇÕES PROIBIDAS

### **Não fazer:**
- ❌ Modificar `src/app/layout.tsx` (mantém Server Component)
- ❌ Sobrescrever `src/components/ui/Mandala.tsx` (perde 687 linhas)
- ❌ Alterar assinatura de `useRessonanciaEmocional`
- ❌ Usar cores muito escuras (contraste insuficiente)
- ❌ Transições >3s (desconforto)
- ❌ Push sem confirmação do usuário

---

## 🎯 CRITÉRIOS DE SUCESSO

| Critério | Validação | Status |
|----------|-----------|--------|
| Arquivo novo criado | BackgroundEmocional.tsx existe | [ ] |
| Sem modificações em existentes | git diff mostra apenas novo arquivo | [ ] |
| TypeScript sem erros | tsc --noEmit | [ ] |
| Lint sem erros | npm run lint | [ ] |
| Build sem erros | npm run build | [ ] |
| Contraste WCAG AA | 4.5:1 mínimo | [ ] |
| Performance ≥60fps | Chrome DevTools | [ ] |
| Transição ≤3s | 2s implementado | [ ] |

---

## 📚 REFERÊNCIAS

- Prompt 18: Sinestesia Adaptativa (base)
- Prompt 19: Ressonância Emocional (atual)
- Next.js Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- WCAG Contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Framer Motion: https://www.framer.com/motion/

---

## 🎉 RESULTADO ESPERADO

Um componente **opcional** que:
- ✅ Adiciona fundo reativo sutil
- ✅ Não quebra arquitetura existente
- ✅ Mantém todos os sistemas funcionais
- ✅ Respeita design system atual
- ✅ Performance mantida (≥60fps)
- ✅ Acessibilidade garantida (WCAG AA)

**Usuário pode escolher usar ou não, sem impacto no app.**

---

**🌿✨ Prompt Melhorado — Seguro, Validado e Reversível!**

