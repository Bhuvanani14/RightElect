import React, { useEffect, useState } from 'react';

const Parliament: React.FC = () => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const base = import.meta.env.VITE_SERVER_URL || '';
    fetch(`${base}/api/parliament`).then(r=>r.json()).then(setData).catch(()=>{});
  }, []);

  if (!data) return <div className="loading">Loading...</div>;

  return (
    <div className="parliament-page">
      <div className="grid">
        <div className="card glass-card">
          <h3>{data.lokSabha.name} — {data.lokSabha.seats} Seats</h3>
          <p><strong>Term:</strong> {data.lokSabha.term}</p>
          <p><strong>Current:</strong> {data.lokSabha.current}</p>
          <p><strong>Eligibility:</strong> {data.lokSabha.eligibility}</p>
          <h4>Key Functions</h4>
          <ul>
            {data.lokSabha.keyFunctions.map((k:string,i:number)=>(<li key={i}>{k}</li>))}
          </ul>
        </div>
        <div className="card glass-card">
          <h3>{data.rajyaSabha.name} — {data.rajyaSabha.seats} Seats</h3>
          <p><strong>Term:</strong> {data.rajyaSabha.term}</p>
          <p><strong>Eligibility:</strong> {data.rajyaSabha.eligibility}</p>
          <p><strong>Elected by:</strong> {data.rajyaSabha.electedBy}</p>
          <h4>Top allocations</h4>
          <ul>
            {data.rajyaSabha.topStateAllocations.map((s:any,i:number)=> (<li key={i}>{s.state}: {s.seats} seats</li>))}
          </ul>
        </div>
      </div>

      <style>{`
        .grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
        .card { padding:16px; }
      `}</style>
    </div>
  );
}

export default Parliament;
