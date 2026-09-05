FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine AS production

# Upgrade system packages (specifically OpenSSL/libcrypto3/libssl3)
RUN apk update && apk upgrade --no-cache && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy application files and node_modules from build stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

USER node

EXPOSE 3000

CMD ["node", "src/server.js"]