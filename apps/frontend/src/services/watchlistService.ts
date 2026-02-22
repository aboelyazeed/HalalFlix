import { api } from "./api";

export const watchlistService = {
  getWatchlist: async (profileId: string) => {
    const response = await api.get<any>(`/watchlist?profileId=${profileId}`);
    return response.data;
  },

  addToWatchlist: async (profileId: string, movieId: string) => {
    const response = await api.post<any>("/watchlist", { profileId, movieId });
    return response.data;
  },

  removeFromWatchlist: async (profileId: string, movieId: string) => {
    const response = await api.post<any>("/watchlist/remove", {
      profileId,
      movieId,
    });
    return response.data;
  },
};
