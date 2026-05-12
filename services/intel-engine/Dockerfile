FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Postgres and curl for diagnostics
RUN apt-get update && apt-get install -y libpq-dev gcc curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-3001}"]
