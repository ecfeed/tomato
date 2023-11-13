import React from "react";
import ReactDOM from "react-dom/client";
import ChoiceDriver from "./drivers/ChoiceDriver";
import TooltipDriver from "./drivers/TooltipDriver";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  return (
    <>
      <TooltipDriver />
      <hr />
      <ChoiceDriver />
    </>
  );
}
