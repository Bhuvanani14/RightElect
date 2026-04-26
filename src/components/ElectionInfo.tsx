import React, { useState } from 'react';
import { MapPin, Search, Download, Map as MapIcon, Newspaper, Info } from 'lucide-react';
import { useSettings, translations } from '../hooks/useSettings';

const ElectionInfo: React.FC = () => {
  const { language } = useSettings();
  const t = translations[language];
  const [location, setLocation] = useState<string | null>(null);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [booths, setBooths] = useState<any[]>([]);
  const [electionInfo, setElectionInfo] = useState<any | null>(null);
  const [liveUpdates, setLiveUpdates] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pincode, setPincode] = useState('');

  const electionLevels = [
    { name: 'Lok Sabha', desc: 'National level elections (543 seats)', icon: '🏛️' },
    { name: 'Vidhan Sabha', desc: 'State level legislative assembly', icon: '🏙️' },
    { name: 'Panchayat/Urban', desc: 'Local body & municipal elections', icon: '🏡' }
  ];

  const newsUpdates = [
    { title: 'New Voter Registration Deadline Extended', date: 'Oct 24, 2024', source: 'ECI News' },
    { title: 'Digital Voter ID (e-EPIC) crossed 50M downloads', date: 'Oct 20, 2024', source: 'Press Hub' },
    { title: 'Security protocols updated for electronic voting', date: 'Oct 15, 2024', source: 'Security Div' }
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
        // fetch nearest booths from backend
        const base = import.meta.env.VITE_SERVER_URL || '';
        fetch(`${base}/api/nearest-booth?lat=${latitude}&lng=${longitude}`)
          .then(r => r.json())
          .then(data => setBooths(data.results || []))
          .catch(() => {});
        setTimeout(() => {
          setLocation("Your detected constituency");
          setIsSearching(false);
        }, 800);
      },
      () => {
        setError("Unable to retrieve location. Please check browser permissions.");
        setIsSearching(false);
      }
    );
  };

  React.useEffect(() => {
    const base = import.meta.env.VITE_SERVER_URL || '';
    fetch(`${base}/api/election-info`).then(r=>r.json()).then(setElectionInfo).catch(()=>{});
    fetch(`${base}/api/latest-updates`).then(r=>r.json()).then(d=>setLiveUpdates(d.articles || [])).catch(()=>{});
  }, []);

  return (
    <div className="info-container animate-fade-in">
      <div className="header text-center">
        <h2 className="gradient-text">{t.hubTitle}</h2>
        <p className="text-muted">{t.hubSubtitle}</p>
      </div>

      <div className="status-grid">
        <div className="location-card glass-card">
          <div className="loc-title">
            <MapPin size={22} className="text-primary" />
            <h3>Your Constituency</h3>
          </div>
          {location ? (
            <div className="loc-result">
              <p className="loc-name">{location}</p>
              <div className="map-view">
                {coords ? (
                  <iframe
                    width="100%"
                    height="200"
                    frameBorder="0"
                    style={{ border: 0, borderRadius: '16px' }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.02}%2C${coords.lat - 0.02}%2C${coords.lng + 0.02}%2C${coords.lat + 0.02}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
                    title="map"
                  />
                ) : null}
                <div className="map-labels">
                  {booths && booths.length > 0 ? (
                    booths.slice(0,3).map((b, i) => (
                      <div key={i} className="label-item">
                        <strong>{b.name}</strong> — {b.address} • {Math.round(b.distance_m)}m • <a href={`https://www.google.com/maps/search/?api=1&query=${b.location.lat},${b.location.lng}${b.place_id?`&query_place_id=${b.place_id}`:''}`} target="_blank" rel="noreferrer">Open</a>
                      </div>
                    ))
                  ) : (
                    <div className="label-item">No nearby booths found yet.</div>
                  )}
                </div>
              </div>
              <button className="btn-text-sm" onClick={() => setLocation(null)}>Update Location</button>
            </div>
          ) : (
            <div className="loc-search text-center">
              <p className="text-muted mb-6">Detect your location for personalized booth info</p>
              <button className="btn-primary w-full" onClick={handleDetectLocation} disabled={isSearching}>
                {isSearching ? 'Analyzing...' : 'Detect My Location'}
              </button>
              <div className="divider">OR</div>
              <div className="input-group">
                <input type="text" placeholder="Enter Pincode" value={pincode} onChange={e => setPincode(e.target.value)} />
                <button className="btn-icon-sq" onClick={handleDetectLocation}><Search size={18} /></button>
              </div>
            </div>
          )}
          {error && (
            <div className="error-box" role="alert" style={{ color: 'var(--accent)', marginTop: '12px' }}>
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="section-title">
        <h3>Electronic Governance</h3>
        <p>Tools for active citizenship</p>
      </div>

      <div className="action-grid-3">
        <a href="https://voters.eci.gov.in/" target="_blank" className="action-card-sq glass-card">
          <Download size={24} className="text-accent" />
          <span>e-EPIC</span>
        </a>
        <a href="https://electoralsearch.eci.gov.in/" target="_blank" className="action-card-sq glass-card">
          <MapIcon size={24} className="text-secondary" />
          <span>Booth Info</span>
        </a>
        <a href="https://affidavit.eci.gov.in/" target="_blank" className="action-card-sq glass-card">
          <Newspaper size={24} className="text-primary" />
          <span>Affidavits</span>
        </a>
      </div>

      <div className="levels-section">
         <h4 className="mb-4 font-bold">Election Categories</h4>
         <div className="levels-list">
            {electionLevels.map((lvl, i) => (
              <div key={i} className="level-item glass-card">
                 <span className="lvl-emoji">{lvl.icon}</span>
                 <div>
                    <h5>{lvl.name}</h5>
                    <p className="text-muted text-xs">{lvl.desc}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div className="news-section">
         <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Latest ECI Updates</h4>
            <span className="text-primary text-xs font-bold">Live</span>
         </div>
        <div className="news-scroll">
          {liveUpdates.length ? liveUpdates.map((n, i) => (
            <div key={i} className="news-item glass-card card-sm">
              <Info size={16} className="text-primary flex-shrink-0" />
              <div>
                <p className="news-title">{n.title}</p>
                <span className="news-meta">{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : ''} • {n.source?.name || ''}</span>
                <div style={{ marginTop: 6 }}><a href={n.url} target="_blank" rel="noreferrer">Read</a></div>
              </div>
            </div>
          )) : (
            <div className="news-item">No live updates available.</div>
          )}
        </div>
      </div>

      <style>{`
        .info-container { display: flex; flex-direction: column; gap: var(--spacing-lg); padding-bottom: 2rem; }
        .loc-title { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
        .map-view { position: relative; margin-top: 1rem; border-radius: 18px; overflow: hidden; }
        .map-labels { padding: 12px; font-size: 0.8rem; background: var(--surface); text-align: left; border-top: 1px solid var(--surface-border); }
        .divider { margin: var(--spacing-sm) 0; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); opacity: 0.5; }
        .input-group { display: flex; gap: 8px; background: var(--surface); border: 1px solid var(--surface-border); padding: 6px; border-radius: 12px; }
        .input-group input { border: none; background: transparent; padding-left: 8px; flex: 1; outline: none; color: var(--text-main); }
        .btn-icon-sq { background: var(--primary); color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; }

        .section-title h3 { font-size: 1.2rem; font-weight: 800; }
        .section-title p { font-size: 0.8rem; color: var(--text-muted); }

        .action-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .action-card-sq { text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; text-align: center; }
        .action-card-sq span { font-size: 0.75rem; font-weight: 700; color: var(--text-main); }

        .levels-list { display: flex; overflow-x: auto; gap: 12px; padding-bottom: 8px; scroll-snap-type: x mandatory; }
        .level-item { min-width: 160px; padding: 16px; scroll-snap-align: start; flex-shrink: 0; display: flex; flex-direction: column; gap: 10px; }
        .lvl-emoji { font-size: 1.5rem; }
        .level-item h5 { font-size: 0.9rem; font-weight: 700; }

        .news-item { display: flex; gap: 12px; padding: 12px; margin-bottom: 10px; align-items: flex-start; }
        .news-title { font-size: 0.85rem; font-weight: 600; line-height: 1.4; color: var(--text-main); }
        .news-meta { font-size: 0.7rem; color: var(--text-muted); }
        .news-scroll { max-height: 250px; overflow-y: auto; }
        
        .btn-text-sm { background: none; border: none; color: var(--primary); font-size: 0.75rem; font-weight: 700; cursor: pointer; margin-top: 10px; }
      `}</style>
    </div>
  );
};

export default ElectionInfo;
