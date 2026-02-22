import { create } from "zustand";

interface WatchlistMovie {
  id: string;
  title: string;
  posterUrl: string;
  type: string;
}

interface WatchlistItem {
  id: string;
  profileId: string;
  movieId: string;
  movie: WatchlistMovie;
  createdAt: string;
}

interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;

  setItems: (items: WatchlistItem[]) => void;
  addItem: (item: WatchlistItem) => void;
  removeItem: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],
  isLoading: false,

  setItems: (items) => set({ items, isLoading: false }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  removeItem: (movieId) =>
    set((state) => ({
      items: state.items.filter((i) => i.movieId !== movieId),
    })),
  isInWatchlist: (movieId) => get().items.some((i) => i.movieId === movieId),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ items: [] }),
}));
