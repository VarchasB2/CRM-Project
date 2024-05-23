"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export default function Provider({ children }: ThemeProviderProps) {
  return (
    <SessionProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </NextThemesProvider>
    </SessionProvider>
  );
}
