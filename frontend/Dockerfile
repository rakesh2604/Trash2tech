# Build from repo root: docker build -f frontend/Dockerfile .
FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* tsconfig.base.json ./
COPY frontend/package.json ./frontend/

RUN npm install -g npm@10

FROM base AS deps
RUN npm ci --ignore-scripts || npm install --ignore-scripts

FROM base AS build
COPY . .
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN npm run build:web

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/frontend/.next/standalone ./
COPY --from=build /app/frontend/.next/static ./frontend/.next/static
COPY --from=build /app/frontend/public ./frontend/public

EXPOSE 3000

CMD ["node", "frontend/server.js"]
