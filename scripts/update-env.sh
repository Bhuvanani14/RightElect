#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/update-env.sh KEY1=VAL1,KEY2=VAL2
# Example: ./scripts/update-env.sh MAPS_API_KEY=xxx,NEWS_API_KEY=yyy

PROJECT_ID=${PROJECT_ID:-tidy-node-494313-j1}
SERVICE_NAME=${SERVICE_NAME:-rightelect-server}
REGION=${REGION:-us-central1}

if [ $# -lt 1 ]; then
  echo "Usage: $0 KEY1=VAL1[,KEY2=VAL2,...]"
  exit 1
fi

ENV_STR=$1

echo "Updating Cloud Run service ${SERVICE_NAME} env vars in project ${PROJECT_ID}..."
gcloud run services update ${SERVICE_NAME} --update-env-vars ${ENV_STR} --region ${REGION} --project ${PROJECT_ID}

echo "Env vars updated."
