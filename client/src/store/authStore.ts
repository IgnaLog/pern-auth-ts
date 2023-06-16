import { create } from "zustand";

type State = {
  accessToken: string;
  user: string;
};

type Actions = {
  setAuth: (updates: Partial<State>) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
  accessToken: "",
  user: "",

  setAuth: (updates) =>
    set((state) => ({
      ...state,
      ...updates,
    })),

  clearAuth: () =>
    set(() => ({
      accessToken: "",
      user: "",
    })),
}));
