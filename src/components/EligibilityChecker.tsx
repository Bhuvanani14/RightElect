import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useSettings, translations } from '../hooks/useSettings';

type Step = 'citizenship' | 'age' | 'registration' | 'result';

const EligibilityChecker: React.FC = () => {
  const { language } = useSettings();
  const t = translations[language];
  const [currentStep, setCurrentStep] = useState<Step>('citizenship');
  const [answers, setAnswers] = useState({
    isCitizen: false,
    isOfAge: false,
    isRegistered: false
  });

  const reset = () => {
    setCurrentStep('citizenship');
    setAnswers({ isCitizen: false, isOfAge: false, isRegistered: false });
  };

  const handleAnswer = (field: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (field === 'isCitizen') {
      if (value) setCurrentStep('age');
      else setCurrentStep('result');
    } else if (field === 'isOfAge') {
      if (value) setCurrentStep('registration');
      else setCurrentStep('result');
    } else if (field === 'isRegistered') {
      setCurrentStep('result');
    }
  };

  const isEligible = answers.isCitizen && answers.isOfAge && answers.isRegistered;

  return (
    <div className="eligibility-container">
      <div className="header">
        <h2 className="gradient-text">{t.eligibilityTitle}</h2>
        <p className="text-muted">{t.eligibilitySubtitle}</p>
      </div>

      <div className="checker-card glass-card">
        <AnimatePresence mode="wait">
          {currentStep === 'citizenship' && (
            <motion.div 
              key="citizenship"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="quiz-step"
            >
              <h3>Are you a citizen of India?</h3>
              <p>Only Indian citizens are eligible to participate in national and state elections.</p>
              <div className="options">
                <button className="btn-option" onClick={() => handleAnswer('isCitizen', true)}>Yes, I am</button>
                <button className="btn-option secondary" onClick={() => handleAnswer('isCitizen', false)}>No</button>
              </div>
            </motion.div>
          )}

          {currentStep === 'age' && (
            <motion.div 
              key="age"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="quiz-step"
            >
              <h3>Are you 18 or older?</h3>
              <p>You must be at least 18 years old on the qualifying date (usually Jan 1st of the election year).</p>
              <div className="options">
                <button className="btn-option" onClick={() => handleAnswer('isOfAge', true)}>Yes, 18+</button>
                <button className="btn-option secondary" onClick={() => handleAnswer('isOfAge', false)}>Not yet</button>
              </div>
            </motion.div>
          )}

          {currentStep === 'registration' && (
            <motion.div 
              key="registration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="quiz-step"
            >
              <h3>Are you registered in the Electoral Roll?</h3>
              <p>Being eligible is second to being registered. Do you have an EPIC (Voter ID) or are your details in the list?</p>
              <div className="options">
                <button className="btn-option" onClick={() => handleAnswer('isRegistered', true)}>Yes, I'm listed</button>
                <button className="btn-option secondary" onClick={() => handleAnswer('isRegistered', false)}>No / Not sure</button>
              </div>
            </motion.div>
          )}

          {currentStep === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="quiz-result"
            >
              {isEligible ? (
                <div className="result-content success">
                  <CheckCircle size={64} className="result-icon pulse" />
                  <h2>You are ready to vote!</h2>
                  <p>You meet all the primary criteria. Just find your polling booth on election day and make your voice heard!</p>
                  <button className="btn-primary">Find My Booth <ArrowRight size={18} /></button>
                </div>
              ) : (
                <div className="result-content failure">
                  <XCircle size={64} className="result-icon" />
                  <h2>You're almost there!</h2>
                  {!answers.isCitizen && <p>Only Indian citizens can vote. If you have OCI status, please check special provisions.</p>}
                  {answers.isCitizen && !answers.isOfAge && <p>You need to be 18 to vote. You'll be eligible once you reach the age!</p>}
                  {answers.isCitizen && answers.isOfAge && !answers.isRegistered && (
                    <div className="next-steps">
                      <p>You meet the criteria but need to register. Start your application today!</p>
                      <button className="btn-primary">How to Register <ArrowRight size={18} /></button>
                    </div>
                  )}
                  <button className="btn-outline" onClick={reset}><RotateCcw size={18} /> Try Again</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .eligibility-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .header h2 { font-size: 1.8rem; font-weight: 700; }
        .checker-card {
          padding: 2rem;
          min-height: 350px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .quiz-step {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .quiz-step h3 { font-size: 1.4rem; color: var(--text-main); }
        .quiz-step p { color: var(--text-muted); line-height: 1.5; }
        .options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 1rem;
        }
        .btn-option {
          background: var(--primary);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-option.secondary {
          background: var(--glass);
          border: 1px solid var(--surface-border);
        }
        .btn-option:hover { transform: translateY(-2px); opacity: 0.9; }

        .quiz-result {
          text-align: center;
        }
        .result-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .result-icon { margin-bottom: 0.5rem; }
        .result-icon.pulse { animation: iconPulse 2s infinite; }
        .success .result-icon { color: var(--secondary); }
        .failure .result-icon { color: var(--accent); }
        
        .result-content h2 { font-size: 1.6rem; }
        .result-content p { color: var(--text-muted); }

        .btn-outline {
          background: transparent;
          border: 1px solid var(--surface-border);
          color: var(--text-muted);
          padding: 10px 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        @keyframes iconPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 0px var(--secondary)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 10px var(--secondary)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0px var(--secondary)); }
        }
      `}</style>
    </div>
  );
};

export default EligibilityChecker;
