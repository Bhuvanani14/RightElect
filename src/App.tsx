import { useState, useEffect } from 'react';
import './App.css';
import { 
  MessageSquare, 
  MapPin, 
  UserCheck, 
  Gamepad2, 
  Info,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports (To be created)
import ChatInterface from './components/ChatInterface';
import Timeline from './components/Timeline';
import EligibilityChecker from './components/EligibilityChecker';
import VotingSimulator from './components/VotingSimulator';
import ElectionInfo from './components/ElectionInfo';

import { useSettings, translations } from './hooks/useSettings';

type AppSection = 'assistant' | 'info' | 'eligibility' | 'simulator' | 'profile';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('assistant');
  const [isLoaded, setIsLoaded] = useState(false);
  const { language, setLanguage, isSimpleMode, toggleSimpleMode, theme, toggleTheme } = useSettings();
  const [showSettings, setShowSettings] = useState(false);

  const t = translations[language === 'hi' ? 'hi' : 'en'];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'assistant':
        return <ChatInterface onNavigate={(section: AppSection) => setActiveSection(section)} />;
      case 'info':
        return <Timeline />;
      case 'eligibility':
        return <EligibilityChecker />;
      case 'simulator':
        return <VotingSimulator />;
      case 'profile':
        return <ElectionInfo />;
      default:
        return <ChatInterface onNavigate={(section: AppSection) => setActiveSection(section)} />;
    }
  };

  if (!isLoaded) return null;

  return (
    <div className={`app-wrapper ${theme} ${isSimpleMode ? 'simple-mode' : ''}`}>
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-circle">
            <div className="logo-dot"></div>
          </div>
          <h1 className="gradient-text">Right Elect</h1>
        </div>
        <div className="header-actions">
          <button 
            className={`lang-badge ${language === 'hi' ? 'active' : ''}`}
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          >
            {language === 'en' ? 'हिं' : 'EN'}
          </button>
          <button className="icon-btn" onClick={() => setShowSettings(!showSettings)}><Settings size={20} /></button>
        </div>
      </header>

      {showSettings && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="settings-overlay glass-card">
          <div className="settings-row">
            <span>{t.simpleMode}</span>
            <button className={`toggle-btn ${isSimpleMode ? 'on' : ''}`} onClick={toggleSimpleMode}>
              <div className="toggle-thumb"></div>
            </button>
          </div>
          <div className="settings-row" style={{ marginTop: '1rem' }}>
            <span>{theme === 'dark' ? t.darkMode : t.lightMode}</span>
            <button className={`toggle-btn ${theme === 'light' ? 'on' : ''}`} onClick={toggleTheme}>
              <div className="toggle-thumb"></div>
            </button>
          </div>
        </motion.div>
      )}

      <main className="main-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="bottom-nav">
        <div 
          className={`nav-item ${activeSection === 'assistant' ? 'active' : ''}`}
          onClick={() => setActiveSection('assistant')}
        >
          <MessageSquare size={24} />
          <span>{t.assistant}</span>
        </div>
        <div 
          className={`nav-item ${activeSection === 'info' ? 'active' : ''}`}
          onClick={() => setActiveSection('info')}
        >
          <Info size={24} />
          <span>{t.process}</span>
        </div>
        <div 
          className={`nav-item ${activeSection === 'simulator' ? 'active' : ''}`}
          onClick={() => setActiveSection('simulator')}
        >
          <Gamepad2 size={24} />
          <span>{t.simulate}</span>
        </div>
        <div 
          className={`nav-item ${activeSection === 'eligibility' ? 'active' : ''}`}
          onClick={() => setActiveSection('eligibility')}
        >
          <UserCheck size={24} />
          <span>{t.eligible}</span>
        </div>
        <div 
          className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          <MapPin size={24} />
          <span>{t.status}</span>
        </div>
      </nav>

      <style>{`
        .app-header {
          padding: 1.5rem 1rem 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: var(--background);
          z-index: 40;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-container h1 {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .logo-circle {
          width: 32px;
          height: 32px;
          border: 3px solid var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-dot {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
        }
        .header-actions .icon-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default App;
