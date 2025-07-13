import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageResize } from '../types/Messages/MessageResize';
import { MessageMinMaxWindow } from '../types/Messages/MessageMinMaxWindow';
import { SvgAdd, SvgMinus } from '../assets/icons';

interface PortalProps {

}

const Portal: React.FC<PortalProps> = () => {
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    const resizeHandle = document.getElementById("resize-handle");
    if (!resizeHandle) return;

    let isResizing = false;

    const onMouseDown = (e: MouseEvent) => {
      isResizing = true;
      document.body.style.cursor = "se-resize";
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        const newHeight = e.clientY;

        const message: MessageResize = {
          module: "Resize",
          direction: "Inner",
          phase: "Actual",
          shouldSaveEditorPreference: false,
          shouldSaveSyncedReources: false,
          width: newWidth,
          height: newHeight
        }

        parent.postMessage({ pluginMessage: message, }, "*");
      }
    };

    const onMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = "default";
      }
    };

    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    resizeHandle.addEventListener("mousedown", onMouseDown);
    resizeHandle.addEventListener("dragstart", onDragStart);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      resizeHandle.removeEventListener("mousedown", onMouseDown);
      resizeHandle.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const toggleBtn = document.getElementById("min-max-window");
    if (!toggleBtn) return;

    toggleBtn.onclick = () => {
      const currentToggle = toggleBtn.getAttribute("should-window-minimize") === "true";
      const newToggle = !currentToggle;
      toggleBtn.setAttribute("should-window-minimize", String(newToggle));
      setToggled(newToggle);

      const message: MessageMinMaxWindow = {
        module: "MinMaxWindow",
        direction: "Inner",
        phase: "Actual",
        shouldSaveEditorPreference: false,
        shouldSaveSyncedReources: false,
        toggle: newToggle
      };
      parent.postMessage({ pluginMessage: message }, "*");
    };
  }, [])

  const iconColor = "var(--figma-color-text-secondary)";


  return createPortal(
    <div className="main-window-toolbar-wrapper">
      <div id="min-max-window" className="main-window-toolbar-icon-wrapper min-max-window">
        <div style={{ width: 12, height: 12 }}>
          {toggled
            ? <SvgAdd color={iconColor} />
            : <SvgMinus color={iconColor} />
          }
        </div>
      </div>
      <div id="resize-handle" className="main-window-toolbar-icon-wrapper resize">
        <div style={{ width: 8, height: 8 }}>
          <svg width="8" height="8" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20L20 0" stroke={iconColor} strokeWidth="2" />
            <path d="M10 20L20 10" stroke={iconColor} strokeWidth="2" />
            <path d="M0 10L10 0" stroke={iconColor} strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>,
    document.getElementById('main-window-toolbar')!
  );
};

export default Portal;
