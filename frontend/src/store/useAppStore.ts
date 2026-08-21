import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ColorMode =
  | "amber"
  | "blue"
  | "pink"
  | "rose"
  | "emerald"
  | "black";
export type AppView = "tasks" | "projects"; // NEW: View Types

interface AppState {
  isAuthenticated: boolean;
  colorMode: ColorMode;
  currentView: AppView; // NEW: Track the active view
  loginAsGuest: () => void;
  logout: () => void;
  setColorMode: (mode: ColorMode) => void;
  setCurrentView: (view: AppView) => void; // NEW: Update the active view
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      colorMode: "black",
      currentView: "tasks", // Default to tasks
      loginAsGuest: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      setColorMode: (mode) => set({ colorMode: mode }),
      setCurrentView: (view) => set({ currentView: view }),
    }),
    {
      name: "ablespace-global-store",
    },
  ),
);
