# ---------- Stage 1: build ----------
FROM node:18-alpine AS builder
WORKDIR /app

# reducir ruido y limitar memoria si querés
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max_old_space_size=1024

# Copiamos package-lock y package.json para aprovechar cache de docker
COPY package*.json ./
RUN npm ci --production=false --silent

# Copiamos el resto del código
COPY . .

# Si necesitás pasar variables VITE_* en build time, usá ARG + ENV (ver más abajo)
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL

# Ejecutamos build (genera /app/dist por defecto)
RUN npm run build

# ---------- Stage 2: runtime (nginx) ----------
FROM nginx:alpine AS runtime

# copia el build de vite (dist) al directorio que sirve nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# copia la configuración de nginx (opcional, para SPA fallback/proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
