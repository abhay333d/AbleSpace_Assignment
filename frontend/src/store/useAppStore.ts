import { create } from "zustand";

type Theme = "light" | "dark";
type ColorMode = "blue" | "amber" | "pink" | "rose" | "emerald" | "black";

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  loginAsGuest: () => void;
  logout: () => void;

  // Theme state
  theme: Theme;
  setTheme: (theme: Theme) => void;

  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  loginAsGuest: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),

  theme: "light",
  setTheme: (theme) => set({ theme }),

  colorMode: "blue", 
  setColorMode: (colorMode) => set({ colorMode }),
}));
