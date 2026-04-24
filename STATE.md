# Cinway State Anchor

## Current Status
- **Phase 1 (Database Integration):** Code complete (`src/lib/tmdb.ts`, `prisma/seed.ts`, `.env` placeholders, `.gitignore` updated). 
  - *Pending Action:* User must populate `.env` and run `npx prisma db push` and `npm run db:seed`.
- **Phase 2 (API & Frontend Connection):** Code complete.
  - API Route (`src/app/api/movies/route.ts`) created to return categorized payload.
  - Frontend (`src/app/page.tsx`) refactored to fetch data using `useSWR`.
  - UI Components (`Billboard.tsx`, `MovieRow.tsx`, `MovieCard.tsx`) typed against `@prisma/client` Movie model.

## Tech Stack Rules Active
- Next.js 15 App Router
- Prisma with PostgreSQL
- SWR for client-side fetching
- Premium Dark Glassmorphism for UI
