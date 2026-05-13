# Joviva Foods — Dokploy Deployment Guide

## Docker Compose

`docker-compose.yml` uses:
- Named volume `backend-data` for persistence
- `env_file: - .env` so Dokploy UI env vars are loaded
- External network `dokploy-network` for Traefik
- No `container_name` set

## Dokploy UI Setup

### 1. Create Project
- Name: `jovivafoods`

### 2. Create Service
- Type: `Docker Compose`
- Name: `jovivafoods`
- Source: GitHub `keepaikk/asapfoods-redesign`
- Branch: `main`
- Compose Path: `docker-compose.yml`

### 3. Environment Variables
- Go to service → Environment
- Add all variables below:

| Variable | Value |
|---|---|
| APP_URL | https://your-domain.com |
| CORS_ORIGIN | https://your-domain.com |
| ADMIN_EMAIL | admin@jovivafoods.com |
| ADMIN_PASSWORD_HASH | $2a$10$replace_with_bcrypt_hash |
| JWT_SECRET | replace_with_random_64_char_string |
| GEMINI_API_KEY | replace_or_leave_empty |
| DB_TYPE | json |
| DATA_DIR | /app/data |
| R2_ENDPOINT | https://862e610ac398171fd05d1a176cfc8d00.r2.cloudflarestorage.com |
| R2_ACCESS_KEY_ID | replace_with_r2_key |
| R2_SECRET_ACCESS_KEY | replace_with_r2_secret |
| R2_BUCKET_NAME | jovivafoods-images |
| R2_PUBLIC_URL | https://pub-5553d0a9ae044f6890bdac1f6fb84803.r2.dev |
| TELEGRAM_BOT_TOKEN | 8593216259:AAEe1oG7_b5w4Q8ybTTrgNWc3MF3F-vRp_4 |
| DATABASE_URL | |
| FIREBASE_PROJECT_ID | |
| FIREBASE_PRIVATE_KEY | |
| FIREBASE_CLIENT_EMAIL | |

### 4. Domains
- Go to service → Domains
- Click dice icon for free `traefik.me` subdomain, or add custom domain
- Frontend container port: `80`
- Backend container port: `3001`
- Toggle HTTPS / LetsEncrypt for custom domains

### 5. Volumes
- Named volume `backend-data` is declared in `docker-compose.yml`
- Dokploy creates it automatically on first deploy
- Verify after deploy: service → Volumes tab

### 6. Deploy
- Click Deploy
- Dokploy builds frontend and backend images
- Starts both services on `dokploy-network`
