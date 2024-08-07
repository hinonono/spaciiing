import React, { useState } from "react";
import { TitleBar, SectionTitle, FigmaButton } from "../components";
import {
  MessageMemorizer,
  MemorizerAction,
  MemorizerMode,
  AvailableMemorizeOptions,
} from "../types/Message";
import { useAppContext } from "../AppProvider";
import Modal from "../components/Modal";

const Shortcut: React.FC = () => {
  // 功能說明彈窗
  const { licenseManagement, setShowCTSubscribe } = useAppContext();
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const [mode, setMode] = useState<MemorizerMode>("memorize");
  const [options, setOptions] = useState<AvailableMemorizeOptions>("width");

  const { memorizedObjectWidth, memorizedObjectHeight, memorizedObjectName } =
    useAppContext();

  const conformMemorizerMessage = (action: MemorizerAction) => {
    const message: MessageMemorizer = {
      module: "Memorizer",
      action: action,
      direction: "Inner",
      phase: "Actual",
    };
    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  const applyMemorizer = () => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";

    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }
    if (mode == "memorize") {
      if (options == "width") {
        conformMemorizerMessage("memorizeObjectWidth");
      } else if (options == "height") {
        conformMemorizerMessage("memorizeObjectHeight");
      } else if (options == "name") {
        conformMemorizerMessage("memorizedObjectName");
      }
    } else {
      if (options == "width") {
        conformMemorizerMessage("setResizableNodeWidth");
      } else if (options == "height") {
        conformMemorizerMessage("setResizableNodeHeight");
      } else if (options == "name") {
        conformMemorizerMessage("setSelectionToMemorizedName");
      }
    }
  };

  const allDoesNotExist =
    memorizedObjectWidth == undefined &&
    memorizedObjectHeight == undefined &&
    memorizedObjectName == "";

  return (
    <div>
      <Modal
        show={showExplanationModal}
        handleClose={handleCloseExplanationModal}
      >
        <div>
          <h3>Property Clipboard</h3>
          <p>
            Memorize specific property of selected object, then apply it to
            another object(s).
          </p>
        </div>
      </Modal>
      <TitleBar
        title="Property Clipboard"
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        {/* 已記憶 */}
        <div>
          <SectionTitle title="Clipboard" />
          <div className="flex variable-list">
            {allDoesNotExist && (
              <div>
                <span className="note">
                  There is nothing inside the clipboard.
                </span>
              </div>
            )}
            {memorizedObjectWidth && (
              <div className="variable">
                <span className="text-secondary">W</span>
                <span className="text-primary">{memorizedObjectWidth}</span>
              </div>
            )}
            {memorizedObjectHeight && (
              <div className="variable">
                <span className="text-secondary">H</span>
                <span className="text-primary">{memorizedObjectHeight}</span>
              </div>
            )}
            {memorizedObjectName && (
              <div className="variable">
                <span className="text-secondary">name</span>
                <span className="text-primary">{memorizedObjectName}</span>
              </div>
            )}
          </div>
        </div>
        {/* 模式 */}
        <div className="mt-xxsmall">
          <SectionTitle title="Mode" />
          <div className="custom-segmented-control">
            <input
              type="radio"
              name="memorizer-mode"
              id="memorizer_mode_memorize"
              value="memorize"
              checked={mode === "memorize"}
              onChange={() => setMode("memorize")}
            />
            <label htmlFor="memorizer_mode_memorize">Memorize</label>
            <input
              type="radio"
              name="memorizer-mode"
              id="memorizer_mode_apply"
              value="apply"
              checked={mode === "apply"}
              onChange={() => setMode("apply")}
            />
            <label htmlFor="memorizer_mode_apply">Apply</label>
          </div>
        </div>
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle title="Options" />
          <div className="custom-radio-group">
            <input
              type="radio"
              name="memorizer-options"
              id="memorizer_option_width"
              value="width"
              checked={options === "width"}
              onChange={() => setOptions("width")}
            />
            <label htmlFor="memorizer_option_width">Width</label>
            <input
              type="radio"
              name="memorizer-options"
              id="memorizer_option_height"
              value="height"
              checked={options === "height"}
              onChange={() => setOptions("height")}
            />
            <label htmlFor="memorizer_option_height">Height</label>
            <input
              type="radio"
              name="memorizer-options"
              id="memorizer_option_name"
              value="name"
              checked={options === "name"}
              onChange={() => setOptions("name")}
            />
            <label htmlFor="memorizer_option_name">Name</label>
          </div>
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <FigmaButton
            title={"Execute"}
            id={"memorizer-apply"}
            onClick={applyMemorizer}
          />
        </div>
      </div>
    </div>
  );
};

export default Shortcut;
