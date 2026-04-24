import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleMovies = [
  {
    tmdbId: 27205,
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/9gk7admal4ZLcnwnCSNPtRtsBTQ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/s3TBrRGB1jav7y4argnzPkNPZKs.jpg',
    genre: 'Sci-Fi',
    duration: '2h 28m',
    releaseYear: 2010,
    rating: 8.8,
  },
  {
    tmdbId: 155,
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/hkBaDkMWbLaf8B1lsWsKX7ZWX3e.jpg',
    genre: 'Action',
    duration: '2h 32m',
    releaseYear: 2008,
    rating: 9.0,
  },
  {
    tmdbId: 13,
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/7c9UVPPiTPltouxRVY6N9uUaHDa.jpg',
    genre: 'Drama',
    duration: '2h 22m',
    releaseYear: 1994,
    rating: 8.8,
  },
  {
    tmdbId: 680,
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    genre: 'Crime',
    duration: '2h 34m',
    releaseYear: 1994,
    rating: 8.9,
  },
  {
    tmdbId: 603,
    title: 'The Matrix',
    description: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
    genre: 'Sci-Fi',
    duration: '2h 16m',
    releaseYear: 1999,
    rating: 8.7,
  },
];

async function main() {
  console.log('Seeding database...');

  for (const movie of sampleMovies) {
    await prisma.movie.upsert({
      where: { tmdbId: movie.tmdbId },
      update: {},
      create: movie,
    });
    console.log(`Added: ${movie.title}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
