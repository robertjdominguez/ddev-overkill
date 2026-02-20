FROM oven/bun:1-alpine

RUN apk add --no-cache curl

RUN addgroup -g 1001 -S bunuser && \
    adduser -S bunuser -u 1001

WORKDIR /app

COPY --chown=bunuser:bunuser package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY --chown=bunuser:bunuser . .

USER bunuser

EXPOSE 3001

CMD ["bun", "run", "src/server.ts"]
