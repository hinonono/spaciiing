import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NestedStructure, StyleSelection } from "../types/General";
import FigmaButton from "./FigmaButton";
import { StyleForm, StyleMode } from "../types/Messages/MessageStyleIntroducer";
import { useTranslation } from "react-i18next";
import ListViewHeader from "./ListViewHeader";
import ColorThumbnailView from "./ColorThumbnailView";
import CYCheckbox from "./CYCheckbox";

interface FolderNavigatorProps {
  form: StyleForm;
  mode: StyleMode;
  structure: NestedStructure;
  selectedScopes: StyleSelection;
  setSelectedScopes: React.Dispatch<React.SetStateAction<StyleSelection>>;
  onNextPageClicked?: () => void;
  onPreviousPageClicked?: () => void;
}

const FolderNavigator: React.FC<FolderNavigatorProps> = ({
  form,
  mode,
  structure,
  selectedScopes,
  setSelectedScopes,
  onNextPageClicked,
  onPreviousPageClicked,
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
      // setDirection("forward"); // ➡️ going deeper

      const newPath = [...currentPath, folder];
      setCurrentPath(newPath);
      setCurrentStructure(currentStructure[folder].children as NestedStructure);
      setSelectedScopes((prev) => ({
        title: currentPath.join("/"),
        scopes: [],
      }));

      setHistory((prev) => [...prev, newPath]); // push to history

      if (onNextPageClicked) {
        onNextPageClicked();
      }
    }
  };

  const goBack = () => {
    // setDirection("backward");

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

    setHistory((prev) => prev.slice(0, -1)); // pop from history

    if (onPreviousPageClicked) {
      onPreviousPageClicked();
    }
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

  const countLeafNodes = (structure: NestedStructure): number => {
    return Object.values(structure).reduce((count, item) => {
      if (item.children) {
        return count + countLeafNodes(item.children as NestedStructure);
      } else {
        return count + 1;
      }
    }, 0);
  };

  const leafNodeCount = countLeafNodes(currentStructure);

  // V38: 2025-09-15 加入動畫
  // const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [history, setHistory] = useState<string[][]>([[]]); // start at root

  return (
    <div>
      <ListViewHeader
        additionalClass={"folder-navigator-header"}
        title={currentPath.length == 0
          ? t("module:home")
          : currentPath[currentPath.length - 1]}
        leftItem={
          currentPath.length > 0 && (
            <FigmaButton
              title={t("term:back")}
              onClick={goBack}
              buttonHeight="small"
              fontSize="small"
              buttonType="grain"
              hasMargin={false}
              showChevron={true}
            />
          )
        }
        rightItem={
          isLeafNodeDisplayed && leafNodeCount > 1 && (
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
          )
        }
      />
      <div
        className={`cy-checkbox-group folder-navigator-items-group folder-navigator-items-group-large border-1-top hide-scrollbar-vertical`}
      >
        <motion.div
          animate={{ x: `-${(history.length - 1) * 100}%` }}
          transition={{ type: "spring", duration: 0.75, ease: "easeInOut", bounce: 0 }}
          className="flex w-full h-full"
        >
          {history.map((path) => {
            // derive structure for this path
            let struct: NestedStructure = structure;
            path.forEach((folder) => {
              struct = struct[folder].children as NestedStructure;
            });

            return (
              <ul
                key={path.join("/")}
                className="w-full flex-shrink-0 list-view-content"
              >
                {Object.keys(struct).map((key) => (
                  <li key={key}>
                    {struct[key].children ? (
                      <button
                        onClick={() => enterFolder(key)}
                        className="button-reset button-folder"
                      >
                        {key}
                        <span className="chevron-right"></span>
                      </button>
                    ) : (
                      <CYCheckbox
                        label={
                          <div className="flex flex-row align-items-center">
                            {struct[key].color && (
                              <ColorThumbnailView
                                color={struct[key].color}
                                opacity={1}
                                size={20}
                                type={form === "STYLE" ? "rounded" : "square"}
                                extraClassName="mr-xxsmall"
                              />
                            )}
                            {key}
                          </div>
                        }
                        checked={selectedScopes.scopes.includes(struct[key].id!)}
                        onChange={() => handleScopeChange(struct[key].id!)}
                        labelKey={struct[key].id}
                        value={struct[key].id}
                      />
                    )}
                  </li>
                ))}
              </ul>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default FolderNavigator;
