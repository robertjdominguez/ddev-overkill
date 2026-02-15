# Build stage
FROM oven/bun:1.2.2 AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .

# Build with Hasura URL (passed at runtime or use default)
ARG VITE_HASURA_GRAPHQL_URL=/graphql/v1
ENV VITE_HASURA_GRAPHQL_URL=$VITE_HASURA_GRAPHQL_URL

RUN bun run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
