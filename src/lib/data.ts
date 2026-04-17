export interface Movie {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  genre: string;
  duration: string;
  releaseYear: number;
}

export const MOVIE_DATABASE: Movie[] = [
  {
    id: "m_1",
    title: "Echoes of Eternity",
    description: "In a world where time is a traded commodity, a rogue chronometrist discovers a conspiracy that spans centuries. She must race against her own past to save the future.",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1600",
    genre: "Sci-Fi",
    duration: "2h 15m",
    releaseYear: 2024
  },
  {
    id: "m_2",
    title: "The Silent Summit",
    description: "An elite climbing team attempts the treacherous K2 summit in winter, but they soon realize the deadliest threat isn't the mountain, but something ancient awakened in the ice.",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600",
    genre: "Thriller",
    duration: "1h 58m",
    releaseYear: 2023
  },
  {
    id: "m_3",
    title: "Neon Shadows",
    description: "In neo-Tokyo 2088, a hardboiled AI detective tracks a serial hacker through the rain-soaked cybernetic underworld, questioning his own programmed morality.",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600",
    genre: "Action",
    duration: "2h 30m",
    releaseYear: 2025
  },
  {
    id: "m_4",
    title: "Canvas of Lies",
    description: "A brilliant art forger is caught empty-handed and forced by Interpol to help steal back a priceless Van Gogh from a ruthless cartel baron.",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=1600",
    genre: "Crime",
    duration: "1h 45m",
    releaseYear: 2022
  },
  {
    id: "m_5",
    title: "Starlight Rendezvous",
    description: "Two rival astrophysicists must put aside their differences when they detect an anomalous signal that could unravel the fabric of the cosmos.",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1600",
    genre: "Drama",
    duration: "2h 05m",
    releaseYear: 2024
  }
];

export const getTrendingMovies = () => MOVIE_DATABASE;
export const getActionMovies = () => MOVIE_DATABASE.filter(m => ['Action', 'Sci-Fi', 'Thriller'].includes(m.genre));
export const getDramaMovies = () => MOVIE_DATABASE.filter(m => ['Drama', 'Crime'].includes(m.genre));
export const getHeroMovie = () => MOVIE_DATABASE[0];
