#!/usr/bin/env bash
# Start the FastAPI application with Uvicorn
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}