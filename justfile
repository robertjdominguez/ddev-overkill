# Start everything: backend + frontend
dev: backend frontend

# Start Postgres + Hasura + seed
backend: seed-image
    docker compose up -d

# Build the seed image (picks up new posts/projects)
seed-image:
    docker build -t mysite-seed -f Dockerfile.seed .

# Start the Vite dev server
frontend:
    cd frontend && bun install && bun dev

# Lint the frontend
lint:
    cd frontend && bun lint

# Stop all containers
down:
    docker compose down

# Rebuild seed image and re-run the seed container
reseed: seed-image
    docker compose up -d --force-recreate seed

# Reload Hasura metadata from disk
reload-metadata:
    curl -s http://localhost:8080/v1/metadata \
        -H 'x-hasura-admin-secret: myadminsecret' \
        -H 'Content-Type: application/json' \
        -d '{"type":"reload_metadata","args":{}}' | python3 -m json.tool

# Tail Hasura logs
logs:
    docker compose logs -f hasura
