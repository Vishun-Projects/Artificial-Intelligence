# GRC Platform Monorepo

- Apps: `apps/web` (Next.js), `apps/api` (NestJS)
- Database: PostgreSQL
- Cache/Queue: Redis
- Object Storage: MinIO (S3 compatible)

## Run locally with Docker

1. Copy environment file and adjust secrets:
   - `cp apps/api/.env.example apps/api/.env`
2. Start services:
   - `docker compose up --build`
3. Apply database migrations:
   - `docker compose exec api npx prisma migrate deploy`
   - For dev: `docker compose exec api npx prisma migrate dev --name init`
4. Access:
   - API: http://localhost:3001 (Swagger at /docs)
   - Web: http://localhost:3000
   - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

## Development without Docker

- Install deps at root: `npm i`
- API: `npm run start:dev -w apps/api`
- Web: `npm run dev -w apps/web`

## Notes

- Prisma schema in `apps/api/prisma/schema.prisma`
- Update `apps/api/.env` for local DB if not using Docker