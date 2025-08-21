import os

# Gunicorn configuration file
bind = f"0.0.0.0:{os.environ.get('PORT', 8000)}"
worker_class = "uvicorn.workers.UvicornWorker"
workers = 1