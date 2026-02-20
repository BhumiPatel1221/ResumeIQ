#!/bin/bash
# ============================================
#  ResumeIQ — Start Python AI Service
#  Run this BEFORE starting the Express server
# ============================================

set -e
cd "$(dirname "$0")"

echo ""
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║  ResumeIQ — Python AI Service Launcher    ║"
echo "  ╚═══════════════════════════════════════════╝"
echo ""

# Create venv if missing
if [ ! -d "venv" ]; then
    echo "[1/3] Creating Python virtual environment..."
    python3 -m venv venv
else
    echo "[1/3] Virtual environment found."
fi

# Activate
source venv/bin/activate

# Install deps
echo "[2/3] Installing dependencies..."
pip install -r requirements.txt --quiet

# Start
echo "[3/3] Starting AI service on http://127.0.0.1:8000 ..."
echo ""
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
