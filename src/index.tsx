import React from "react";
import App from "./App";
import "./assets/figma-plugin-ds.css";
import "./App.css";
import { createRoot } from "react-dom/client";
import { Message } from "./types/Messages/Message";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

// Make sure the DOM is fully loaded before running ReactDOM.render
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content loaded.");

  const container = document.getElementById("root");
  const root = createRoot(container!);
  root.render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );

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

  // Resizing logic
  const resizeHandle = document.getElementById("resize-handle");
  let isResizing = false;

  resizeHandle?.addEventListener("mousedown", (e) => {
    isResizing = true;
    document.body.style.cursor = "se-resize";
    e.preventDefault(); // Prevent text selection
  });

  document.addEventListener("mousemove", (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      const newHeight = e.clientY;
      parent.postMessage(
        {
          pluginMessage: {
            module: "Resize",
            width: newWidth,
            height: newHeight,
          },
        },
        "*"
      );
    }
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = "default";
    }
  });

  // Prevent default drag behavior on the resize handle
  resizeHandle?.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });
});
