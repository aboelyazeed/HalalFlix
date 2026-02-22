import { api } from "./api";

export const authService = {
  signup: async (email: string, password: string) => {
    const response = await api.post<any>("/auth/signup", { email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<any>("/auth/login", { email, password });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post<any>("/auth/forgot-password", { email });
    return response.data;
  },
};
