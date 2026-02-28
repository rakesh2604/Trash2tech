# Build from repo root: docker build -f backend/Dockerfile .
FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* tsconfig.base.json ./
COPY backend/package.json ./backend/

RUN npm install -g npm@10

FROM base AS deps
RUN npm ci --ignore-scripts || npm install --ignore-scripts

FROM base AS build
COPY . .
RUN npm run build:api

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build /app/backend/dist ./dist
COPY backend/package.json ./

RUN npm install --only=production --ignore-scripts

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/v1/health || exit 1

CMD ["node", "dist/main.js"]
