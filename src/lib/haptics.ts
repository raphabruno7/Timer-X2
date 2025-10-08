/**
 * Feedback háptico para dispositivos móveis
 * Usa a Web Vibration API quando disponível
 */

export function vibrate(pattern: number | number[]) {
  if (typeof window === 'undefined') return;
  
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (error) {
    console.log('[Haptics] Vibração não suportada:', error);
  }
}

/**
 * Padrões de vibração predefinidos
 */
export const HapticPatterns = {
  light: 30,          // Toque leve
  medium: 50,         // Toque médio
  heavy: 80,          // Toque forte
  success: [30, 50, 30],  // Padrão de sucesso
  error: [50, 100, 50],   // Padrão de erro
  click: 20,          // Click suave
} as const;

