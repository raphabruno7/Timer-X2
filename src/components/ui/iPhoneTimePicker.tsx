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
    
    const itemHeight = 48; // altura de cada item (h-12 = 48px)
    const scrollTop = ref.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
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

  // Scroll inicial para valores atuais - "00" centralizado e único visível
  useEffect(() => {
    const timer = setTimeout(() => {
      // Com padding de 51px, o "00" fica centralizado quando scroll = 0
      if (hoursRef.current) {
        hoursRef.current.scrollTop = 0; // "00" centralizado
      }
      if (minutesRef.current) {
        minutesRef.current.scrollTop = 0; // "00" centralizado
      }
      if (secondsRef.current) {
        secondsRef.current.scrollTop = 0; // "00" centralizado
      }
      
      // Garantir que os valores estejam em 0
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const renderTimeColumn = (
    ref: React.RefObject<HTMLDivElement | null>,
    values: number[],
    selected: number,
    setter: (val: number) => void,
    label: string
  ) => (
    <div className="flex flex-col items-center">
      {/* Label */}
      <div className="h-6 flex items-center justify-center mb-3">
        <p className="text-xs text-[#F9F9F9]/70 font-medium uppercase tracking-widest">
          {label}
        </p>
      </div>
      
      {/* Time Column Container */}
      <div className="relative w-20 h-[150px] overflow-hidden rounded-xl border border-emerald-600/40 bg-emerald-950/20 shadow-lg">
        {/* Seleção central highlight */}
        <div className="absolute inset-x-0 top-[75px] h-12 bg-emerald-500/20 border-y border-emerald-500/50 pointer-events-none z-10" />
        
        {/* Gradientes laterais */}
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#1A1A1A] to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#1A1A1A] to-transparent pointer-events-none z-20" />
        
        {/* Scroll container */}
        <div
          ref={ref}
          className="h-full overflow-y-scroll scrollbar-hide snap-y snap-mandatory scroll-smooth"
          onScroll={() => handleScroll(ref, setter, values.length - 1)}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
          }}
        >
          {/* Padding top - aumentado para esconder completamente números acima */}
          <div className="h-[75px]" />
          
          {/* Items */}
          {values.map((value) => {
            const isSelected = value === selected;
            return (
              <div
                key={value}
                className={`h-12 flex items-center justify-center text-2xl font-light transition-all duration-300 snap-center leading-none ${
                  isSelected
                    ? "text-emerald-300 scale-110 font-medium drop-shadow-lg"
                    : "text-[#F9F9F9]/50 scale-95"
                }`}
                style={{
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {value.toString().padStart(2, "0")}
              </div>
            );
          })}
          
          {/* Padding bottom - aumentado para esconder completamente números abaixo */}
          <div className="h-[75px]" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Time Picker Columns - Layout Refinado */}
      <div className="flex justify-center items-center gap-x-8 mb-12">
        {renderTimeColumn(hoursRef, hoursArray, hours, setHours, "HORAS")}
        
        {/* Colon Separator - Refinado */}
        <div className="flex items-center justify-center">
          <div className="text-3xl font-light text-emerald-300/80 drop-shadow-sm">:</div>
        </div>
        
        {renderTimeColumn(minutesRef, minutesArray, minutes, setMinutes, "MIN")}
        
        {/* Colon Separator - Refinado */}
        <div className="flex items-center justify-center">
          <div className="text-3xl font-light text-emerald-300/80 drop-shadow-sm">:</div>
        </div>
        
        {renderTimeColumn(secondsRef, secondsArray, seconds, setSeconds, "SEG")}
      </div>

      {/* Action Buttons - Refinados */}
      <div className="flex gap-6 justify-center">
        <Button
          onClick={cancelAction}
          variant="outline"
          className="border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/30 hover:text-emerald-200 bg-transparent px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <X className="w-5 h-5 mr-3" />
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
        >
          <Play className="w-5 h-5 mr-3" />
          Iniciar
        </Button>
      </div>
    </div>
  );
}