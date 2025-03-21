import React, { useEffect, useState } from "react";
import { FigmaButton, SectionTitle, TitleBar } from "../components";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import Modal from "../components/Modal";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import {
  MessageStyleIntroducer,
  StyleForm,
  StyleMode,
} from "../types/Messages/MessageStyleIntroducer";
import { NestedStructure, StyleSelection } from "../types/General";
import { buildNestedStructure } from "../module-frontend/styleIntroducerFrontEnd";
import FolderNavigator from "../components/FolderNavigator";
import SegmentedControl from "../components/SegmentedControl";
import { CatalogueSettingModal } from "../components/modalComponents";

interface StyleIntroducerProps {}

const StyleIntroducer: React.FC<StyleIntroducerProps> = () => {
  // Context
  const { licenseManagement, setShowCTSubscribe, styleList, setFreeUserDelayModalConfig } = useAppContext();
  const { t } = useTranslation(["common", "settings", "license", "term"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  // 型錄功能彈窗
  const [showCatalogueModal, setShowCatalogueModal] = useState(false);
  const handleOpenCatalogueModal = () => setShowCatalogueModal(true);
  const handleCloseCatalogueModal = () => setShowCatalogueModal(false);

  // 形式：樣式、變數
  const [form, setForm] = useState<StyleForm>("STYLE");

  // 模式：色彩、效果、文字
  const [mode, setMode] = useState<StyleMode>("COLOR");

  const applyStyleIntroducer = (isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: 30, // Adjust the delay time as necessary
          onProceed: () => applyStyleIntroducer(true), // Retry with `isRealCall = true`
        });
        return;
      }
    }
  
    if (selectedScopes.scopes.length <= 0) {
      return;
    }
  
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
  const [hasError, setHasError] = useState(false); //  state for error tracking
  const [errorPath, setErrorPath] = useState<string | undefined>(undefined); //  state for error path

  useEffect(() => {
    const result = buildNestedStructure(styleList);

    if (result.structure) {
      setNestedStructure(result.structure);
      setHasError(false);
    } else {
      console.error("Error path:", result.errorPath);
      setHasError(true);
      setErrorPath(result.errorPath); // Store the error path for the error message
    }
  }, [styleList, mode]);

  const folderNavigator = () => {
    if (hasError) {
      return (
        <div className="text-color-error p-xsmall">
          Failed to process the {form} structure. The system encountered a
          duplicate path: "{errorPath}". Please ensure that each path segment is
          unique.
        </div>
      );
    }

    if (!nestedStructure) {
      return <div className="text-color-primary p-xsmall">Loading...</div>;
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
    setMode("COLOR");
    setNestedStructure(null);
    // 當form改變時，傳送初始化訊息
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
  }, [form]);

  useEffect(() => {
    setSelectedScopes({
      title: "",
      scopes: [],
    });
    setNestedStructure(null);
    // 當Mode改變時，傳送初始化訊息
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
  }, [mode]);

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
        <CatalogueSettingModal
          show={showCatalogueModal}
          handleClose={handleCloseCatalogueModal}
        />
      </div>
      <TitleBar
        title={t("module:moduleCatalogue")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
        rightItem={
          <FigmaButton
            title={t("module:setting")}
            onClick={handleOpenCatalogueModal}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
          />
        }
      />
      <div className="content">
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:form")} />
          <SegmentedControl
            inputName="form"
            value={form}
            onChange={(newForm) => setForm(newForm as StyleForm)}
          >
            <SegmentedControl.Option value="STYLE" label="term:style" />
            <SegmentedControl.Option value="VARIABLE" label="term:variable" />
          </SegmentedControl>
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
            {form === "VARIABLE" && (
              <>
                <option key="FLOAT" value="FLOAT">
                  {t("term:float")}
                </option>
              </>
            )}
            {form === "STYLE" && (
              <>
                <option key="EFFECT" value="EFFECT">
                  {t("term:effect")}
                </option>
                <option key="TEXT" value="TEXT">
                  {t("term:typography")}
                </option>
              </>
            )}
          </select>
        </div>
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle
            title={form === "STYLE" ? t("term:style") : t("term:variable")}
          />
          <div className="folder-navigator">{folderNavigator()}</div>
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <FigmaButton
            title={t("module:generate")}
            onClick={() => applyStyleIntroducer(false)}
            disabled={hasError}
          />
        </div>
      </div>
    </div>
  );
};

export default StyleIntroducer;
