import React, { useState } from "react";
import Editor, { OnChange } from "@monaco-editor/react";

interface MonacoCodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  height?: number;
}

const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  code,
  setCode,
  height = 200,
}) => {
  const [editorHeight, setEditorHeight] = useState(height);

  const handleEditorChange: OnChange = (value) => {
    setCode(value ?? "");
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startHeight = editorHeight;

    const onMouseMove = (e: MouseEvent) => {
      const newHeight = startHeight + (e.clientY - startY);
      setEditorHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="monaco-code-editor" style={{ position: "relative" }}>
      <Editor
        height={editorHeight + "px"}
        defaultLanguage="json"
        value={code}
        theme="vs-dark"
        options={{
          fontSize: 14, // Set the font size to 16
          minimap: {
            enabled: false, // Disable the minimap
          },
          scrollBeyondLastLine: false,
          tabSize: 2, // Set the tab size to 2
          insertSpaces: true, // Use spaces instead of tabs
        }}
        onChange={handleEditorChange}
      />
      <div
        style={{
          height: "10px",
          background: "#ccc",
          cursor: "row-resize",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default MonacoCodeEditor;