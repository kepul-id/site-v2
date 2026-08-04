# Build stage
# Debian-based (not alpine) so sharp's prebuilt binaries work for astro:assets
FROM node:22-slim AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

# Cache dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Where catalog.astro pulls products from at build time.
# CI can use the default; builds running on the server itself must pass the
# internal address (http://kepul-backend:8000) because the droplet cannot reach
# its own public IP.
ARG API_BASE_URL=https://api.kepul.id
ENV API_BASE_URL=$API_BASE_URL

RUN pnpm build

# =================================================================
# Production stage - static files served by nginx
# =================================================================
FROM nginx:1.27-alpine AS prod
COPY build/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
