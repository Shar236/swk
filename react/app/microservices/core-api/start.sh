#!/bin/bash
# Startup script for RAHI Voice Assistant API

echo "Starting RAHI Voice Assistant API..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d "env" ]; then
    source env/bin/activate
fi

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

echo "RAHI Voice Assistant API stopped."