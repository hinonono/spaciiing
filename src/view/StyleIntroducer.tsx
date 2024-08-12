import React, { useEffect, useState } from "react";
import { FigmaButton, SectionTitle, TitleBar } from "../components";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import Modal from "../components/Modal";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import { MessageStyleIntroducer } from "../types/Messages/MessageStyleIntroducer";
import { CustomCheckboxGroupOption } from "../types/General";

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
        if (
          !newPaintStyleOptions.some((option) => option.fullName === fullName)
        ) {
          newPaintStyleOptions.push({
            id: style.id, // Keep style.id as the primary identifier
            name: part,
            indented: index > 0,
            indentLevel: index,
            fullName: fullName, // Add fullName to ensure uniqueness
            isLeaf: index === parts.length - 1, // Mark as leaf if it's the last part
          });
        }
      });
    });

    setPaintStyleOptions(newPaintStyleOptions);
  }, [paintStyleList]);

  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const getChildOptions = (fullName: string) => {
    return paintStyleOptions
      .filter((option) => {
        return (
          option.fullName.startsWith(fullName) &&
          option.indentLevel > fullName.split("/").length - 1
        );
      })
      .map((option) => option.fullName);
  };

  const handleScopeChange = (fullName: string) => {
    setSelectedScopes((prev) => {
      const isSelected = prev.includes(fullName);
      const childOptions = getChildOptions(fullName);

      if (isSelected) {
        // Uncheck the parent and all its children
        return prev.filter(
          (item) => item !== fullName && !childOptions.includes(item)
        );
      } else {
        // Check the parent and all its children
        const newSelections = [
          fullName,
          ...childOptions.filter(
            (childFullName) => !prev.includes(childFullName)
          ),
        ];
        // Only add leaf nodes to selectedScopes
        return [
          ...prev,
          ...newSelections.filter((optionFullName) => {
            const option = paintStyleOptions.find(
              (opt) => opt.fullName === optionFullName
            );
            return option?.isLeaf;
          }),
        ];
      }
    });
  };

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
          <div className="custom-checkbox-group scope-group scope-group-large hide-scrollbar-vertical">
            {paintStyleOptions.map((item) => (
              <label
                key={item.fullName} // Use fullName as the key to ensure uniqueness
                className={`container ${
                  item.indented ? `indent-level-${item.indentLevel}` : ""
                }`}
              >
                {item.name}
                <input
                  type="checkbox"
                  value={item.fullName}
                  checked={
                    selectedScopes.includes(item.fullName) ||
                    paintStyleOptions.some(
                      (opt) =>
                        opt.fullName.startsWith(item.fullName) &&
                        selectedScopes.includes(opt.fullName)
                    )
                  }
                  onChange={() => handleScopeChange(item.fullName)}
                />
                <span className="checkmark"></span>
              </label>
            ))}
          </div>
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
