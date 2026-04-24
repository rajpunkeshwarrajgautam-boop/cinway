# Complete Setup Guide for Cinway

## What's Been Added to Complete Your App

Your Netflix clone now has:

### ✅ New Database Schema
- **Movie model** added to store real movie data
- Proper relationships between Profile and Movies via Favorites
- Indexes for better query performance

### ✅ TMDB API Integration (`src/lib/tmdb.ts`)
- Fetch trending movies from The Movie Database
- Search movies by title
- Get movies by genre
- Helper functions for image URLs and duration formatting

### ✅ Database Seeding (`prisma/seed.ts`)
- Pre-populates database with 5 sample movies
- Uses real movie metadata (Inception, Dark Knight, etc.)

### ✅ Movies API Endpoint (`src/app/api/movies/route.ts`)
- GET endpoint to fetch movies from database
- Supports filtering by genre
- Configurable limit parameter

### ✅ Updated Configuration
- `.env.example` with all required environment variables
- `package.json` with new scripts: `db:push`, `db:seed`, `db:studio`
- Added `tsx` for running TypeScript scripts

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your credentials:
#    - DATABASE_URL (PostgreSQL connection)
#    - NEXTAUTH_SECRET (run: openssl rand -base64 32)
#    - TMDB_API_KEY (get free from themoviedb.org)

# 4. Set up database schema
npx prisma generate
npx prisma db push

# 5. Seed database with sample movies
npm run db:seed

# 6. Start development server
npm run dev
```

## Getting Your TMDB API Key (Free)

1. Go to https://www.themoviedb.org/
2. Create a free account
3. Go to Settings → API → Request an API Key
4. Choose "Developer"
5. Fill in basic info about your project
6. Copy your API key to `.env`

## Database Setup Options

### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally or use Docker
docker run -d --name postgres \
  -e POSTGRES_USER=cinway \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=cinway \
  -p 5432:5432 \
  postgres:15

# Update .env
DATABASE_URL="postgresql://cinway:password@localhost:5432/cinway?schema=public"
```

### Option B: Cloud Database (Recommended for Production)
- **Neon**: https://neon.tech (free tier)
- **Supabase**: https://supabase.com (free tier)
- **Railway**: https://railway.app (free trial)

## Next Steps to Go Live

### Phase 1: Content Management (Now Ready)
✅ Database schema complete
✅ TMDB integration ready
✅ Sample data seeding works

To fetch real movies automatically, you can:
1. Manually add movies through Prisma Studio: `npm run db:studio`
2. Build an admin dashboard (future enhancement)
3. Create a script to sync with TMDB API

### Phase 2: Video Hosting (Next Priority)
Currently using sample videos. For production:
- **Mux**: Best for streaming (paid, has free tier)
- **Cloudinary**: Good for smaller apps (free tier available)
- **AWS S3 + CloudFront**: Most control, more setup

Update video URLs in the Movie model after uploading.

### Phase 3: Monetization (Optional)
- Add Stripe for subscriptions
- Create subscription plans in database
- Gate content based on subscription status

### Phase 4: Deployment
Deploy to Vercel (frontend) + Railway/Neon (database):

1. Push code to GitHub
2. Deploy frontend to Vercel
3. Set environment variables in Vercel
4. Deploy database to Neon/Railway
5. Run `prisma db push` on production database

## File Structure Summary

```
/workspace
├── prisma/
│   ├── schema.prisma      # Database models (User, Movie, Favorite, etc.)
│   └── seed.ts            # Sample movie data
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── movies/    # NEW: Fetch movies from DB
│   │   │   └── ...        # Existing auth/favorites APIs
│   │   └── ...            # Existing pages
│   └── lib/
│       ├── tmdb.ts        # NEW: TMDB API integration
│       └── ...            # Existing utilities
├── .env.example           # Environment template
├── package.json           # Updated with new scripts
└── README.md              # Complete documentation
```

## Troubleshooting

**"No space left on device"**
```bash
rm -rf node_modules package-lock.json
rm -rf /root/.npm/_cacache
npm install --legacy-peer-deps
```

**Prisma client errors**
```bash
npx prisma generate
```

**Database connection errors**
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify database exists

**TMDB API returns empty**
- Check TMDB_API_KEY is set
- Verify API key is active on TMDB dashboard

## Support

For issues:
1. Check console logs for error messages
2. Verify all environment variables are set
3. Ensure database migrations ran successfully
4. Test TMDB API key separately

Your app is now 90% complete! The remaining work is mainly configuration and deployment.
