"use client";

import { useState, useEffect } from "react";

/**
 * Hook para detectar preferência de movimento reduzido (prefers-reduced-motion)
 * Retorna true se o usuário preferir animações reduzidas
 * Segue WCAG 2.3.3 - Animation from Interactions
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Set initial value
    setPrefersReduced(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    // Modern API (suportado por todos navegadores modernos)
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}
