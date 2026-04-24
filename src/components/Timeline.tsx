import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ChevronRight, Info } from 'lucide-react';
import { ELECTION_STAGES, type ElectionStage } from '../data/election-data';
import { useSettings, translations } from '../hooks/useSettings';

const Timeline: React.FC = () => {
  const { language } = useSettings();
  const t = translations[language];
  const [selectedStage, setSelectedStage] = useState<ElectionStage | null>(ELECTION_STAGES[0]);

  return (
    <div className="timeline-container scroll-hide">
      <div className="timeline-header">
        <h2 className="gradient-text">{t.timelineTitle}</h2>
        <p className="text-muted">{t.timelineSubtitle}</p>
      </div>

      <div className="stages-flow">
        {ELECTION_STAGES.map((stage, index) => (
          <div key={stage.id} className="stage-item-wrapper">
             <div 
              className={`stage-node ${selectedStage?.id === stage.id ? 'active' : ''} ${stage.status}`}
              onClick={() => setSelectedStage(stage)}
            >
              <div className="node-icon">
                {stage.status === 'completed' ? <CheckCircle2 size={18} /> : 
                 stage.status === 'ongoing' ? <Clock size={18} /> : <Circle size={18} />}
              </div>
              <div className="node-content">
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </div>
              <ChevronRight className="node-arrow" size={20} />
            </div>
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
            <Info className="text-primary" size={24} />
            <h2>Deep Dive: {selectedStage.title}</h2>
          </div>
          <p className="long-desc">{selectedStage.longDescription}</p>
          <div className="stage-status-badge">
            Status: <span className={`status-${selectedStage.status}`}>{selectedStage.status}</span>
          </div>
        </motion.div>
      )}

      <style>{`
        .timeline-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-bottom: 2rem;
        }
        .timeline-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
        }
        .text-muted {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .stages-flow {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .stage-item-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .stage-node {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid transparent;
        }
        .stage-node.active {
          background: rgba(79, 70, 229, 0.1);
          border-color: var(--primary);
        }
        .node-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .node-icon.completed { color: var(--secondary); }
        .node-icon.ongoing { color: var(--accent); }
        .node-icon.upcoming { color: var(--text-muted); }

        .node-content { flex: 1; }
        .node-content h3 { font-size: 1rem; margin-bottom: 4px; }
        .node-content p { font-size: 0.8rem; color: var(--text-muted); }
        
        .node-arrow {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .connector {
          width: 2px;
          height: 24px;
          background: var(--surface-border);
          margin-left: 31px;
        }

        .stage-details {
          padding: 24px;
          margin-top: 1rem;
        }
        .details-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1rem;
        }
        .details-header h2 { font-size: 1.2rem; }
        .long-desc {
          line-height: 1.6;
          color: var(--text-main);
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }
        .stage-status-badge {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .status-completed { color: var(--secondary); }
        .status-ongoing { color: var(--accent); }
        .status-upcoming { color: var(--text-muted); }

        .scroll-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Timeline;
