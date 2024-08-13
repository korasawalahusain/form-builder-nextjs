"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";

type Props = {};

export function Provider({ children }: React.PropsWithChildren<Props>) {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
