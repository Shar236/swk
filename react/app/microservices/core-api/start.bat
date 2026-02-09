@echo off
REM Startup batch file for RAHI Voice Assistant API

echo Starting RAHI Voice Assistant API...

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else if exist "env\Scripts\activate.bat" (
    call env\Scripts\activate.bat
)

REM Install dependencies
pip install -r requirements.txt

REM Start the API server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause