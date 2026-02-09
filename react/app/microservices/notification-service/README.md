# Notification Service

Notification microservice for the RAHI platform supporting SMS, email, and push notifications.

## Features
- SMS notifications via Twilio
- Email notifications (extensible)
- Push notifications (extensible)
- RESTful API endpoints
- Health checks

## Prerequisites

### Twilio Setup (for SMS)
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token
3. Purchase a phone number

## Environment Variables

Create a `.env` file:
```bash
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
```

## Endpoints

### POST `/send-sms`
Send SMS notification.

**Request Body:**
```json
{
  "to_phone": "+919876543210",
  "message": "Your booking has been confirmed!",
  "user_id": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "provider": "twilio",
  "notification_id": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

### POST `/send-email`
Send email notification.

**Request Body:**
```json
{
  "to_email": "user@example.com",
  "subject": "Booking Confirmation",
  "body": "Your booking details...",
  "user_id": "optional-user-id"
}
```

### POST `/send-push`
Send push notification.

**Request Body:**
```json
{
  "user_id": "user-123",
  "title": "New Booking Request",
  "message": "You have a new booking request",
  "data": {
    "booking_id": "booking-456",
    "customer_name": "John Doe"
  }
}
```

### GET `/health`
Health check endpoint.

### GET `/`
Service information.

## Development

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file with your credentials
echo "TWILIO_ACCOUNT_SID=your_sid" > .env
echo "TWILIO_AUTH_TOKEN=your_token" >> .env
echo "TWILIO_PHONE_NUMBER=your_number" >> .env

# Run locally
uvicorn main:app --reload --port 8005

# Build Docker image
docker build -t rahi-notification-service .

# Run with Docker
docker run -p 8005:8005 --env-file .env rahi-notification-service
```

## Integration Examples

### From Frontend (JavaScript):
```javascript
// Send SMS notification
const response = await fetch('/api/notifications/send-sms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to_phone: '+919876543210',
    message: 'Your worker is on the way!'
  })
});
```

### From Another Service (Python):
```python
import requests

response = requests.post(
    'http://notification-service:8005/send-sms',
    json={
        'to_phone': '+919876543210',
        'message': 'Booking confirmed!'
    }
)
```

## Extending Functionality

### Adding Email Service
Integrate with SendGrid, Amazon SES, or SMTP:
1. Add email library to requirements.txt
2. Update the `send_email` function
3. Add email service credentials to environment

### Adding Push Notifications
Integrate with Firebase Cloud Messaging:
1. Add `firebase-admin` to requirements.txt
2. Update the `send_push_notification` function
3. Add FCM credentials to environment
