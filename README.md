# site-overkill

It's a personal blog. It did not need Postgres with pgvector, a Hasura GraphQL API, an Express Actions service wired to OpenAI for semantic search, S3-compatible object storage via MinIO, and a React frontend. But here we are.

The name says it all. Markdown files go in, get ingested into a database at seed time, and come out the other end as a fully queryable GraphQL API with vector-based "find me something similar" search. Could I have just used a static site generator? Absolutely. Did I? Absolutely not.

## How it all fits together

```mermaid
flowchart LR
    subgraph Backend
        pg[(Postgres pgvector)]
        minio[(MinIO)]
        hasura[Hasura]
        actions[Actions]
        openai([OpenAI])
    end

    subgraph Frontend
        vite[React Vite]
    end

    pg --> hasura
    hasura --> vite
    hasura --> actions
    actions --> openai
    actions --> pg
    actions --> minio
```

## Prerequisites

- Docker & Docker Compose
- [Bun](https://bun.sh)
- [just](https://github.com/casey/just)
- An [OpenAI API key](https://platform.openai.com/api-keys) (for semantic search)

## Getting started

```sh
cp .env.example .env
# Fill in your OPENAI_API_KEY and adjust any other values
just dev
```

That's it. One command builds the seed image, spins up the backend (Postgres, Hasura, MinIO, Actions), and launches the Vite dev server. Go grab a coffee while Docker does its thing.

## Commands

Everything runs through [just](https://github.com/casey/just) because typing `docker compose up -d && cd frontend && bun install && bun dev` every morning is not for me.

| Command | What it does |
|---|---|
| `just dev` | Start everything (backend + frontend) |
| `just backend` | Postgres, Hasura, MinIO, Actions, and seed containers |
| `just frontend` | Vite dev server only |
| `just down` | Stop all containers |
| `just reseed` | Rebuild seed image and re-ingest posts |
| `just actions` | Run Actions service locally with hot-reload |
| `just generate-embeddings` | Generate OpenAI embeddings for all posts |
| `just reload-metadata` | Reload Hasura metadata from disk |
| `just logs` | Tail Hasura logs |
| `just minio-console` | Open MinIO console in browser |

## Services

| Service | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Hasura Console | http://localhost:8080/console |
| GraphQL endpoint | http://localhost:8080/v1/graphql |
| MinIO Console | http://localhost:9001 |
| Actions service | http://localhost:3001 |

## Project structure

```
├── frontend/          React + Vite + Tailwind + Mantine
├── hasura/
│   ├── metadata/      Hasura metadata (tracked tables, permissions, actions)
│   ├── migrations/    SQL migrations
│   └── actions/       Express service (embeddings, search, image proxy)
├── posts/             Markdown blog posts (ingested at seed time)
├── projects/          Markdown project pages
├── assets/            Static images uploaded to MinIO
├── scripts/           Seed and ingestion scripts
├── nginx/             Nginx config for production
└── deploy/            Production docker-compose
```

## Environment

Copy `.env.example` to `.env` and fill in your values. The example file has everything you need with placeholder defaults. The only one you actually have to go get is `OPENAI_API_KEY` — the rest work out of the box for local dev.
