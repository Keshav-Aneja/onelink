FROM oven/bun:latest AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock turbo.json ./
COPY apps/backend ./apps/backend
COPY packages ./packages

RUN bun install
RUN bun run turbo build --filter=backend


FROM oven/bun:latest

COPY --from=builder /app/apps/backend/dist ./dist
COPY apps/backend/package.json ./package.json

EXPOSE 8080

CMD ["bun","run","start","--cwd","dist"]
