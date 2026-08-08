"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const colorMode = useAppStore((state) => state.colorMode);

  // Sync our custom color mode to the root element on the client only
  useEffect(() => {
    const root = document.documentElement;

    // Remove any existing theme- prefix classes
    root.className = root.className.replace(/\btheme-[a-z]+\b/g, "").trim();

    // Add the active color mode class (e.g., 'theme-blue')
    root.classList.add(`theme-${colorMode}`);
  }, [colorMode]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
