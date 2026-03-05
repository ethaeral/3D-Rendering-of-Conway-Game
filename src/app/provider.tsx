import React from "react";
import { AppRoutes } from "./routes";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function AppWithProvider() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
