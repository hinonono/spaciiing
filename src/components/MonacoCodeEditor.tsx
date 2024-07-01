import React from "react";
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
  const handleEditorChange: OnChange = (value) => {
    setCode(value ?? "");
  };

  return (
    <div className="monaco-code-editor">
      <Editor
        height={height + "px"}
        defaultLanguage="javascript"
        value={code}
        theme="vs-dark"
        options={{
          fontSize: 14, // Set the font size to 16
          minimap: {
            enabled: false, // Disable the minimap
          },
          scrollBeyondLastLine: false,
        }}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default MonacoCodeEditor;
