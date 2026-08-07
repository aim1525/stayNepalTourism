import React, { createContext, useContext, useState } from 'react';
import en from './en.json';
import ne from './ne.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const translations = lang === 'ne' ? ne : en;

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ne' : 'en');
  };

  const t = (path) => {
    const keys = path.split('.');
    let current = translations;
    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k];
      } else {
        return path;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
