import React from "react";
import ReactDOM from "react-dom/client";
import ChoiceDriver from "./drivers/choice/ChoiceDriver";
import TooltipDriver from "./drivers/tooltip/TooltipDriver";
import PoC from "./pages/PoC";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./global.css";
import { MockParameter } from "./components/canvas/0_1_0/MockParameter";
import { Canvas } from "./components/canvas/0_1_0/Canvas";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="dev" element={<Canvas />} />
        <Route index element={<Navigate replace to="/poc/choice" />} />
        <Route path="poc" element={<PoC />}>
          <Route index element={<Navigate replace to="choice" />} />
          <Route path="choice" element={<ChoiceDriver />} />
          <Route path="tooltip" element={<TooltipDriver />} />
          <Route path="art" element={<p>Working on it</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
