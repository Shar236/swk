import os
import time
import requests
import smtplib
from email.mime.text import MIMEText
from datetime import datetime

# Load environment variables from .env file
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key.strip()] = value.strip().strip('"').strip("'")

load_env()

# URL Configuration
FRONTENT_URL = os.getenv("VITE_FRONTEND_URL", "http://localhost:8080")
BACKEND_URL = os.getenv("VITE_BACKEND_API_URL", "http://localhost:8000")
HEALTH_ENDPOINT = f"{BACKEND_URL}/health"

# Email Configuration (Loaded from .env)
ADMIN_EMAIL = os.getenv("SMTP_EMAIL_ADMIN", "founder@rahi.com")
EMAIL_NOTIFY_LIST = [ADMIN_EMAIL, "it-admin@rahi.com"]
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.resend.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_alert_email(subject, body):
    """Sends an alert email if a system failure is detected."""
    print(f"🚨 ALERT: {subject}")
    print(f"Message: {body}")
    
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print("⚠️ Email notification skipped: SMTP credentials not set in .env")
        return

    try:
        msg = MIMEText(body)
        msg['Subject'] = f"[RAHI SYSTEM ALERT] {subject}"
        msg['From'] = "alerts@rahi.com"
        msg['To'] = ", ".join(EMAIL_NOTIFY_LIST)

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
            print("✅ Alert email sent successfully.")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

def check_system_health():
    """Checks the health of the frontend and backend."""
    status_report = {
        "timestamp": datetime.now().isoformat(),
        "frontend": "DOWN",
        "backend": "DOWN",
        "errors": []
    }

    # Check Frontend
    try:
        fe_resp = requests.get(FRONTENT_URL, timeout=5)
        if fe_resp.status_code == 200:
            status_report["frontend"] = "UP"
        else:
            status_report["errors"].append(f"Frontend returned status code {fe_resp.status_code}")
    except Exception as e:
        status_report["errors"].append(f"Frontend unreachable: {str(e)}")

    # Check Backend
    try:
        be_resp = requests.get(HEALTH_ENDPOINT, timeout=5)
        if be_resp.status_code == 200:
            status_report["backend"] = "UP"
            data = be_resp.json()
            if data.get("status") != "healthy":
                status_report["errors"].append(f"Backend reporting unhealthy: {data}")
        else:
            status_report["errors"].append(f"Backend health check returned {be_resp.status_code}")
    except Exception as e:
        status_report["errors"].append(f"Backend unreachable: {str(e)}")

    return status_report

def monitor_loop():
    """Continuous monitoring loop."""
    print("🚀 Starting RAHI Real-Time Monitoring Agent...")
    print(f"Monitoring: {FRONTENT_URL} and {BACKEND_URL}")
    
    consecutive_failures = 0
    
    while True:
        report = check_system_health()
        
        if report["frontend"] == "DOWN" or report["backend"] == "DOWN":
            consecutive_failures += 1
            if consecutive_failures >= 3: # Alert after 3 consecutive failures (prevent flapping)
                subject = "Critical System Downtime Detected"
                body = f"System Report at {report['timestamp']}\n\n"
                body += f"Frontend: {report['frontend']}\n"
                body += f"Backend: {report['backend']}\n"
                body += f"Errors:\n" + "\n".join(report["errors"])
                
                send_alert_email(subject, body)
                consecutive_failures = 0 # Reset after alert
        else:
            consecutive_failures = 0
            # Optional: Log success once an hour
            if datetime.now().minute == 0 and datetime.now().second < 30:
                print(f"✅ System Healthy at {report['timestamp']}")

        time.sleep(30) # Wait 30 seconds before next check

if __name__ == "__main__":
    try:
        monitor_loop()
    except KeyboardInterrupt:
        print("\n👋 Monitoring Agent stopped by user.")
