import { useState, useEffect } from 'react';
import './App.css';
import { 
  MessageSquare,
  Info,
  Settings,
  Scan,
  BrainCircuit,
  LayoutGrid,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ChatInterface from './components/ChatInterface';
import Timeline from './components/Timeline';
import EligibilityChecker from './components/EligibilityChecker';
import VotingSimulator from './components/VotingSimulator';
import ElectionInfo from './components/ElectionInfo';
import VoterIDOCR from './components/VoterIDOCR';
import KnowledgeQuiz from './components/KnowledgeQuiz';
import Dates from './components/Dates';
import Parliament from './components/Parliament';
import StatesUTs from './components/StatesUTs';

import { useSettings, translations } from './hooks/useSettings';

type AppSection = 'assistant' | 'info' | 'eligibility' | 'simulator' | 'profile' | 'ocr' | 'quiz' | 'dates' | 'parliament' | 'states';

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
        return <ChatInterface onNavigate={setActiveSection} />;
      case 'info':
        return <Timeline />;
      case 'eligibility':
        return <EligibilityChecker onNavigate={setActiveSection} />;
      case 'simulator':
        return <VotingSimulator />;
      case 'profile':
        return <ElectionInfo />;
      case 'ocr':
        return <VoterIDOCR />;
      case 'quiz':
        return <KnowledgeQuiz />;
      case 'dates':
        return <Dates />;
      case 'parliament':
        return <Parliament />;
      case 'states':
        return <StatesUTs />;
      default:
        return <ChatInterface onNavigate={setActiveSection} />;
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
          <button className="icon-btn" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={22} />
          </button>
        </div>
      </header>

      {showSettings && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="settings-overlay glass-card">
          <div className="settings-row">
            <span>{language === 'hi' ? 'भाषा (Language)' : 'Language'}</span>
            <div className="lang-selector">
              <button className={`lang-badge ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en')}>EN</button>
              <button className={`lang-badge ${language === 'hi' ? 'active' : ''}`} onClick={() => setLanguage('hi')}>हि</button>
            </div>
          </div>
          <div className="settings-row">
            <span>{language === 'hi' ? 'डार्क मोड' : 'Dark Mode'}</span>
            <button className={`toggle-btn ${theme === 'dark' ? 'on' : ''}`} onClick={toggleTheme}>
              <div className="toggle-thumb"></div>
            </button>
          </div>
          <div className="settings-row">
             <span>{language === 'hi' ? 'सरल मोड' : 'Simple Mode'}</span>
             <button className={`toggle-btn ${isSimpleMode ? 'on' : ''}`} onClick={toggleSimpleMode}>
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
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="bottom-nav">
        <div className={`nav-item ${activeSection === 'assistant' ? 'active' : ''}`} onClick={() => setActiveSection('assistant')}>
          <MessageSquare size={22} />
          <span>{t.assistant}</span>
        </div>
        <div className={`nav-item ${activeSection === 'info' ? 'active' : ''}`} onClick={() => setActiveSection('info')}>
          <Info size={22} />
          <span>{t.process}</span>
        </div>
        <div className={`nav-item ${activeSection === 'ocr' ? 'active' : ''}`} onClick={() => setActiveSection('ocr')}>
          <Scan size={22} />
          <span>OCR</span>
        </div>
        <div className={`nav-item ${activeSection === 'quiz' ? 'active' : ''}`} onClick={() => setActiveSection('quiz')}>
          <BrainCircuit size={22} />
          <span>Quiz</span>
        </div>
        <div className={`nav-item ${['profile', 'eligibility', 'simulator'].includes(activeSection) ? 'active' : ''}`} onClick={() => setActiveSection('profile')}>
          <LayoutGrid size={22} />
          <span>Hub</span>
        </div>
        <div className={`nav-item ${activeSection === 'dates' ? 'active' : ''}`} onClick={() => setActiveSection('dates')}>
          <Calendar size={22} />
          <span>Dates</span>
        </div>
        <div className={`nav-item ${activeSection === 'parliament' ? 'active' : ''}`} onClick={() => setActiveSection('parliament')}>
          <MessageSquare size={22} />
          <span>Parliament</span>
        </div>
        <div className={`nav-item ${activeSection === 'states' ? 'active' : ''}`} onClick={() => setActiveSection('states')}>
          <LayoutGrid size={22} />
          <span>States</span>
        </div>
      </nav>

      <style>{`
        .app-header { padding: 1.5rem 1rem 0.5rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--background); z-index: 40; }
        .logo-container { display: flex; align-items: center; gap: 12px; }
        .logo-container h1 { font-size: 1.5rem; font-weight: 800; }
        .logo-circle { width: 32px; height: 32px; border: 3px solid var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .logo-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; }
        .header-actions .icon-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
        .settings-overlay { position: absolute; top: 70px; left: 1rem; right: 1rem; z-index: 100; display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem; }
        .settings-row { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 0.95rem; }
        .lang-selector { display: flex; gap: 8px; }
      `}</style>
    </div>
  );
}

export default App;
