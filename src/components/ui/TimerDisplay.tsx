"use client";

import React from "react";
import { motion } from "framer-motion";

interface TimerDisplayProps {
  timeRemaining: number; // em segundos
  isRunning: boolean;
  isPaused: boolean;
  presetName: string;
}

export function TimerDisplay({ timeRemaining, isRunning, isPaused, presetName }: TimerDisplayProps) {
  // Converter segundos para formato MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  
  // Calcular progresso (0-1)
  const totalSeconds = minutes * 60 + seconds;
  const progress = totalSeconds > 0 ? (timeRemaining / totalSeconds) : 0;
  
  // Calcular ângulo do círculo de progresso
  const circumference = 2 * Math.PI * 120; // raio 120
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Círculo de Progresso */}
      <div className="relative mb-8">
        <svg width="280" height="280" className="transform -rotate-90">
          {/* Círculo de fundo */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="rgba(46, 204, 113, 0.2)"
            strokeWidth="8"
            fill="none"
          />
          {/* Círculo de progresso */}
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            stroke="#2ECC71"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
        
        {/* Tempo no centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            animate={{
              scale: isRunning ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isRunning ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <div className="text-5xl font-light text-emerald-300 tracking-wider mb-2" style={{ fontVariantNumeric: "tabular-nums" }}>
              {timeString}
            </div>
            <div className="text-sm text-[#F9F9F9]/70 uppercase tracking-wide">
              {presetName}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status */}
      <motion.div
        className="text-center mb-6"
        animate={{ opacity: isRunning ? 1 : 0.7 }}
      >
        {isRunning && !isPaused && (
          <div className="text-emerald-400 text-sm font-light tracking-wide">
            ⏱️ Rodando...
          </div>
        )}
        {isPaused && (
          <div className="text-yellow-400 text-sm font-light tracking-wide">
            ⏸️ Pausado
          </div>
        )}
        {!isRunning && !isPaused && timeRemaining > 0 && (
          <div className="text-[#F9F9F9]/60 text-sm font-light tracking-wide">
            ⏹️ Pronto para começar
          </div>
        )}
        {timeRemaining === 0 && (
          <div className="text-emerald-400 text-sm font-light tracking-wide">
            ✅ Tempo concluído!
          </div>
        )}
      </motion.div>
    </div>
  );
}
