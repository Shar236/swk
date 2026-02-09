# Chatbot Service

AI-powered customer support microservice for the RAHI platform.

## Features
- Natural language processing with Groq/LangChain
- Context-aware conversations
- Multi-model fallback support
- RESTful API endpoints

## Endpoints

### POST `/chat`
Process a chat message and return AI response.

**Request Body:**
```json
{
  "message": "Hello, I need help finding an electrician",
  "user_id": "optional-user-id",
  "context": {}
}
```

**Response:**
```json
{
  "reply": "I can help you find an electrician! Please visit our Services page...",
  "success": true,
  "conversation_id": "optional-conversation-id"
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

# Run locally
uvicorn main:app --reload --port 8004

# Build Docker image
docker build -t rahi-chatbot-service .

# Run with Docker
docker run -p 8004:8004 rahi-chatbot-service
```

## Environment Variables

```bash
GROQ_API_KEY=your_groq_api_key_here
```
