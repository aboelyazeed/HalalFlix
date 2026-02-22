import { create } from "zustand";

interface Profile {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
  createdAt: string;
}

interface ProfileState {
  profiles: Profile[];
  activeProfile: Profile | null;
  isLoading: boolean;

  setProfiles: (profiles: Profile[]) => void;
  setActiveProfile: (profile: Profile) => void;
  addProfile: (profile: Profile) => void;
  removeProfile: (id: string) => void;
  clearProfiles: () => void;
  setLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: [],
  activeProfile: null,
  isLoading: false,

  setProfiles: (profiles) => set({ profiles, isLoading: false }),
  setActiveProfile: (activeProfile) => set({ activeProfile }),
  addProfile: (profile) =>
    set((state) => ({ profiles: [...state.profiles, profile] })),
  removeProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
      activeProfile:
        state.activeProfile?.id === id ? null : state.activeProfile,
    })),
  clearProfiles: () => set({ profiles: [], activeProfile: null }),
  setLoading: (isLoading) => set({ isLoading }),
}));
