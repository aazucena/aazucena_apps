FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Postgres and curl for diagnostics
RUN apt-get update && apt-get install -y libpq-dev gcc curl && rm -rf /var/lib/apt/lists/*

# Build context = monorepo root (set in compose.yml and Railway root directory)
COPY services/intel-engine/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY services/intel-engine/ .

# Bake knowledge corpus into the image for Railway (no volume mounts in production)
COPY docs/ /app/data/docs/

EXPOSE 3003

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-3003}"]
