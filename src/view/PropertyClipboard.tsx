import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../AppProvider";
import { FigmaButton, SectionTitle, TitleBar } from "../components";
import Modal from "../components/Modal";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import { PropertyClipboardSupportedProperty } from "../types/PropertClipboard";
import { MessagePropertyClipboard } from "../types/Messages/MessagePropertyClipboard";

interface PropertyClipboardProps {}

const PropertyClipboard: React.FC<PropertyClipboardProps> = () => {
  // 多語言化
  const { t } = useTranslation(["module"]);

  // 功能說明彈窗
  const { licenseManagement, setShowCTSubscribe, editorPreference } =
    useAppContext();
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  // 記憶所選取的物件作為參考目標
  const setReferenceObject = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessagePropertyClipboard = {
      action: "setReferenceObject",
      module: "PropertyClipboard",
      phase: "Actual",
      direction: "Inner",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  // 貼上指定的屬性至所選擇的物件
  const pastePropertyToObject = (
    property: PropertyClipboardSupportedProperty[]
  ) => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessagePropertyClipboard = {
      action: "pastePropertyToObject",
      module: "PropertyClipboard",
      phase: "Actual",
      direction: "Inner",
      property: property,
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
          <SectionTitle title={"Copy from"} />
          {editorPreference.referenceObject ? (
            <div className="variable flex flex-justify-center align-items-center">
              <span className="text-primary">
                {`${editorPreference.referenceObject.name} (ID: ${editorPreference.referenceObject.id})`}
              </span>
            </div>
          ) : (
            <div className="flex variable-list flex flex-justify-center align-items-center">
              <div>
                <span className="note">
                  {t("module:nothingInsideClipboard")}
                </span>
              </div>
            </div>
          )}
          <div className="mt-xxsmall">
            <FigmaButton
              buttonType="secondary"
              title={"Memorize"}
              onClick={setReferenceObject}
              buttonHeight="xlarge"
              hasTopBottomMargin={false}
            />
          </div>
        </div>
        <div className="mt-xsmall">
          <SectionTitle title={"Paste"} />
          {/* 長度與寬度 */}
          <div className="list-view">
            <div className="list-view-header property-clipboard-header">
              <div></div>
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {"Size"}
              </div>
              <div>
                <FigmaButton
                  title={"Apply"}
                  onClick={() => {
                    pastePropertyToObject(["HEIGHT", "WIDTH"]);
                  }}
                  buttonHeight="small"
                  fontSize="small"
                  buttonType="grain"
                  hasMargin={false}
                />
              </div>
            </div>
            <div className="padding-16 grid border-1-top">
              <FigmaButton
                buttonType="secondary"
                title={"Width"}
                onClick={() => {
                  pastePropertyToObject(["WIDTH"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Height"}
                onClick={() => {
                  pastePropertyToObject(["HEIGHT"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
            </div>
          </div>
          {/* 筆畫 */}
          <div className="list-view mt-xsmall">
            <div className="list-view-header property-clipboard-header">
              <div></div>
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {"Stroke"}
              </div>
              <div>
                <FigmaButton
                  title={"Apply"}
                  onClick={() => {
                    pastePropertyToObject([
                      "STROKES",
                      "STROKE_ALIGN",
                      "STROKE_WEIGHT",
                      "STROKE_STYLE",
                      "STROKE_DASH",
                      "STROKE_GAP",
                      "STROKE_CAP",
                      "STROKE_JOIN",
                      "STROKE_MITER_LIMIT",
                    ]);
                  }}
                  buttonHeight="small"
                  fontSize="small"
                  buttonType="grain"
                  hasMargin={false}
                />
              </div>
            </div>
            <div className="padding-16 grid border-1-top">
              <FigmaButton
                buttonType="secondary"
                title={"Color"}
                onClick={() => {
                  pastePropertyToObject(["STROKES"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Position"}
                onClick={() => {
                  pastePropertyToObject(["STROKE_ALIGN"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Weight"}
                onClick={() => {
                  pastePropertyToObject(["STROKE_WEIGHT"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Stroke Style"}
                onClick={() => {
                  pastePropertyToObject(["STROKE_STYLE"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Dash"}
                onClick={() => {
                  pastePropertyToObject(["STROKE_DASH"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Gap"}
                onClick={() => {
                  pastePropertyToObject(["STROKE_GAP"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Dash Cap"}
                onClick={() => {
                  pastePropertyToObject(["STROKE_CAP"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Join"}
                onClick={() => {
                  pastePropertyToObject(["STROKE_JOIN"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Miter Angle"}
                onClick={() => {
                  pastePropertyToObject(["STROKE_MITER_LIMIT"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyClipboard;
