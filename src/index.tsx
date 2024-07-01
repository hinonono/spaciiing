import React from "react";
import App from "./App";
import "./assets/figma-plugin-ds.css";
import "./App.css";
import { createRoot } from "react-dom/client";
import { Message } from "./types/Message";

// Make sure the DOM is fully loaded before running ReactDOM.render
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content loaded.");

  const container = document.getElementById("root");
  const root = createRoot(container!);
  root.render(<App />);

  const message: Message = {
    module: "Init",
    direction: "Inner",
    phase: "Init",
  };

  parent.postMessage(
    {
      pluginMessage: message,
    },
    "*"
  );
});
