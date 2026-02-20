@echo off
REM ============================================
REM  ResumeIQ — Start Python AI Service
REM  Run this BEFORE starting the Express server
REM ============================================

echo.
echo  ╔═══════════════════════════════════════════╗
echo  ║  ResumeIQ — Python AI Service Launcher    ║
echo  ╚═══════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo [1/3] Creating Python virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Python is not installed or not in PATH.
        echo Install Python 3.10+ from https://www.python.org/downloads/
        pause
        exit /b 1
    )
) else (
    echo [1/3] Virtual environment found.
)

REM Activate venv
call venv\Scripts\activate.bat

REM Install / update dependencies
echo [2/3] Installing dependencies (first run may take a few minutes)...
pip install -r requirements.txt --quiet

REM Start the service
echo [3/3] Starting AI service on http://127.0.0.1:8000 ...
echo.
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
