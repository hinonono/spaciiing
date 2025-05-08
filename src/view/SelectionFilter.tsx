import React, { useState } from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import Modal from "../components/Modal";
import { NodeFilterable } from "../types/NodeFilterable";
import {
  AdditionalFilterOptions,
  MessageSelectionFilter,
} from "../types/Messages/MessageSelectionFilter";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import * as info from "../info.json";
import { FilterableScopesNew } from "../module-frontend/selectionFilterUI";

const SelectionFilter: React.FC = () => {
  const { t } = useTranslation(["module", "term"]);
  const { licenseManagement, setFreeUserDelayModalConfig, editorType } = useAppContext();

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const [skipLockedLayer, setSkipLockedLayer] = useState(true);
  const handleSkipLockedLayerChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setSkipLockedLayer(event.target.checked);
  };
  const [skipHiddenLayer, setSkipHiddenLayer] = useState(true);
  const handleSkipHiddenLayerChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setSkipHiddenLayer(event.target.checked);
  };
  const [findWithName, setFindWithName] = useState(false);
  const handleFindWithNameChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setFindWithName(event.target.checked);
    if (event.target.checked == false) {
      setFindCriteria("");
    }
  };

  // 主要功能
  const [selectedScopes, setSelectedScopes] = useState<NodeFilterable[]>([]);
  const handleScopeChange = (scope: NodeFilterable) => {
    if (scope === "ALL_OPTIONS") {
      // Toggle specific fill scopes
      const scopes = FilterableScopesNew.map((item) => item.scope);
      const fillScopes: NodeFilterable[] = scopes;
      setSelectedScopes((prevScopes) =>
        prevScopes.includes(scope)
          ? prevScopes.filter((s) => !fillScopes.includes(s))
          : [...new Set([...prevScopes, ...fillScopes])]
      );
    } else if (scope === "ALL_SHAPE") {
      // Toggle specific fill scopes
      const fillScopes: NodeFilterable[] = [
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
  const [findCriteria, setFindCriteria] = useState("");
  const handleFindCriteriaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFindCriteria(event.target.value);
  };

  // 傳送訊息
  const applySelectionFilter = (isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: info.freeUserWaitingTime,
          onProceed: () => applySelectionFilter(true), // Re-invoke with the real call
        });
        return;
      }
    }

    const addtionalOptions: AdditionalFilterOptions = {
      skipLockLayers: skipLockedLayer,
      skipHiddenLayers: skipHiddenLayer,
      findWithName: findWithName,
      findCriteria: findCriteria,
    };

    const message: MessageSelectionFilter = {
      filterScopes: selectedScopes,
      module: "SelectionFilter",
      phase: "Actual",
      direction: "Inner",
      additionalFilterOptions: addtionalOptions,
    };

    parent.postMessage({ pluginMessage: message, }, "*");
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
        title={t("module:moduleSelectionFilter")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        {/* 圖層類型 */}
        <div className="mt-xxsmall">
          <SectionTitle
            title={`${t("module:filterFor")} (${selectedScopes.length})`}
          />
          <div className="cy-checkbox-group border-1-cy-border-light scope-group scope-group-large hide-scrollbar-vertical">
            {FilterableScopesNew.map((item) => item.supportedEditorTypes.includes(editorType) && (
              <label
                key={t(item.nameKey)}
                className={`container ${item.indented ? `indent-level-${item.indentLevel}` : ""
                  }`}
              >
                <div className="flex align-items-center">
                  {item.svg && <div className="icon-20 mr-xxxsmall">{item.svg}</div>}
                  {t(item.nameKey)}
                </div>
                <input
                  type="checkbox"
                  value={item.scope}
                  checked={selectedScopes.includes(item.scope)}
                  onChange={() => handleScopeChange(item.scope)}
                />
                <span className={`checkmark ${item.svg && "when-has-icon"}`}></span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:options")} />
          <div className="cy-checkbox-group">
            <label className="container">
              {t("module:skipHiddenLayers")}
              <input
                type="checkbox"
                checked={skipHiddenLayer}
                onChange={handleSkipHiddenLayerChange}
              />
              <span className="checkmark"></span>
            </label>
            <label className="container">
              {t("module:skipLockLayers")}
              <input
                type="checkbox"
                checked={skipLockedLayer}
                onChange={handleSkipLockedLayerChange}
              />
              <span className="checkmark"></span>
            </label>
            <label className="container">
              {t("module:findWithName")}
              <input
                type="checkbox"
                checked={findWithName}
                onChange={handleFindWithNameChange}
              />
              <span className="checkmark"></span>
            </label>
            {findWithName && (
              <div className="indent-level-1">
                <textarea
                  className="textarea"
                  rows={1}
                  value={findCriteria}
                  onChange={handleFindCriteriaChange}
                  placeholder={t("module:findWithName")}
                />
              </div>
            )}
          </div>
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <FigmaButton
            title={t("module:filter")}
            id={"selection-filter-apply"}
            onClick={() => applySelectionFilter(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectionFilter;
