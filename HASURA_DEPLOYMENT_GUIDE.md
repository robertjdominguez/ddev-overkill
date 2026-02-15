# Personal Site with Hasura Backend - Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Render.com                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Docker Compose                    │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │    │
│  │  │   Postgres  │  │   Hasura    │  │   Nginx   │  │    │
│  │  │    ( :5432) │◄─┤  ( :8080)   │  │  ( :80)   │  │    │
│  │  │             │  │   GraphQL   │◄─┤  SPA + API │  │    │
│  │  └─────────────┘  └─────────────┘  └───────────┘  │    │
│  │                                              │        │
│  │  ┌─────────────────────────────────────────┐ │        │
│  │  │     Vite React App (served by Nginx)    │ │        │
│  │  │     Queries Hasura GraphQL for content   │ │        │
│  │  └─────────────────────────────────────────┘ │        │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Files in this setup

```
deploy/
├── docker-compose.yml          # Main orchestration
├── .env                        # Environment variables (create)
├── hasura/
│   ├── config.yaml            # Hasura CLI config
│   ├── metadata/
│   │   └── tables/
│   │       ├── public_posts.yaml
│   │       └── public_projects.yaml
│   └── seeds/
│       └── 01_posts.sql       # Seed data from markdown
├── nginx/
│   └── default.conf           # Nginx config (SPA + GraphQL proxy)
├── scripts/
│   └── ingest-markdown.js     # Script to convert markdown → SQL
├── frontend/
│   └── Dockerfile            # Frontend build
└── render.yaml               # Render.com deployment config
```

---

## 1. Environment Setup (.env)

Create `deploy/.env`:

```bash
# Hasura
HASURA_GRAPHQL_ADMIN_SECRET=your-super-secret-admin-key
HASURA_GRAPHQL_JWT_SECRET=your-jwt-secret-key
HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:postgrespassword@postgres:5432/mysite
HASURA_GRAPHQL_ENABLE_CONSOLE=true

# App
VITE_HASURA_GRAPHQL_URL=http://localhost/graphql/v1

# Postgres
POSTGRES_PASSWORD=postgrespassword
POSTGRES_DB=mysite
```

---

## 2. Docker Compose (docker-compose.yml)

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: mysite-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Hasura GraphQL Engine
  hasura:
    image: hasura/graphql-engine:v2.42.0
    container_name: mysite-hasura
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      HASURA_GRAPHQL_DATABASE_URL: ${HASURA_GRAPHQL_DATABASE_URL}
      HASURA_GRAPHQL_ADMIN_SECRET: ${HASURA_GRAPHQL_ADMIN_SECRET}
      HASURA_GRAPHQL_JWT_SECRET: ${HASURA_GRAPHQL_JWT_SECRET}
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
      # Uncomment for action/remote schema support:
      # HASURA_GRAPHQL_EXTERNAL_URL: https://your-domain.com
    volumes:
      - ./hasura/metadata:/hasura/metadata
      - ./hasura/seeds:/hasura/seeds
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/healthz"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Nginx (serves SPA + proxies GraphQL)
  nginx:
    image: nginx:alpine
    container_name: mysite-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      # - "443:443"  # Uncomment for HTTPS
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - frontend_build:/usr/share/nginx/html:ro
    depends_on:
      - hasura
    profiles:
      - production

  # Seed script (run once to ingest markdown)
  seed:
    image: node:20-alpine
    container_name: mysite-seed
    working_dir: /app
    volumes:
      - ./scripts:/app
      - ../../posts:/posts:ro    # Mount your markdown posts
    command: ["node", "ingest-markdown.js"]
    env_file: .env
    profiles:
      - seed
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  frontend_build:

networks:
  default:
    name: mysite-network
```

---

## 3. Nginx Configuration (nginx/default.conf)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # GraphQL API proxy
    location /graphql/v1/ {
        proxy_pass http://hasura:8080/v1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Hasura admin secret (for client queries - in production use JWT)
        proxy_set_header X-Hasura-Admin-Secret ${HASURA_GRAPHQL_ADMIN_SECRET};
    }

    # Hasura console (optional - disable in production)
    location /console/ {
        proxy_pass http://hasura:8080/console/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # SPA routing - serve index.html for all non-file routes
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

---

## 4. Hasura Tables Metadata (hasura/metadata/tables/)

### public_posts.yaml

```yaml
table:
  schema: public
  name: posts
configuration:
  custom_root_fields:
    select: posts
    select_by_key: post_by_slug
  column_config:
    slug:
      custom_name: slug
    created_at:
      custom_name: createdAt
objectRelationships:
  - name: author
    using:
      foreign_key_constraint_on:
        column: author_id
        table:
          schema: public
          name: authors
arrayRelationships: []
insert_permissions:
  - role: public
    permission:
      check: {}
      set:
        created_at: now()
update_permissions:
  - role: public
    permission:
      filter: {}
      set:
        updated_at: now()
delete_permissions:
  - role: public
    permission:
      filter: {}
select_permissions:
  - role: public
    permission:
      columns:
        - id
        - title
        - slug
        - hook
        - body
        - image
        - created_at
        - updated_at
      filter: {}
```

### public_projects.yaml

```yaml
table:
  schema: public
  name: projects
configuration:
  custom_root_fields:
    select: projects
    select_by_key: project_by_slug
column_config:
  slug:
    custom_name: slug
  created_at:
    custom_name: createdAt
objectRelationships: []
arrayRelationships: []
insert_permissions:
  - role: public
    permission:
      check: {}
update_permissions:
  - role: public
    permission:
      filter: {}
delete_permissions:
  - role: public
    permission:
      filter: {}
select_permissions:
  - role: public
    permission:
      columns:
        - id
        - title
        - slug
        - description
        - url
        - image
        - tech_stack
        - created_at
      filter: {}
```

---

## 5. Markdown Ingestion Script (scripts/ingest-markdown.js)

```javascript
/**
 * Ingests markdown files from /posts into Hasura Postgres
 * 
 * Usage: 
 *   node ingest-markdown.js
 * 
 * Environment:
 *   HASURA_GRAPHQL_ENDPOINT - Hasura GraphQL endpoint
 *   HASURA_ADMIN_SECRET - Hasura admin secret
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = process.env.POSTS_DIR || '/posts';
const HASURA_ENDPOINT = process.env.HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql';
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || 'myadminsecret';

const POSTS_TABLE = 'posts';
const PROJECTS_TABLE = 'projects';

// SQL fragments for upsert
const upsertPost = `
  INSERT INTO posts (slug, title, hook, body, image, created_at, updated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    hook = EXCLUDED.hook,
    body = EXCLUDED.body,
    image = EXCLUDED.image,
    updated_at = EXCLUDED.updated_at
`;

const upsertProject = `
  INSERT INTO projects (slug, title, description, url, image, tech_stack, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    url = EXCLUDED.url,
    image = EXCLUDED.image,
    tech_stack = EXCLUDED.tech_stack
`;

async function queryHasura(query, variables) {
  const response = await fetch(HASURA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

async function executeSql(sql, values) {
  const mutation = `
    mutation ExecuteSQL($sql: String!, $args: [String!]!) {
      run_sql(sql: $sql, args: $args) {
        affected_rows
        returning {
          slug
        }
      }
    }
  `;
  return queryHasura(mutation, { sql, args: values });
}

function parseMarkdownFiles(dir, tableType) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  
  return files.map(filename => {
    const filepath = path.join(dir, filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    const { data, content: body } = matter(content);
    
    const slug = data.slug || filename.replace('.md', '');
    
    return {
      slug,
      title: data.title || 'Untitled',
      hook: data.hook || data.description || '',
      body: body,
      image: data.image || null,
      created_at: data.created_at || data.date || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      // Project-specific
      url: data.url || data.link || null,
      tech_stack: data.tech_stack || data.stack || null,
    };
  });
}

async function ingestPosts() {
  const posts = parseMarkdownFiles(POSTS_DIR, 'post');
  
  console.log(`Found ${posts.length} posts to ingest`);
  
  for (const post of posts) {
    const values = [
      post.slug,
      post.title,
      post.hook,
      post.body,
      post.image,
      post.created_at,
      post.updated_at,
    ];
    
    try {
      await executeSql(upsertPost, values);
      console.log(`✓ Ingested: ${post.title}`);
    } catch (err) {
      console.error(`✗ Failed: ${post.title}`, err.message);
    }
  }
}

async function main() {
  console.log('Starting markdown ingestion...');
  console.log(`Posts directory: ${POSTS_DIR}`);
  console.log(`Hasura endpoint: ${HASURA_ENDPOINT}`);
  
  // Wait for Hasura to be ready
  let retries = 10;
  while (retries > 0) {
    try {
      await queryHasura('{ __typename }', {});
      console.log('Connected to Hasura');
      break;
    } catch {
      retries--;
      console.log(`Waiting for Hasura... (${retries} retries left)`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  await ingestPosts();
  console.log('Done!');
}

main().catch(console.error);
```

---

## 6. Hasura SQL Schema (hasura/seeds/01_schema.sql)

```sql
-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    hook TEXT,
    body TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table  
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    image TEXT,
    tech_stack TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Enable GraphQL
COMMENT ON TABLE posts IS E'@graphql({"order_by": {"created_at": "desc"}})' ;
COMMENT ON TABLE projects IS E'@graphql({"order_by": {"created_at": "desc"}})' ;
```

---

## 7. Frontend Dockerfile (frontend/Dockerfile)

```dockerfile
# Build stage
FROM oven/bun:1.2.2 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build args for Hasura URL
ARG VITE_HASURA_GRAPHQL_URL
ENV VITE_HASURA_GRAPHQL_URL=$VITE_HASURA_GRAPHQL_URL

# Build the app
RUN bun run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 8. Render.com Deployment (render.yaml)

```yaml
services:
  - type: Web
    name: mysite
    env: docker
    region: oregon
    plan: starter
    dockerComposePath: deploy/docker-compose.yml
    dockerComposeVars:
      - key: POSTGRES_PASSWORD
        sync: false
      - key: HASURA_GRAPHQL_ADMIN_SECRET
        sync: false
      - key: HASURA_GRAPHQL_JWT_SECRET
        sync: false
    disk:
      name: postgres
      mountPath: /var/lib/postgresql/data
      sizeGB: 1

# Alternative: Separate services (recommended for production)
# See: https://render.com/docs/docker
```

---

## 9. Frontend GraphQL Integration

### Install Apollo Client

```bash
bun add @apollo/client graphql
```

### Create GraphQL Client (src/lib/apollo.ts)

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_HASURA_GRAPHQL_URL || '/graphql/v1',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
```

### GraphQL Queries (src/graphql/queries.ts)

```typescript
import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts {
    posts(order_by: { created_at: desc }) {
      id
      slug
      title
      hook
      image
      created_at
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    posts(where: { slug: { _eq: $slug } }) {
      id
      slug
      title
      hook
      body
      image
      created_at
      updated_at
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    projects(order_by: { created_at: desc }) {
      id
      slug
      title
      description
      url
      image
      tech_stack
    }
  }
`;
```

### Posts Page Component (src/pages/Posts.tsx)

```typescript
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../graphql/queries';
import { Link, Card, Text, Image, Group, Badge } from '@mantine/core';

export function PostsPage() {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Posts</h1>
      {data.posts.map((post: any) => (
        <Card key={post.id} shadow="sm" padding="lg" radius="md" withBorder mb="md">
          <Card.Section>
            {post.image && <Image src={post.image} height={160} alt={post.title} />}
          </Card.Section>
          
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>{post.title}</Text>
            <Badge>{new Date(post.created_at).toLocaleDateString()}</Badge>
          </Group>
          
          <Text size="sm" c="dimmed" lineClamp={2}>
            {post.hook}
          </Text>
          
          <Link href={`/posts/${post.slug}`} mt="md" component={Link}>
            Read more →
          </Link>
        </Card>
      ))}
    </div>
  );
}
```

---

## 10. Deployment Commands

### Local Development

```bash
# Start all services
cd deploy
docker compose up -d

# Run seed to ingest markdown
docker compose --profile seed up seed

# View logs
docker compose logs -f

# Stop everything
docker compose down
```

### Deploy to Render.com

```bash
# Install render CLI
brew install render/render/cli

# Authenticate
render auth login

# Deploy
render yaml deploy render.yaml

# Or use the dashboard to connect your GitHub repo
```

---

## 11. Workflow After Deployment

### Writing a New Post

1. **Write in Markdown** (your preferred workflow):
```bash
# Edit locally
vim posts/new-post.md
git add posts/new-post.md
git commit -m "Add new post"
git push
```

2. **Re-ingest to Hasura** (on deployment or manually):
```bash
# Trigger re-seed (add webhook or run manually)
docker compose --profile seed up seed
```

### Alternative: GitHub Actions for Auto-Deploy + Re-Seed

```yaml
name: Deploy and Seed
on:
  push:
    paths:
      - 'posts/**'
      - 'projects/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Render
        run: |
          curl -X PUT "$RENDER_DEPLOY_HOOK"
      
      - name: Wait for deploy
        run: sleep 30
      
      - name: Re-seed Hasura
        run: |
          docker compose --profile seed up seed
```

---

## Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| Database | PostgreSQL 15 | Stores posts, projects |
| API | Hasura v2 | GraphQL over Postgres |
| Frontend | Vite + React + Mantine | Your site UI |
| Server | Nginx | Serves SPA + proxies GraphQL |
| Deployment | Render.com | Hosting |

This gives you:
- **Markdown-first DX** - Keep writing in markdown files
- **GraphQL API** - Type-safe queries from frontend
- **Hasura Admin** - Web UI to manage content manually if needed
- **Single deployment** - Docker Compose runs everything
- **Overengineered** ✓ - Plenty of moving parts to learn from!
