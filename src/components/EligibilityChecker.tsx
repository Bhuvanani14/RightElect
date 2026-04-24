import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useSettings, translations } from '../hooks/useSettings';

type Step = 'citizenship' | 'age' | 'registration' | 'result';

interface EligibilityCheckerProps {
  onNavigate: (section: any) => void;
}

const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ onNavigate }) => {
  const { language } = useSettings();
  const t = translations[language];
  const [currentStep, setCurrentStep] = useState<Step>('citizenship');
  const [answers, setAnswers] = useState({
    isCitizen: false,
    isOfAge: false,
    isRegistered: false
  });

  const handleAnswer = (answer: boolean) => {
    switch (currentStep) {
      case 'citizenship':
        setAnswers(prev => ({ ...prev, isCitizen: answer }));
        setCurrentStep(answer ? 'age' : 'result');
        break;
      case 'age':
        setAnswers(prev => ({ ...prev, isOfAge: answer }));
        setCurrentStep(answer ? 'registration' : 'result');
        break;
      case 'registration':
        setAnswers(prev => ({ ...prev, isRegistered: answer }));
        setCurrentStep('result');
        break;
    }
  };

  const isEligible = answers.isCitizen && answers.isOfAge && answers.isRegistered;

  return (
    <div className="eligibility-container animate-fade-in">
      <div className="header">
        <h2 className="gradient-text">{t.eligibilityTitle}</h2>
        <p className="text-muted">{t.eligibilitySubtitle}</p>
      </div>

      <div className="checker-card glass-card">
        <AnimatePresence mode="wait">
          {currentStep === 'citizenship' && (
            <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="quiz-step">
              <h3>{language === 'hi' ? "क्या आप भारत के नागरिक हैं?" : "Are you a citizen of India?"}</h3>
              <p>{language === 'hi' ? "मतदान के लिए भारतीय नागरिकता अनिवार्य है।" : "Indian citizenship is mandatory for voting."}</p>
              <div className="options">
                <button className="btn-option" onClick={() => handleAnswer(true)}>{language === 'hi' ? "हाँ, मैं हूँ" : "Yes, I am"}</button>
                <button className="btn-option secondary" onClick={() => handleAnswer(false)}>{language === 'hi' ? "नहीं" : "No"}</button>
              </div>
            </motion.div>
          )}

          {currentStep === 'age' && (
            <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="quiz-step">
              <h3>{language === 'hi' ? "क्या आपकी उम्र 18 वर्ष या उससे अधिक है?" : "Are you 18 years or older?"}</h3>
              <p>{language === 'hi' ? "मतदान के लिए न्यूनतम आयु 18 वर्ष है।" : "The minimum age for voting is 18 years."}</p>
              <div className="options">
                <button className="btn-option" onClick={() => handleAnswer(true)}>{language === 'hi' ? "हाँ" : "Yes"}</button>
                <button className="btn-option secondary" onClick={() => handleAnswer(false)}>{language === 'hi' ? "नहीं" : "No"}</button>
              </div>
            </motion.div>
          )}

          {currentStep === 'registration' && (
            <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="quiz-step">
              <h3>{language === 'hi' ? "क्या आप मतदाता सूची में पंजीकृत हैं?" : "Are you registered in the electoral roll?"}</h3>
              <p>{language === 'hi' ? "वोट देने के लिए आपका नाम मतदाता सूची में होना चाहिए।" : "Your name must be in the electoral roll to vote."}</p>
              <div className="options">
                <button className="btn-option" onClick={() => handleAnswer(true)}>{language === 'hi' ? "हाँ, मैं हूँ" : "Yes, I am"}</button>
                <button className="btn-option secondary" onClick={() => handleAnswer(false)}>{language === 'hi' ? "नहीं" : "No"}</button>
              </div>
            </motion.div>
          )}

          {currentStep === 'result' && (
            <motion.div key="4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="quiz-result">
              <div className={`result-content ${isEligible ? 'success' : 'failure'}`}>
                <div className="result-icon pulse">
                  {isEligible ? <CheckCircle size={80} /> : <XCircle size={80} />}
                </div>
                <h2>{isEligible ? (language === 'hi' ? "आप पात्र हैं!" : "You are Eligible!") : (language === 'hi' ? "आप अभी पात्र नहीं हैं" : "You are not eligible yet")}</h2>
                <p>
                  {isEligible 
                    ? (language === 'hi' ? "बधाई हो! आप मतदान करने के लिए पूरी तरह तैयार हैं।" : "Great news! You are all set to participate in the democracy.")
                    : (language === 'hi' ? "चिंता न करें, हम इसे ठीक करने में आपकी मदद कर सकते हैं।" : "Don't worry, we can help you get ready.")}
                </p>
                
                {isEligible ? (
                  <button className="btn-primary" onClick={() => onNavigate('info')}>
                    {language === 'hi' ? "बूथ खोजें" : "Find my booth"} <ArrowRight size={18} />
                  </button>
                ) : (
                  <div className="action-btns">
                    <button className="btn-primary" onClick={() => window.open('https://voters.eci.gov.in/', '_blank')}>
                      {language === 'hi' ? "अभी रजिस्टर करें" : "Register Now"} <ArrowRight size={18} />
                    </button>
                    <button className="btn-outline" onClick={() => setCurrentStep('citizenship')}>
                      <RotateCcw size={18} /> {language === 'hi' ? "फिर से जांचें" : "Retest"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .eligibility-container { display: flex; flex-direction: column; gap: var(--spacing-lg); }
        .header { text-align: center; }
        .checker-card { 
          padding: var(--spacing-xl) var(--spacing-lg); 
          min-height: 420px; 
          display: flex; 
          flex-direction: column; 
          justify-content: center;
          border-width: 2px;
        }
        .quiz-step { display: flex; flex-direction: column; gap: 1rem; }
        .quiz-step h3 { font-size: 1.5rem; color: var(--text-main); font-weight: 800; line-height: 1.3; }
        .quiz-step p { color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; }
        .options { display: flex; flex-direction: column; gap: var(--spacing-sm); margin-top: 1.5rem; }
        
        .btn-option {
          background: var(--primary);
          color: white;
          border: none;
          padding: 18px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px var(--primary-glow);
        }
        .btn-option.secondary {
          background: var(--glass);
          border: 1px solid var(--surface-border);
          color: var(--text-main);
          box-shadow: none;
        }
        .btn-option:active { transform: scale(0.97); }

        .quiz-result { text-align: center; }
        .result-content { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .result-icon { margin-bottom: 0.5rem; }
        .result-icon.pulse { animation: iconPulse 2s infinite; }
        .success .result-icon { color: var(--secondary); }
        .failure .result-icon { color: var(--accent); }
        
        .result-content h2 { font-size: 1.8rem; font-weight: 800; }
        .result-content p { color: var(--text-muted); line-height: 1.5; font-size: 1rem; max-width: 280px; }

        .action-btns { display: flex; flex-direction: column; gap: 12px; width: 100%; }
        .btn-outline {
          background: transparent;
          border: 2px solid var(--surface-border);
          color: var(--text-main);
          padding: 14px 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 700;
        }

        @keyframes iconPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 0px var(--secondary)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 15px var(--secondary)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0px var(--secondary)); }
        }
      `}</style>
    </div>
  );
};

export default EligibilityChecker;
