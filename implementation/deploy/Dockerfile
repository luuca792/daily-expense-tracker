# Sổ chi tiêu: Node builds the static site, nginx serves it. Build context: implementation/
#   docker build -f deploy/Dockerfile -t luuca792/so-chi-tieu .
FROM node:22-alpine AS build
WORKDIR /app
COPY app/package.json app/package-lock.json ./
RUN npm ci
COPY app/ ./
# unit tests run in the build: a failing rule or migration never ships (plan §5 release rule)
RUN npx vitest run && npm run build

FROM nginx:1.27-alpine
LABEL org.opencontainers.image.title="so-chi-tieu"
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
