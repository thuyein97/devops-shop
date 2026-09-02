FROM node:22-alpine AS dependencies

RUN apk update && apk upgrade && npm install -g npm@latest

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev


FROM node:22-alpine AS production

RUN apk update && apk upgrade && npm install -g npm@latest

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

USER node

EXPOSE 3000

CMD ["node", "src/server.js"]