"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSettings: () => void;
}

export function TimerControls({ 
  isRunning, 
  isPaused, 
  timeRemaining, 
  onStart, 
  onPause, 
  onResume, 
  onReset, 
  onSettings 
}: TimerControlsProps) {
  const canStart = !isRunning && timeRemaining > 0;
  const canPause = isRunning && !isPaused;
  const canResume = isRunning && isPaused;
  const canReset = timeRemaining > 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Controles principais */}
      <div className="flex items-center gap-4">
        {/* Botão Play/Pause */}
        {canStart && (
          <Button
            onClick={onStart}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 text-lg rounded-full"
          >
            <Play className="w-6 h-6 mr-2" />
            Começar
          </Button>
        )}
        
        {canPause && (
          <Button
            onClick={onPause}
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-8 py-4 text-lg rounded-full"
          >
            <Pause className="w-6 h-6 mr-2" />
            Pausar
          </Button>
        )}
        
        {canResume && (
          <Button
            onClick={onResume}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 text-lg rounded-full"
          >
            <Play className="w-6 h-6 mr-2" />
            Continuar
          </Button>
        )}
      </div>

      {/* Controles secundários */}
      <div className="flex items-center gap-3">
        {/* Reset */}
        {canReset && (
          <Button
            onClick={onReset}
            variant="outline"
            className="border-emerald-700/30 text-emerald-300 hover:bg-emerald-900/20 hover:text-emerald-200 bg-transparent px-6 py-3"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        )}
        
        {/* Configurações */}
        <Button
          onClick={onSettings}
          variant="outline"
          className="border-emerald-700/30 text-emerald-300 hover:bg-emerald-900/20 hover:text-emerald-200 bg-transparent px-6 py-3"
        >
          <Settings className="w-5 h-5 mr-2" />
          Configurar
        </Button>
      </div>
    </div>
  );
}
