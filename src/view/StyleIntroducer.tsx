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

  // 形式：樣式、變數
  const [form, setForm] = useState<"STYLE" | "VARIABLE">("STYLE");

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
      form: form,
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
    // console.log(selectedScopes);
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
        form={form}
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
    // 當form或Mode改變時，傳送初始化訊息
    const message: MessageStyleIntroducer = {
      form: form,
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
  }, [form, mode]);

  return (
    <div>
      <div>
        <Modal
          show={showExplanationModal}
          handleClose={handleCloseExplanationModal}
        >
          <div>
            <h3>{t("module:moduleCatalogue")}</h3>
            <p>{t("module:moduleCatalogueDesc")}</p>
          </div>
        </Modal>
      </div>
      <TitleBar
        title={t("module:moduleCatalogue")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:form")} />
          <div className="custom-segmented-control">
            <input
              type="radio"
              name="style-introducer-form"
              value="STYLE"
              id="style-introducer-form-style"
              checked={form === "STYLE"}
              onChange={() => setForm("STYLE")}
            />
            <label htmlFor="style-introducer-form-style">
              {t("term:style")}
            </label>
            <input
              type="radio"
              name="style-introducer-form"
              value="VARIABLE"
              id="style-introducer-form-variable"
              checked={form === "VARIABLE"}
              onChange={() => setForm("VARIABLE")}
            />
            <label htmlFor="style-introducer-form-variable">
              {t("term:variable")}
            </label>
          </div>
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:type")} />
          <select
            name="style-introducer-mode"
            className="custom-select"
            value={mode}
            onChange={(e) => setMode(e.target.value as StyleMode)}
          >
            <option key="COLOR" value="COLOR">
              {t("term:color")}
            </option>
            {form === "STYLE" && (
              <>
                <option key="EFFECT" value="EFFECT">
                  {t("term:effectColor")}
                </option>
                <option key="TEXT" value="TEXT">
                  {t("term:fontFamily")}
                </option>
              </>
            )}
          </select>
        </div>
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle title={form === "STYLE" ? t("term:style") : t("term:variable")} />
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
