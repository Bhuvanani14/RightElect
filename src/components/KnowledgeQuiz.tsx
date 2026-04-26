import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, RotateCcw, HelpCircle, Award } from 'lucide-react';
// no hooks used currently

const QUIZ_QUESTIONS = [
  {
    q: "What is the minimum age required to vote in India?",
    a: ["18 years", "21 years", "25 years", "16 years"],
    correct: 0,
    fact: "The voting age was lowered from 21 to 18 by the 61st Amendment Act in 1988."
  },
  {
    q: "Which constitutional body conducts elections in India?",
    a: ["Parliament", "Supreme Court", "Election Commission", "NITI Aayog"],
    correct: 2,
    fact: "The Election Commission of India (ECI) is an autonomous constitutional authority."
  },
  {
    q: "What does VVPAT stand for?",
    a: ["Voter Verified Paper Audit Trail", "Voter Validated Paper Account Task", "Verified Voter Paper Audit Tool", "Voter Verification Public Audit Trace"],
    correct: 0,
    fact: "VVPAT allows voters to verify that their vote was cast as intended."
  },
  {
    q: "What is the maximum number of candidates an EVM can support?",
    a: ["16 candidates", "32 candidates", "64 candidates", "No limit"],
    correct: 2,
    fact: "A single EVM can support up to 64 candidates (including NOTA)."
  }
];

const KnowledgeQuiz: React.FC = () => {
  // language intentionally unused in quiz for now
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    const correct = idx === QUIZ_QUESTIONS[currentIdx].correct;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);

    setTimeout(() => {
      if (currentIdx < QUIZ_QUESTIONS.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const restart = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="quiz-container animate-fade-in">
      <div className="header text-center mb-8">
        <div className="badge mx-auto mb-4">
          <Brain size={16} /> <span>DEMOCRACY IQ</span>
        </div>
        <h2 className="gradient-text">Test Your Knowledge</h2>
        <p className="text-muted">How well do you know the Indian election process?</p>
      </div>

      {!showResult ? (
        <div className="quiz-card glass-card">
          <div className="progress-bar">
            <motion.div 
              className="progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
          
          <div className="q-header">
            <span className="q-count">Question {currentIdx + 1}/{QUIZ_QUESTIONS.length}</span>
            <h3>{QUIZ_QUESTIONS[currentIdx].q}</h3>
          </div>

          <div className="options-grid">
            {QUIZ_QUESTIONS[currentIdx].a.map((opt, i) => (
              <button
                key={i}
                className={`opt-btn ${selectedAnswer === i ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                onClick={() => selectedAnswer === null && handleAnswer(i)}
                disabled={selectedAnswer !== null}
              >
                <span>{opt}</span>
                {selectedAnswer === i && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedAnswer !== null && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="fact-box"
              >
                <HelpCircle size={18} className="text-primary" />
                <p><strong>Did you know?</strong> {QUIZ_QUESTIONS[currentIdx].fact}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="result-card glass-card text-center">
          <div className="trophy-box">
            <Trophy size={60} className="text-accent" />
            <Award size={24} className="sub-trophy text-primary" />
          </div>
          <h2>Great Job!</h2>
          <div className="score-display">
            <span>Your Score</span>
            <strong>{score} / {QUIZ_QUESTIONS.length}</strong>
          </div>
          <p className="text-muted mb-8">
            {score === QUIZ_QUESTIONS.length ? "Electoral Expert! You know your rights perfectly." : 
             score > QUIZ_QUESTIONS.length / 2 ? "Well done! You have a good grasp of the process." : 
             "Good attempt! Keep learning to become a more informed voter."}
          </p>
          <div className="action-buttons">
            <button className="btn-primary w-full" onClick={restart}>
              <RotateCcw size={18} /> Try Again
            </button>
          </div>
        </motion.div>
      )}

      <style>{`
        .quiz-container { padding: 4px; }
        .badge { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          width: fit-content; 
          background: var(--primary-glow); 
          color: var(--primary); 
          padding: 6px 12px; 
          border-radius: 20px; 
          font-size: 0.7rem; 
          font-weight: 800;
          letter-spacing: 1px;
        }
        .progress-bar { height: 6px; background: var(--surface-border); border-radius: 3px; overflow: hidden; margin-bottom: 2rem; }
        .progress-fill { height: 100%; background: var(--primary); }
        
        .q-header { margin-bottom: 2rem; }
        .q-count { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 8px; }
        .q-header h3 { font-size: 1.3rem; font-weight: 800; line-height: 1.4; color: var(--text-main); }
        
        .options-grid { display: flex; flex-direction: column; gap: 12px; }
        .opt-btn { 
          padding: 18px; 
          background: var(--surface); 
          border: 1px solid var(--surface-border); 
          border-radius: 16px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          cursor: pointer; 
          transition: all 0.2s;
          color: var(--text-main);
          font-weight: 600;
        }
        .opt-btn:hover:not(:disabled) { border-color: var(--primary); background: var(--primary-glow); }
        .opt-btn.correct { background: rgba(16, 185, 129, 0.1); border-color: var(--secondary); color: var(--secondary); }
        .opt-btn.wrong { background: rgba(239, 68, 68, 0.1); border-color: var(--accent); color: var(--accent); }
        
        .fact-box { margin-top: 1.5rem; padding: 1rem; background: var(--primary-glow); border-radius: 14px; display: flex; gap: 12px; }
        .fact-box p { font-size: 0.85rem; line-height: 1.5; color: var(--text-main); text-align: left; }
        
        .trophy-box { position: relative; width: 100px; height: 100px; margin: 0 auto 1.5rem; background: var(--primary-glow); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .sub-trophy { position: absolute; top: 0; right: 0; background: var(--surface); padding: 4px; border-radius: 50%; border: 2px solid var(--primary-glow); }
        .score-display { margin-bottom: 1.5rem; }
        .score-display span { display: block; font-size: 0.9rem; color: var(--text-muted); }
        .score-display strong { font-size: 3rem; color: var(--primary); font-weight: 800; }
      `}</style>
    </div>
  );
};

const XCircle = ({ size }: { size: number }) => <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></motion.svg>
const CheckCircle = ({ size }: { size: number }) => <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></motion.svg>

export default KnowledgeQuiz;
