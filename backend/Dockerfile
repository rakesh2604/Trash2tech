# Build with context = backend directory (from repo root: docker build -f backend/Dockerfile backend/)
# Or from backend/: docker build -t ewaste-api .
FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./
COPY tsconfig.docker.json ./tsconfig.json

RUN npm install -g npm@10

FROM base AS deps
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts

FROM deps AS build
COPY . .
# Use standalone tsconfig so build works without monorepo tsconfig.base.json
COPY tsconfig.docker.json ./tsconfig.json
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

RUN npm install --only=production --ignore-scripts

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/v1/health || exit 1

CMD ["node", "dist/main.js"]
