import { v4 as uuidv4 } from "uuid";
import { query } from "../../config/database";

export class WatchlistService {
  async getWatchlist(profileId: string) {
    const result = await query(
      `SELECT w.id, w.profile_id, w.movie_id, w.created_at,
              m.title, m.synopsis, m.poster_url, m.backdrop_url, m.video_url,
              m.duration, m.release_year, m.type, m.age_rating, m.is_featured, m.is_new_release
       FROM watchlist w
       JOIN movies m ON w.movie_id = m.id
       WHERE w.profile_id = $1
       ORDER BY w.created_at DESC`,
      [profileId],
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      profileId: row.profile_id,
      movieId: row.movie_id,
      createdAt: row.created_at,
      movie: {
        id: row.movie_id,
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
        genres: [],
      },
    }));
  }

  async addToWatchlist(profileId: string, movieId: string) {
    // Check if already in watchlist
    const existing = await query(
      "SELECT id FROM watchlist WHERE profile_id = $1 AND movie_id = $2",
      [profileId, movieId],
    );
    if (existing.rows.length > 0) {
      throw new Error("Already in watchlist");
    }

    const id = uuidv4();
    await query(
      "INSERT INTO watchlist (id, profile_id, movie_id, created_at) VALUES ($1, $2, $3, NOW())",
      [id, profileId, movieId],
    );

    return { id, profileId, movieId, createdAt: new Date().toISOString() };
  }

  async removeFromWatchlist(profileId: string, movieId: string) {
    const result = await query(
      "DELETE FROM watchlist WHERE profile_id = $1 AND movie_id = $2",
      [profileId, movieId],
    );
    if (result.rowCount === 0) {
      throw new Error("Item not in watchlist");
    }
    return { message: "Removed from watchlist" };
  }
}
