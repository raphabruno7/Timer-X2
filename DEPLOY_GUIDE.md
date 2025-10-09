# 🚀 Guia de Deploy - Timer X2 v1.0

**Versão:** 1.0.0  
**Data:** 09/10/2025  
**Branch:** `release/v1.0`  
**Tag:** `v1.0` (commit: 85fa1e4)

---

## ✅ Pré-requisitos

### **Validações Completadas:**
- [x] TypeScript: 0 erros
- [x] Lint: 0 erros críticos
- [x] Build: sucesso (npm run build)
- [x] Dev server: funcional (http://localhost:3001)
- [x] Branch de release criada
- [x] Tag v1.0 criada
- [x] Documentação completa

---

## 🚀 Processo de Deploy (3 Etapas)

### **Etapa 1: Push para GitHub** 📤

```bash
# Verificar remote
git remote -v

# Push da branch de release com tags
git push origin release/v1.0 --tags

# Verificação:
# - Branch release/v1.0 aparece no GitHub
# - Tag v1.0 aparece em Releases
```

**Resultado esperado:**
```
✅ remote: Resolving deltas: 100%
✅ To github.com:usuario/timer-x2.git
✅  * [new branch]      release/v1.0 -> release/v1.0
✅  * [new tag]         v1.0 -> v1.0
```

---

### **Etapa 2: Deploy Vercel** ☁️

#### **Opção A: Via CLI**
```bash
# Instalar Vercel CLI (se necessário)
npm i -g vercel

# Login (se necessário)
vercel login

# Deploy para produção
vercel --prod

# Seguir prompts:
# - Set up and deploy? Y
# - Project name: timer-x2
# - Deploy? Y
```

#### **Opção B: Via Git Push (CI/CD)**
```bash
# Se Vercel estiver conectado ao GitHub:
git push origin release/v1.0

# Vercel detecta automaticamente e faz deploy
# Monitorar em: https://vercel.com/dashboard
```

**Resultado esperado:**
```
✅ Build completed
✅ Deployment ready
✅ Production: https://timer-x2.vercel.app
```

---

### **Etapa 3: Deploy Convex** 🗄️

```bash
# Verificar se está autenticado
npx convex whoami

# Deploy para produção (se necessário)
npx convex deploy --prod

# Confirmar:
# - Functions deployed
# - Schemas synced
# - Database ready
```

**Resultado esperado:**
```
✅ Deploying functions...
✅ Functions deployed: 15
✅ Database ready
✅ Dashboard: https://dashboard.convex.dev/...
```

---

## 🔍 Verificações Pós-Deploy

### **1. Site Funcionando**
```bash
# Abrir em navegador:
https://timer-x2.vercel.app

# Verificar:
✅ Página carrega (sem erro 500)
✅ Timer aparece (Mandala visível)
✅ Play/Pause/Reset funcionam
✅ Presets carregam do Convex
✅ Nenhum erro no Console (F12)
```

### **2. Performance**
```bash
# Lighthouse (Chrome DevTools)
1. F12 → Lighthouse tab
2. Mode: Mobile
3. Categories: All
4. Generate Report

Verificar:
✅ Performance: ≥90
✅ Accessibility: ≥95
✅ Best Practices: ≥90
✅ SEO: ≥90
```

### **3. Funcionalidade**
```bash
# Testar fluxo completo:
1. Selecionar preset (25min)
2. Clicar Play
3. Observar Mandala pulsando (verde)
4. Clicar Pause
5. Observar Mandala respirando (dourado+verde)
6. Clicar Play novamente
7. Aguardar 1-2 min
8. Clicar Reset
9. Verificar histórico em /stats

✅ Tudo funciona sem erros
```

### **4. Convex Database**
```bash
# Abrir Convex Dashboard
npx convex dashboard

# Verificar:
✅ Tables: presets, historico, sessoes, ciclos, etc.
✅ Functions: listar, adicionar, registrar, etc.
✅ Queries: respondendo
✅ Mutations: funcionando
✅ Logs: sem erros
```

---

## 🐛 Troubleshooting

### **Problema: Build falha**
```bash
# Limpar cache e reinstalar
rm -rf .next node_modules
npm install
npm run build
```

### **Problema: Convex não conecta**
```bash
# Verificar env vars
cat .env.local | grep CONVEX

# Deve ter:
CONVEX_URL=https://...
NEXT_PUBLIC_CONVEX_URL=https://...

# Se não tiver, rodar:
npx convex dev --once
```

### **Problema: Vercel build falha**
```bash
# Verificar Node version
node -v  # Deve ser ≥18

# Verificar package.json engine:
"engines": {
  "node": ">=18.0.0"
}

# Rebuild local:
npm run build
```

---

## 📊 Métricas de Sucesso

### **Performance (esperado):**
```
✅ Lighthouse Performance: ≥90
✅ FPS: 60fps constante
✅ Time to Interactive: <3s
✅ First Contentful Paint: <1.5s
✅ Cumulative Layout Shift: <0.1
```

### **Funcional:**
```
✅ Timer funciona
✅ Mandala responde
✅ Presets salvam
✅ Histórico registra
✅ IA sugere (se API key configurada)
✅ Mobile responsivo
```

### **Técnico:**
```
✅ Build size: 248 kB First Load JS
✅ TypeScript: 0 errors
✅ Lint: 0 errors críticos
✅ WCAG: AA compliance
```

---

## 🎯 Comandos Rápidos

### **Deploy Completo (All-in-One):**
```bash
# 1. Push para GitHub
git push origin release/v1.0 --tags

# 2. Deploy Vercel
vercel --prod

# 3. Deploy Convex (se necessário)
npx convex deploy --prod

# 4. Verificar
open https://timer-x2.vercel.app
```

### **Rollback (se necessário):**
```bash
# Voltar para versão anterior
vercel rollback

# Ou redeployar main
git checkout main
vercel --prod
```

---

## 📞 Links Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Convex Dashboard:** https://dashboard.convex.dev
- **GitHub Repo:** (seu repositório)
- **Docs Next.js:** https://nextjs.org/docs
- **Docs Convex:** https://docs.convex.dev

---

## ✨ Próximo Lançamento (v1.1)

### **Planejado:**
- Limpar warnings de código não usado
- Adicionar testes automatizados (Jest/Vitest)
- Lighthouse real (não estimado)
- Feedback de usuários reais
- Melhorias de UX baseadas em analytics

---

**🌿✨ Timer X2 v1.0 — Pronto para Deploy!**

---

_Guia criado em 09/10/2025_  
_Status: Aguardando execução dos comandos de deploy_

