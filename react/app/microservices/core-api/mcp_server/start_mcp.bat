@echo off
echo Starting RAHI MCP Server...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install requirements. Please ensure python and pip are in your PATH.
    pause
    exit /b %errorlevel%
)
python server.py
pause
