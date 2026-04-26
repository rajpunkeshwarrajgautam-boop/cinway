import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

const tvGenreMap: Record<number, string> = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
};

async function main() {
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY is required. Set it in .env');
    process.exit(1);
  }

  console.log('Fetching popular TV shows from TMDB...');

  const pages = [1, 2, 3];
  const allShows: any[] = [];

  for (const page of pages) {
    const response = await axios.get(`${TMDB_BASE}/tv/popular`, {
      params: { api_key: TMDB_API_KEY, page },
    });
    allShows.push(...response.data.results);
  }

  console.log(`Found ${allShows.length} TV shows. Seeding...`);

  for (const show of allShows) {
    if (!show.poster_path) continue;

    const genreName = show.genre_ids?.length > 0
      ? tvGenreMap[show.genre_ids[0]] || 'Drama'
      : 'Drama';

    try {
      const details = await axios.get(`${TMDB_BASE}/tv/${show.id}`, {
        params: { api_key: TMDB_API_KEY },
      });

      await prisma.tvShow.upsert({
        where: { tmdbId: show.id },
        update: {},
        create: {
          tmdbId: show.id,
          name: show.name || show.original_name,
          overview: show.overview || 'No overview available.',
          posterUrl: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
          backdropUrl: show.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
            : null,
          genre: genreName,
          seasons: details.data.number_of_seasons || 1,
          firstAirDate: show.first_air_date || null,
          rating: show.vote_average || null,
        },
      });
      console.log(`Added: ${show.name}`);
    } catch (err) {
      console.log(`Skipped: ${show.name} (error fetching details)`);
    }
  }

  console.log('TV Show seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
