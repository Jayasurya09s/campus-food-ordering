"use client";

import { ThemeProvider } from "@/lib/theme-provider";
import Provider from "@/components/SessionProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
