# Sổ chi tiêu: Node builds the static site, nginx serves it. Build context: implementation/
#   docker build -f deploy/Dockerfile --build-arg APP_VERSION=1.0.2 -t luuca792/expense-tracker:1.0.2 .
FROM node:22-alpine AS build
WORKDIR /app
COPY app/package.json app/package-lock.json ./
RUN npm ci
COPY app/ ./
# unit tests run in the build: a failing rule or migration never ships (plan §5 release rule)
RUN npx vitest run && npm run build

FROM nginx:1.27-alpine
# the tag's version (app/package.json); the app itself reads package.json at build time
ARG APP_VERSION=1.0.2
LABEL org.opencontainers.image.title="expense-tracker"
LABEL org.opencontainers.image.version="${APP_VERSION}"
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
