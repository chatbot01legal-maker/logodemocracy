# analytics/config.py

PROJECT_ID = "logodemocracy-ai-2026"
SERVICE_NAME = "logodemocracy-dev"
REGION = "us-west1"

# Tarifas documentadas para estimación (USD por millón de tokens)

# Etapas conocidas
SOPHIA_STAGES = [
    "claim_extraction", 
    "semantic_review", 
    "factual_verification", 
    "gemini_review"
]

LOGOS_STAGES = [
    "reconstruction_A", 
    "reconstruction_B", 
    "relational_analysis", 
    "synthesis"
]

# Rutas conocidas
FEEDBACK_ROUTE = "/api/logos/feedback"
LOGOS_COMPARE_ROUTE = "/api/logos/compare"
