import React, { useState } from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import { NodeRenamable } from "../types/NodeRenamable";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import {
  RenamerSupportedTargets,
  MessageRenamer,
} from "../types/Messages/MessageRenamer";
import * as pluginConfig from "../pluginConfig.json";
import { RenamableScopesNew } from "../module-frontend/renamerUI";
import CYCheckbox from "../components/CYCheckbox";

const Renamer: React.FC = () => {
  const { t, i18n } = useTranslation(["module", "term"]);

  const { licenseManagement, setShowCTSubscribe, setFreeUserDelayModalConfig } = useAppContext();
  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  //

  const initialScopes = RenamableScopesNew.map((item) => item.scope);

  //
  const [options, setOptions] = useState<RenamerSupportedTargets[]>([]);
  const [selectedScopes, setSelectedScopes] =
    useState<NodeRenamable[]>(initialScopes);
  const [deleteHiddenLayer, setDeleteHiddenLayer] = useState(false);
  const [skipLockedLayer, setSkipLockedLayer] = useState(true);
  const [skipHiddenLayer, setSkipHiddenLayer] = useState(true);
  const handleSkipHiddenLayerChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setSkipHiddenLayer(event.target.checked);
  };

  const [useTextLayerContent, setUseTextLayerContent] = useState(true);

  // Handle checkbox change
  const handleDeleteHiddenLayerChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setDeleteHiddenLayer(event.target.checked);
  };

  const handleSkipLockedLayerChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setSkipLockedLayer(event.target.checked);
  };

  const handleUseTextLayerContentChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setUseTextLayerContent(event.target.checked);
  };

  const handleScopeChange = (scope: NodeRenamable) => {
    if (scope === "ALL_OPTIONS") {
      // Toggle specific fill scopes
      const fillScopes: NodeRenamable[] = RenamableScopesNew.map(
        (item) => item.scope
      );
      setSelectedScopes((prevScopes) =>
        prevScopes.includes(scope)
          ? prevScopes.filter((s) => !fillScopes.includes(s))
          : [...new Set([...prevScopes, ...fillScopes])]
      );
    } else if (scope === "ALL_SHAPE") {
      // Toggle specific fill scopes
      const fillScopes: NodeRenamable[] = [
        "RECTANGLE",
        "ELLIPSE",
        "LINE",
        "POLYGON",
        "STAR",
        "VECTOR",
        "ALL_SHAPE",
      ];
      setSelectedScopes((prevScopes) =>
        prevScopes.includes(scope)
          ? prevScopes.filter((s) => !fillScopes.includes(s))
          : [...new Set([...prevScopes, ...fillScopes])]
      );
    } else {
      // Standard toggle for individual scopes
      setSelectedScopes((prevScopes) =>
        prevScopes.includes(scope)
          ? prevScopes.filter((s) => s !== scope)
          : [...prevScopes, scope]
      );
    }
  };

  const applyRenamer = (isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: pluginConfig.freeUserWaitingTime, // You can adjust the delay time as needed
          onProceed: () => applyRenamer(true), // Retry the function with `isRealCall = true`
        });
        return;
      }
    }

    // Real logic for applying the renamer
    const message: MessageRenamer = {
      target: options,
      module: "Renamer",
      phase: "Actual",
      renameTarget: selectedScopes,
      options: {
        deleteHiddenLayer: deleteHiddenLayer,
        skipHiddenLayers: skipHiddenLayer,
        skipLockedLayer: skipLockedLayer,
        useTextLayerContent: useTextLayerContent,
      },
      lang: i18n.language
    };

    parent.postMessage({ pluginMessage: message, }, "*");
  };

  return (
    <div>
      <Modal
        show={showExplanationModal}
        handleClose={handleCloseExplanationModal}
      >
        <div>
          <h3>{t("module:moduleNamingClener")}</h3>
          <p>{t("module:moduleNamingClenerDesc")}</p>
        </div>
      </Modal>
      <TitleBar
        title={t("module:moduleNamingClener")}
        onClick={handleOpenExplanationModal}
      />
      <div className="content">
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle
            title={`${t("module:renameScopes")} (${selectedScopes.length})`}
          />
          <div className="cy-checkbox-group border-1-cy-border-light scope-group scope-group-large hide-scrollbar-vertical">
            {RenamableScopesNew.map((item) => (
              <CYCheckbox
                label={
                  <div className="flex align-items-center">
                    {item.svg && <div className="icon-20 mr-xxsmall">{item.svg}</div>}
                    {t(item.nameKey)}
                  </div>
                }
                checked={selectedScopes.includes(item.scope)}
                onChange={() => handleScopeChange(item.scope)}
                labelKey={item.scope}
                labelAdditionClass={`${item.indented ? `indent-level-${item.indentLevel}` : ""}`}
                value={item.scope}
              />
            ))}
          </div>
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:options")} />
          <div className="cy-checkbox-group">
            <CYCheckbox
              label={t("module:skipHiddenLayers")}
              checked={skipHiddenLayer}
              onChange={handleSkipHiddenLayerChange}
            />
            <CYCheckbox
              label={t("module:skipLockLayers")}
              checked={skipLockedLayer}
              onChange={handleSkipLockedLayerChange}
            />
            <CYCheckbox
              label={t("module:useTextLayerContent")}
              checked={useTextLayerContent}
              onChange={handleUseTextLayerContentChange}
            />
          </div>
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <FigmaButton
            title={`${t("module:cleanUp")} (${selectedScopes.length})`}
            id={"renamer-apply"}
            onClick={() => applyRenamer(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Renamer;
