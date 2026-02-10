import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { User, Company } from "@/shared/types";

interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setCompany: (company: Company | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        company: null,
        isAuthenticated: false,
        isLoading: false,

        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),

        setCompany: (company) =>
          set((state) => {
            state.company = company;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        logout: () =>
          set((state) => {
            state.user = null;
            state.company = null;
            state.isAuthenticated = false;
          }),

        updateUser: (updates) =>
          set((state) => {
            if (state.user) {
              Object.assign(state.user, updates);
            }
          }),
      })),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          company: state.company,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "auth-store" }
  )
);
