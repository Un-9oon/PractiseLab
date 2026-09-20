#!/bin/bash
# NexusCorp Pentest Target — Docker + Nginx HTTPS One-Command Deployment Script

echo "=========================================================="
echo "🚀 Building Docker Image for Nginx HTTPS Pentest App..."
echo "=========================================================="

cd /home/we/Downloads/cybersec-pentest-lab

# 1. Generate SSL Certificate if missing
if [ ! -f ssl/fullchain.pem ]; then
    echo "📜 Generating Self-Signed SSL Certificate..."
    mkdir -p ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout ssl/privkey.pem \
      -out ssl/fullchain.pem \
      -subj "/C=PK/ST=Punjab/L=Lahore/O=NexusCorp Security/OU=Pentest Lab/CN=localhost" \
      -addext "subjectAltName=IP:127.0.0.1,DNS:localhost"
fi

# 2. Build Docker Container
echo "📦 Building Docker Image..."
docker build -t nexuscorp-pentest-app .

# 3. Stop existing container if running
docker stop nexuscorp_pentest_app 2>/dev/null || true
docker rm nexuscorp_pentest_app 2>/dev/null || true

# 4. Run Container on Port 80 and 443
echo "🌐 Launching Nginx HTTPS Docker Container on Ports 80 & 443..."
docker run -d \
  --name nexuscorp_pentest_app \
  -p 80:80 \
  -p 443:443 \
  --restart always \
  nexuscorp-pentest-app

echo ""
echo "=========================================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "----------------------------------------------------------"
echo "🌐 HTTP (Redirects to HTTPS):  http://localhost/"
echo "🔒 HTTPS (TLS 1.2/1.3 Active): https://localhost/"
echo "=========================================================="
