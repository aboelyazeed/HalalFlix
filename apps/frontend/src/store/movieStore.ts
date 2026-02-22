import { create } from "zustand";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string | null;
  duration: number;
  releaseYear: number;
  type: string;
  ageRating: string;
  isFeatured: boolean;
  isNewRelease: boolean;
  genres: Array<{ id: string; name: string; slug: string }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  movies: Movie[];
}

interface MovieState {
  featured: Movie | null;
  categories: Category[];
  searchResults: Movie[];
  isLoading: boolean;
  isSearching: boolean;

  setHomeFeed: (featured: Movie | null, categories: Category[]) => void;
  setSearchResults: (results: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  setSearching: (searching: boolean) => void;
  clearSearch: () => void;
}

export const useMovieStore = create<MovieState>((set) => ({
  featured: null,
  categories: [],
  searchResults: [],
  isLoading: false,
  isSearching: false,

  setHomeFeed: (featured, categories) =>
    set({ featured, categories, isLoading: false }),
  setSearchResults: (searchResults) =>
    set({ searchResults, isSearching: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setSearching: (isSearching) => set({ isSearching }),
  clearSearch: () => set({ searchResults: [], isSearching: false }),
}));
