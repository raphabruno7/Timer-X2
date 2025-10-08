"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  delay?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Skeleton loader que só aparece após um delay
 * Evita flash de loading para operações rápidas (<500ms)
 */
export function SkeletonWithDelay({ 
  delay = 500, 
  className = "",
  children 
}: SkeletonProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`animate-pulse ${className}`}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      {children || (
        <div className="space-y-3">
          <div className="h-8 bg-emerald-900/20 rounded-lg w-full" />
          <div className="h-6 bg-emerald-900/20 rounded-lg w-3/4" />
          <div className="h-6 bg-emerald-900/20 rounded-lg w-1/2" />
        </div>
      )}
    </motion.div>
  );
}
