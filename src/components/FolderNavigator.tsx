import React, { useEffect, useState } from "react";
import { NestedStructure, StyleSelection } from "../types/General";
import FigmaButton from "./FigmaButton";
import { StyleForm, StyleMode } from "../types/Messages/MessageStyleIntroducer";
import { useTranslation } from "react-i18next";

interface FolderNavigatorProps {
  form: StyleForm;
  mode: StyleMode;
  structure: NestedStructure;
  selectedScopes: StyleSelection;
  setSelectedScopes: React.Dispatch<React.SetStateAction<StyleSelection>>;
}

const FolderNavigator: React.FC<FolderNavigatorProps> = ({
  form,
  mode,
  structure,
  selectedScopes,
  setSelectedScopes,
}) => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentStructure, setCurrentStructure] =
    useState<NestedStructure>(structure);

  const { t } = useTranslation(["term"]);

  useEffect(() => {
    setCurrentStructure(structure);
  }, [structure]);

  useEffect(() => {
    setCurrentPath([]);
    setCurrentStructure(structure);
    setSelectedScopes({
      title: "",
      scopes: [],
    });
  }, [mode, form]);

  const enterFolder = (folder: string) => {
    if (currentStructure[folder].children) {
      setCurrentPath([...currentPath, folder]);
      setCurrentStructure(currentStructure[folder].children as NestedStructure);
      setSelectedScopes((prev) => ({
        title: currentPath.join("/"),
        scopes: prev.scopes,
      }));
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
    setSelectedScopes((prev) => ({
      title: currentPath.join("/"),
      scopes: [],
    }));
  };

  const handleScopeChange = (id: string) => {
    setSelectedScopes((prev) => {
      const newCheckedOptions = prev.scopes.includes(id)
        ? prev.scopes.filter((checkedId) => checkedId !== id)
        : [...prev.scopes, id];
      return { title: prev.title, scopes: newCheckedOptions };
    });
  };

  const toggleAll = () => {
    const allLeafIds = Object.values(currentStructure)
      .filter((item) => item.id)
      .map((item) => item.id!);

    const areAllChecked = allLeafIds.every((id) =>
      selectedScopes.scopes.includes(id)
    );

    const newCheckedOptions = areAllChecked
      ? {
          title: currentPath.join("/"),
          scopes: selectedScopes.scopes.filter(
            (id) => !allLeafIds.includes(id)
          ),
        }
      : {
          title: currentPath.join("/"),
          scopes: [...new Set([...selectedScopes.scopes, ...allLeafIds])],
        };

    setSelectedScopes(newCheckedOptions);
  };

  const isLeafNodeDisplayed = Object.keys(currentStructure).every(
    (key) => !currentStructure[key].children
  );

  return (
    <div>
      <div className="folder-navigator-header">
        <div>
          {currentPath.length > 0 && (
            <FigmaButton
              title={t("term:back")}
              onClick={goBack}
              buttonHeight="small"
              fontSize="small"
              buttonType="grain"
              hasMargin={false}
              showChevron={true}
            />
          )}
        </div>
        <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
          {currentPath.length == 0
            ? t("module:home")
            : currentPath[currentPath.length - 1]}
        </div>
        <div>
          {isLeafNodeDisplayed && (
            <FigmaButton
              title={
                Object.keys(currentStructure).every((key) =>
                  selectedScopes.scopes.includes(currentStructure[key].id!)
                )
                  ? t("term:unselectAll")
                  : t("term:selectAll")
              }
              onClick={toggleAll}
              buttonHeight="small"
              fontSize="small"
              buttonType="grain"
              hasMargin={false}
            />
          )}
        </div>
      </div>
      <div
        className={`custom-checkbox-group folder-navigator-items-group folder-navigator-items-group-large border-1-top hide-scrollbar-vertical`}
      >
        <ul className="list-style-none">
          {Object.keys(currentStructure).map((key) => (
            <li key={key}>
              {currentStructure[key].children ? (
                <button
                  onClick={() => enterFolder(key)}
                  className="button-reset button-folder"
                >
                  {key}
                  <span className="chevron-right"></span>
                </button>
              ) : (
                <label
                  key={currentStructure[key].id} // Use id as the key to ensure uniqueness
                  className="container" // You can add indentation styles or other classes here
                >
                  {key}
                  <input
                    type="checkbox"
                    value={currentStructure[key].id}
                    checked={selectedScopes.scopes.includes(
                      currentStructure[key].id!
                    )}
                    onChange={() =>
                      handleScopeChange(currentStructure[key].id!)
                    }
                  />
                  <span className="checkmark"></span>
                </label>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FolderNavigator;
