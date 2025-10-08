import { create } from "zustand";

interface TimerState {
  minutes: number;
  presetName: string;
  presetId: string | null;
  setMinutes: (m: number) => void;
  setPreset: (name: string, id: string | null) => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  minutes: 25,
  presetName: "Foco Dinâmico",
  presetId: null,
  setMinutes: (m) => set({ minutes: m }),
  setPreset: (name, id) => set({ presetName: name, presetId: id }),
  reset: () => set({ minutes: 25, presetName: "Foco Dinâmico", presetId: null }),
}));
