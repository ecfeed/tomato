import React from "react";
import ReactDOM from "react-dom/client";
import ChoiceDriver from "./drivers/choice/ChoiceDriver";
import TooltipDriver from "./drivers/tooltip/TooltipDriver";
import CanvasDriver from "./drivers/canvas/CanvasDriver";
import PoC from "./pages/PoC";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="/poc/choice" />} />
        <Route path="poc" element={<PoC />}>
          <Route index element={<Navigate replace to="choice" />} />
          <Route path="choice" element={<ChoiceDriver />} />
          <Route path="tooltip" element={<TooltipDriver />} />
          <Route path="canvas" element={<CanvasDriver />} />
          <Route path="art" element={<p>Working on it</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
