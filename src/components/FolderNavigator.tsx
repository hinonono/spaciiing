import React, { useState } from "react";
import { NestedStructure } from "../types/General";

interface FolderNavigatorProps {
  structure: NestedStructure;
  selectedScopes: string[];
  setSelectedScopes: React.Dispatch<React.SetStateAction<string[]>>;
}

const FolderNavigator: React.FC<FolderNavigatorProps> = ({
  structure,
  selectedScopes,
  setSelectedScopes,
}) => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentStructure, setCurrentStructure] =
    useState<NestedStructure>(structure);
  //   const [checkedOptions, setCheckedOptions] = useState<string[]>([]);

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
    setSelectedScopes((prev) => {
      const newCheckedOptions = prev.includes(id)
        ? prev.filter((checkedId) => checkedId !== id)
        : [...prev, id];
      return newCheckedOptions;
    });
  };

  const toggleAll = () => {
    const allLeafIds = Object.values(currentStructure)
      .filter((item) => item.id)
      .map((item) => item.id!);

    const areAllChecked = allLeafIds.every((id) => selectedScopes.includes(id));

    const newCheckedOptions = areAllChecked
      ? selectedScopes.filter((id) => !allLeafIds.includes(id))
      : [...new Set([...selectedScopes, ...allLeafIds])];

    setSelectedScopes(newCheckedOptions);
  };

  const isLeafNodeDisplayed = Object.keys(currentStructure).every(
    (key) => !currentStructure[key].children
  );

  return (
    <div>
      {currentPath.length > 0 && <button onClick={goBack}>Back</button>}

      {isLeafNodeDisplayed && (
        <button onClick={toggleAll}>
          {Object.keys(currentStructure).every((key) =>
            selectedScopes.includes(currentStructure[key].id!)
          )
            ? "Unselect All"
            : "Select All"}
        </button>
      )}
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
                  checked={selectedScopes.includes(currentStructure[key].id!)}
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
