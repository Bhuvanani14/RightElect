import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Dates: React.FC = () => {
  const [importantDates, setImportantDates] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchFromFirestore = async () => {
      try {
        const snap = await getDocs(collection(db, 'importantDates'));
        const docs = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        if (mounted && docs.length) setImportantDates(docs);
      } catch (err) {
        // ignore: Firestore not configured or permission denied
      }
    };

    fetchFromFirestore();

    // fallback static list if Firestore empty or unavailable
    if (!importantDates.length) {
      setImportantDates([
        { title: 'Rajya Sabha Biennial Elections', date: 'March 2026', status: 'upcoming' },
        { title: 'Bihar Vidhan Sabha Elections', date: 'October–November 2025', status: 'upcoming' },
        { title: 'Delhi Municipal Elections', date: '2025', status: 'upcoming' },
        { title: 'Next Lok Sabha Elections', date: '2029', status: 'upcoming' },
        { title: 'Voter List Revision (Annual)', date: 'Oct–Jan', status: 'ongoing' }
      ]);
    }

    return () => { mounted = false; };
  }, []);

  return (
    <div className="dates-page">
      <div className="header">
        <h2>Important Election Dates</h2>
      </div>
      <div className="dates-list">
        {importantDates.map((d,i)=> (
          <div key={d.id || i} className="date-item glass-card">
            <div className="left">
              <Calendar />
            </div>
            <div className="content">
              <strong>{d.title}</strong>
              <div className="muted">{d.date}</div>
            </div>
            <div className="action"><button className="btn">Add</button></div>
          </div>
        ))}
      </div>
      <style>{`
        .dates-page { padding: 1rem; }
        .dates-list { display:flex; flex-direction:column; gap:12px; }
        .date-item { display:flex; align-items:center; gap:12px; padding:12px; }
        .date-item .left { width:40px; display:flex; align-items:center; justify-content:center; }
        .date-item .content { flex:1 }
        .date-item .action { }
      `}</style>
    </div>
  );
}

export default Dates;
