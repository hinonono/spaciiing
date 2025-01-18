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

const Renamer: React.FC = () => {
  const { t } = useTranslation(["module", "term"]);

  const { licenseManagement, setShowCTSubscribe, setFreeUserDelayModalConfig } = useAppContext();
  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  //
  const RenamableScopesNew: {
    nameKey: string;
    scope: NodeRenamable;
    indented?: boolean;
    indentLevel?: number;
  }[] = [
    { nameKey: "term:allOptions", scope: "ALL_OPTIONS" },
    { nameKey: "term:image", scope: "IMAGE" },
    { nameKey: "term:text", scope: "TEXT" },
    { nameKey: "term:frame", scope: "FRAME" },
    { nameKey: "term:group", scope: "GROUP" },
    { nameKey: "term:allShape", scope: "ALL_SHAPE" },
    {
      nameKey: "term:rectangle",
      scope: "RECTANGLE",
      indented: true,
      indentLevel: 1,
    },
    {
      nameKey: "term:ellipse",
      scope: "ELLIPSE",
      indented: true,
      indentLevel: 1,
    },
    { nameKey: "term:line", scope: "LINE", indented: true, indentLevel: 1 },
    {
      nameKey: "term:polygon",
      scope: "POLYGON",
      indented: true,
      indentLevel: 1,
    },
    { nameKey: "term:star", scope: "STAR", indented: true, indentLevel: 1 },
    { nameKey: "term:vector", scope: "VECTOR", indented: true, indentLevel: 1 },
  ];
  const initialScopes = RenamableScopesNew.map((item) => item.scope);

  //
  const [options, setOptions] = useState<RenamerSupportedTargets[]>([]);
  const [selectedScopes, setSelectedScopes] =
    useState<NodeRenamable[]>(initialScopes);
  const [deleteHiddenLayer, setDeleteHiddenLayer] = useState(false);
  const [skipLockedLayer, setSkipLockedLayer] = useState(true);
  const [includeParentLayer, setIncludeParentLayer] = useState(false);

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

  const handleIncludeParentLayerChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIncludeParentLayer(event.target.checked);
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
          initialTime: 30, // You can adjust the delay time as needed
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
        skipLockedLayer: skipLockedLayer,
        includeParentLayer: includeParentLayer,
      },
    };
  
    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
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
          <h4>{t("module:renameFormat")}</h4>
          <ul>
            <li>{t("module:renameImage")}</li>
            <li>{t("module:renameAutoLayout")}</li>
            <li>{t("module:renameText")}</li>
            <li>{t("module:renameFrame")}</li>
            <li>{t("module:renameGroup")}</li>
            <li>{t("module:renameRectangle")}</li>
            <li>{t("module:renameEllipse")}</li>
            <li>{t("module:renameLine")}</li>
            <li>{t("module:renamePolygon")}</li>
            <li>{t("module:renameStar")}</li>
            <li>{t("module:renameVector")}</li>
          </ul>
        </div>
      </Modal>
      <TitleBar
        title={t("module:moduleNamingClener")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle
            title={`${t("module:renameScopes")} (${selectedScopes.length})`}
          />
          <div className="custom-checkbox-group scope-group hide-scrollbar-vertical">
            {RenamableScopesNew.map((item) => (
              <label
                key={item.scope}
                className={`container ${
                  item.indented ? `indent-level-${item.indentLevel}` : ""
                }`}
              >
                {t(item.nameKey)}
                <input
                  type="checkbox"
                  value={item.scope}
                  checked={selectedScopes.includes(item.scope)}
                  onChange={() => handleScopeChange(item.scope)}
                />
                <span className="checkmark"></span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:options")} />
          <div className="custom-checkbox-group">
            <label className="container">
              {t("module:deleteHiddenLayers")}
              <input
                type="checkbox"
                checked={deleteHiddenLayer}
                onChange={handleDeleteHiddenLayerChange}
              />
              <span className="checkmark"></span>
            </label>
            <label className="container">
              {t("module:includeParentLayers")}
              <input
                type="checkbox"
                checked={includeParentLayer}
                onChange={handleIncludeParentLayerChange}
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
          </div>
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <FigmaButton
            title={t("module:cleanUp")}
            id={"renamer-apply"}
            onClick={applyRenamer}
          />
        </div>
      </div>
    </div>
  );
};

export default Renamer;
