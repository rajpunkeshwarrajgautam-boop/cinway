# Cinway - Netflix Clone Streaming Platform

A full-stack streaming platform built with Next.js 15, featuring a premium UI/UX with custom CSS.

## Features

✅ **Authentication System**
- Email/password registration & login
- OAuth providers (Google, GitHub)
- Protected routes with NextAuth middleware
- Multiple user profiles per account

✅ **Movie Browsing**
- Dynamic movie data from database
- TMDB API integration for real movie metadata
- Trending, Action, Drama categories
- Search functionality
- Hover effects and animations

✅ **Video Player**
- Custom HTML5 player with controls
- Play/pause, volume, seek, fullscreen
- Auto-hide controls on inactivity

✅ **My List (Favorites)**
- Add/remove movies to favorites
- Per-profile favorite lists
- Real-time updates via SWR

✅ **Info Modal**
- Detailed movie information
- Video preview autoplay
- "More Like This" recommendations

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand, SWR
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- TMDB API key (free from https://www.themoviedb.org/settings/api)

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `TMDB_API_KEY`: Get free API key from TMDB

3. **Set up database**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── movies/        # Movie data endpoint
│   │   └── favorite/      # Favorites management
│   ├── auth/              # Login/Register page
│   ├── profiles/          # Profile selection
│   ├── watch/[movieId]/   # Video player
│   └── search/            # Search page
├── components/
│   ├── layout/Navbar.tsx  # Navigation
│   └── movies/            # Movie components
├── hooks/                 # Custom hooks
└── lib/
    ├── tmdb.ts           # TMDB API integration
    ├── prismadb.ts       # Prisma client
    └── authOptions.ts    # NextAuth config
prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seeding
```

## Database Schema

- **User**: Account with email/password
- **Profile**: User profiles (like Netflix)
- **Movie**: Movie metadata from TMDB
- **Favorite**: Profile-Movie many-to-many relationship

## API Routes

- `GET /api/movies` - Fetch movies (optional genre filter)
- `POST /api/favorite` - Add to favorites
- `DELETE /api/favorite` - Remove from favorites
- `GET /api/favorites` - Get user's favorites

## Deployment

The app can be deployed to Vercel, Railway, or any platform supporting Next.js.

### Environment Variables for Production
- Set `NEXTAUTH_URL` to your production domain
- Use a secure `NEXTAUTH_SECRET`
- Configure production database URL

## Future Enhancements

- [ ] HLS video streaming with Mux/AWS MediaConvert
- [ ] Subscription system with Stripe
- [ ] Admin dashboard for content management
- [ ] User reviews and ratings
- [ ] Continue watching feature
- [ ] Mobile app with React Native

## License

MIT
