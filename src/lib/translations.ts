// Sistema de traduções para Timer X²
// Detecta automaticamente o idioma do dispositivo

export type Language = 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE';

export interface Translations {
  // Header
  title: string;
  subtitle: string;
  
  // Timer
  timer: {
    play: string;
    pause: string;
    reset: string;
    focusMode: string;
    breathingMode: string;
    breakMode: string;
  };
  
  // Navigation
  nav: {
    stats: string;
    timer: string;
    ai: string;
    manual: string;
    settings: string;
  };
  
  // AI Page
  ai: {
    title: string;
    analysis: {
      title: string;
      description: string;
      energyDetection: string;
      energyDescription: string;
      adaptiveAdjustment: string;
      adaptiveDescription: string;
    };
    features: {
      title: string;
      idealMode: string;
      idealDescription: string;
      bestTime: string;
      bestTimeDescription: string;
      fatiguePrediction: string;
      fatigueDescription: string;
    };
  };
  
  // Manual Page
  manual: {
    title: string;
    subtitle: string;
    selectedTime: string;
    setTime: string;
    selectAtLeastOneMinute: string;
    timerSetTo: string;
    hours: string;
    minutes: string;
    seconds: string;
    confirm: string;
    cancel: string;
  };
  
  // Settings
  settings: {
    title: string;
    language: string;
    theme: string;
    notifications: string;
  };
  
  // Stats
  stats: {
    title: string;
    totalTime: string;
    sessions: string;
    averageSession: string;
  };
}

// Traduções em Português (Brasil)
const ptBR: Translations = {
  title: 'Timer X²',
  subtitle: 'Foco & Respiração para Produtividade Máxima',
  
  timer: {
    play: 'Iniciar',
    pause: 'Pausar',
    reset: 'Resetar',
    focusMode: 'Foco Dinâmico',
    breathingMode: 'Respiração Profunda',
    breakMode: 'Pausa Curta',
  },
  
  nav: {
    stats: 'Stats',
    timer: 'Timer',
    ai: 'IA',
    manual: 'Manual',
    settings: 'Configurações',
  },
  
  ai: {
    title: 'Inteligência Artificial',
    analysis: {
      title: 'Análise de Padrões',
      description: 'A IA analisa seus hábitos de foco e sugere ajustes personalizados para maximizar sua produtividade.',
      energyDetection: 'Detecção de Energia',
      energyDescription: 'Identifica seus melhores horários',
      adaptiveAdjustment: 'Ajuste Adaptativo',
      adaptiveDescription: 'Ritmo personalizado automaticamente',
    },
    features: {
      title: 'Próximas Funcionalidades',
      idealMode: 'Sugestão de Modo Ideal',
      idealDescription: 'Baseado em contexto, horário e histórico',
      bestTime: 'Melhor Horário para Foco',
      bestTimeDescription: 'Análise de produtividade por período',
      fatiguePrediction: 'Previsão de Cansaço',
      fatigueDescription: 'Alertas preventivos e pausas sugeridas',
    },
  },
  
  manual: {
    title: 'Tempo Manual',
    subtitle: 'Escolha horas, minutos e segundos',
    selectedTime: 'Tempo Selecionado',
    setTime: 'Definir Tempo',
    selectAtLeastOneMinute: 'Selecione pelo menos 1 minuto',
    timerSetTo: 'Timer definido para',
    hours: 'Horas',
    minutes: 'Min',
    seconds: 'Seg',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
  },
  
  settings: {
    title: 'Configurações',
    language: 'Idioma',
    theme: 'Tema',
    notifications: 'Notificações',
  },
  
  stats: {
    title: 'Estatísticas',
    totalTime: 'Tempo Total',
    sessions: 'Sessões',
    averageSession: 'Média por Sessão',
  },
};

// Traduções em Inglês
const enUS: Translations = {
  title: 'Timer X²',
  subtitle: 'Focus & Breathwork for Peak Productivity',
  
  timer: {
    play: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    focusMode: 'Dynamic Focus',
    breathingMode: 'Deep Breathing',
    breakMode: 'Short Break',
  },
  
  nav: {
    stats: 'Stats',
    timer: 'Timer',
    ai: 'AI',
    manual: 'Manual',
    settings: 'Settings',
  },
  
  ai: {
    title: 'Artificial Intelligence',
    analysis: {
      title: 'Pattern Analysis',
      description: 'AI analyzes your focus habits and suggests personalized adjustments to maximize your productivity.',
      energyDetection: 'Energy Detection',
      energyDescription: 'Identifies your best times',
      adaptiveAdjustment: 'Adaptive Adjustment',
      adaptiveDescription: 'Automatically personalized rhythm',
    },
    features: {
      title: 'Upcoming Features',
      idealMode: 'Ideal Mode Suggestion',
      idealDescription: 'Based on context, time and history',
      bestTime: 'Best Focus Time',
      bestTimeDescription: 'Productivity analysis by period',
      fatiguePrediction: 'Fatigue Prediction',
      fatigueDescription: 'Preventive alerts and suggested breaks',
    },
  },
  
  manual: {
    title: 'Manual Time',
    subtitle: 'Choose hours, minutes and seconds',
    selectedTime: 'Selected Time',
    setTime: 'Set Time',
    selectAtLeastOneMinute: 'Select at least 1 minute',
    timerSetTo: 'Timer set to',
    hours: 'Hours',
    minutes: 'Min',
    seconds: 'Sec',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  
  settings: {
    title: 'Settings',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
  },
  
  stats: {
    title: 'Statistics',
    totalTime: 'Total Time',
    sessions: 'Sessions',
    averageSession: 'Average Session',
  },
};

// Traduções em Espanhol
const esES: Translations = {
  title: 'Timer X²',
  subtitle: 'Enfoque y Respiración para Máxima Productividad',
  
  timer: {
    play: 'Iniciar',
    pause: 'Pausar',
    reset: 'Reiniciar',
    focusMode: 'Enfoque Dinámico',
    breathingMode: 'Respiración Profunda',
    breakMode: 'Descanso Corto',
  },
  
  nav: {
    stats: 'Estadísticas',
    timer: 'Temporizador',
    ai: 'IA',
    manual: 'Manual',
    settings: 'Configuración',
  },
  
  ai: {
    title: 'Inteligencia Artificial',
    analysis: {
      title: 'Análisis de Patrones',
      description: 'La IA analiza tus hábitos de enfoque y sugiere ajustes personalizados para maximizar tu productividad.',
      energyDetection: 'Detección de Energía',
      energyDescription: 'Identifica tus mejores horarios',
      adaptiveAdjustment: 'Ajuste Adaptativo',
      adaptiveDescription: 'Ritmo personalizado automáticamente',
    },
    features: {
      title: 'Próximas Funcionalidades',
      idealMode: 'Sugerencia de Modo Ideal',
      idealDescription: 'Basado en contexto, horario e historial',
      bestTime: 'Mejor Hora para Enfoque',
      bestTimeDescription: 'Análisis de productividad por período',
      fatiguePrediction: 'Predicción de Fatiga',
      fatigueDescription: 'Alertas preventivas y descansos sugeridos',
    },
  },
  
  manual: {
    title: 'Tiempo Manual',
    subtitle: 'Elige horas, minutos y segundos',
    selectedTime: 'Tiempo Seleccionado',
    setTime: 'Establecer Tiempo',
    selectAtLeastOneMinute: 'Selecciona al menos 1 minuto',
    timerSetTo: 'Timer establecido para',
    hours: 'Horas',
    minutes: 'Min',
    seconds: 'Seg',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
  },
  
  settings: {
    title: 'Configuración',
    language: 'Idioma',
    theme: 'Tema',
    notifications: 'Notificaciones',
  },
  
  stats: {
    title: 'Estadísticas',
    totalTime: 'Tiempo Total',
    sessions: 'Sesiones',
    averageSession: 'Promedio por Sesión',
  },
};

// Traduções em Francês
const frFR: Translations = {
  title: 'Timer X²',
  subtitle: 'Focus et Respiration pour une Productivité Maximale',
  
  timer: {
    play: 'Démarrer',
    pause: 'Pause',
    reset: 'Réinitialiser',
    focusMode: 'Focus Dynamique',
    breathingMode: 'Respiration Profonde',
    breakMode: 'Pause Courte',
  },
  
  nav: {
    stats: 'Statistiques',
    timer: 'Minuteur',
    ai: 'IA',
    manual: 'Manuel',
    settings: 'Paramètres',
  },
  
  ai: {
    title: 'Intelligence Artificielle',
    analysis: {
      title: 'Analyse des Modèles',
      description: 'L\'IA analyse vos habitudes de concentration et suggère des ajustements personnalisés pour maximiser votre productivité.',
      energyDetection: 'Détection d\'Énergie',
      energyDescription: 'Identifie vos meilleurs moments',
      adaptiveAdjustment: 'Ajustement Adaptatif',
      adaptiveDescription: 'Rythme personnalisé automatiquement',
    },
    features: {
      title: 'Fonctionnalités à Venir',
      idealMode: 'Suggestion de Mode Idéal',
      idealDescription: 'Basé sur le contexte, l\'heure et l\'historique',
      bestTime: 'Meilleur Moment pour Se Concentrer',
      bestTimeDescription: 'Analyse de productivité par période',
      fatiguePrediction: 'Prédiction de Fatigue',
      fatigueDescription: 'Alertes préventives et pauses suggérées',
    },
  },
  
  manual: {
    title: 'Temps Manuel',
    subtitle: 'Choisissez heures, minutes et secondes',
    selectedTime: 'Temps Sélectionné',
    setTime: 'Définir le Temps',
    selectAtLeastOneMinute: 'Sélectionnez au moins 1 minute',
    timerSetTo: 'Minuteur défini pour',
    hours: 'Heures',
    minutes: 'Min',
    seconds: 'Sec',
    confirm: 'Confirmer',
    cancel: 'Annuler',
  },
  
  settings: {
    title: 'Paramètres',
    language: 'Langue',
    theme: 'Thème',
    notifications: 'Notifications',
  },
  
  stats: {
    title: 'Statistiques',
    totalTime: 'Temps Total',
    sessions: 'Sessions',
    averageSession: 'Moyenne par Session',
  },
};

// Traduções em Alemão
const deDE: Translations = {
  title: 'Timer X²',
  subtitle: 'Fokus & Atmung für Höchstproduktivität',
  
  timer: {
    play: 'Starten',
    pause: 'Pause',
    reset: 'Zurücksetzen',
    focusMode: 'Dynamischer Fokus',
    breathingMode: 'Tiefes Atmen',
    breakMode: 'Kurze Pause',
  },
  
  nav: {
    stats: 'Statistiken',
    timer: 'Timer',
    ai: 'KI',
    manual: 'Manuell',
    settings: 'Einstellungen',
  },
  
  ai: {
    title: 'Künstliche Intelligenz',
    analysis: {
      title: 'Musteranalyse',
      description: 'Die KI analysiert Ihre Fokusgewohnheiten und schlägt personalisierte Anpassungen vor, um Ihre Produktivität zu maximieren.',
      energyDetection: 'Energieerkennung',
      energyDescription: 'Identifiziert Ihre besten Zeiten',
      adaptiveAdjustment: 'Adaptive Anpassung',
      adaptiveDescription: 'Automatisch personalisierter Rhythmus',
    },
    features: {
      title: 'Kommende Funktionen',
      idealMode: 'Idealer Modus-Vorschlag',
      idealDescription: 'Basierend auf Kontext, Zeit und Verlauf',
      bestTime: 'Beste Fokuszeit',
      bestTimeDescription: 'Produktivitätsanalyse nach Zeitraum',
      fatiguePrediction: 'Ermüdungsvorhersage',
      fatigueDescription: 'Präventive Warnungen und vorgeschlagene Pausen',
    },
  },
  
  manual: {
    title: 'Manuelle Zeit',
    subtitle: 'Wählen Sie Stunden, Minuten und Sekunden',
    selectedTime: 'Ausgewählte Zeit',
    setTime: 'Zeit Festlegen',
    selectAtLeastOneMinute: 'Wählen Sie mindestens 1 Minute',
    timerSetTo: 'Timer eingestellt auf',
    hours: 'Stunden',
    minutes: 'Min',
    seconds: 'Sek',
    confirm: 'Bestätigen',
    cancel: 'Abbrechen',
  },
  
  settings: {
    title: 'Einstellungen',
    language: 'Sprache',
    theme: 'Design',
    notifications: 'Benachrichtigungen',
  },
  
  stats: {
    title: 'Statistiken',
    totalTime: 'Gesamtzeit',
    sessions: 'Sitzungen',
    averageSession: 'Durchschnitt pro Sitzung',
  },
};

// Mapa de traduções
const translations: Record<Language, Translations> = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
  'fr-FR': frFR,
  'de-DE': deDE,
};

// Função para detectar idioma do dispositivo
export function detectDeviceLanguage(): Language {
  if (typeof window === 'undefined') return 'pt-BR'; // Fallback para SSR
  
  const browserLanguage = navigator.language || navigator.userLanguage;
  
  // Mapear idiomas do navegador para nossos idiomas suportados
  if (browserLanguage.startsWith('pt')) return 'pt-BR';
  if (browserLanguage.startsWith('en')) return 'en-US';
  if (browserLanguage.startsWith('es')) return 'es-ES';
  if (browserLanguage.startsWith('fr')) return 'fr-FR';
  if (browserLanguage.startsWith('de')) return 'de-DE';
  
  // Fallback para inglês se idioma não suportado
  return 'en-US';
}

// Função para obter traduções
export function getTranslations(language: Language): Translations {
  return translations[language] || translations['en-US'];
}

// Função para obter tradução específica
export function t(language: Language, key: string): string {
  const translations = getTranslations(language);
  const keys = key.split('.');
  let value: unknown = translations;
  
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
  }
  
  return typeof value === 'string' ? value : key;
}
