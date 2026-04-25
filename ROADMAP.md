# 🚀 Cinway Development Roadmap

## ✅ Completed (MVP)
- [x] Next.js 15 App Router setup
- [x] Authentication (NextAuth + Credentials + OAuth)
- [x] UI Components (Navbar, Billboard, MovieRow, Modal)
- [x] Custom CSS Styling (Glassmorphism, Dark Mode)
- [x] Video Player UI (Controls, Fullscreen)
- [x] Mock Data Implementation

## 🚧 Pending (To reach 100%)
### Phase 1: Database Integration
- [x] Install `axios` and `tsx`
- [x] Update `prisma/schema.prisma` with `Movie` model
- [ ] Run `npx prisma db push`
- [x] Create `src/lib/tmdb.ts` for API helpers
- [x] Create `prisma/seed.ts` to fetch real movies
- [ ] Run `npm run db:seed`

### Phase 2: API & Frontend Connection
- [ ] Create `src/app/api/movies/route.ts`
- [ ] Update `src/app/page.tsx` to use `useSWR` and fetch from API
- [ ] Replace mock data in `Billboard` and `MovieRow` components

### Phase 3: Production Ready
- [ ] Secure Video Streaming (Signed URLs / Mux)
- [ ] Stripe Subscription Integration
- [x] Deploy to Vercel + Neon DB