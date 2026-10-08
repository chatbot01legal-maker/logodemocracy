# analytics/parsers.py
import re
from datetime import datetime

# Basado en la estructura de logs del backend
METRICS_REGEX = re.compile(
    r"\[SOPHIA-GENAI\] METRICS stage=(?P<stage>\w+)\s+input=(?P<input>[\w/]+)\s+output=(?P<output>[\w/]+)\s+thoughts=(?P<thoughts>[\w/]+)\s+total=(?P<total>[\w/]+)\s+model=(?P<model>[\w.-]+)"
)

def parse_genai_logs(logs):
    parsed = []
    for log in logs:
        text = log.get("textPayload", "")
        if "[SOPHIA-GENAI] METRICS" in text:
            match = METRICS_REGEX.search(text)
            if match:
                data = match.groupdict()
                for k in ["input", "output", "thoughts", "total"]:
                    data[k] = int(data[k]) if data[k].isdigit() else 0
                data["timestamp"] = log.get("timestamp")
                parsed.append(data)
    return parsed

def parse_http_logs(logs):
    parsed = []
    for log in logs:
        http_req = log.get("httpRequest")
        if http_req:
            parsed.append({
                "timestamp": log.get("timestamp"),
                "method": http_req.get("requestMethod"),
                "url": http_req.get("requestUrl", ""),
                "status": http_req.get("status"),
                "latency": http_req.get("latency")
            })
    return parsed

def get_errors(logs):
    errors = []
    for log in logs:
        if log.get("severity") in ["ERROR", "CRITICAL"]:
            errors.append({
                "timestamp": log.get("timestamp"),
                "text": log.get("textPayload") or log.get("jsonPayload", {}).get("message", "Error desconocido")
            })
    return errors
