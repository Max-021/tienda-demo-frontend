# Dockerfile (cliente) - multi-stage, optimizado para CI builds
FROM node:18 AS build
WORKDIR /app

# Evitar sourcemaps en producción para ahorrar memoria/tiempo
ENV GENERATE_SOURCEMAP=false
# limitar heap de Node durante build (ajusta 1024 si necesitás)
ENV NODE_OPTIONS=--max_old_space_size=1024

COPY package*.json ./
RUN npm ci --production=false --silent

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
