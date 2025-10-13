# 🎨 Timer X2 — Sugestões de Tipografia

**Versão:** v1.0  
**Data:** 09/10/2025  
**Objetivo:** Melhorar hierarquia visual e legibilidade

---

## 🎯 **Melhorias Implementadas**

### ✅ **Título Principal**
```css
/* ANTES */
Timer X2 (font-light)

/* DEPOIS */
TIMER X² (font-bold + uppercase + superscript)
```

### ✅ **Contador de Tempo**
```css
/* ANTES */
font-light (300)

/* DEPOIS */
font-bold + fontWeight: 700
```

### ✅ **Status do Timer**
```css
/* ANTES */
"Em foco" (font-light)

/* DEPOIS */
"EM FOCO" (font-semibold + uppercase)
```

### ✅ **Elemento Ativo**
```css
/* ANTES */
"Elemento Ativo" (font-normal)

/* DEPOIS */
"ELEMENTO ATIVO" (font-semibold + uppercase)
```

---

## 🔤 **Sugestões de Fontes para o App**

### **1. Fontes do Sistema (Recomendadas)**

#### **Para Títulos e Contador:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
font-weight: 700; /* Bold */
```

#### **Para Texto Corpo:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
font-weight: 500; /* Medium */
```

### **2. Fontes Google Fonts (Alternativas)**

#### **Opção A - Inter (Moderno)**
```css
/* Import no layout.tsx */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Uso */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

#### **Opção B - Poppins (Friendly)**
```css
/* Import no layout.tsx */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

/* Uso */
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
```

#### **Opção C - Space Grotesk (Tech)**
```css
/* Import no layout.tsx */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

/* Uso */
font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
```

### **3. Fontes Monospace (Para Contador)**

#### **JetBrains Mono (Recomendada)**
```css
/* Import no layout.tsx */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

/* Para contador de tempo */
font-family: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
```

---

## 📱 **Hierarquia de Fontes Sugerida**

| Elemento | Fonte | Peso | Tamanho | Uso |
|----------|-------|------|---------|-----|
| **Título** | System Bold | 700 | 3xl | TIMER X² |
| **Contador** | JetBrains Mono | 700 | 3xl-5xl | 24:38 |
| **Status** | System Medium | 600 | sm | EM FOCO |
| **Elemento** | System Medium | 600 | sm | ELEMENTO ATIVO |
| **Botões** | System Medium | 500 | base | Play/Pause/Reset |
| **Presets** | System Regular | 400 | sm | Foco Dinâmico |

---

## 🎨 **Implementação no Tailwind**

### **1. Configurar fontes no `tailwind.config.ts`:**
```typescript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      }
    }
  }
}
```

### **2. Classes CSS sugeridas:**
```css
/* Títulos */
.text-title { @apply font-bold text-3xl uppercase tracking-wider; }

/* Contador */
.text-timer { @apply font-mono font-bold text-3xl sm:text-4xl md:text-5xl; }

/* Status */
.text-status { @apply font-semibold text-sm uppercase tracking-wide; }

/* Botões */
.text-button { @apply font-medium text-base; }
```

---

## 🚀 **Próximos Passos**

1. **Testar fontes** no navegador
2. **Implementar** JetBrains Mono para contador
3. **Ajustar** espaçamentos (letter-spacing)
4. **Otimizar** para diferentes tamanhos de tela
5. **Considerar** `font-display: swap` para performance

---

## 💡 **Dicas de UX**

- **Contador:** Monospace garante alinhamento perfeito dos números
- **Títulos:** Bold + uppercase cria hierarquia clara
- **Status:** Semibold + uppercase melhora legibilidade
- **Consistência:** Usar mesma família em todo o app

---

**Status:** ✅ Implementado parcialmente  
**Próximo:** Testar fontes Google Fonts
