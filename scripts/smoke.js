const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const url = process.env.DEPLOYED_URL || 'https://rightelect-server-139878808531.us-central1.run.app';
const endpoints = [
  '/',
  '/api/parliament',
  '/api/states',
  '/api/election-info',
  '/api/nearest-booth?lat=28.6139&lng=77.2090'
];

async function probe(path) {
  try {
    const res = await fetch(url + path, { timeout: 10000 });
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text.slice(0, 400); }
    return { path, status: res.status, ok: res.ok, body };
  } catch (err) {
    return { path, error: String(err) };
  }
}

(async () => {
  console.log(`Smoke test target: ${url}`);
  for (const ep of endpoints) {
    const r = await probe(ep);
    if (r.error) {
      console.log(`${ep} -> ERROR: ${r.error}`);
      continue;
    }
    if (typeof r.body === 'object') {
      const summary = [];
      if (r.body.count !== undefined) summary.push(`count=${r.body.count}`);
      if (r.body.results) summary.push(`results=${r.body.results.length}`);
      if (r.body.parliaments) summary.push(`parliaments=${r.body.parliaments.length}`);
      console.log(`${ep} -> ${r.status} ${summary.join(' ')}`);
    } else {
      console.log(`${ep} -> ${r.status} body-preview: ${String(r.body).slice(0,200)}`);
    }
  }
})();
