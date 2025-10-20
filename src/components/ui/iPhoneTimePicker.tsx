"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Play } from "lucide-react";

interface Props {
  confirmAction: (hours: number, minutes: number, seconds: number) => void;
  cancelAction: () => void;
}

export default function TimePicker({ confirmAction, cancelAction }: Props) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);


  const handleConfirm = () => {
    confirmAction(hours, minutes, seconds);
  };


  const renderTimeField = (
    value: number,
    setter: (val: number) => void,
    label: string,
    maxValue: number
  ) => (
    <div className="flex flex-col items-center justify-center">
      {/* Label */}
      <p className="text-xs text-[#F9F9F9]/60 mb-3 font-light uppercase tracking-wider">
        {label}
      </p>
      
      {/* Input Field */}
      <div className="relative">
        <input
          type="number"
          min="0"
          max={maxValue}
          value={value}
          onChange={(e) => setter(Number(e.target.value))}
          className="w-16 h-12 text-center bg-emerald-950/40 border border-emerald-700/30 rounded-lg text-emerald-300 text-xl font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          style={{ fontVariantNumeric: "tabular-nums" }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Time Picker Fields - Aligned Layout */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {renderTimeField(hours, setHours, "HORAS", 23)}
        
        {/* Colon Separator */}
        <div className="text-3xl font-bold text-emerald-300 mb-3">:</div>
        
        {renderTimeField(minutes, setMinutes, "MIN", 59)}
        
        {/* Colon Separator */}
        <div className="text-3xl font-bold text-emerald-300 mb-3">:</div>
        
        {renderTimeField(seconds, setSeconds, "SEG", 59)}
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