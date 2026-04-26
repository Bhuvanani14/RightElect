Deployment instructions and required GCP permissions

Project: tidy-node-494313-j1

Enable APIs (run in Cloud Shell or with gcloud):

```bash
gcloud config set project tidy-node-494313-j1
gcloud services enable run.googleapis.com cloudbuild.googleapis.com iam.googleapis.com artifactregistry.googleapis.com aiplatform.googleapis.com maps-backend.googleapis.com
```

Create a service account for Cloud Run deployments and give it minimal roles:

```bash
gcloud iam service-accounts create rightelect-sa --display-name="RightElect Cloud Run SA"

# Grant roles to service account (adjust least-privilege as needed)
gcloud projects add-iam-policy-binding tidy-node-494313-j1 --member="serviceAccount:rightelect-sa@tidy-node-494313-j1.iam.gserviceaccount.com" --role="roles/run.admin"
gcloud projects add-iam-policy-binding tidy-node-494313-j1 --member="serviceAccount:rightelect-sa@tidy-node-494313-j1.iam.gserviceaccount.com" --role="roles/iam.serviceAccountUser"
gcloud projects add-iam-policy-binding tidy-node-494313-j1 --member="serviceAccount:rightelect-sa@tidy-node-494313-j1.iam.gserviceaccount.com" --role="roles/cloudbuild.builds.builder"
gcloud projects add-iam-policy-binding tidy-node-494313-j1 --member="serviceAccount:rightelect-sa@tidy-node-494313-j1.iam.gserviceaccount.com" --role="roles/storage.admin"

```

Build and push server image (Cloud Build):

```bash
cd server
gcloud builds submit --tag gcr.io/tidy-node-494313-j1/rightelect-server:latest

# Deploy to Cloud Run
gcloud run deploy rightelect-server --image gcr.io/tidy-node-494313-j1/rightelect-server:latest --platform managed --region=us-central1 --allow-unauthenticated --service-account=rightelect-sa@tidy-node-494313-j1.iam.gserviceaccount.com --project=tidy-node-494313-j1
```

Set environment variables for the service (MAPS_API_KEY, NEWS_API_KEY, GENERATIVE_API_KEY, GOOGLE_PROJECT_ID) either in Cloud Run console or via gcloud:

```bash
gcloud run services update rightelect-server --update-env-vars MAPS_API_KEY="YOUR_KEY",NEWS_API_KEY="YOUR_NEWS_KEY",GENERATIVE_API_KEY="YOUR_GEN_KEY",GOOGLE_PROJECT_ID="tidy-node-494313-j1" --region=us-central1 --project=tidy-node-494313-j1
```

Notes and security:
- Use Secret Manager to store secrets and mount them as environment variables rather than placing keys in plaintext.
- Restrict Maps API key to your deployed domain and to the Maps/Places APIs.
- For Vertex AI access from Cloud Run, prefer using a service account with the `roles/aiplatform.user` role and use metadata credentials.

Secrets (recommended: Secret Manager + `--set-secrets` on deploy)
-----------------------------------------------------------
Create secrets and add the key material (replace values or pipe files):

```bash
# MAPS API key
gcloud secrets create MAPS_API_KEY --replication-policy="automatic" --project=tidy-node-494313-j1
echo "YOUR_MAPS_KEY" | gcloud secrets versions add MAPS_API_KEY --data-file=- --project=tidy-node-494313-j1

# News API key (NewsAPI.org or other provider)
gcloud secrets create NEWS_API_KEY --replication-policy="automatic" --project=tidy-node-494313-j1
echo "YOUR_NEWSAPI_KEY" | gcloud secrets versions add NEWS_API_KEY --data-file=- --project=tidy-node-494313-j1

# Vertex / Generative API key (if using API-key fallback)
gcloud secrets create GENERATIVE_API_KEY --replication-policy="automatic" --project=tidy-node-494313-j1
echo "YOUR_GENERATIVE_KEY" | gcloud secrets versions add GENERATIVE_API_KEY --data-file=- --project=tidy-node-494313-j1
```

Grant the Cloud Run service account access to read those secrets:

```bash
gcloud secrets add-iam-policy-binding projects/tidy-node-494313-j1/secrets/MAPS_API_KEY \
	--member="serviceAccount:rightelect-sa@tidy-node-494313-j1.iam.gserviceaccount.com" \
	--role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding projects/tidy-node-494313-j1/secrets/NEWS_API_KEY \
	--member="serviceAccount:rightelect-sa@tidy-node-494313-j1.iam.gserviceaccount.com" \
	--role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding projects/tidy-node-494313-j1/secrets/GENERATIVE_API_KEY \
	--member="serviceAccount:rightelect-sa@tidy-node-494313-j1.iam.gserviceaccount.com" \
	--role="roles/secretmanager.secretAccessor"
```

Redeploy Cloud Run attaching secrets to environment variables (recommended):

```bash
gcloud run deploy rightelect-server \
	--image gcr.io/tidy-node-494313-j1/rightelect-server:latest \
	--region us-central1 --platform managed --allow-unauthenticated \
	--service-account rightelect-sa@tidy-node-494313-j1.iam.gserviceaccount.com \
	--set-secrets MAPS_API_KEY=MAPS_API_KEY:latest,NEWS_API_KEY=NEWS_API_KEY:latest,GENERATIVE_API_KEY=GENERATIVE_API_KEY:latest \
	--project=tidy-node-494313-j1
```

After deploy, verify endpoints:

```bash
curl -i https://rightelect-server-139878808531.us-central1.run.app/
curl -sS "https://rightelect-server-139878808531.us-central1.run.app/api/nearest-booth?lat=28.6139&lng=77.2090" | jq
curl -sS -X POST -H "Content-Type: application/json" -d '{"prompt":"How to register to vote?"}' "https://rightelect-server-139878808531.us-central1.run.app/api/ai-assistant" | jq
```

If you prefer I run the `gcloud run deploy` here, reply with the exact secret names present in Secret Manager and confirm you allow me to perform the deploy command now.
