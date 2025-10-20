"use client";

import React, { useState, useRef, useEffect } from "react";
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
    
    const itemWidth = 60; // largura de cada item
    const scrollLeft = ref.current.scrollLeft;
    const index = Math.round(scrollLeft / itemWidth);
    const clampedIndex = Math.max(0, Math.min(index, maxValue));
    
    setter(clampedIndex);
  };

  const handleConfirm = () => {
    confirmAction(hours, minutes, seconds);
  };

  // Scroll inicial para valores atuais
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hoursRef.current) {
        hoursRef.current.scrollLeft = hours * 60;
      }
      if (minutesRef.current) {
        minutesRef.current.scrollLeft = minutes * 60;
      }
      if (secondsRef.current) {
        secondsRef.current.scrollLeft = seconds * 60;
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

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

      {/* Time Picker Wheels - Horizontal Layout */}
      <div className="flex justify-center gap-6 mb-8">
        {/* Hours Wheel */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-[#F9F9F9]/60 mb-2 font-light uppercase tracking-wider">
            Horas
          </p>
          <div className="relative w-20 h-16 overflow-hidden">
            <div className="absolute inset-y-0 left-[calc(50%-30px)] w-12 bg-emerald-500/20 border-x-2 border-emerald-500/50 pointer-events-none z-10" />
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#1A1A1A] to-transparent pointer-events-none z-20" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1A1A1A] to-transparent pointer-events-none z-20" />
            <div
              ref={hoursRef}
              className="h-full overflow-x-scroll scrollbar-hide snap-x snap-mandatory"
              onScroll={() => handleScroll(hoursRef, setHours, hoursArray.length - 1)}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="w-8 inline-block" />
              {hoursArray.map((value) => {
                const isSelected = value === hours;
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
              <div className="w-8 inline-block" />
            </div>
          </div>
        </div>

        <div className="text-2xl font-bold text-emerald-300 self-end mb-6">:</div>

        {/* Minutes Wheel */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-[#F9F9F9]/60 mb-2 font-light uppercase tracking-wider">
            Min
          </p>
          <div className="relative w-20 h-16 overflow-hidden">
            <div className="absolute inset-y-0 left-[calc(50%-30px)] w-12 bg-emerald-500/20 border-x-2 border-emerald-500/50 pointer-events-none z-10" />
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#1A1A1A] to-transparent pointer-events-none z-20" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1A1A1A] to-transparent pointer-events-none z-20" />
            <div
              ref={minutesRef}
              className="h-full overflow-x-scroll scrollbar-hide snap-x snap-mandatory"
              onScroll={() => handleScroll(minutesRef, setMinutes, minutesArray.length - 1)}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="w-8 inline-block" />
              {minutesArray.map((value) => {
                const isSelected = value === minutes;
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
              <div className="w-8 inline-block" />
            </div>
          </div>
        </div>

        <div className="text-2xl font-bold text-emerald-300 self-end mb-6">:</div>

        {/* Seconds Wheel */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-[#F9F9F9]/60 mb-2 font-light uppercase tracking-wider">
            Seg
          </p>
          <div className="relative w-20 h-16 overflow-hidden">
            <div className="absolute inset-y-0 left-[calc(50%-30px)] w-12 bg-emerald-500/20 border-x-2 border-emerald-500/50 pointer-events-none z-10" />
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#1A1A1A] to-transparent pointer-events-none z-20" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1A1A1A] to-transparent pointer-events-none z-20" />
            <div
              ref={secondsRef}
              className="h-full overflow-x-scroll scrollbar-hide snap-x snap-mandatory"
              onScroll={() => handleScroll(secondsRef, setSeconds, secondsArray.length - 1)}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="w-8 inline-block" />
              {secondsArray.map((value) => {
                const isSelected = value === seconds;
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
              <div className="w-8 inline-block" />
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