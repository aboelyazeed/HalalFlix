import { query } from "../../config/database";

export class MoviesService {
  async getHomeFeed() {
    // Get featured movie
    const featured = await query(
      `SELECT m.*, json_agg(json_build_object('id', g.id, 'name', g.name, 'slug', g.slug)) as genres
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       WHERE m.is_featured = true
       GROUP BY m.id
       LIMIT 1`,
    );

    // Get categories with their movies
    const categories = await query(
      `SELECT c.id, c.name, c.slug, c.display_order
       FROM categories c
       ORDER BY c.display_order`,
    );

    const categoriesWithMovies = await Promise.all(
      categories.rows.map(async (cat: any) => {
        const movies = await query(
          `SELECT m.*, json_agg(json_build_object('id', g.id, 'name', g.name, 'slug', g.slug)) as genres
           FROM movies m
           JOIN category_movies cm ON m.id = cm.movie_id
           LEFT JOIN movie_genres mg ON m.id = mg.movie_id
           LEFT JOIN genres g ON mg.genre_id = g.id
           WHERE cm.category_id = $1
           GROUP BY m.id, cm.display_order
           ORDER BY cm.display_order
           LIMIT 20`,
          [cat.id],
        );

        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          displayOrder: cat.display_order,
          movies: movies.rows.map(this.mapMovie),
        };
      }),
    );

    return {
      featured:
        featured.rows.length > 0 ? this.mapMovie(featured.rows[0]) : null,
      categories: categoriesWithMovies,
    };
  }

  async getMovieById(id: string) {
    const result = await query(
      `SELECT m.*, json_agg(DISTINCT jsonb_build_object('id', g.id, 'name', g.name, 'slug', g.slug)) as genres
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       WHERE m.id = $1
       GROUP BY m.id`,
      [id],
    );

    if (result.rows.length === 0) throw new Error("Movie not found");

    const movie = this.mapMovie(result.rows[0]);

    // If series, get episodes
    if (movie.type === "series") {
      const episodes = await query(
        `SELECT id, movie_id, season, episode_number, title, synopsis, duration, video_url, thumbnail_url
         FROM episodes WHERE movie_id = $1 ORDER BY season, episode_number`,
        [id],
      );
      return {
        ...movie,
        episodes: episodes.rows.map((e: any) => ({
          id: e.id,
          movieId: e.movie_id,
          season: e.season,
          episodeNumber: e.episode_number,
          title: e.title,
          synopsis: e.synopsis,
          duration: e.duration,
          videoUrl: e.video_url,
          thumbnailUrl: e.thumbnail_url,
        })),
      };
    }

    return movie;
  }

  async search(q: string) {
    const result = await query(
      `SELECT m.*, json_agg(json_build_object('id', g.id, 'name', g.name, 'slug', g.slug)) as genres
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       WHERE LOWER(m.title) LIKE $1 OR LOWER(m.synopsis) LIKE $1
       GROUP BY m.id
       LIMIT 30`,
      [`%${q.toLowerCase()}%`],
    );
    return result.rows.map(this.mapMovie);
  }

  async getCategories() {
    const result = await query(
      "SELECT id, name, slug FROM genres ORDER BY name",
    );
    return result.rows;
  }

  async getByGenre(genreSlug: string) {
    const result = await query(
      `SELECT m.*, json_agg(json_build_object('id', g.id, 'name', g.name, 'slug', g.slug)) as genres
       FROM movies m
       JOIN movie_genres mg ON m.id = mg.movie_id
       JOIN genres g ON mg.genre_id = g.id
       WHERE g.slug = $1
       GROUP BY m.id
       LIMIT 30`,
      [genreSlug],
    );
    return result.rows.map(this.mapMovie);
  }

  private mapMovie(row: any) {
    return {
      id: row.id,
      title: row.title,
      synopsis: row.synopsis,
      posterUrl: row.poster_url,
      backdropUrl: row.backdrop_url,
      videoUrl: row.video_url,
      duration: row.duration,
      releaseYear: row.release_year,
      type: row.type,
      ageRating: row.age_rating,
      isFeatured: row.is_featured,
      isNewRelease: row.is_new_release,
      genres: row.genres ? row.genres.filter((g: any) => g.id !== null) : [],
      createdAt: row.created_at,
    };
  }
}
