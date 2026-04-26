import React, { useEffect, useState } from 'react';

const StatesUTs: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{
    const base = import.meta.env.VITE_SERVER_URL || '';
    fetch(`${base}/api/states`).then(r=>r.json()).then(d=>setList(d.items || [])).catch(()=>{});
  },[]);

  return (
    <div className="states-page">
      <h2>States & Union Territories</h2>
      <div className="table">
        <div className="row header">
          <div>Name</div><div>Capital</div><div>Type</div><div>Vidhan Sabha</div><div>Lok Sabha</div><div>Rajya Sabha</div><div>Region</div>
        </div>
        {list.map((s,i)=> (
          <div key={i} className="row">
            <div>{s.name}</div><div>{s.capital}</div><div>{s.type}</div><div>{s.vidhanSabha || '-'}</div><div>{s.lokSabha || '-'}</div><div>{s.rajyaSabha || '-'}</div><div>{s.region}</div>
          </div>
        ))}
      </div>
      <style>{`
        .table { border-radius:8px; overflow:hidden; }
        .row { display:grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr; gap:8px; padding:10px; align-items:center; }
        .row.header { background: var(--surface); font-weight:700; }
      `}</style>
    </div>
  );
}

export default StatesUTs;
