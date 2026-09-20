# Stage 1: Build React App
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Stage 2: Serve with Production Nginx + SSL
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx_docker.conf /etc/nginx/conf.d/default.conf
COPY ssl/fullchain.pem /etc/nginx/ssl/fullchain.pem
COPY ssl/privkey.pem /etc/nginx/ssl/privkey.pem

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
