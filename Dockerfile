# Dockerfile para cliente (React) - multi-stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Opcional: copiar nginx.conf si querés rewrites / SPA fallback
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
