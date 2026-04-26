Server for Google API proxies and integrations.

Environment variables (example):

- MAPS_API_KEY=your-google-maps-api-key
- GENERATIVE_API_KEY=your-vertex-access-token-or-bearer
- NEWS_API_KEY=your-newsapi-key
- GOOGLE_PROJECT_ID=tidy-node-494313-j1

Local dev:

```bash
cd server
npm install
npm run dev
```

Build for Cloud Run (example):

```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/rightelect-server:latest
gcloud run deploy rightelect-server --image gcr.io/$PROJECT_ID/rightelect-server:latest --platform managed --region=us-central1 --allow-unauthenticated --project=$PROJECT_ID
```
