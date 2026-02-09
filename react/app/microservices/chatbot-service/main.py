from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RAHI Chatbot Service", 
    version="1.0.0",
    description="Microservice for AI-powered customer support"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    user_id: str = None
    context: dict = {}

class ChatResponse(BaseModel):
    reply: str
    success: bool
    conversation_id: str = None

# Import the chatbot logic
from chatbot import ask_chatbot

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        logger.info(f"Received chat request: {request.message[:50]}...")
        reply = ask_chatbot(request.message)
        logger.info("Successfully processed chat request")
        return ChatResponse(reply=reply, success=True)
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "RAHI Chatbot Service is running", 
        "version": "1.0.0", 
        "endpoints": ["/chat", "/health"]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "RAHI Chatbot Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True)
