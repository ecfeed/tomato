import React from "react";
import ReactDOM from "react-dom/client";
import TooltipDriver from "./drivers/tooltip/TooltipDriver";
import CanvasDriver from "./drivers/canvas/CanvasDriver";
import PoC from "./pages/PoC";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./global.css";
import PromptDriver from "./drivers/prompt/PromptDriver";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="/poc/canvas" />} />
        <Route path="poc" element={<PoC />}>
          <Route index element={<Navigate replace to="canvas" />} />
          <Route path="tooltip" element={<TooltipDriver />} />
          <Route path="canvas" element={<CanvasDriver />} />
          <Route path="prompt" element={<PromptDriver />} />
          <Route path="art" element={<p>Working on it</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);