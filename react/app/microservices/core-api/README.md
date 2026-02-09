# RAHI Voice Assistant Backend Setup

## Prerequisites
- Python 3.8+
- pip package manager

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set your Gemini API key:
```bash
# On Windows:
setx GOOGLE_API_KEY "your_gemini_api_key_here"

# On Linux/Mac:
export GOOGLE_API_KEY="your_gemini_api_key_here"
```

## Running the Server

Start the backend server:
```bash
# Option 1: Direct Python
python -m uvicorn main:app --reload

# Option 2: Using uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Option 3: Use the startup script
# On Windows:
start.bat

# On Linux/Mac:
chmod +x start.sh
./start.sh
```

## API Endpoints

- `POST /chat` - Main chat endpoint
- `GET /health` - Health check

## Expected Request Format
```json
{
  "message": "Your question here",
  "context": {}
}
```

## Expected Response Format
```json
{
  "reply": "AI response here",
  "success": true
}
```

## Troubleshooting

If you see "I'm having trouble connecting to the backend service":
1. Make sure the backend server is running on `http://localhost:8000`
2. Check that your GOOGLE_API_KEY is properly set
3. Verify that the required packages are installed

The frontend will automatically fall back to the local AI if the backend is unavailable.