import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import {Logging} from '@google-cloud/logging';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple request metrics
let requestCount = 0;
app.use((req, res, next) => { requestCount++; next(); });

// Initialize Cloud Logging client if running on GCP or with credentials
let logger: any = console;
try {
  const logging = new Logging({ projectId: process.env.GOOGLE_PROJECT_ID || undefined });
  const log = logging.log('rightelect-server');
  logger = {
    info: (msg: any, meta?: any) => {
      console.log(msg, meta || '');
      const entry = log.entry({ resource: { type: 'global' } }, { message: msg, ...meta });
      log.write(entry).catch(() => {});
    },
    error: (msg: any, meta?: any) => {
      console.error(msg, meta || '');
      const entry = log.entry({ resource: { type: 'global' } }, { message: msg, ...meta });
      log.write(entry).catch(() => {});
    }
  };
} catch (e) {
  // fallback to console
}

const PORT = process.env.PORT || 8080;
const MAPS_API_KEY = process.env.MAPS_API_KEY || process.env.GOOGLE_API_KEY || '';
const NEWS_API_KEY = process.env.NEWS_API_KEY || '';
const GEN_KEY = process.env.GENERATIVE_API_KEY || process.env.VERTEX_API_KEY || '';
const PROJECT_ID = process.env.GOOGLE_PROJECT_ID || process.env.GCLOUD_PROJECT || '';

function haversineDistance(lat1:number, lon1:number, lat2:number, lon2:number) {
  const toRad = (v:number) => (v * Math.PI) / 180;
  const R = 6371e3; // metres
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

app.get('/', (req, res) => res.json({ status: 'ok', project: PROJECT_ID }));

app.get('/metrics', (req, res) => {
  res.json({ uptime: process.uptime(), requests: requestCount, timestamp: Date.now() });
});

// Nearest polling booth using Places Nearby Search (keyword fallback)
app.get('/api/nearest-booth', async (req, res) => {
  const lat = parseFloat(String(req.query.lat || req.query.latitude || ''));
  const lng = parseFloat(String(req.query.lng || req.query.longitude || ''));
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });
  if (!MAPS_API_KEY) return res.status(500).json({ error: 'MAPS_API_KEY not configured' });

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=polling%20station&key=${MAPS_API_KEY}`;
    const r = await axios.get(url);
    const candidates = r.data.results || [];
    const mapped = candidates.map((c:any) => {
      const loc = c.geometry?.location || { lat: 0, lng: 0 };
      return {
        name: c.name,
        place_id: c.place_id,
        address: c.vicinity || c.formatted_address,
        location: loc,
        distance_m: Math.round(haversineDistance(lat, lng, loc.lat, loc.lng))
      };
    });

    mapped.sort((a:any,b:any)=>a.distance_m - b.distance_m);
    return res.json({ query: { lat, lng }, results: mapped.slice(0,5) });
  } catch (err:any) {
    console.error('nearest-booth error', err?.response?.data || err.message);
    return res.status(500).json({ error: 'failed to query maps', detail: err?.response?.data || err.message });
  }
});

// Simple AI assistant proxy (Vertex AI / Generative) - best-effort stub with guidance
app.post('/api/ai-assistant', async (req, res) => {
  const prompt = String(req.body.prompt || req.body.question || '');
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  // If user has configured GENERATIVE_API_KEY, call Vertex AI REST API (Text-Bison example)
  if (!GEN_KEY) {
    // Fallback: return a helpful canned response while instructing how to enable the API
    return res.json({
      reply: `(Local fallback) I received: ${prompt}. To enable cloud AI, set GENERATIVE_API_KEY and deploy the server with access to Vertex AI.`
    });
  }

  try {
    // Use API key (if provided) as a query param for REST requests, or fall back to service account
    const location = process.env.VERTEX_LOCATION || 'us-central1';
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${location}/publishers/google/models/text-bison:predict`;
    const body = { instances: [{ content: prompt }], parameters: { temperature: 0.2, maxOutputTokens: 600 } };
    const requestUrl = GEN_KEY ? `${url}?key=${GEN_KEY}` : url;
    const headers: any = { 'Content-Type': 'application/json' };
    // If GEN_KEY is not present, the call will rely on the server's ADC (service account). When using ADC, set Authorization header externally.
    const r = await axios.post(requestUrl, body, { headers });
    // Response parsing depends on model; return raw for now
    return res.json({ reply: r.data });
  } catch (err:any) {
    console.error('ai-assistant error', err?.response?.data || err.message);
    return res.status(500).json({ error: 'ai error', detail: err?.response?.data || err.message });
  }
});

// Latest election updates - fallback to NewsAPI if available
app.get('/api/latest-updates', async (req, res) => {
  const q = String(req.query.q || 'Election Commission of India');
  // Prefer NEWS_API_KEY if available, otherwise return helpful message
  if (!NEWS_API_KEY) {
    return res.status(500).json({ error: 'NEWS_API_KEY not configured for latest updates' });
  }

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;
    const r = await axios.get(url);
    return res.json({ query: q, articles: r.data.articles });
  } catch (err:any) {
    console.error('latest-updates error', err?.response?.data || err.message);
    return res.status(500).json({ error: 'failed to fetch news', detail: err?.response?.data || err.message });
  }
});

// Election info: dates, parliaments, states & union territories
app.get('/api/election-info', (req, res) => {
  // Minimal curated dataset for frontend display. Expand as needed.
  const info = {
    nextElections: [
      { name: 'Lok Sabha - General Elections', dates: 'TBD', seats: 543 },
      { name: 'State Assembly Elections', dates: 'Varies by state', seats: 'Varies' }
    ],
    parliaments: [
      { name: 'Lok Sabha', seats: 543 },
      { name: 'Rajya Sabha', seats: 245 }
    ],
    statesAndUTs: [
      'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
      'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
    ]
  };
  return res.json(info);
});

// Parliament details
app.get('/api/parliament', (req, res) => {
  const data = {
    lokSabha: {
      name: 'Lok Sabha',
      seats: 543,
      term: '5 years',
      current: '18th Lok Sabha (2024–2029)',
      eligibility: 'Indian citizen, 25+ years of age',
      keyFunctions: [
        'Passes Union Budget and Money Bills',
        'Votes of No Confidence against the government',
        'Amends the Constitution (with special majority)',
        'Declares war and ratifies treaties',
        'Elects the President jointly with Rajya Sabha and state legislatures'
      ],
      topStateAllocations: [
        { state: 'Uttar Pradesh', seats: 80 },
        { state: 'Maharashtra', seats: 48 },
        { state: 'Bihar', seats: 40 },
        { state: 'West Bengal', seats: 42 }
      ]
    },
    rajyaSabha: {
      name: 'Rajya Sabha',
      seats: 245,
      term: '6 years (one-third retire every 2 years)',
      eligibility: 'Indian citizen, 30+ years of age',
      electedBy: 'Elected by members of State Legislative Assemblies and UTs',
      topStateAllocations: [
        { state: 'Uttar Pradesh', seats: 31 },
        { state: 'Maharashtra', seats: 19 },
        { state: 'Tamil Nadu', seats: 18 }
      ]
    }
  };
  return res.json(data);
});

// States & Union Territories data
app.get('/api/states', (req, res) => {
  const list = [
    { name: 'Andhra Pradesh', capital: 'Amaravati', type: 'State', vidhanSabha: 175, lokSabha: 25, rajyaSabha: 11, region: 'South' },
    { name: 'Arunachal Pradesh', capital: 'Itanagar', type: 'State', vidhanSabha: 60, lokSabha: 2, rajyaSabha: 1, region: 'North East' },
    { name: 'Assam', capital: 'Dispur', type: 'State', vidhanSabha: 126, lokSabha: 14, rajyaSabha: 7, region: 'North East' },
    { name: 'Bihar', capital: 'Patna', type: 'State', vidhanSabha: 243, lokSabha: 40, rajyaSabha: 16, region: 'East' },
    { name: 'Chhattisgarh', capital: 'Raipur', type: 'State', vidhanSabha: 90, lokSabha: 11, rajyaSabha: 5, region: 'Central' },
    { name: 'Goa', capital: 'Panaji', type: 'State', vidhanSabha: 40, lokSabha: 2, rajyaSabha: 1, region: 'West' },
    { name: 'Gujarat', capital: 'Gandhinagar', type: 'State', vidhanSabha: 182, lokSabha: 26, rajyaSabha: 11, region: 'West' },
    { name: 'Haryana', capital: 'Chandigarh', type: 'State', vidhanSabha: 90, lokSabha: 10, rajyaSabha: 5, region: 'North' },
    { name: 'Himachal Pradesh', capital: 'Shimla', type: 'State', vidhanSabha: 68, lokSabha: 4, rajyaSabha: 3, region: 'North' },
    { name: 'Jharkhand', capital: 'Ranchi', type: 'State', vidhanSabha: 81, lokSabha: 14, rajyaSabha: 6, region: 'East' },
    { name: 'Karnataka', capital: 'Bengaluru', type: 'State', vidhanSabha: 224, lokSabha: 28, rajyaSabha: 12, region: 'South' },
    { name: 'Kerala', capital: 'Thiruvananthapuram', type: 'State', vidhanSabha: 140, lokSabha: 20, rajyaSabha: 9, region: 'South' },
    { name: 'Madhya Pradesh', capital: 'Bhopal', type: 'State', vidhanSabha: 230, lokSabha: 29, rajyaSabha: 11, region: 'Central' },
    { name: 'Maharashtra', capital: 'Mumbai', type: 'State', vidhanSabha: 288, lokSabha: 48, rajyaSabha: 19, region: 'West' },
    { name: 'Manipur', capital: 'Imphal', type: 'State', vidhanSabha: 60, lokSabha: 2, rajyaSabha: 1, region: 'North East' },
    { name: 'Meghalaya', capital: 'Shillong', type: 'State', vidhanSabha: 60, lokSabha: 2, rajyaSabha: 1, region: 'North East' },
    { name: 'Mizoram', capital: 'Aizawl', type: 'State', vidhanSabha: 40, lokSabha: 1, rajyaSabha: 1, region: 'North East' },
    { name: 'Nagaland', capital: 'Kohima', type: 'State', vidhanSabha: 60, lokSabha: 1, rajyaSabha: 1, region: 'North East' },
    { name: 'Odisha', capital: 'Bhubaneswar', type: 'State', vidhanSabha: 147, lokSabha: 21, rajyaSabha: 10, region: 'East' },
    { name: 'Punjab', capital: 'Chandigarh', type: 'State', vidhanSabha: 117, lokSabha: 13, rajyaSabha: 7, region: 'North' },
    { name: 'Rajasthan', capital: 'Jaipur', type: 'State', vidhanSabha: 200, lokSabha: 25, rajyaSabha: 10, region: 'North' },
    { name: 'Sikkim', capital: 'Gangtok', type: 'State', vidhanSabha: 32, lokSabha: 1, rajyaSabha: 1, region: 'North East' },
    { name: 'Tamil Nadu', capital: 'Chennai', type: 'State', vidhanSabha: 234, lokSabha: 39, rajyaSabha: 18, region: 'South' },
    { name: 'Telangana', capital: 'Hyderabad', type: 'State', vidhanSabha: 119, lokSabha: 17, rajyaSabha: 7, region: 'South' },
    { name: 'Tripura', capital: 'Agartala', type: 'State', vidhanSabha: 60, lokSabha: 2, rajyaSabha: 1, region: 'North East' },
    { name: 'Uttar Pradesh', capital: 'Lucknow', type: 'State', vidhanSabha: 403, lokSabha: 80, rajyaSabha: 31, region: 'North' },
    { name: 'Uttarakhand', capital: 'Dehradun', type: 'State', vidhanSabha: 70, lokSabha: 5, rajyaSabha: 3, region: 'North' },
    { name: 'West Bengal', capital: 'Kolkata', type: 'State', vidhanSabha: 294, lokSabha: 42, rajyaSabha: 16, region: 'East' },
    // Union Territories
    { name: 'Andaman and Nicobar Islands', capital: 'Port Blair', type: 'UT', vidhanSabha: 0, lokSabha: 1, rajyaSabha: 0, region: 'Andaman' },
    { name: 'Chandigarh', capital: 'Chandigarh', type: 'UT', vidhanSabha: 0, lokSabha: 1, rajyaSabha: 0, region: 'North' },
    { name: 'Delhi', capital: 'New Delhi', type: 'UT', vidhanSabha: 70, lokSabha: 7, rajyaSabha: 3, region: 'North' },
    { name: 'Jammu and Kashmir', capital: 'Srinagar', type: 'UT', vidhanSabha: 0, lokSabha: 5, rajyaSabha: 4, region: 'North' },
    { name: 'Ladakh', capital: 'Leh', type: 'UT', vidhanSabha: 0, lokSabha: 0, rajyaSabha: 0, region: 'North' },
    { name: 'Puducherry', capital: 'Puducherry', type: 'UT', vidhanSabha: 30, lokSabha: 1, rajyaSabha: 1, region: 'South' }
  ];
  return res.json({ count: list.length, items: list });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
