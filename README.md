# site-overkill

Personal site backed by Postgres, Hasura, and a React (Vite) frontend.

## Prerequisites

- Docker & Docker Compose
- [Bun](https://bun.sh)
- [just](https://github.com/casey/just)

## Quick start

```sh
just dev
```

This builds the seed image, starts the backend containers, and launches the Vite dev server.

## Available commands

| Command | What it does |
|---|---|
| `just dev` | Start everything (backend + frontend) |
| `just backend` | Postgres + Hasura + seed containers only |
| `just frontend` | Vite dev server only |
| `just down` | Stop all containers |
| `just reseed` | Rebuild seed image and re-ingest posts/projects |
| `just reload-metadata` | Reload Hasura metadata from disk |
| `just logs` | Tail Hasura logs |

## Services

| Service | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Hasura Console | http://localhost:8080/console |
| GraphQL endpoint | http://localhost:8080/v1/graphql |

Hasura admin secret: `myadminsecret`

## Environment

All config lives in `.env` at the project root. Key values:

| Variable | Default | Purpose |
|---|---|---|
| `HASURA_GRAPHQL_ADMIN_SECRET` | `myadminsecret` | Hasura admin access |
| `POSTGRES_PASSWORD` | `postgrespassword` | Postgres password |
| `VITE_HASURA_GRAPHQL_URL` | `http://localhost:8080/v1/graphql` | Frontend GraphQL endpoint |
