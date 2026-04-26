import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Fingerprint, CheckCircle } from 'lucide-react';

type SimStep = 'entry' | 'verify' | 'ink' | 'evm' | 'vvpat' | 'done';

const VotingSimulator: React.FC = () => {
  const [step, setStep] = useState<SimStep>('entry');
  const [votedParty, setVotedParty] = useState<string | null>(null);

  const CANDIDATES = [
    { id: 1, name: "Arjun Sharma", symbol: "☀️", color: "#F59E0B" },
    { id: 2, name: "Priya Varma", symbol: "🌿", color: "#10B981" },
    { id: 3, name: "Rahul Das", symbol: "💡", color: "#3B82F6" },
  ];

  const next = () => {
    const steps: SimStep[] = ['entry', 'verify', 'ink', 'evm', 'vvpat', 'done'];
    const currentIdx = steps.indexOf(step);
    if (currentIdx < steps.length - 1) setStep(steps[currentIdx + 1]);
  };

  const handleVote = (partyName: string) => {
    setVotedParty(partyName);
    next();
  };

  return (
    <div className="simulator-container">
      <div className="sim-header">
        <h2 className="gradient-text">Voting Simulator</h2>
        <p className="text-muted">Master the booth experience</p>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn-outline" onClick={async () => {
            if (!navigator.geolocation) { alert('Geolocation not available'); return; }
            navigator.geolocation.getCurrentPosition(async (pos) => {
              const lat = pos.coords.latitude; const lng = pos.coords.longitude;
              try {
                const base = import.meta.env.VITE_SERVER_URL || '';
                const resp = await fetch(`${base}/api/nearest-booth?lat=${lat}&lng=${lng}`);
                const data = await resp.json();
                if (data?.results?.length) {
                  const nearest = data.results[0];
                  alert(`Nearest: ${nearest.name} (${nearest.address}) — ${nearest.distance_m} m`);
                } else {
                  alert('No nearby polling stations found.');
                }
              } catch (e:any) { alert('Failed to find nearest booth: ' + (e?.message || e)); }
            }, (err) => alert('Geolocation error: ' + err.message));
          }}>Find nearest booth</button>
        </div>
      </div>

      <div className="sim-booth glass-card">
        <AnimatePresence mode="wait">
          {step === 'entry' && (
            <motion.div key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sim-step-content">
              <Shield size={48} className="text-primary" />
              <h3>Stage 1: Entrance</h3>
              <p>You enter the polling station. First, your name is checked against the electoral roll by the polling officers.</p>
              <button className="btn-primary" onClick={next}>Approach Officer</button>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sim-step-content">
              <Fingerprint size={48} className="text-primary" />
              <h3>Stage 2: Verification</h3>
              <p>Show your ID proof. The officer calls out your name and serial number to verify your identity.</p>
              <button className="btn-primary" onClick={next}>Show ID</button>
            </motion.div>
          )}

          {step === 'ink' && (
            <motion.div key="ink" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sim-step-content">
               <div className="ink-demo">
                 <div className="finger-demo">
                   <div className="ink-mark"></div>
                 </div>
               </div>
              <h3>Stage 3: Indelible Ink</h3>
              <p>A second officer marks your left forefinger with indelible ink and asks you to sign the register.</p>
              <button className="btn-primary" onClick={next}>Get Inked</button>
            </motion.div>
          )}

          {step === 'evm' && (
            <motion.div key="evm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sim-step-content evm-simulation">
              <h3>Stage 4: Cast Your Vote</h3>
              <p>Enter the voting compartment and use the Electronic Voting Machine (EVM).</p>
              <div className="evm-machine">
                <div className="evm-header">ELECTRONIC VOTING MACHINE</div>
                {CANDIDATES.map((c) => (
                  <div key={c.id} className="evm-row">
                    <div className="candidate-box">
                      <span className="c-symbol" aria-hidden="true">{c.symbol}</span>
                      <span className="c-name">{c.name}</span>
                    </div>
                    <button 
                      className="vote-btn" 
                      onClick={() => handleVote(c.name)}
                      aria-label={`Vote for ${c.name}`}
                      title={`Vote for ${c.name}`}
                    >
                      <div className="btn-inner" aria-hidden="true"></div>
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'vvpat' && (
            <motion.div key="vvpat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sim-step-content">
              <div className="vvpat-machine">
                <div className="vvpat-screen">
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="vvpat-slip"
                  >
                    <p>SLIP</p>
                    <hr/>
                    <p>{votedParty}</p>
                    <p>VERIFIED</p>
                  </motion.div>
                </div>
              </div>
              <h3>Stage 5: VVPAT Verification</h3>
              <p>The VVPAT machine displays a slip with your choice for 7 seconds. This ensures your vote was recorded correctly.</p>
              <button className="btn-primary" onClick={next}>Continue</button>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sim-step-content">
              <CheckCircle size={64} className="text-secondary" />
              <h3>Vote Cast Successfully!</h3>
              <p>You've completed the voting simulation. Remember, voting is your right and responsibility.</p>
              <button className="btn-outline" onClick={() => setStep('entry')}>Reset Simulator</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .simulator-container { display: flex; flex-direction: column; gap: 1rem; }
        .sim-booth { padding: 2rem; min-height: 450px; display: flex; flex-direction: column; }
        .sim-step-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          height: 100%;
        }
        .sim-step-content h3 { font-size: 1.4rem; color: white; }
        .sim-step-content p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; }

        .ink-demo { position: relative; margin-bottom: 1rem; }
        .finger-demo {
          width: 60px;
          height: 100px;
          background: #E5A58A;
          border-radius: 30px 30px 10px 10px;
          border: 2px solid #C48B75;
          position: relative;
        }
        .ink-mark {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 25px;
          background: #2D1B69;
          border-radius: 2px;
          box-shadow: 0 0 5px rgba(45, 27, 105, 0.5);
        }

        /* EVM Styles */
        .evm-machine {
          width: 100%;
          background: #BEC6D0;
          border-radius: 8px;
          padding: 10px;
          border: 4px solid #8E9AAF;
          color: #1a1a1a;
        }
        .evm-header {
          text-align: center;
          font-weight: 700;
          font-size: 0.7rem;
          margin-bottom: 10px;
          color: #4A5568;
        }
        .evm-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: white;
          margin-bottom: 4px;
          border-radius: 4px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }
        .candidate-box { display: flex; align-items: center; gap: 12px; }
        .c-symbol { font-size: 1.2rem; }
        .c-name { font-weight: 600; font-size: 0.9rem; }
        .vote-btn {
          width: 36px;
          height: 36px;
          background: #34D399;
          border: 3px solid #059669;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
        }
        .btn-inner {
          width: 20px;
          height: 20px;
          background: #059669;
          border-radius: 2px;
          margin: 5px;
        }

        /* VVPAT Styles */
        .vvpat-machine {
          width: 120px;
          height: 160px;
          background: #334155;
          border: 4px solid #1E293B;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }
        .vvpat-screen {
          width: 90%;
          height: 80%;
          background: #F1F5F9;
          margin: 5% auto;
          border-radius: 4px;
          padding: 10px;
          display: flex;
          justify-content: center;
        }
        .vvpat-slip {
          width: 100%;
          background: white;
          border: 1px solid #CBD5E1;
          padding: 5px;
          font-size: 0.5rem;
          color: black;
          text-align: center;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid var(--surface-border);
          color: var(--text-muted);
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default VotingSimulator;
