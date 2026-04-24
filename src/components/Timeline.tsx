import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ChevronRight, Info, ExternalLink } from 'lucide-react';
import { ELECTION_STAGES, type ElectionStage } from '../data/election-data';
import { useSettings, translations } from '../hooks/useSettings';

const Timeline: React.FC = () => {
  const { language } = useSettings();
  const t = translations[language];
  const [selectedStage, setSelectedStage] = useState<ElectionStage | null>(ELECTION_STAGES[0]);

  return (
    <div className="timeline-container animate-fade-in">
      <div className="timeline-header">
        <h2 className="gradient-text">{t.timelineTitle}</h2>
        <p className="text-muted">{t.timelineSubtitle}</p>
      </div>

      <div className="stages-flow scroll-hide">
        {ELECTION_STAGES.map((stage, index) => (
          <div key={stage.id} className="stage-wrapper">
            <motion.div 
              className={`stage-node glass-card ${selectedStage?.id === stage.id ? 'active' : ''}`}
              onClick={() => setSelectedStage(stage)}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`node-icon ${stage.status}`}>
                {stage.status === 'completed' ? <CheckCircle2 size={22} /> : 
                 stage.status === 'ongoing' ? <Clock size={22} /> : 
                 <Circle size={22} />}
              </div>
              <div className="node-content">
                <h3>{language === 'hi' ? stage.titleHi : stage.title}</h3>
                <p>{language === 'hi' ? stage.descriptionHi : stage.description}</p>
              </div>
              <div className="node-arrow">
                <ChevronRight size={18} />
              </div>
            </motion.div>
            {index < ELECTION_STAGES.length - 1 && <div className="connector"></div>}
          </div>
        ))}
      </div>

      {selectedStage && (
        <motion.div 
          key={selectedStage.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stage-details glass-card"
        >
          <div className="details-header">
            <div className={`status-icon ${selectedStage.status}`}>
              <Info size={24} />
            </div>
            <div>
              <h2>{language === 'hi' ? selectedStage.titleHi : selectedStage.title}</h2>
              <span className={`stage-status-badge status-${selectedStage.status}`}>
                {selectedStage.status}
              </span>
            </div>
          </div>
          <p className="long-desc">
            {language === 'hi' ? selectedStage.longDescHi : selectedStage.longDesc}
          </p>
          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem' }}
            onClick={() => window.open('https://eci.gov.in/elections/election-process/', '_blank')}
          >
            {language === 'hi' ? "विस्तृत प्रक्रिया देखें" : "View Detailed Process"} <ExternalLink size={16} />
          </button>
        </motion.div>
      )}

      <style>{`
        .timeline-container { display: flex; flex-direction: column; gap: var(--spacing-lg); }
        .timeline-header { text-align: center; }
        .stages-flow { display: flex; flex-direction: column; padding: 4px; }
        
        .stage-node {
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--surface-border);
        }
        .stage-node.active {
          border-color: var(--primary);
          background: var(--primary-glow);
          transform: translateX(8px);
        }
        
        .node-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: var(--background);
        }
        .node-icon.completed { color: var(--secondary); border: 1px solid var(--secondary); }
        .node-icon.ongoing { color: var(--accent); border: 1px solid var(--accent); }
        .node-icon.upcoming { color: var(--text-muted); border: 1px solid var(--surface-border); }

        .node-content { flex: 1; }
        .node-content h3 { font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px; }
        .node-content p { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
        
        .node-arrow {
          color: var(--text-muted);
          opacity: 0.4;
        }

        .connector {
          width: 2px;
          height: 24px;
          background: var(--surface-border);
          margin-left: 26px;
        }

        .stage-details { padding: var(--spacing-lg); margin-top: 1rem; border: 2px solid var(--primary-glow); }
        .details-header { display: flex; align-items: center; gap: 16px; margin-bottom: 1.5rem; }
        .details-header h2 { font-size: 1.3rem; font-weight: 800; color: var(--text-main); }
        .status-icon { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .status-icon.completed { background: rgba(16, 185, 129, 0.1); color: var(--secondary); }
        .status-icon.ongoing { background: rgba(245, 158, 11, 0.1); color: var(--accent); }
        .status-icon.upcoming { background: var(--glass); color: var(--text-muted); }

        .long-desc { line-height: 1.7; color: var(--text-main); font-size: 0.95rem; opacity: 0.9; }
        .stage-status-badge { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; padding: 2px 8px; border-radius: 6px; background: var(--glass); }
        .status-completed { color: var(--secondary); }
        .status-ongoing { color: var(--accent); }
        .status-upcoming { color: var(--text-muted); }

        .scroll-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Timeline;
