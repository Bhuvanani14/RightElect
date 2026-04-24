import React, { useState } from 'react';
import { MapPin, Search, Calendar, Bell, Download, ExternalLink, Map as MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings, translations } from '../hooks/useSettings';

const ElectionInfo: React.FC = () => {
  const { language } = useSettings();
  const t = translations[language];
  const [location, setLocation] = useState<string | null>(null);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pincode, setPincode] = useState('');

  const upcomingElections = [
    { title: language === 'hi' ? "वोटिंग चरण 6" : "Voting Phase 6", date: language === 'hi' ? "25 मई, 2024" : "May 25, 2024", type: language === 'hi' ? "लोकसभा" : "Lok Sabha" },
    { title: language === 'hi' ? "वोटिंग चरण 7" : "Voting Phase 7", date: language === 'hi' ? "01 जून, 2024" : "June 01, 2024", type: language === 'hi' ? "लोकसभा" : "Lok Sabha" },
    { title: language === 'hi' ? "चुनाव परिणाम" : "Election Results", date: language === 'hi' ? "04 जून, 2024" : "June 04, 2024", type: language === 'hi' ? "घोषणा" : "Declaration" }
  ];

  const handleDetectLocation = () => {
    setIsSearching(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsSearching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setTimeout(() => {
          setLocation("Detected Constituency (Near your coordinates)");
          setIsSearching(false);
        }, 1000);
      },
      () => {
        setError("Unable to retrieve your location. Please check browser permissions.");
        setIsSearching(false);
      }
    );
  };

  const handlePincodeSearch = () => {
    if (pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }
    setIsSearching(true);
    setError(null);
    
    setTimeout(() => {
      setCoords({ lat: 12.9716, lng: 77.5946 }); 
      setLocation(`Constituency for Pincode ${pincode}`);
      setIsSearching(false);
    }, 1200);
  };

  return (
    <div className="info-container animate-fade-in">
      <div className="info-header">
        <h2 className="gradient-text">{t.hubTitle}</h2>
        <p className="text-muted">{t.hubSubtitle}</p>
      </div>

      <div className="location-card glass-card">
        <div className="loc-title">
          <MapPin size={24} className="text-primary" />
          <h3>{language === 'hi' ? "क्षेत्र की जानकारी" : "Current Constituency"}</h3>
        </div>
        
        {location ? (
          <div className="loc-result">
            <p className="loc-name">{location}</p>
            <div className="election-tag">{language === 'hi' ? "आगामी मतदान: 26 मई, 2024" : "Upcoming Voting: May 26, 2024"}</div>
            
            <div className="map-preview">
              <iframe 
                width="100%" 
                height="220" 
                frameBorder="0" 
                style={{ border: 0, borderRadius: '20px' }}
                src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyCoWg4mGgYqfcNCr78gm-RN79xowHsmBVE&q=Polling+Booth+near+${coords?.lat},${coords?.lng}`}
                allowFullScreen
              ></iframe>
              <div className="map-overlay glass-card">
                <p><strong>{language === 'hi' ? "निकटतम बूथ:" : "Nearest Booth:"}</strong> Govt. High School, Sector 4</p>
                <p className="text-muted">{language === 'hi' ? "आपके स्थान से 1.2 किमी दूर" : "1.2 km away from your location"}</p>
              </div>
            </div>

            <button className="btn-text" onClick={() => { setLocation(null); setCoords(null); setPincode(''); }}>
               {language === 'hi' ? "स्थान बदलें" : "Change Location"}
            </button>
          </div>
        ) : (
          <div className="loc-search">
            <p>{language === 'hi' ? "प्रासंगिक तिथियां दिखाने के लिए हमें बताएं कि आप कहां हैं।" : "Tell us where you are to show relevant dates."}</p>
            {error && <div className="error-msg">{error}</div>}
            <div className="search-box">
              <button className="btn-primary" onClick={handleDetectLocation} disabled={isSearching}>
                {isSearching ? (language === 'hi' ? "पता लगा रहा है..." : "Detecting...") : (language === 'hi' ? "मेरा स्थान खोजें" : "Detect My Location")}
              </button>
              <div className="divider"><span>{language === 'hi' ? "या" : "OR"}</span></div>
              <div className="input-field">
                <input 
                  type="text" 
                  placeholder={language === 'hi' ? "पिनकोड दर्ज करें" : "Enter Pincode"} 
                  value={pincode}
                  maxLength={6}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g,''))}
                  onKeyPress={(e) => e.key === 'Enter' && handlePincodeSearch()}
                />
                <button className="search-btn" onClick={handlePincodeSearch}><Search size={20} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="quick-actions grid-2">
        <a href="https://voters.eci.gov.in/home/e-epic-download" target="_blank" rel="noopener noreferrer" className="action-card glass-card no-decor">
          <Download size={26} className="text-accent" />
          <div className="action-text">
            <h4>{language === 'hi' ? "e-EPIC" : "e-EPIC"}</h4>
            <p>{language === 'hi' ? "डाउनलोड करें" : "Download ID"}</p>
          </div>
          <ExternalLink size={16} className="ext-icon" />
        </a>
        <a href="https://services.india.gov.in/service/detail/search-polling-station-location-online-by-election-commission-of-india-1" target="_blank" rel="noopener noreferrer" className="action-card glass-card no-decor">
          <MapIcon size={26} className="text-secondary" />
          <div className="action-text">
            <h4>{language === 'hi' ? "बूथ खोजें" : "Booth Locator"}</h4>
            <p>{language === 'hi' ? "केंद्र खोजें" : "Find Station"}</p>
          </div>
          <ExternalLink size={16} className="ext-icon" />
        </a>
      </div>

      <div className="upcoming-section">
        <h3>{language === 'hi' ? "महत्वपूर्ण तिथियां" : "Important Dates"}</h3>
        <div className="dates-list">
          {upcomingElections.map((e, idx) => (
            <motion.div 
               key={idx} 
               initial={{ opacity: 0, x: -10 }} 
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="date-item glass-card"
            >
              <div className="date-icon">
                <Calendar size={20} />
              </div>
              <div className="date-info">
                <h5>{e.title}</h5>
                <p>{e.date} • {e.type}</p>
              </div>
              <button className="btn-bell"><Bell size={18} /></button>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .info-container { display: flex; flex-direction: column; gap: var(--spacing-lg); }
        .info-header { text-align: center; }
        .loc-title { display: flex; align-items: center; gap: 12px; margin-bottom: var(--spacing-md); }
        .loc-result { text-align: center; }
        .loc-name { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px; }
        .election-tag { background: var(--primary-glow); color: var(--primary); padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: var(--spacing-md); }
        
        .map-preview { position: relative; margin-bottom: var(--spacing-md); }
        .map-overlay { 
          position: absolute; 
          bottom: 12px; 
          left: 12px; 
          right: 12px; 
          padding: 16px; 
          text-align: left; 
          backdrop-filter: blur(20px);
          border: 1px solid var(--surface-border);
        }
        .map-overlay p { margin: 0; font-size: 0.85rem; }
        .map-overlay strong { color: var(--primary); display: block; margin-bottom: 4px; }

        .error-msg { background: rgba(239, 68, 68, 0.1); color: #EF4444; padding: 12px; border-radius: 12px; font-size: 0.85rem; margin-bottom: 1rem; border: 1px solid rgba(239, 68, 68, 0.2); }

        .loc-search { text-align: center; }
        .loc-search p { margin-bottom: var(--spacing-lg); color: var(--text-muted); line-height: 1.5; }
        .search-box { display: flex; flex-direction: column; gap: var(--spacing-md); }
        
        .divider { 
          position: relative; 
          text-align: center; 
          margin: 10px 0; 
        }
        .divider::before { content: ""; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--surface-border); }
        .divider span { position: relative; background: var(--surface); padding: 0 12px; font-size: 0.75rem; color: var(--text-muted); font-weight: 700; }

        .input-field { 
          display: flex; 
          align-items: center; 
          background: var(--surface); 
          border: 1px solid var(--surface-border);
          padding: 6px 6px 6px 16px;
          border-radius: 18px;
          transition: border-color 0.2s;
        }
        .input-field:focus-within { border-color: var(--primary); }
        .input-field input { background: transparent; border: none; outline: none; color: var(--text-main); flex: 1; font-family: inherit; font-size: 1rem; }
        .search-btn { background: var(--primary); color: white; border: none; width: 42px; height: 42px; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm); }
        .no-decor { text-decoration: none; color: inherit; }
        .action-card { padding: 20px; position: relative; display: flex; align-items: center; gap: 14px; cursor: pointer; }
        .action-text h4 { font-size: 1rem; font-weight: 700; }
        .action-text p { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        .ext-icon { position: absolute; top: 12px; right: 12px; opacity: 0.2; }

        .upcoming-section h3 { font-size: 1.15rem; margin-bottom: var(--spacing-md); font-weight: 700; }
        .dates-list { display: flex; flex-direction: column; gap: 12px; }
        .date-item { display: flex; align-items: center; gap: 14px; padding: var(--spacing-md); }
        .date-icon { width: 44px; height: 44px; background: var(--primary-glow); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .date-info { flex: 1; }
        .date-info h5 { font-size: 0.95rem; font-weight: 700; margin-bottom: 2px; }
        .date-info p { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
        .btn-bell { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 8px; border-radius: 10px; transition: all 0.2s; }
        .btn-bell:hover { color: var(--accent); background: rgba(245, 158, 11, 0.1); }
        
        .btn-text { background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; margin-top: 1rem; font-size: 0.9rem; text-decoration: underline; }
      `}</style>
    </div>
  );
};

export default ElectionInfo;
