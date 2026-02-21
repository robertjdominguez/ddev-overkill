const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const POSTS_DIR = process.env.POSTS_DIR || '/posts';
const PROJECTS_DIR = process.env.PROJECTS_DIR || '/projects';
const ASSETS_DIR = process.env.ASSETS_DIR || '/assets';
const PGPASSWORD = process.env.PGPASSWORD || 'postgrespassword';

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://minio:9000';
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'minioadmin';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'minioadmin';
const MINIO_BUCKET = process.env.MINIO_BUCKET || 'assets';

const s3 = new S3Client({
  endpoint: MINIO_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

const client = new Client({
  host: process.env.PGHOST || 'postgres',
  port: 5432,
  database: 'mysite',
  user: 'postgres',
  password: PGPASSWORD,
});

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: content };
  }
  
  const frontmatter = match[1];
  const body = match[2];
  const data = {};
  
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });
  
  return { data, body };
}

function parseMarkdownFiles(dir) {
  console.log(`parseMarkdownFiles: checking dir=${dir}`);
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir);
  console.log(`Found ${files.length} files in ${dir}`);
  
  const mdFiles = files.filter(f => f.endsWith('.md'));
  
  return mdFiles.map(filename => {
    const filepath = path.join(dir, filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    const { data, body } = parseFrontmatter(content);
    
    const slug = data.slug || filename.replace('.md', '');
    
    return {
      slug,
      title: data.title || 'Untitled',
      hook: data.hook || data.description || '',
      body: body,
      image: data.image || null,
      created_at: data.created_at || data.date || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      url: data.url || data.link || null,
      tech_stack: data.tech_stack ? data.tech_stack.split(',').map(s => s.trim()) : null,
    };
  });
}

async function upsertPost(client, post) {
  const sql = `
    INSERT INTO posts (slug, title, hook, body, image, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      hook = EXCLUDED.hook,
      body = EXCLUDED.body,
      image = EXCLUDED.image,
      updated_at = EXCLUDED.updated_at
  `;
  await client.query(sql, [
    post.slug,
    post.title,
    post.hook,
    post.body,
    post.image,
    post.created_at,
    post.updated_at,
  ]);
}

async function upsertProject(client, project) {
  const sql = `
    INSERT INTO projects (slug, title, description, url, image, tech_stack, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      url = EXCLUDED.url,
      image = EXCLUDED.image,
      tech_stack = EXCLUDED.tech_stack
  `;
  await client.query(sql, [
    project.slug,
    project.title,
    project.description || project.hook || '',
    project.url,
    project.image,
    project.tech_stack,
    project.created_at,
  ]);
}

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function isLocalPath(img) {
  return img && !img.startsWith('http');
}

async function uploadImageToMinio(localPath) {
  // Strip leading slash to get relative path
  const relativePath = localPath.replace(/^\//, '');
  const filePath = path.join(ASSETS_DIR, relativePath);

  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ Asset not found: ${filePath} — keeping original value`);
    return localPath;
  }

  const body = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  await s3.send(new PutObjectCommand({
    Bucket: MINIO_BUCKET,
    Key: relativePath,
    Body: body,
    ContentType: contentType,
  }));

  const rewrittenUrl = `/storage/${MINIO_BUCKET}/${relativePath}`;
  console.log(`  ↑ Uploaded ${relativePath} → ${rewrittenUrl}`);
  return rewrittenUrl;
}

async function rewriteBodyImages(body) {
  // Match markdown images with local paths: ![alt](/some/path.ext)
  const imgRegex = /!\[([^\]]*)\]\((\/[^)]+\.(jpg|jpeg|png|gif|webp|svg))\)/gi;
  const matches = [...body.matchAll(imgRegex)];
  let result = body;
  for (const match of matches) {
    const localPath = match[2];
    if (isLocalPath(localPath)) {
      const newUrl = await uploadImageToMinio(localPath);
      result = result.replace(match[0], `![${match[1]}](${newUrl})`);
    }
  }
  return result;
}

async function main() {
  console.log('Starting markdown ingestion...');
  console.log(`Posts directory: ${POSTS_DIR}`);
  console.log(`Projects directory: ${PROJECTS_DIR}`);
  console.log(`Assets directory: ${ASSETS_DIR}`);

  await client.connect();
  console.log('Connected to Postgres');

  // Ingest posts
  const posts = parseMarkdownFiles(POSTS_DIR);
  console.log(`Found ${posts.length} posts`);

  for (const post of posts) {
    try {
      if (isLocalPath(post.image)) {
        post.image = await uploadImageToMinio(post.image);
      }
      post.body = await rewriteBodyImages(post.body);
      await upsertPost(client, post);
      console.log(`✓ Post: ${post.title}`);
    } catch (err) {
      console.error(`✗ Failed: ${post.title}`, err.message);
    }
  }

  // Ingest projects
  const projects = parseMarkdownFiles(PROJECTS_DIR);
  console.log(`Found ${projects.length} projects`);

  for (const project of projects) {
    try {
      if (isLocalPath(project.image)) {
        project.image = await uploadImageToMinio(project.image);
      }
      await upsertProject(client, project);
      console.log(`✓ Project: ${project.title}`);
    } catch (err) {
      console.error(`✗ Failed: ${project.title}`, err.message);
    }
  }

  await client.end();
  console.log('Done!');
}

main().catch(console.error);
