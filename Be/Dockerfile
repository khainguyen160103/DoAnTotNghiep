FROM python:3.9-slim

WORKDIR /app

# Cài đặt dependencies cần thiết để build psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && apt-get clean

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000