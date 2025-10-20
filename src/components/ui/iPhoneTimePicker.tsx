"use client";

import React, { useState, useRef, useEffect } from "react";
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

  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);

  // Gerar arrays de números
  const hoursArray = Array.from({ length: 24 }, (_, i) => i); // 0-23
  const minutesArray = Array.from({ length: 60 }, (_, i) => i); // 0-59
  const secondsArray = Array.from({ length: 60 }, (_, i) => i); // 0-59

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    setter: (val: number) => void,
    maxValue: number
  ) => {
    if (!ref.current) return;
    
    const itemWidth = 48; // largura de cada item (w-12 = 48px)
    const padding = 24; // padding left (w-6 = 24px)
    const scrollLeft = ref.current.scrollLeft;
    const index = Math.round((scrollLeft - padding) / itemWidth);
    const clampedIndex = Math.max(0, Math.min(index, maxValue));
    
    // Só atualiza se o valor mudou
    setter((prevValue) => {
      if (prevValue !== clampedIndex) {
        console.log(`[TimePicker] Scroll atualizado: ${clampedIndex}`);
        return clampedIndex;
      }
      return prevValue;
    });
  };

  const handleConfirm = () => {
    confirmAction(hours, minutes, seconds);
  };

  // Scroll inicial para valores atuais
  useEffect(() => {
    const timer = setTimeout(() => {
      const padding = 24; // padding left
      const itemWidth = 48; // largura do item
      
      if (hoursRef.current) {
        hoursRef.current.scrollLeft = padding + (hours * itemWidth);
      }
      if (minutesRef.current) {
        minutesRef.current.scrollLeft = padding + (minutes * itemWidth);
      }
      if (secondsRef.current) {
        secondsRef.current.scrollLeft = padding + (seconds * itemWidth);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const renderSwipeWheel = (
    ref: React.RefObject<HTMLDivElement | null>,
    values: number[],
    selected: number,
    setter: (val: number) => void,
    label: string
  ) => (
    <div className="flex flex-col items-center h-20">
      {/* Label - Altura fixa para alinhamento */}
      <div className="h-6 flex items-center justify-center mb-2">
        <p className="text-xs text-[#F9F9F9]/60 font-light uppercase tracking-wider">
          {label}
        </p>
      </div>
      
      {/* Swipe Wheel Container - Altura fixa */}
      <div className="relative w-20 h-16 overflow-hidden rounded-lg border border-emerald-700/30 bg-emerald-950/20">
        {/* Seleção central highlight */}
        <div className="absolute inset-y-0 left-[calc(50%-30px)] w-12 bg-emerald-500/20 border-x-2 border-emerald-500/50 pointer-events-none z-10" />
        
        {/* Gradientes laterais */}
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#1A1A1A] to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#1A1A1A] to-transparent pointer-events-none z-20" />
        
        {/* Scroll container */}
        <div
          ref={ref}
          className="h-full overflow-x-scroll scrollbar-hide snap-x snap-mandatory"
          onScroll={() => handleScroll(ref, setter, values.length - 1)}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Padding left */}
          <div className="w-6 inline-block" />
          
          {/* Items */}
          {values.map((value) => {
            const isSelected = value === selected;
            return (
              <div
                key={value}
                className={`w-12 h-16 inline-flex items-center justify-center text-lg font-bold transition-all snap-center ${
                  isSelected
                    ? "text-emerald-300 scale-110"
                    : "text-[#F9F9F9]/40 scale-90"
                }`}
                style={{
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {value.toString().padStart(2, "0")}
              </div>
            );
          })}
          
          {/* Padding right */}
          <div className="w-6 inline-block" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Swipe Time Picker Wheels - Estrutura Matemática Precisa */}
      <div className="flex items-center justify-center gap-6 mb-8">
        {/* Container para HORAS */}
        <div className="flex flex-col items-center h-20">
          {renderSwipeWheel(hoursRef, hoursArray, hours, setHours, "HORAS")}
        </div>
        
        {/* Colon Separator - Centralizado matematicamente */}
        <div className="h-20 flex items-center justify-center">
          <div className="text-3xl font-bold text-emerald-300">:</div>
        </div>
        
        {/* Container para MIN */}
        <div className="flex flex-col items-center h-20">
          {renderSwipeWheel(minutesRef, minutesArray, minutes, setMinutes, "MIN")}
        </div>
        
        {/* Colon Separator - Centralizado matematicamente */}
        <div className="h-20 flex items-center justify-center">
          <div className="text-3xl font-bold text-emerald-300">:</div>
        </div>
        
        {/* Container para SEG */}
        <div className="flex flex-col items-center h-20">
          {renderSwipeWheel(secondsRef, secondsArray, seconds, setSeconds, "SEG")}
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