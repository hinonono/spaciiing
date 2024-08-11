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
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";

const Shortcut: React.FC = () => {
  const { t } = useTranslation(["module"]);

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
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
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
          <h3>{t("module:modulePropertyClipboard")}</h3>
          <p>{t("module:modulePropertyClipboardDesc")}</p>
        </div>
      </Modal>
      <TitleBar
        title={t("module:modulePropertyClipboard")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        {/* 已記憶 */}
        <div>
          <SectionTitle title={t("module:clipboard")} />
          <div className="flex variable-list">
            {allDoesNotExist && (
              <div>
                <span className="note">
                  {t("module:nothingInsideClipboard")}
                </span>
              </div>
            )}
            {memorizedObjectWidth && (
              <div className="variable">
                <span className="text-secondary">
                  {t("module:widthAbbreviation")}
                </span>
                <span className="text-primary">{memorizedObjectWidth}</span>
              </div>
            )}
            {memorizedObjectHeight && (
              <div className="variable">
                <span className="text-secondary">
                  {t("module:heightAbbreviation")}
                </span>
                <span className="text-primary">{memorizedObjectHeight}</span>
              </div>
            )}
            {memorizedObjectName && (
              <div className="variable">
                <span className="text-secondary">
                  {t("module:nameAbbreviation")}
                </span>
                <span className="text-primary">{memorizedObjectName}</span>
              </div>
            )}
          </div>
        </div>
        {/* 模式 */}
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:mode")} />
          <div className="custom-segmented-control">
            <input
              type="radio"
              name="memorizer-mode"
              id="memorizer_mode_memorize"
              value="memorize"
              checked={mode === "memorize"}
              onChange={() => setMode("memorize")}
            />
            <label htmlFor="memorizer_mode_memorize">
              {t("module:memorize")}
            </label>
            <input
              type="radio"
              name="memorizer-mode"
              id="memorizer_mode_apply"
              value="apply"
              checked={mode === "apply"}
              onChange={() => setMode("apply")}
            />
            <label htmlFor="memorizer_mode_apply">{t("module:apply")}</label>
          </div>
        </div>
        {/* 選項 */}
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:options")} />
          <div className="custom-radio-group">
            <input
              type="radio"
              name="memorizer-options"
              id="memorizer_option_width"
              value="width"
              checked={options === "width"}
              onChange={() => setOptions("width")}
            />
            <label htmlFor="memorizer_option_width">{t("module:width")}</label>
            <input
              type="radio"
              name="memorizer-options"
              id="memorizer_option_height"
              value="height"
              checked={options === "height"}
              onChange={() => setOptions("height")}
            />
            <label htmlFor="memorizer_option_height">
              {t("module:height")}
            </label>
            <input
              type="radio"
              name="memorizer-options"
              id="memorizer_option_name"
              value="name"
              checked={options === "name"}
              onChange={() => setOptions("name")}
            />
            <label htmlFor="memorizer_option_name">{t("module:name")}</label>
          </div>
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <FigmaButton
            title={t("module:execute")}
            id={"memorizer-apply"}
            onClick={applyMemorizer}
          />
        </div>
      </div>
    </div>
  );
};

export default Shortcut;
