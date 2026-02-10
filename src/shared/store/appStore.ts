import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Notifications
  notificationPanelOpen: boolean;

  // Theme
  theme: "light" | "dark" | "system";

  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setNotificationPanelOpen: (open: boolean) => void;
  toggleNotificationPanel: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        sidebarOpen: true,
        sidebarCollapsed: false,
        notificationPanelOpen: false,
        theme: "light",

        setSidebarOpen: (open) =>
          set((state) => {
            state.sidebarOpen = open;
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          }),

        setSidebarCollapsed: (collapsed) =>
          set((state) => {
            state.sidebarCollapsed = collapsed;
          }),

        toggleSidebarCollapsed: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),

        setNotificationPanelOpen: (open) =>
          set((state) => {
            state.notificationPanelOpen = open;
          }),

        toggleNotificationPanel: () =>
          set((state) => {
            state.notificationPanelOpen = !state.notificationPanelOpen;
          }),

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),
      })),
      {
        name: "app-storage",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    { name: "app-store" }
  )
);
