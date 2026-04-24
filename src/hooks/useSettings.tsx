import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'hi';
type Theme = 'dark' | 'light';

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isSimpleMode: boolean;
  toggleSimpleMode: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleSimpleMode = () => setIsSimpleMode(prev => !prev);
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <SettingsContext.Provider value={{ 
      language, setLanguage, isSimpleMode, toggleSimpleMode, theme, toggleTheme 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

export const translations = {
  en: {
    hero: "Right Elect",
    subtitle: "Your Intelligent Election Assistant",
    assistant: "Assistant",
    process: "Process",
    simulate: "Simulate",
    eligible: "Eligible?",
    status: "Status",
    simpleMode: "Simple Mode",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    askPlaceholder: "Ask anything about elections...",
    timelineTitle: "Election Process",
    timelineSubtitle: "A step-by-step guide to democracy",
    eligibilityTitle: "Eligibility Checker",
    eligibilitySubtitle: "Find out if you can vote in 30 seconds",
    hubTitle: "Your Election Hub",
    hubSubtitle: "Stay updated with local schedules"
  },
  hi: {
    hero: "राईट इलेक्ट",
    subtitle: "आपका बुद्धिमान चुनाव सहायक",
    assistant: "सहायक",
    process: "प्रक्रिया",
    simulate: "सिमुलेशन",
    eligible: "पात्रता?",
    status: "स्थिति",
    simpleMode: "सरल मोड",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    askPlaceholder: "चुनाव के बारे में कुछ भी पूछें...",
    timelineTitle: "चुनाव प्रक्रिया",
    timelineSubtitle: "लोकतंत्र के लिए एक चरण-दर-चरण मार्गदर्शिका",
    eligibilityTitle: "पात्रता जांचकर्ता",
    eligibilitySubtitle: "30 सेकंड में पता लगाएं कि क्या आप वोट दे सकते हैं",
    hubTitle: "आपका चुनाव केंद्र",
    hubSubtitle: "स्थानीय कार्यक्रमों के साथ अपडेट रहें"
  }
};
