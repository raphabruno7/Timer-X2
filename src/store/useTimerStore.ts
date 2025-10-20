import { create } from "zustand";

interface TimerState {
  // Configuração do timer
  minutes: number;
  presetName: string;
  presetId: string | null;
  isManualTime: boolean; // Flag para indicar se o tempo foi definido manualmente
  
  // Estados do timer
  timeRemaining: number; // Tempo restante em segundos
  isRunning: boolean; // Se o timer está rodando
  isPaused: boolean; // Se o timer está pausado
  
  // Métodos de configuração
  setMinutes: (m: number) => void;
  setPreset: (name: string, id: string | null) => void;
  setManualTime: (m: number, name: string) => void; // Método específico para tempo manual
  
  // Métodos de controle do timer
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tick: () => void; // Decrementar tempo
  
  // Reset geral
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  // Configuração inicial
  minutes: 25,
  presetName: "Foco Dinâmico",
  presetId: null,
  isManualTime: false,
  
  // Estados do timer
  timeRemaining: 25 * 60, // 25 minutos em segundos
  isRunning: false,
  isPaused: false,
  
  // Métodos de configuração
  setMinutes: (m) => set({ 
    minutes: m, 
    timeRemaining: m * 60,
    isManualTime: false 
  }),
  
  setPreset: (name, id) => set({ presetName: name, presetId: id }),
  
  setManualTime: (m, name) => set({ 
    minutes: m, 
    presetName: name, 
    presetId: null, 
    timeRemaining: m * 60,
    isManualTime: true 
  }),
  
  // Métodos de controle do timer
  startTimer: () => set({ isRunning: true, isPaused: false }),
  
  pauseTimer: () => set({ isRunning: false, isPaused: true }),
  
  resumeTimer: () => set({ isRunning: true, isPaused: false }),
  
  resetTimer: () => {
    const state = get();
    set({ 
      timeRemaining: state.minutes * 60,
      isRunning: false, 
      isPaused: false 
    });
  },
  
  tick: () => {
    const state = get();
    if (state.isRunning && state.timeRemaining > 0) {
      set({ timeRemaining: state.timeRemaining - 1 });
    } else if (state.timeRemaining === 0) {
      // Timer terminou
      set({ isRunning: false, isPaused: false });
    }
  },
  
  // Reset geral
  reset: () => set({ 
    minutes: 25, 
    presetName: "Foco Dinâmico", 
    presetId: null, 
    timeRemaining: 25 * 60,
    isRunning: false,
    isPaused: false,
    isManualTime: false 
  }),
}));
