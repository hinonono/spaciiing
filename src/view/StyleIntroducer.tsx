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
  const {
    licenseManagement,
    setShowCTSubscribe,
    paintStyleList,
    setPaintStyleList,
  } = useAppContext();
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

    const message: MessageStyleIntroducer = {
      module: "StyleIntroducer",
      phase: "Actual",
      direction: "Inner",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  interface PaintStyleOption extends CustomCheckboxGroupOption {
    id: string;
  }

  const [paintStyleOptions, setPaintStyleOptions] = useState<
    PaintStyleOption[]
  >([]);

  useEffect(() => {
    setPaintStyleOptions(
      paintStyleList.map((style) => ({
        id: style.id,
        name: style.name,
        indented: false,
      }))
    );
  }, [paintStyleList]);

  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const handleScopeChange = (id: string) => {
    setSelectedScopes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
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
          <div className="custom-checkbox-group scope-group hide-scrollbar-vertical">
            {paintStyleOptions.map((item) => (
              <label
                key={item.id}
                className={`container ${
                  item.indented ? `indent-level-${item.indentLevel}` : ""
                }`}
              >
                {t(item.name)}
                <input
                  type="checkbox"
                  value={item.id}
                  checked={selectedScopes.includes(item.id)}
                  onChange={() => handleScopeChange(item.id)}
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
