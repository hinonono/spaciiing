import React, { useState } from "react";
import { NestedStructure } from "../types/General";

interface FolderNavigatorProps {
  structure: NestedStructure;
}

const FolderNavigator: React.FC<FolderNavigatorProps> = ({ structure }) => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentStructure, setCurrentStructure] =
    useState<NestedStructure>(structure);
  const [checkedOptions, setCheckedOptions] = useState<string[]>([]);

  const enterFolder = (folder: string) => {
    if (currentStructure[folder].children) {
      setCurrentPath([...currentPath, folder]);
      setCurrentStructure(currentStructure[folder].children as NestedStructure);
    }
  };

  const goBack = () => {
    const newPath = currentPath.slice(0, -1);
    let newStructure = structure;

    newPath.forEach((folder) => {
      newStructure = newStructure[folder].children as NestedStructure;
    });

    setCurrentPath(newPath);
    setCurrentStructure(newStructure);
  };

  const handleScopeChange = (id: string) => {
    setCheckedOptions((prev) =>
      prev.includes(id)
        ? prev.filter((checkedId) => checkedId !== id)
        : [...prev, id]
    );
  };

  return (
    <div>
      {currentPath.length > 0 && <button onClick={goBack}>Back</button>}
      <ul>
        {Object.keys(currentStructure).map((key) => (
          <li key={key}>
            {currentStructure[key].children ? (
              <button onClick={() => enterFolder(key)}>{key}</button>
            ) : (
              <label
                key={currentStructure[key].id} // Use id as the key to ensure uniqueness
                className="container" // You can add indentation styles or other classes here
              >
                {key}
                <input
                  type="checkbox"
                  value={currentStructure[key].id}
                  checked={checkedOptions.includes(currentStructure[key].id!)}
                  onChange={() => handleScopeChange(currentStructure[key].id!)}
                />
                <span className="checkmark"></span>
              </label>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FolderNavigator;
