import { api } from "./api";

export const profileService = {
  getProfiles: async () => {
    const response = await api.get<any>("/users/profiles");
    return response.data;
  },

  createProfile: async (name: string, avatarUrl: string, isKids: boolean) => {
    const response = await api.post<any>("/users/profiles", {
      name,
      avatarUrl,
      isKids,
    });
    return response.data;
  },

  updateProfile: async (
    id: string,
    data: { name?: string; avatarUrl?: string; isKids?: boolean },
  ) => {
    const response = await api.put<any>(`/users/profiles/${id}`, data);
    return response.data;
  },

  deleteProfile: async (id: string) => {
    const response = await api.delete<any>(`/users/profiles/${id}`);
    return response.data;
  },
};
