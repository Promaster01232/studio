
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'bn';

type LanguageProviderProps = {
  children: ReactNode;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const initialState: LanguageProviderState = {
  language: 'en',
  setLanguage: () => null,
};

const LanguageProviderContext = createContext<LanguageProviderState>(initialState);

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    try {
      const storedLanguage = localStorage.getItem('language') as Language | null;
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    } catch (e) {
      console.warn('localStorage is not available for language preference.');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (e) {
      console.warn('localStorage is not available for language preference.');
    }
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
  };

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
