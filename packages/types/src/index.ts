// ============================================================
// Halalflix Shared Types
// ============================================================

// --- Auth ---
export interface SignUpRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

// --- User ---
export interface User {
  id: string;
  email: string;
  subscriptionStatus: "trial" | "active" | "canceled" | "expired";
  subscriptionPlan: "monthly" | "annual" | null;
  createdAt: string;
}

// --- Profile ---
export interface Profile {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
  createdAt: string;
}

export interface CreateProfileRequest {
  name: string;
  avatarUrl: string;
  isKids: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  avatarUrl?: string;
  isKids?: boolean;
}

// --- Genre ---
export interface Genre {
  id: string;
  name: string;
  slug: string;
}

// --- Movie / Series ---
export type ContentType = "movie" | "series";
export type AgeRating = "G" | "PG" | "PG-13" | "Family";

export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string | null;
  duration: number; // minutes
  releaseYear: number;
  type: ContentType;
  ageRating: AgeRating;
  isFeatured: boolean;
  isNewRelease: boolean;
  genres: Genre[];
  createdAt: string;
}

export interface Episode {
  id: string;
  movieId: string;
  season: number;
  episodeNumber: number;
  title: string;
  synopsis: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
}

// --- Category (Home Feed Rows) ---
export interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  movies: Movie[];
}

// --- Watchlist ---
export interface WatchlistItem {
  id: string;
  profileId: string;
  movieId: string;
  movie: Movie;
  createdAt: string;
}

// --- API Envelope ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

// --- Home Feed ---
export interface HomeFeed {
  featured: Movie;
  categories: Category[];
}
