# ⏱️ Timer X² — Focus & Breathwork for Peak Productivity

**Version:** v1.0 · **Date:** October 2025  
**Stack:** Next.js + TypeScript + Tailwind + ShadCN + Framer Motion + Convex  
**🌐 Live Demo:** [timer-x2.vercel.app](https://timer-x2.vercel.app)

---

## 💡 Purpose

**Timer X²** is a **focus and productivity system** that combines **time management techniques** (like Pomodoro and Deep Work) with **breathwork exercises** to restore energy and concentration between work sessions.

> "Real productivity is when body and mind breathe in the same rhythm."  

---

## 🎯 What Timer X² Does

- ⏳ Smart Timer (play, pause, reset)  
- 🌬️ Guided Breathing Sessions for energetic breaks  
- 🎧 Focus Modes: Deep Work, Study, Creativity, Reading  
- 📊 History and Productivity Statistics  
- ⚙️ Fluid and Responsive Interface  
- ⏱️ Custom Time Picker (up to 99:59:59)

---

## 🧱 Architecture

```
src/
├── app/
│   ├── page.tsx              # Main timer
│   ├── manual/page.tsx       # Custom time picker
│   ├── settings/page.tsx     # Settings
│   └── stats/page.tsx        # Statistics
│
├── components/
│   ├── ui/
│   │   ├── TimePicker.tsx    # Custom time selection
│   │   ├── PresetSelector.tsx# Focus modes
│   │   ├── Mandala.tsx       # Visual feedback
│   │   └── BottomNav.tsx     # Navigation
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
```

---

## ⚙️ Setup

1️⃣ Clone the repository  
```bash
git clone https://github.com/yourusername/timer-x2.git
cd timer-x2
```

2️⃣ Install dependencies  
```bash
npm install
```

3️⃣ Configure environment variables  
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

4️⃣ Set up Convex (if using database features)  
```bash
npx convex dev
# Follow the setup instructions
```

5️⃣ Run in development mode  
```bash
npm run dev
```  
➡️ http://localhost:3000

---

## 🧘 Philosophy

Each **Timer X²** cycle combines **intense focus** with **active recovery**, allowing the brain and body to maintain a productive rhythm without exhaustion.

Integrated methods:
- Pomodoro (25/5)
- Deep Focus (45/10)
- Micro-Break (10/2)
- Breath Reset (4-4-4 breathing)
- Alternate Nostril (Nadi Shodhana)

---

## 🎨 Design System

| Element | Color | Meaning |
|---------|-------|---------|
| Main background | #1C1C1C | Focus |
| Primary green | #2ECC71 | Energy |
| Gold accent | #FFD700 | Clarity |
| Soft white | #F9F9F9 | Lightness |

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| FPS | 60 |
| CLS | <0.1 |
| Lighthouse Perf | ≥ 90 |
| Lighthouse A11y | ≥ 95 |
| prefers-reduced-motion | OK |

---

## 🚀 Deploy

### 🌐 Live Application
**Access the app:** [timer-x2.vercel.app](https://timer-x2.vercel.app)

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run lint
npm run build
npm run start
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy Convex Database
```bash
npx convex deploy
```

---

## 🧩 Future Roadmap

| Phase | Feature | Goal |
|-------|---------|------|
| v1.1 | Advanced focus adjustments | Improve timer flow |
| v1.2 | Weekly reports | Performance insights |
| v1.3 | Sunni AI Integration | Adaptive music and sound |
| v2.0 | Community and challenges | Collaborative focus sessions |

---

## 👤 Credits

| Area | Responsible |
|------|-------------|
| Conception | Raphael Bruno Dantas Moreira |
| Development | GPT-5 Agentic Coding |
| Design | Minimal Productivity Lab |
| Infrastructure | Convex + Vercel |

---

## 📄 License
MIT License © 2025 — Timer X² Project  
Free use for educational and personal productivity purposes.

---

## 💬 Final Message

> **Timer X²** is more than a timer.  
> It's an instrument of energy, focus, and clarity — for those who work with presence.

---

**Status:** *Production ready – continuous refinement* 🌱