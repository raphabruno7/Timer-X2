import { create } from "zustand";

interface TimerState {
  minutes: number;
  presetName: string;
  presetId: string | null;
  isManualTime: boolean; // Flag para indicar se o tempo foi definido manualmente
  setMinutes: (m: number) => void;
  setPreset: (name: string, id: string | null) => void;
  setManualTime: (m: number, name: string) => void; // Método específico para tempo manual
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  minutes: 25,
  presetName: "Foco Dinâmico",
  presetId: null,
  isManualTime: false, // Inicialmente não é tempo manual
  setMinutes: (m) => set({ minutes: m, isManualTime: false }), // setMinutes marca como não manual
  setPreset: (name, id) => set({ presetName: name, presetId: id }),
  setManualTime: (m, name) => set({ 
    minutes: m, 
    presetName: name, 
    presetId: null, 
    isManualTime: true 
  }), // setManualTime marca como manual
  reset: () => set({ 
    minutes: 25, 
    presetName: "Foco Dinâmico", 
    presetId: null, 
    isManualTime: false 
  }),
}));
