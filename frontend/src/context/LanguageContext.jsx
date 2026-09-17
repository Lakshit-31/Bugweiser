import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, supportedLanguages } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('moolya_lang');
      if (saved && supportedLanguages.some(l => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      console.error('Error reading saved language:', e);
    }
    return 'hi'; // Default Hindi
  });

  const setLang = (newLang) => {
    if (supportedLanguages.some(l => l.code === newLang)) {
      setLangState(newLang);
      try {
        localStorage.setItem('moolya_lang', newLang);
      } catch (e) {
        console.error('Error saving language:', e);
      }
    }
  };

  const toggleLanguage = () => {
    // Cycle through supported languages or toggle hi/en
    setLangState(prev => {
      const currentIndex = supportedLanguages.findIndex(l => l.code === prev);
      const nextIndex = (currentIndex + 1) % supportedLanguages.length;
      const nextLang = supportedLanguages[nextIndex].code;
      try {
        localStorage.setItem('moolya_lang', nextLang);
      } catch (e) {
        console.error('Error saving language:', e);
      }
      return nextLang;
    });
  };

  const t = (key, params = {}) => {
    const langDict = translations[lang] || translations['hi'] || translations['en'];
    let text = langDict[key] || translations['hi']?.[key] || translations['en']?.[key] || key;

    if (typeof text === 'string' && params && typeof params === 'object') {
      Object.keys(params).forEach(paramKey => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      });
    }

    return text;
  };

  const currentLanguageObj = supportedLanguages.find(l => l.code === lang) || supportedLanguages[1];

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      toggleLanguage,
      t,
      supportedLanguages,
      currentLanguageObj
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export { supportedLanguages, translations };
