import React from "react";
import { App } from "./app";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function AppWithProvider() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
