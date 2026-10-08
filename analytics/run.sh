#!/bin/bash

export MONGODB_URI="$(gcloud secrets versions access latest \
  --secret=MONGODB_URI \
  --project=logodemocracy-ai-2026)"

if [ -z "$MONGODB_URI" ]; then
    echo "ERROR: No se pudo obtener MONGODB_URI."
    exit 1
fi

python3 -m analytics.ld_analytics
