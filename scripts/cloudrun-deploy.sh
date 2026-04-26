#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID=${1:?project id}
IMAGE=${2:?image}
SERVICE_NAME=${3:-rightelect-server}
REGION=${4:-us-central1}
SERVICE_ACCOUNT=${5:-rightelect-sa@${PROJECT_ID}.iam.gserviceaccount.com}

echo "Preparing Cloud Run deploy for ${SERVICE_NAME} in ${PROJECT_ID}..."

# Construct --set-secrets flags if the secrets exist in Secret Manager
SECRETS_FLAGS=""
for S in MAPS_API_KEY NEWS_API_KEY GENERATIVE_API_KEY; do
  # Check if secret exists
  if gcloud secrets describe ${S} --project=${PROJECT_ID} >/dev/null 2>&1; then
    SECRETS_FLAGS+=" --set-secrets ${S}=projects/${PROJECT_ID}/secrets/${S}:latest"
  fi
done

gcloud run deploy ${SERVICE_NAME} \
  --image gcr.io/${PROJECT_ID}/${IMAGE} \
  --region=${REGION} --platform=managed \
  --allow-unauthenticated \
  --service-account=${SERVICE_ACCOUNT} \
  ${SECRETS_FLAGS} \
  --project=${PROJECT_ID}

echo "Cloud Run deploy finished (request sent)."
