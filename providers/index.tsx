import React, { PropsWithChildren } from "react";
import { Provider as ClerkProvider } from "./clerk-provider";
import { Provider as ThemeProvider } from "./theme-provider";

type Props = {};

export function Provider({ children }: PropsWithChildren<Props>) {
  return (
    <ClerkProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ClerkProvider>
  );
}
