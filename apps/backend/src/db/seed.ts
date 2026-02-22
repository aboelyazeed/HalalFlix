import { v4 as uuidv4 } from "uuid";
import { pool, query } from "../config/database";

async function seed() {
  try {
    console.log("Seeding database...");

    // --- Genres ---
    const genres = [
      { id: uuidv4(), name: "Drama", slug: "drama" },
      { id: uuidv4(), name: "Sci-Fi", slug: "sci-fi" },
      { id: uuidv4(), name: "Family", slug: "family" },
      { id: uuidv4(), name: "Adventure", slug: "adventure" },
      { id: uuidv4(), name: "Documentary", slug: "documentary" },
      { id: uuidv4(), name: "Action", slug: "action" },
      { id: uuidv4(), name: "Thriller", slug: "thriller" },
      { id: uuidv4(), name: "Comedy", slug: "comedy" },
      { id: uuidv4(), name: "Historical", slug: "historical" },
      { id: uuidv4(), name: "Kids", slug: "kids" },
      { id: uuidv4(), name: "Romance", slug: "romance" },
    ];

    for (const g of genres) {
      await query(
        "INSERT INTO genres (id, name, slug) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING",
        [g.id, g.name, g.slug],
      );
    }
    console.log(`  Seeded ${genres.length} genres`);

    // --- Movies ---
    // Sample movie poster URLs (placeholder)
    const samplePoster =
      "https://via.placeholder.com/300x450/1a1a2e/e94560?text=";
    const sampleBackdrop =
      "https://via.placeholder.com/1280x720/16213e/0f3460?text=";
    const sampleVideo =
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

    const movies = [
      {
        id: uuidv4(),
        title: "Cosmic Voyage",
        synopsis:
          "A breathtaking journey through the cosmos, exploring the wonders of creation and the beauty of the universe.",
        duration: 120,
        releaseYear: 2025,
        type: "movie",
        ageRating: "Family",
        isFeatured: true,
        isNewRelease: true,
        genreSlugs: ["sci-fi", "family", "adventure"],
      },
      {
        id: uuidv4(),
        title: "The Desert Chronicles",
        synopsis:
          "In a future where water is scarce and alliances are fragile, a young wanderer must unite the tribes of the deep desert to protect their ancient secrets from off-world invaders.",
        duration: 135,
        releaseYear: 2025,
        type: "movie",
        ageRating: "PG-13",
        isFeatured: false,
        isNewRelease: true,
        genreSlugs: ["sci-fi", "adventure", "action"],
      },
      {
        id: uuidv4(),
        title: "Legacy",
        synopsis:
          "The family returns to Istanbul to claim what is rightfully theirs, but old enemies have been waiting in the shadows. A story of honor, betrayal, and redemption.",
        duration: 45,
        releaseYear: 2024,
        type: "series",
        ageRating: "PG-13",
        isFeatured: false,
        isNewRelease: false,
        genreSlugs: ["drama", "family", "historical"],
      },
      {
        id: uuidv4(),
        title: "CyberRun",
        synopsis:
          "In a digitally enhanced Cairo, a courier uncovers a conspiracy that threatens to disconnect the entire city. High-speed chases and neon-lit battles await.",
        duration: 110,
        releaseYear: 2025,
        type: "movie",
        ageRating: "PG-13",
        isFeatured: false,
        isNewRelease: true,
        genreSlugs: ["action", "thriller", "sci-fi"],
      },
      {
        id: uuidv4(),
        title: "The Portrait",
        synopsis:
          "An artist discovers that her paintings can alter reality. A thoughtful exploration of creativity, faith, and the power of imagination.",
        duration: 98,
        releaseYear: 2024,
        type: "movie",
        ageRating: "Family",
        isFeatured: false,
        isNewRelease: false,
        genreSlugs: ["drama", "family"],
      },
      {
        id: uuidv4(),
        title: "Ottoman Legacy",
        synopsis:
          "A sweeping historical epic that traces the rise and fall of a legendary Ottoman commander.",
        duration: 50,
        releaseYear: 2024,
        type: "series",
        ageRating: "PG-13",
        isFeatured: false,
        isNewRelease: false,
        genreSlugs: ["historical", "drama", "action"],
      },
      {
        id: uuidv4(),
        title: "Ramadan Nights",
        synopsis:
          "Heartwarming stories of family, faith, and togetherness during the holy month of Ramadan across different cities in the Middle East.",
        duration: 40,
        releaseYear: 2025,
        type: "series",
        ageRating: "Family",
        isFeatured: false,
        isNewRelease: true,
        genreSlugs: ["drama", "family", "romance"],
      },
      {
        id: uuidv4(),
        title: "The Last Caravan",
        synopsis:
          "A thrilling adventure following a group of travelers on the ancient Silk Road, facing bandits, sandstorms, and their own inner demons.",
        duration: 125,
        releaseYear: 2024,
        type: "movie",
        ageRating: "PG",
        isFeatured: false,
        isNewRelease: false,
        genreSlugs: ["adventure", "historical", "action"],
      },
      {
        id: uuidv4(),
        title: "Little Explorers",
        synopsis:
          "Join Zara and Yusuf as they discover the wonders of nature, science, and Islamic art in this colorful animated series for children.",
        duration: 22,
        releaseYear: 2025,
        type: "series",
        ageRating: "G",
        isFeatured: false,
        isNewRelease: true,
        genreSlugs: ["kids", "family", "adventure"],
      },
      {
        id: uuidv4(),
        title: "Mountain of Light",
        synopsis:
          "A documentary exploring the history, architecture, and spiritual significance of the most beautiful mosques around the world.",
        duration: 90,
        releaseYear: 2024,
        type: "movie",
        ageRating: "G",
        isFeatured: false,
        isNewRelease: false,
        genreSlugs: ["documentary", "historical"],
      },
      {
        id: uuidv4(),
        title: "The Inventor",
        synopsis:
          "The inspiring true story of a young Muslim inventor who defied expectations and created a groundbreaking device that changed the world.",
        duration: 105,
        releaseYear: 2025,
        type: "movie",
        ageRating: "PG",
        isFeatured: false,
        isNewRelease: true,
        genreSlugs: ["drama", "family"],
      },
      {
        id: uuidv4(),
        title: "Desert Stars",
        synopsis:
          "A family comedy set in the Arabian desert where a group of cousins spend their summer vacation at their grandparents' oasis farm.",
        duration: 95,
        releaseYear: 2024,
        type: "movie",
        ageRating: "Family",
        isFeatured: false,
        isNewRelease: false,
        genreSlugs: ["comedy", "family"],
      },
    ];

    for (const m of movies) {
      const posterUrl = `${samplePoster}${encodeURIComponent(m.title)}`;
      const backdropUrl = `${sampleBackdrop}${encodeURIComponent(m.title)}`;

      await query(
        `INSERT INTO movies (id, title, synopsis, poster_url, backdrop_url, video_url, duration, release_year, type, age_rating, is_featured, is_new_release, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
         ON CONFLICT (id) DO NOTHING`,
        [
          m.id,
          m.title,
          m.synopsis,
          posterUrl,
          backdropUrl,
          sampleVideo,
          m.duration,
          m.releaseYear,
          m.type,
          m.ageRating,
          m.isFeatured,
          m.isNewRelease,
        ],
      );

      // Link genres
      for (const slug of m.genreSlugs) {
        const genre = genres.find((g) => g.slug === slug);
        if (genre) {
          await query(
            "INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [m.id, genre.id],
          );
        }
      }
    }
    console.log(`  Seeded ${movies.length} movies`);

    // --- Episodes for series ---
    const seriesMovies = movies.filter((m) => m.type === "series");
    for (const series of seriesMovies) {
      const episodeCount = series.title === "Little Explorers" ? 10 : 8;
      for (let ep = 1; ep <= episodeCount; ep++) {
        await query(
          `INSERT INTO episodes (id, movie_id, season, episode_number, title, synopsis, duration, video_url, thumbnail_url)
           VALUES ($1, $2, 1, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [
            uuidv4(),
            series.id,
            ep,
            `Episode ${ep}`,
            `${series.title} - Episode ${ep} synopsis`,
            series.duration,
            sampleVideo,
            `${samplePoster}Ep${ep}`,
          ],
        );
      }
    }
    console.log("  Seeded episodes for series");

    // --- Categories (home feed rows) ---
    const categories = [
      {
        id: uuidv4(),
        name: "Trending Now",
        slug: "trending",
        order: 1,
        movieTitles: [
          "Cosmic Voyage",
          "CyberRun",
          "The Desert Chronicles",
          "Legacy",
        ],
      },
      {
        id: uuidv4(),
        name: "Ramadan Specials",
        slug: "ramadan-specials",
        order: 2,
        movieTitles: ["Ramadan Nights", "Mountain of Light", "The Portrait"],
      },
      {
        id: uuidv4(),
        name: "New Releases",
        slug: "new-releases",
        order: 3,
        movieTitles: [
          "The Inventor",
          "Little Explorers",
          "Ramadan Nights",
          "CyberRun",
          "The Desert Chronicles",
        ],
      },
      {
        id: uuidv4(),
        name: "Historical Epics",
        slug: "historical-epics",
        order: 4,
        movieTitles: ["Ottoman Legacy", "The Last Caravan", "Legacy"],
      },
      {
        id: uuidv4(),
        name: "Family Favorites",
        slug: "family-favorites",
        order: 5,
        movieTitles: [
          "Desert Stars",
          "Little Explorers",
          "The Portrait",
          "Cosmic Voyage",
        ],
      },
      {
        id: uuidv4(),
        name: "Kids",
        slug: "kids-content",
        order: 6,
        movieTitles: ["Little Explorers", "Desert Stars"],
      },
      {
        id: uuidv4(),
        name: "Documentaries",
        slug: "documentaries",
        order: 7,
        movieTitles: ["Mountain of Light"],
      },
    ];

    for (const cat of categories) {
      await query(
        "INSERT INTO categories (id, name, slug, display_order) VALUES ($1, $2, $3, $4) ON CONFLICT (slug) DO NOTHING",
        [cat.id, cat.name, cat.slug, cat.order],
      );

      let displayOrder = 0;
      for (const title of cat.movieTitles) {
        const movie = movies.find((m) => m.title === title);
        if (movie) {
          await query(
            "INSERT INTO category_movies (category_id, movie_id, display_order) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
            [cat.id, movie.id, displayOrder++],
          );
        }
      }
    }
    console.log(`  Seeded ${categories.length} categories`);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await pool.end();
  }
}

seed();
