#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate
echo "Starting FastAPI backend server at http://127.0.0.1:8000 ..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
