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
    { title: language === 'hi' ? "आम चुनाव 2024" : "General Elections 2024", date: language === 'hi' ? "अप्रैल - मई 2024" : "April - May 2024", type: language === 'hi' ? "राष्ट्रीय" : "National" },
    { title: language === 'hi' ? "राज्य विधानसभा चुनाव" : "State Assembly Elections", date: language === 'hi' ? "जल्द आ रहा है" : "Coming Soon", type: language === 'hi' ? "क्षेत्रीय" : "Regional" }
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
    
    // Simulate lookup for pincode
    setTimeout(() => {
      setCoords({ lat: 12.9716, lng: 77.5946 }); // Mock coords for the pincode
      setLocation(`Constituency for Pincode ${pincode}`);
      setIsSearching(false);
    }, 1200);
  };

  return (
    <div className="info-container">
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
          <div className="loc-result animate-fade-in">
            <p className="loc-name">{location}</p>
            <div className="election-tag">{language === 'hi' ? "आगामी मतदान: 26 मई, 2024" : "Upcoming Voting: May 26, 2024"}</div>
            
            <div className="map-preview glass-card">
              <iframe 
                width="100%" 
                height="200" 
                frameBorder="0" 
                style={{ border: 0, borderRadius: '12px' }}
                src={`https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY&q=Polling+Booth+near+${coords?.lat},${coords?.lng}`}
                allowFullScreen
              ></iframe>
              <div className="map-overlay">
                <p><strong>{language === 'hi' ? "निकटतम बूथ:" : "Nearest Booth:"}</strong> Govt. High School, Sector 4</p>
                <p>{language === 'hi' ? "आपके स्थान से 1.2 किमी दूर" : "1.2 km away from your location"}</p>
              </div>
            </div>

            <button className="btn-text" onClick={() => { setLocation(null); setCoords(null); setPincode(''); }}>{language === 'hi' ? "स्थान बदलें" : "Change Location"}</button>
          </div>
        ) : (
          <div className="loc-search">
            <p>{language === 'hi' ? "प्रासंगिक तिथियां दिखाने के लिए हमें बताएं कि आप कहां हैं।" : "Tell us where you are to show relevant dates."}</p>
            {error && <div className="error-msg">{error}</div>}
            <div className="search-box">
              <button className="btn-primary" onClick={handleDetectLocation} disabled={isSearching}>
                {isSearching ? (language === 'hi' ? "पता लगा रहा है..." : "Detecting...") : (language === 'hi' ? "मेरा स्थान खोजें" : "Detect My Location")}
              </button>
              <div className="divider">{language === 'hi' ? "या" : "OR"}</div>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder={language === 'hi' ? "पिनकोड दर्ज करें" : "Enter Pincode"} 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePincodeSearch()}
                />
                <button className="icon-btn" onClick={handlePincodeSearch}>
                   <Search size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="quick-actions grid-2">
        <a href="https://voters.eci.gov.in/home/e-epic-download" target="_blank" rel="noopener noreferrer" className="action-card glass-card no-decor">
          <Download size={24} className="text-accent" />
          <h4>{language === 'hi' ? "e-EPIC डाउनलोड करें" : "Download e-EPIC"}</h4>
          <p>{language === 'hi' ? "अपना डिजिटल वोटर आईडी कार्ड प्राप्त करें।" : "Get your digital voter ID card."}</p>
          <ExternalLink size={16} className="ext-icon" />
        </a>
        <a href="https://services.india.gov.in/service/detail/search-polling-station-location-online-by-election-commission-of-india-1" target="_blank" rel="noopener noreferrer" className="action-card glass-card no-decor">
          <MapIcon size={24} className="text-secondary" />
          <h4>{language === 'hi' ? "बूथ लोकेटर" : "Booth Locator"}</h4>
          <p>{language === 'hi' ? "अपना निर्धारित मतदान केंद्र खोजें।" : "Find your assigned polling station."}</p>
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
              <button className="btn-icon">
                <Bell size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .info-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .location-card { padding: 1.5rem; }
        .loc-title { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
        .loc-result { text-align: center; padding: 1rem 0; }
        .loc-name { font-size: 1.4rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px; }
        .election-tag { background: rgba(16, 185, 129, 0.1); color: var(--secondary); padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; display: inline-block; margin-bottom: 1.5rem; }
        
        .map-preview { position: relative; margin-bottom: 1.5rem; overflow: hidden; }
        .map-overlay { padding: 12px; text-align: left; background: var(--surface); border-top: 1px solid var(--surface-border); }
        .map-overlay p { margin: 0; font-size: 0.85rem; }
        .map-overlay strong { color: var(--primary); }
+
        .error-msg { background: rgba(239, 68, 68, 0.1); color: #EF4444; padding: 10px; border-radius: 8px; font-size: 0.8rem; margin-bottom: 1rem; }
+
        .loc-search { text-align: center; }
        .loc-search p { margin-bottom: 1.5rem; color: var(--text-muted); }
        .search-box { display: flex; flex-direction: column; gap: 1rem; }
        .divider { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
        .input-group { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          background: var(--glass); 
          border: 1px solid var(--surface-border);
          padding: 10px 15px;
          border-radius: 12px;
        }
        .input-group input { background: transparent; border: none; outline: none; color: var(--text-main); flex: 1; font-family: inherit; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .no-decor { text-decoration: none; color: inherit; }
        .action-card { padding: 1.2rem; position: relative; display: flex; flex-direction: column; gap: 8px; cursor: pointer; transition: transform 0.2s; }
        .action-card:hover { transform: scale(1.02); }
        .action-card h4 { font-size: 0.95rem; }
        .action-card p { font-size: 0.75rem; color: var(--text-muted); }
        .ext-icon { position: absolute; top: 1.2rem; right: 1.2rem; opacity: 0.3; }
+
        .upcoming-section h3 { font-size: 1.1rem; margin-bottom: 1rem; }
        .dates-list { display: flex; flex-direction: column; gap: 8px; }
        .date-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; }
        .date-icon { width: 40px; height: 40px; background: rgba(79, 70, 229, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .date-info { flex: 1; }
        .date-info h5 { font-size: 0.9rem; margin-bottom: 2px; }
        .date-info p { font-size: 0.75rem; color: var(--text-muted); }
        .btn-icon { background: none; border: none; color: var(--text-muted); cursor: pointer; }
      `}</style>
    </div>
  );
};

export default ElectionInfo;
