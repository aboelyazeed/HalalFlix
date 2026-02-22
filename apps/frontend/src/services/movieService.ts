import { api } from "./api";

export const movieService = {
  getHomeFeed: async () => {
    const response = await api.get<any>("/movies/home");
    return response.data;
  },

  getMovieById: async (id: string) => {
    const response = await api.get<any>(`/movies/${id}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await api.get<any>(
      `/movies/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<any>("/movies/categories");
    return response.data;
  },

  getByGenre: async (slug: string) => {
    const response = await api.get<any>(`/movies/genre/${slug}`);
    return response.data;
  },
};
