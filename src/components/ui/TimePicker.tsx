"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hours: number, minutes: number, seconds: number) => void;
  inline?: boolean; // Novo prop para modo inline
}

export function TimePicker({ isOpen, onClose, onConfirm, inline = false }: TimePickerProps) {
  // FORÇAR TEMPO INICIAL 00:00:00 - CORREÇÃO URGENTE
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);
  
  // Debounce para evitar muitas atualizações
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Gerar arrays de números
  const hoursArray = Array.from({ length: 100 }, (_, i) => i); // 0-99
  const minutesArray = Array.from({ length: 60 }, (_, i) => i); // 0-59
  const secondsArray = Array.from({ length: 60 }, (_, i) => i); // 0-59

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    setter: (val: number) => void,
    maxValue: number,
    label: string
  ) => {
    if (!ref.current) return;
    
    // Limpar timeout anterior
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Debounce para evitar muitas atualizações
    scrollTimeoutRef.current = setTimeout(() => {
      if (!ref.current) return;
      
      const itemHeight = 48; // altura de cada item
      const scrollTop = ref.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, maxValue));
      
      // Só atualiza se o valor mudou
      setter(clampedIndex);
    }, 50); // 50ms de debounce
  };

  const handleConfirm = () => {
    console.log("[TimePicker] Confirmando tempo:", { hours, minutes, seconds });
    onConfirm(hours, minutes, seconds);
    onClose();
  };

  // Scroll inicial para valores atuais - FORÇAR RESET PARA 00:00:00
  useEffect(() => {
    if (isOpen || inline) {
      // FORÇAR RESET DOS VALORES - CORREÇÃO DEFINITIVA
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      
      const timer = setTimeout(() => {
        if (hoursRef.current) {
          hoursRef.current.scrollTop = 0; // FORÇAR SCROLL PARA 0
        }
        if (minutesRef.current) {
          minutesRef.current.scrollTop = 0; // FORÇAR SCROLL PARA 0
        }
        if (secondsRef.current) {
          secondsRef.current.scrollTop = 0; // FORÇAR SCROLL PARA 0
        }
      }, inline ? 50 : 200); // Delay menor para modo inline
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, inline]); // Adicionado inline como dependência
  
  // Cleanup do timeout quando componente desmonta
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  // Suporte para tecla Escape (apenas em modo modal)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !inline) {
        onClose();
      }
    };

    if (isOpen && !inline) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, inline]);

  const renderWheel = (
    ref: React.RefObject<HTMLDivElement | null>,
    values: number[],
    selected: number,
    setter: (val: number) => void,
    label: string
  ) => (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-48 overflow-hidden">
        {/* Seleção central highlight */}
        <div className="absolute inset-x-0 top-[calc(50%-24px)] h-12 bg-emerald-500/20 border-y-2 border-emerald-500/50 pointer-events-none z-10" />
        
        {/* Gradientes superior e inferior */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#1A1A1A] to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1A1A1A] to-transparent pointer-events-none z-20" />
        
        {/* Scroll container */}
        <div
          ref={ref}
          className="h-full overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
          onScroll={() => handleScroll(ref, setter, values.length - 1, label)}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Padding top */}
          <div className="h-24" />
          
          {/* Items */}
          {values.map((value) => {
            const isSelected = value === selected;
            return (
              <div
                key={value}
                className={`h-12 flex items-center justify-center text-2xl font-bold transition-all snap-center ${
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
          
          {/* Padding bottom */}
          <div className="h-24" />
        </div>
      </div>
      
      {/* Label */}
      <p className="text-xs text-[#F9F9F9]/60 mt-2 font-light uppercase tracking-wider">
        {label}
      </p>
    </div>
  );

  // Renderização inline (sem modal)
  if (inline) {
    return (
      <div className="w-full max-w-md mx-auto">
        {/* Time Picker Wheels */}
        <div className="p-6 flex justify-center gap-4">
          {renderWheel(hoursRef, hoursArray, hours, setHours, "Hours")}
          <div className="text-3xl font-bold text-emerald-300 self-start mt-20">:</div>
          {renderWheel(minutesRef, minutesArray, minutes, setMinutes, "Min")}
          <div className="text-3xl font-bold text-emerald-300 self-start mt-20">:</div>
          {renderWheel(secondsRef, secondsArray, seconds, setSeconds, "Sec")}
        </div>

        {/* Display atual */}
        <div className="px-6 pb-4">
          <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-700/30">
            <p className="text-center text-4xl font-bold text-emerald-300 tracking-wider" style={{ fontVariantNumeric: "tabular-nums" }}>
              {hours.toString().padStart(2, "0")}:
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderização modal (comportamento original)
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="bg-[#1A1A1A] rounded-3xl border-2 border-emerald-700/30 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header com botão de fechar */}
              <div className="p-6 border-b border-emerald-700/20 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F9F9F9]/10 transition-colors duration-200 flex items-center justify-center"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5 text-[#F9F9F9]/70 hover:text-[#F9F9F9]" />
                </button>
                <h2 className="text-2xl font-bold text-emerald-300 text-center tracking-wide uppercase">
                  ⏱️ Manual Time
                </h2>
                <p className="text-sm text-[#F9F9F9]/60 text-center mt-2 font-light">
                  Choose hours, minutes and seconds
                </p>
              </div>

              {/* Time Picker Wheels */}
              <div className="p-6 flex justify-center gap-4">
                {renderWheel(hoursRef, hoursArray, hours, setHours, "Hours")}
                <div className="text-3xl font-bold text-emerald-300 self-start mt-20">:</div>
                {renderWheel(minutesRef, minutesArray, minutes, setMinutes, "Min")}
                <div className="text-3xl font-bold text-emerald-300 self-start mt-20">:</div>
                {renderWheel(secondsRef, secondsArray, seconds, setSeconds, "Sec")}
              </div>

              {/* Display atual */}
              <div className="px-6 pb-4">
                <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-700/30">
                  <p className="text-center text-4xl font-bold text-emerald-300 tracking-wider" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {hours.toString().padStart(2, "0")}:
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 flex gap-3 border-t border-emerald-700/20">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-emerald-700/30 text-emerald-300 hover:bg-emerald-900/20 hover:text-emerald-200 bg-transparent"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


