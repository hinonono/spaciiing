import React, { useEffect, useState } from "react";
import { FigmaButton, SectionTitle, TitleBar } from "../components";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import Modal from "../components/Modal";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import { MessageStyleIntroducer } from "../types/Messages/MessageStyleIntroducer";
import { CustomCheckboxGroupOption, NestedStructure } from "../types/General";
import { buildNestedStructure } from "../module-frontend/styleIntroducerFrontEnd";
import FolderNavigator from "../components/FolderNavigator";

interface StyleIntroducerProps {}

const StyleIntroducer: React.FC<StyleIntroducerProps> = () => {
  // Context
  const { licenseManagement, setShowCTSubscribe, paintStyleList } =
    useAppContext();
  const { t } = useTranslation(["common", "settings", "license"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const applyStyleIntroducer = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    console.log(selectedScopes);

    // const message: MessageStyleIntroducer = {
    //   module: "StyleIntroducer",
    //   phase: "Actual",
    //   direction: "Inner",
    // };

    // parent.postMessage(
    //   {
    //     pluginMessage: message,
    //   },
    //   "*"
    // );
  };

  interface PaintStyleOption extends CustomCheckboxGroupOption {
    id: string;
    fullName: string; // Add fullName to ensure uniqueness
    isLeaf: boolean; // Add isLeaf to distinguish leaf nodes
  }

  const [paintStyleOptions, setPaintStyleOptions] = useState<
    PaintStyleOption[]
  >([]);

  useEffect(() => {
    const newPaintStyleOptions: PaintStyleOption[] = [];

    paintStyleList.forEach((style) => {
      const parts = style.name.split("/");
      parts.forEach((part, index) => {
        const fullName = parts.slice(0, index + 1).join("/");
        const isLeaf = index === parts.length - 1;
        const id = isLeaf ? style.id : `non-leaf-${fullName}`;

        if (
          !newPaintStyleOptions.some((option) => option.fullName === fullName)
        ) {
          newPaintStyleOptions.push({
            id: id, // Use the generated id
            name: part,
            indented: index > 0,
            indentLevel: index,
            fullName: fullName, // Add fullName to ensure uniqueness
            isLeaf: isLeaf, // Mark as leaf if it's the last part
          });
        }
      });
    });

    setPaintStyleOptions(newPaintStyleOptions);
  }, [paintStyleList]);

  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [checkedOptions, setCheckedOptions] = useState<string[]>([]);

  const handleScopeChange = (id: string) => {
    const option = paintStyleOptions.find((opt) => opt.id === id);
    if (!option) return;

    const fullName = option.fullName;
    const fullNameParts = fullName.split("/");

    setCheckedOptions((prev) => {
      const isSelected = prev.includes(id);
      const childOptions = paintStyleOptions.filter((opt) => {
        const optParts = opt.fullName.split("/");
        return (
          opt.fullName.startsWith(fullName) &&
          optParts.length === fullNameParts.length + 1
        );
      });

      if (isSelected) {
        // Uncheck the parent and all its children
        return prev.filter(
          (item) => item !== id && !childOptions.some((opt) => opt.id === item)
        );
      } else {
        // Check the parent and all its children
        return [
          ...prev,
          id,
          ...childOptions
            .map((opt) => opt.id)
            .filter((childId) => !prev.includes(childId)),
        ];
      }
    });

    setSelectedScopes((prev) => {
      const isSelected = prev.includes(id);
      const childOptions = paintStyleOptions.filter((opt) => {
        const optParts = opt.fullName.split("/");
        return (
          opt.fullName.startsWith(fullName) &&
          optParts.length === fullNameParts.length + 1
        );
      });

      if (isSelected) {
        // Uncheck the parent and all its children
        return prev.filter(
          (item) => item !== id && !childOptions.some((opt) => opt.id === item)
        );
      } else {
        // Check the parent and all its children
        const newSelections = [
          id,
          ...childOptions
            .map((opt) => opt.id)
            .filter((childId) => !prev.includes(childId)),
        ];
        // Only add leaf nodes to selectedScopes
        return [
          ...prev,
          ...newSelections.filter((optionId) => {
            const option = paintStyleOptions.find((opt) => opt.id === optionId);
            return option?.isLeaf;
          }),
        ];
      }
    });
  };

  const [nestedStructure, setNestedStructure] =
    useState<NestedStructure | null>(null);

  useEffect(() => {
    setNestedStructure(buildNestedStructure(paintStyleList));
  }, [paintStyleList]);

  if (!nestedStructure) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Modal
          show={showExplanationModal}
          handleClose={handleCloseExplanationModal}
        >
          <div>
            <h3>{t("module:moduleSelectionFilter")}</h3>
            <p>{t("module:moduleSelectionFilterDesc")}</p>
          </div>
        </Modal>
      </div>
      <TitleBar
        title={"Style Introducer"}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle title={"Styles"} />
          <FolderNavigator structure={nestedStructure} />
          {/* <div className="custom-checkbox-group scope-group scope-group-large hide-scrollbar-vertical">
            {paintStyleOptions
              .filter((item) => !item.isLeaf) // Filter out leaf options
              .map((item) => (
                <label
                  key={item.id} // Use id as the key to ensure uniqueness
                  className={`container ${
                    item.indented ? `indent-level-${item.indentLevel}` : ""
                  }`}
                >
                  {item.name}
                  <input
                    type="checkbox"
                    value={item.id}
                    checked={checkedOptions.includes(item.id)}
                    onChange={() => handleScopeChange(item.id)}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
          </div> */}
          {/* 按鈕 */}
          <div className="mt-xsmall">
            <FigmaButton
              title={t("module:apply")}
              onClick={applyStyleIntroducer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleIntroducer;
