import React from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {

}

const Portal: React.FC<PortalProps> = () => {

  // Resizing logic
  const resizeHandle = document.getElementById("resize-handle");
  let isResizing = false;

  resizeHandle?.addEventListener("mousedown", (e) => {
    isResizing = true;
    document.body.style.cursor = "se-resize";
    e.preventDefault(); // Prevent text selection

    console.log("hhh", isResizing);
  });

  document.addEventListener("mousemove", (e) => {
    console.log("wwww", isResizing);

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


  return createPortal(
    <div className="main-window-toolbar-wrapper">
      <div className="main-window-toolbar-icon-wrapper min-max-window">
        <div style={{ width: 8, height: 8 }}>
          <svg width="8" height="8" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20L20 0" stroke="var(--figma-color-text-secondary)" stroke-width="2" />
            <path d="M10 20L20 10" stroke="var(--figma-color-text-secondary)" stroke-width="2" />
            <path d="M0 10L10 0" stroke="var(--figma-color-text-secondary)" stroke-width="2" />
          </svg>
        </div>
      </div>
      <div id="resize-handle" className="main-window-toolbar-icon-wrapper resize">
        <div style={{ width: 8, height: 8 }}>
          <svg width="8" height="8" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20L20 0" stroke="var(--figma-color-text-secondary)" stroke-width="2" />
            <path d="M10 20L20 10" stroke="var(--figma-color-text-secondary)" stroke-width="2" />
            <path d="M0 10L10 0" stroke="var(--figma-color-text-secondary)" stroke-width="2" />
          </svg>
        </div>
      </div>
    </div>,
    document.getElementById('main-window-toolbar')!
  );
};

export default Portal;
