import React, { useState } from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import { MessageRenamer, RenamerSupportedTargets } from "../types/Message";
import { NodeRenamable } from "../types/NodeRenamable";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";

const RenamableScopes: NodeRenamable[] = [
  "ALL_OPTIONS",
  "IMAGE",
  "TEXT",
  "FRAME",
  "GROUP",
  "ALL_SHAPE",
  "RECTANGLE",
  "ELLIPSE",
  "LINE",
  "POLYGON",
  "STAR",
  "VECTOR",
];

const Renamer: React.FC = () => {
  const { t } = useTranslation(["module"]);

  const { licenseManagement, setShowCTSubscribe } = useAppContext();
  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const [options, setOptions] = useState<RenamerSupportedTargets[]>([]);
  const [selectedScopes, setSelectedScopes] =
    useState<NodeRenamable[]>(RenamableScopes);
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
      const fillScopes: NodeRenamable[] = RenamableScopes;
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

  const applyRenamer = () => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";

    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageRenamer = {
      target: options,
      module: "Renamer",
      phase: "Actual",
      renameTarget: selectedScopes,
      docOptions: {
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
            {RenamableScopes.map((scope) => (
              <label key={scope} className="container">
                {scope}
                <input
                  type="checkbox"
                  value={scope}
                  checked={selectedScopes.includes(scope)}
                  onChange={() => handleScopeChange(scope)}
                />
                <span className="checkmark"></span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={`Options`} />
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
