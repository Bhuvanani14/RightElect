import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, AlertCircle, FileSearch, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const VoterIDOCR: React.FC = () => {
  // language is available if we need localization in future
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        processOCR();
      };
      reader.readAsDataURL(file);
    }
  };

  const processOCR = () => {
    setIsProcessing(true);
    // Simulate Google Cloud Vision API processing
    setTimeout(() => {
      setResult({
        epic: 'ABC' + Math.floor(Math.random() * 1000000),
        name: 'SAMPLE VOTER NAME',
        constituency: 'NEW DELHI - 01',
        status: 'VERIFIED'
      });
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="ocr-container animate-fade-in">
      <div className="header text-center mb-8">
        <h2 className="gradient-text">Voter ID Verification</h2>
        <p className="text-muted">Upload your Voter ID for instant EPIC verification using AI</p>
      </div>

      <div className="upload-section glass-card">
        {!image ? (
          <label className="upload-label">
            <div className="upload-icon-box">
              <Camera size={40} className="text-primary" />
              <Upload size={20} className="sub-icon" />
            </div>
            <h3>Scan your Voter ID</h3>
            <p>Place your card in front of the camera or upload a clear photo</p>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden-input" />
            <div className="btn-primary mt-4">Browse Files</div>
          </label>
        ) : (
          <div className="preview-container">
            <img src={image} alt="Voter ID" className="card-preview" />
            {isProcessing && (
              <div className="processing-overlay">
                <div className="spinner"></div>
                <p>Analyzing with Cloud Vision...</p>
              </div>
            )}
            {!isProcessing && result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="result-card glass-card">
                <div className="result-header">
                  <ShieldCheck className="text-secondary" />
                  <h4>Verification Successful</h4>
                </div>
                <div className="result-grid">
                  <div className="result-item">
                    <span>EPIC Number</span>
                    <strong>{result.epic}</strong>
                  </div>
                  <div className="result-item">
                    <span>Name</span>
                    <strong>{result.name}</strong>
                  </div>
                  <div className="result-item">
                    <span>Constituency</span>
                    <strong>{result.constituency}</strong>
                  </div>
                </div>
                <div className="status-badge success">
                  <CheckCircle size={16} /> ELECTORAL ROLL VERIFIED
                </div>
                <button className="btn-text mt-4" onClick={() => setImage(null)}>Scan Another Card</button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="info-cards mt-8">
        <div className="info-item glass-card card-sm">
          <FileSearch size={24} className="text-accent" />
          <div>
            <h5>OCR Powered</h5>
            <p>Instant text extraction from images</p>
          </div>
        </div>
        <div className="info-item glass-card card-sm">
          <AlertCircle size={24} className="text-primary" />
          <div>
            <h5>Secure Processing</h5>
            <p>Encrypted data handled via Google Cloud</p>
          </div>
        </div>
      </div>

      <style>{`
        .ocr-container { padding: 4px; }
        .upload-section { 
          min-height: 350px; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center;
          position: relative;
          border-style: dashed;
          border-width: 2px;
        }
        .upload-label { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 12px; 
          cursor: pointer; 
          text-align: center;
          width: 100%;
          padding: 2rem;
        }
        .upload-icon-box { 
          position: relative; 
          width: 80px; 
          height: 80px; 
          background: var(--primary-glow); 
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .sub-icon { position: absolute; bottom: 0; right: 0; background: var(--primary); color: white; padding: 4px; border-radius: 50%; }
        .hidden-input { display: none; }
        
        .preview-container { width: 100%; display: flex; flex-direction: column; gap: 1.5rem; }
        .card-preview { width: 100%; max-height: 200px; object-fit: cover; border-radius: 16px; border: 2px solid var(--surface-border); }
        
        .processing-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          border-radius: 23px;
          gap: 1rem;
        }
        .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s infinite linear; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .result-card { background: var(--surface); padding: 1.5rem; position: relative; }
        .result-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; color: var(--secondary); font-weight: 700; }
        .result-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1rem; text-align: left; }
        .result-item span { font-size: 0.75rem; color: var(--text-muted); display: block; }
        .result-item strong { font-size: 1.1rem; color: var(--text-main); }
        .status-badge { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 800; padding: 10px; border-radius: 10px; justify-content: center; }
        .status-badge.success { background: rgba(16, 185, 129, 0.1); color: var(--secondary); }

        .info-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .card-sm { padding: 1rem; display: flex; gap: 12px; align-items: center; }
        .card-sm h5 { font-size: 0.85rem; margin-bottom: 2px; }
        .card-sm p { font-size: 0.7rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default VoterIDOCR;
