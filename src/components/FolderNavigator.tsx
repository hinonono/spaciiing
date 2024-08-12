import React, { useEffect, useState } from "react";
import { NestedStructure } from "../types/General";
import FigmaButton from "./FigmaButton";

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

  useEffect(() => {
    console.log("FolderNavigator structure updated:", structure);
    setCurrentStructure(structure); // Update currentStructure when structure prop changes
  }, [structure]);

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
      <div className="flex flex-row flex-justify-spacebetween">
        {currentPath.length > 0 && (
          <FigmaButton
            title={"Back"}
            onClick={goBack}
            buttonHeight="small"
            fontSize="small"
            buttonType="secondary"
          />
        )}
        {isLeafNodeDisplayed && (
          <FigmaButton
            title={
              Object.keys(currentStructure).every((key) =>
                selectedScopes.includes(currentStructure[key].id!)
              )
                ? "Unselect All"
                : "Select All"
            }
            onClick={toggleAll}
            buttonHeight="small"
            fontSize="small"
            buttonType="secondary"
          />
        )}
      </div>
      <ul className="list-style-none">
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