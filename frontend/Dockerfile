# ── Etapa 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Recibe la URL del backend como argumento de build (default: localhost)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Etapa 2: servidor ────────────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
