import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { App } from "./app";
import { ConwayLayout } from "./conway-layout";
import { ConwayGridDOM, ConwayGridWebGL, ConwayGridV3, ConwayGridV4 } from "./pages/conway-grid-outlet";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConwayLayout />}>
          <Route index element={<Navigate to="/v1" replace />} />
          <Route path="v1" element={<ConwayGridDOM />} />
          <Route path="v2" element={<ConwayGridWebGL />} />
          <Route path="v3" element={<ConwayGridV3 />} />
          <Route path="v4" element={<ConwayGridV4 />} />
        </Route>
        <Route path="/legacy" element={<App />} />
        <Route path="*" element={<Navigate to="/v1" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
