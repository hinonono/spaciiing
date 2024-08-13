import React, { useEffect, useState } from "react";
import { FigmaButton, SectionTitle, TitleBar } from "../components";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import Modal from "../components/Modal";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import {
  MessageStyleIntroducer,
  StyleMode,
} from "../types/Messages/MessageStyleIntroducer";
import { NestedStructure, StyleSelection } from "../types/General";
import { buildNestedStructure } from "../module-frontend/styleIntroducerFrontEnd";
import FolderNavigator from "../components/FolderNavigator";

interface StyleIntroducerProps {}

const StyleIntroducer: React.FC<StyleIntroducerProps> = () => {
  // Context
  const { licenseManagement, setShowCTSubscribe, styleList } = useAppContext();
  const { t } = useTranslation(["common", "settings", "license"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  // 模式：色彩、效果、文字
  const [mode, setMode] = useState<StyleMode>("COLOR");

  const applyStyleIntroducer = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    if (selectedScopes.scopes.length <= 0) {
      return;
    }

    console.log(selectedScopes);

    const message: MessageStyleIntroducer = {
      module: "StyleIntroducer",
      phase: "Actual",
      direction: "Inner",
      styleMode: mode,
      styleSelection: selectedScopes,
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  const [selectedScopes, setSelectedScopes] = useState<StyleSelection>({
    title: "",
    scopes: [],
  });
  useEffect(() => {
    console.log(selectedScopes);
  }, [selectedScopes]);

  const [nestedStructure, setNestedStructure] =
    useState<NestedStructure | null>(null);

  useEffect(() => {
    // console.log("This code is running", styleList);

    setNestedStructure(buildNestedStructure(styleList));
  }, [styleList, mode]);

  const folderNavigator = () => {
    if (!nestedStructure) {
      return <div>Loading...</div>;
    }

    return (
      <FolderNavigator
        mode={mode}
        structure={nestedStructure}
        selectedScopes={selectedScopes}
        setSelectedScopes={setSelectedScopes}
      />
    );
  };

  
  useEffect(() => {
    setSelectedScopes({
      title: "",
      scopes: [],
    });
    // 當Mode改變時，傳送初始化訊息
    const message: MessageStyleIntroducer = {
      styleMode: mode,
      module: "StyleIntroducer",
      phase: "Init",
      direction: "Inner",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  }, [mode]);

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
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:mode")} />
          <div className="custom-segmented-control">
            <input
              type="radio"
              name="sp-mode"
              value="COLOR"
              id="style-introducer-mode-color"
              checked={mode === "COLOR"}
              onChange={() => setMode("COLOR")}
            />
            <label htmlFor="style-introducer-mode-color">Color</label>
            <input
              type="radio"
              name="sp-mode"
              value="EFFECT"
              id="style-introducer-mode-effect"
              checked={mode === "EFFECT"}
              onChange={() => setMode("EFFECT")}
            />
            <label htmlFor="style-introducer-mode-effect">Effect</label>
            <input
              type="radio"
              name="sp-mode"
              value="TEXT"
              id="style-introducer-mode-text"
              checked={mode === "TEXT"}
              onChange={() => setMode("TEXT")}
            />
            <label htmlFor="style-introducer-mode-text">Text</label>
          </div>
        </div>
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle title={"Styles"} />
          <div className="folder-navigator">{folderNavigator()}</div>
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <FigmaButton
            title={t("module:generate")}
            onClick={applyStyleIntroducer}
          />
        </div>
      </div>
    </div>
  );
};

export default StyleIntroducer;
