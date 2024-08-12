import React, { useEffect, useState } from "react";
import { FigmaButton, SectionTitle, TitleBar } from "../components";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import Modal from "../components/Modal";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import { MessageStyleIntroducer } from "../types/Messages/MessageStyleIntroducer";
import { NestedStructure } from "../types/General";
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

  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  useEffect(() => {
    console.log(selectedScopes);
  }, [selectedScopes]);

  const [nestedStructure, setNestedStructure] =
    useState<NestedStructure | null>(null);

  useEffect(() => {
    console.log("This code is running", paintStyleList);

    setNestedStructure(buildNestedStructure(paintStyleList));
  }, [paintStyleList]);

  const folderNavigator = () => {
    if (!nestedStructure) {
      return <div>Loading...</div>;
    }

    return (
      <FolderNavigator
        structure={nestedStructure}
        selectedScopes={selectedScopes}
        setSelectedScopes={setSelectedScopes}
      />
    );
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
          <div className="folder-navigator">{folderNavigator()}</div>
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
