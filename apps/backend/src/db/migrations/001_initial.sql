-- Halalflix MVP Database Schema
-- ==============================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'canceled', 'expired')),
  subscription_plan VARCHAR(20) CHECK (subscription_plan IN ('monthly', 'annual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (max 4 per user, enforced in app layer)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500) DEFAULT '/avatars/default.png',
  is_kids BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Genres
CREATE TABLE IF NOT EXISTS genres (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- Movies / Series
CREATE TABLE IF NOT EXISTS movies (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  synopsis TEXT,
  poster_url VARCHAR(500),
  backdrop_url VARCHAR(500),
  video_url VARCHAR(500),
  duration INTEGER, -- minutes
  release_year INTEGER,
  type VARCHAR(10) DEFAULT 'movie' CHECK (type IN ('movie', 'series')),
  age_rating VARCHAR(10) DEFAULT 'Family' CHECK (age_rating IN ('G', 'PG', 'PG-13', 'Family')),
  is_featured BOOLEAN DEFAULT false,
  is_new_release BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movie-Genre junction
CREATE TABLE IF NOT EXISTS movie_genres (
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

-- Episodes (for series)
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  episode_number INTEGER NOT NULL,
  title VARCHAR(500),
  synopsis TEXT,
  duration INTEGER,
  video_url VARCHAR(500),
  thumbnail_url VARCHAR(500)
);

-- Categories (home feed rows)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Category-Movie junction
CREATE TABLE IF NOT EXISTS category_movies (
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (category_id, movie_id)
);

-- Watchlist
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, movie_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_movie_genres_movie_id ON movie_genres(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_genres_genre_id ON movie_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_episodes_movie_id ON episodes(movie_id);
CREATE INDEX IF NOT EXISTS idx_category_movies_category_id ON category_movies(category_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_profile_id ON watchlist(profile_id);
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_type ON movies(type);
CREATE INDEX IF NOT EXISTS idx_movies_is_featured ON movies(is_featured);
