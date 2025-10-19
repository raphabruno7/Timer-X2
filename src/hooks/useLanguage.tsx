"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { Language, detectDeviceLanguage, getTranslations, Translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isDetecting: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt-BR');
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    // Detectar idioma do dispositivo automaticamente
    const detectedLanguage = detectDeviceLanguage();
    setLanguage(detectedLanguage);
    setIsDetecting(false);
    
    // Salvar preferência no localStorage
    localStorage.setItem('timer-x2-language', detectedLanguage);
  }, []);

  // Carregar idioma salvo do localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('timer-x2-language') as Language;
    if (savedLanguage && !isDetecting) {
      setLanguage(savedLanguage);
    }
  }, [isDetecting]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('timer-x2-language', lang);
  };

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleSetLanguage, 
        t, 
        isDetecting 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook simplificado para traduções
export function useTranslations() {
  const { t } = useLanguage();
  return t;
}
