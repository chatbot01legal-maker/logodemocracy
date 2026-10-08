# analytics/gcloud.py
import subprocess
import json
import sys
from .config import PROJECT_ID, SERVICE_NAME

def fetch_logs(freshness="24h", filter_str="", limit=1000):
    """
    Ejecuta gcloud logging read y devuelve una lista de diccionarios JSON.
    """
    base_filter = f'resource.type="cloud_run_revision" AND resource.labels.service_name="{SERVICE_NAME}"'
    full_filter = f'{base_filter} AND {filter_str}' if filter_str else base_filter
    
    cmd = [
        "gcloud", "logging", "read",
        full_filter,
        f"--project={PROJECT_ID}",
        f"--freshness={freshness}",
        f"--limit={limit}",
        "--format=json"
    ]
    
    print(f"Obteniendo datos de Cloud Logging ({freshness})...")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        if not result.stdout.strip():
            return []
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error al ejecutar gcloud: {e.stderr}")
        return []
    except json.JSONDecodeError:
        print("Error al parsear el JSON de gcloud.")
        return []
