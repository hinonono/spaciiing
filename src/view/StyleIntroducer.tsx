import React, { useEffect, useState } from "react";
import { FigmaButton, SectionTitle, TitleBar } from "../components";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import Modal from "../components/Modal";
import { StyleForm, StyleMode, } from "../types/Messages/MessageStyleIntroducer";
import { NestedStructure, StyleSelection } from "../types/General";
import { applyStyleIntroducer, buildNestedStructure, reInitStyleIntroducer } from "../module-frontend/styleIntroducerFrontEnd";
import FolderNavigator from "../components/FolderNavigator";
import SegmentedControl from "../components/SegmentedControl";
import { CatalogueSettingModal } from "../components/modalComponents";

interface StyleIntroducerProps { }

const StyleIntroducer: React.FC<StyleIntroducerProps> = () => {
  // Context
  const appContext = useAppContext();
  const { t, i18n } = useTranslation(["common", "settings", "license", "term"]);

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
    const result = buildNestedStructure(appContext.styleList);

    if (result.structure) {
      setNestedStructure(result.structure);
      setHasError(false);
    } else {
      console.error("Error path:", result.errorPath);
      setHasError(true);
      setErrorPath(result.errorPath); // Store the error path for the error message
    }
  }, [appContext.styleList, mode]);

  const folderNavigator = () => {
    if (hasError) {
      return (
        <div className="text-color-error p-xsmall font-size-small">
          Failed to process the {form} structure. The system encountered a
          duplicate path: "{errorPath}". Please ensure that all {form} names are unique.
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
    setMode("COLOR");
    clearScopeAndStructure();
    reInitStyleIntroducer(i18n.language, form, mode,)
  }, [form]);

  useEffect(() => {
    clearScopeAndStructure();
    reInitStyleIntroducer(i18n.language, form, mode);
  }, [mode]);

  function clearScopeAndStructure() {
    setSelectedScopes({ title: "", scopes: [], });
    setNestedStructure(null);
  }

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
            <option key="COLOR" value="COLOR">{t("term:color")}</option>
            {form === "VARIABLE" && (
              <>
                <option key="FLOAT" value="FLOAT">{t("term:float")}</option>
                <option key="STRING" value="STRING">{t("term:string")}</option>
              </>
            )}
            {form === "STYLE" && (
              <>
                <option key="EFFECT" value="EFFECT">{t("term:effect")}</option>
                <option key="TEXT" value="TEXT">{t("term:typography")}</option>
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
            onClick={() => {
              applyStyleIntroducer(
                appContext,
                selectedScopes,
                form,
                mode,
                i18n.language,
                false
              )
            }}
            disabled={hasError}
          />
        </div>
      </div>
    </div>
  );
};

export default StyleIntroducer;
