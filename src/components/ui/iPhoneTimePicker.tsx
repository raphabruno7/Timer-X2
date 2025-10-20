"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Play } from "lucide-react";

interface Props {
  confirmAction: (hours: number, minutes: number, seconds: number) => void;
  cancelAction: () => void;
}

export default function iPhoneTimePicker({ confirmAction, cancelAction }: Props) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleConfirm = () => {
    confirmAction(hours, minutes, seconds);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-emerald-300 mb-2 uppercase tracking-wider">
          ⏱️ Manual Time
        </h2>
        <p className="text-sm text-[#F9F9F9]/60 font-light">
          Escolha horas, minutos e segundos
        </p>
      </div>

      {/* Simple Time Input */}
      <div className="mb-8">
        <div className="bg-emerald-950/40 rounded-xl p-6 border border-emerald-700/30">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <label className="text-xs text-[#F9F9F9]/60 mb-2 block font-light uppercase tracking-wider">
                Horas
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                className="w-full text-center text-2xl font-bold text-emerald-300 bg-transparent border border-emerald-700/30 rounded-lg p-2"
              />
            </div>
            <div className="text-center">
              <label className="text-xs text-[#F9F9F9]/60 mb-2 block font-light uppercase tracking-wider">
                Min
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className="w-full text-center text-2xl font-bold text-emerald-300 bg-transparent border border-emerald-700/30 rounded-lg p-2"
              />
            </div>
            <div className="text-center">
              <label className="text-xs text-[#F9F9F9]/60 mb-2 block font-light uppercase tracking-wider">
                Seg
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                className="w-full text-center text-2xl font-bold text-emerald-300 bg-transparent border border-emerald-700/30 rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Display atual */}
      <div className="mb-8">
        <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-700/30">
          <p className="text-center text-3xl font-bold text-emerald-300 tracking-wider" style={{ fontVariantNumeric: "tabular-nums" }}>
            {hours.toString().padStart(2, "0")}:
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={cancelAction}
          variant="outline"
          className="border-emerald-700/30 text-emerald-300 hover:bg-emerald-900/20 hover:text-emerald-200 bg-transparent px-6 py-3 rounded-full"
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-full"
        >
          <Play className="w-4 h-4 mr-2" />
          Iniciar
        </Button>
      </div>
    </div>
  );
}