from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import logging
import os
from typing import Optional
from twilio.rest import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RAHI Notification Service", 
    version="1.0.0",
    description="Microservice for sending notifications (SMS, Email, Push)"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

# Initialize Twilio client
twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
else:
    logger.warning("Twilio credentials not configured. SMS functionality will be disabled.")

class SmsRequest(BaseModel):
    to_phone: str
    message: str
    user_id: Optional[str] = None

class EmailRequest(BaseModel):
    to_email: EmailStr
    subject: str
    body: str
    user_id: Optional[str] = None

class PushNotificationRequest(BaseModel):
    user_id: str
    title: str
    message: str
    data: Optional[dict] = None

class NotificationResponse(BaseModel):
    success: bool
    message: str
    provider: str
    notification_id: Optional[str] = None

@app.post("/send-sms", response_model=NotificationResponse)
async def send_sms(request: SmsRequest):
    """Send SMS notification using Twilio"""
    try:
        if not twilio_client:
            raise HTTPException(status_code=503, detail="SMS service not configured")
        
        logger.info(f"Sending SMS to {request.to_phone}: {request.message[:30]}...")
        
        message = twilio_client.messages.create(
            body=request.message,
            from_=TWILIO_PHONE_NUMBER,
            to=request.to_phone
        )
        
        logger.info(f"SMS sent successfully. SID: {message.sid}")
        return NotificationResponse(
            success=True,
            message="SMS sent successfully",
            provider="twilio",
            notification_id=message.sid
        )
    except Exception as e:
        logger.error(f"Error sending SMS: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send SMS: {str(e)}")

@app.post("/send-email", response_model=NotificationResponse)
async def send_email(request: EmailRequest):
    """Send email notification (placeholder - integrate with email service)"""
    try:
        logger.info(f"Sending email to {request.to_email}: {request.subject}")
        
        # TODO: Integrate with email service (SendGrid, SMTP, etc.)
        # For now, log the request
        logger.info(f"Email queued: To={request.to_email}, Subject={request.subject}")
        
        return NotificationResponse(
            success=True,
            message="Email queued for sending",
            provider="email_service",
            notification_id="email_" + request.to_email.replace("@", "_").replace(".", "_")
        )
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@app.post("/send-push", response_model=NotificationResponse)
async def send_push_notification(request: PushNotificationRequest):
    """Send push notification (placeholder - integrate with FCM/APNs)"""
    try:
        logger.info(f"Sending push notification to user {request.user_id}: {request.title}")
        
        # TODO: Integrate with Firebase Cloud Messaging or Apple Push Notification Service
        # For now, log the request
        logger.info(f"Push notification queued: User={request.user_id}, Title={request.title}")
        
        return NotificationResponse(
            success=True,
            message="Push notification queued",
            provider="push_service",
            notification_id=f"push_{request.user_id}_{hash(request.title)}"
        )
    except Exception as e:
        logger.error(f"Error sending push notification: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send push notification: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "RAHI Notification Service is running", 
        "version": "1.0.0", 
        "endpoints": ["/send-sms", "/send-email", "/send-push", "/health"],
        "sms_enabled": twilio_client is not None
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "RAHI Notification Service",
        "sms_enabled": twilio_client is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8005, reload=True)
