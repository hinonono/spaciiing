import React, { useState } from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import { MessageRenamer, RenamerSupportedTargets } from "../types/Message";
import { NodeRenamable } from "../types/NodeRenamable";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";

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
          <h3>Naming Cleaner</h3>
          <p>Clean the naming of layers within your selection.</p>
          <h4>Rename format</h4>
          <ul>
            <li>Image: Image</li>
            <li>Auto layout: V Auto Layout / H Auto Layout</li>
            <li>Text: The content of the itself</li>
            <li>Frame: Frame</li>
            <li>Group: Group</li>
            <li>Rectangle: Rectangle</li>
            <li>Ellipse: Ellipse</li>
            <li>Line: Line</li>
            <li>Polygon: Polygon</li>
            <li>Star: Star</li>
            <li>Vector: Vector</li>
          </ul>
        </div>
      </Modal>
      <TitleBar
        title="Naming Cleaner"
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle title={`Rename Scopes (${selectedScopes.length})`} />
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
              Delete hidden layers
              <input
                type="checkbox"
                checked={deleteHiddenLayer}
                onChange={handleDeleteHiddenLayerChange}
              />
              <span className="checkmark"></span>
            </label>
            <label className="container">
              Include parent layers
              <input
                type="checkbox"
                checked={includeParentLayer}
                onChange={handleIncludeParentLayerChange}
              />
              <span className="checkmark"></span>
            </label>
            <label className="container">
              Skip lock layers
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
            title={"Clean selection"}
            id={"renamer-apply"}
            onClick={applyRenamer}
          />
        </div>
      </div>
    </div>
  );
};

export default Renamer;
