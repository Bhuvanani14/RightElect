#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/deploy.sh [TAG]
# Example: ./scripts/deploy.sh v1

PROJECT_ID=${PROJECT_ID:-tidy-node-494313-j1}
TAG=${1:-"$SHORT_SHA"}
IMAGE="rightelect-server:${TAG}"
SERVICE_NAME=${SERVICE_NAME:-rightelect-server}
REGION=${REGION:-us-central1}
SERVICE_ACCOUNT=${SERVICE_ACCOUNT:-rightelect-sa@${PROJECT_ID}.iam.gserviceaccount.com}

echo "Building and deploying ${IMAGE} to Cloud Run service ${SERVICE_NAME} in project ${PROJECT_ID}..."

gcloud builds submit --config=cloudbuild.yaml --substitutions _IMAGE=${IMAGE},_SERVICE_NAME=${SERVICE_NAME},_REGION=${REGION},_SERVICE_ACCOUNT=${SERVICE_ACCOUNT} --project=${PROJECT_ID}

echo "Deployment request submitted. Cloud Build will build the image and deploy to Cloud Run." 
