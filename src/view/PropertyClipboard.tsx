import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../AppProvider";
import { FigmaButton, SectionTitle, TitleBar } from "../components";
import Modal from "../components/Modal";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import { PropertyClipboardSupportedProperty } from "../types/PropertClipboard";
import {
  MessagePropertyClipboard,
  PasteBehavior,
} from "../types/Messages/MessagePropertyClipboard";

interface PropertyClipboardProps {}

const PropertyClipboard: React.FC<PropertyClipboardProps> = () => {
  // 多語言化
  const { t } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const { licenseManagement, setShowCTSubscribe, editorPreference, setFreeUserDelayModalConfig } =
    useAppContext();
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  // 行為彈窗
  const [pasteBehavior, setPasteBehavior] =
    useState<PasteBehavior>("pasteToIncrement");

  // 用於需要事先指定貼上行為時，才會帶入的貼上屬性
  const [pasteProperties, setPasteProperties] = useState<
    PropertyClipboardSupportedProperty[]
  >([]);

  const [showBehaviorModal, setShowBehaviorModal] = useState(false);
  const handleCloseBehaviorModal = () => {
    setShowBehaviorModal(false);
    setPasteProperties([]);
  };

  // 記憶所選取的物件作為參考目標
  const setReferenceObject = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      console.log("🤡 Show wait modal from property clipboard");
      
      setFreeUserDelayModalConfig({show: true, initialTime:5, onProceed: setReferenceObjectReal})
      return;
    }

    setReferenceObjectReal();
  };

  const setReferenceObjectReal = () => {
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
  }

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
      behavior: pasteBehavior,
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );

    console.log(pasteBehavior);
  };

  // Function to open the modal with the specific function to execute
  const openModalWithProperties = (
    properties: PropertyClipboardSupportedProperty[]
  ) => {
    setPasteProperties(properties);
    setShowBehaviorModal(true); // Open the modal
  };

  // Function to handle confirmation and execute the stored function
  const handleConfirm = () => {
    if (pasteProperties) {
      pastePropertyToObject(pasteProperties); // Execute the specific function
    }
    handleCloseBehaviorModal(); // Close the modal
  };
  const [shouldConfirm, setShouldConfirm] = useState(false);

  // Effect to handle confirm after pasteBehavior updates
  useEffect(() => {
    if (shouldConfirm) {
      handleConfirm();
      setShouldConfirm(false); // Reset shouldConfirm after executing
    }
  }, [pasteBehavior, shouldConfirm]);

  const handleBehaviorChangeAndConfirm = (newBehavior: PasteBehavior) => {
    setPasteBehavior(newBehavior);
    setShouldConfirm(true); // Set to confirm after behavior updates
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
      <Modal show={showBehaviorModal} handleClose={handleCloseBehaviorModal}>
        <div>
          <h3>{t("module:pastePreference")}</h3>
          <div className="grid mt-xsmall">
            <FigmaButton
              buttonType="secondary"
              title={t("module:addToExistingStyle")}
              onClick={() => handleBehaviorChangeAndConfirm("pasteToIncrement")}
              buttonHeight="xlarge"
              hasTopBottomMargin={false}
            />
            <FigmaButton
              buttonType="primary"
              title={t("module:replaceStyle")}
              onClick={() => handleBehaviorChangeAndConfirm("pasteToReplace")}
              buttonHeight="xlarge"
              hasTopBottomMargin={false}
            />
          </div>
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
          <SectionTitle title={t("module:copyFrom")} />
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
                  {t("module:selectLayerAsReference")}
                </span>
              </div>
            </div>
          )}
          <div className="mt-xxsmall">
            <FigmaButton
              buttonType="secondary"
              title={t("module:memorize")}
              onClick={setReferenceObject}
              buttonHeight="xlarge"
              hasTopBottomMargin={false}
            />
          </div>
        </div>
        <div className="mt-xsmall">
          <SectionTitle title={t("term:paste")} />
          {/* 長度與寬度 */}
          <div className="list-view">
            <div className="list-view-header property-clipboard-header">
              <div></div>
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {t("term:size")}
              </div>
              <div>
                <FigmaButton
                  title={t("module:applyAll")}
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
                title={t("term:width")}
                onClick={() => {
                  pastePropertyToObject(["WIDTH"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:height")}
                onClick={() => {
                  pastePropertyToObject(["HEIGHT"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
            </div>
          </div>
          {/* 外觀 */}
          <div className="list-view  mt-xsmall">
            <div className="list-view-header property-clipboard-header">
              <div></div>
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {t("term:appearance")}
              </div>
              <div>
                <FigmaButton
                  title={t("module:applyAll")}
                  onClick={() => {
                    pastePropertyToObject([
                      "LAYER_OPACITY",
                      "LAYER_CORNER_RADIUS",
                      "LAYER_BLEND_MODE",
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
                title={t("term:opacity")}
                onClick={() => {
                  pastePropertyToObject(["LAYER_OPACITY"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:cornerRadius")}
                onClick={() => {
                  pastePropertyToObject(["LAYER_CORNER_RADIUS"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:blendMode")}
                onClick={() => {
                  pastePropertyToObject(["LAYER_BLEND_MODE"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
            </div>
          </div>
          {/* 填色 */}
          <div className="list-view  mt-xsmall">
            <div className="list-view-header property-clipboard-header">
              <div></div>
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {t("term:allFills")}
              </div>
              <div>
                <FigmaButton
                  title={t("module:applyAll")}
                  onClick={() => {
                    openModalWithProperties(["FILL_ALL"]);
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
                title={t("term:solidFill")}
                onClick={() => {
                  openModalWithProperties(["FILL_SOLID"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:gradientFill")}
                onClick={() => {
                  openModalWithProperties(["FILL_GRADIENT"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:imageFill")}
                onClick={() => {
                  openModalWithProperties(["FILL_IMAGE"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:videoFill")}
                onClick={() => {
                  openModalWithProperties(["FILL_VIDEO"]);
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
                {t("term:stroke")}
              </div>
              <div>
                <FigmaButton
                  title={t("module:applyAll")}
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
                title={t("term:color")}
                onClick={() => {
                  pastePropertyToObject(["STROKES"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:position")}
                onClick={() => {
                  pastePropertyToObject(["STROKE_ALIGN"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:strokeWeight")}
                onClick={() => {
                  pastePropertyToObject(["STROKE_WEIGHT"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:strokeStyle")}
                onClick={() => {
                  pastePropertyToObject(["STROKE_STYLE"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:strokeDash")}
                onClick={() => {
                  pastePropertyToObject(["STROKE_DASH"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:strokeGap")}
                onClick={() => {
                  pastePropertyToObject(["STROKE_GAP"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:dashCap")}
                onClick={() => {
                  pastePropertyToObject(["STROKE_CAP"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:join")}
                onClick={() => {
                  pastePropertyToObject(["STROKE_JOIN"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:miterAngle")}
                onClick={() => {
                  pastePropertyToObject(["STROKE_MITER_LIMIT"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
            </div>
          </div>
          {/* 效果 */}
          <div className="list-view  mt-xsmall">
            <div className="list-view-header property-clipboard-header">
              <div></div>
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {t("term:effect")}
              </div>
              <div>
                <FigmaButton
                  title={t("module:applyAll")}
                  onClick={() => {
                    openModalWithProperties(["EFFECT_ALL"]);
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
                title={t("term:innerShadow")}
                onClick={() => {
                  openModalWithProperties(["EFFECT_INNER_SHADOW"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:dropShadow")}
                onClick={() => {
                  openModalWithProperties(["EFFECT_DROP_SHADOW"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:layerBlur")}
                onClick={() => {
                  openModalWithProperties(["EFFECT_LAYER_BLUR"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:backgroundBlur")}
                onClick={() => {
                  openModalWithProperties(["EFFECT_BACKGROUND_BLUR"]);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
            </div>
          </div>
          {/* 其他 */}
          <div className="list-view mt-xsmall">
            <div className="list-view-header property-clipboard-header">
              <div></div>
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {t("term:others")}
              </div>
              <div></div>
            </div>
            <div className="padding-16 grid border-1-top">
              <FigmaButton
                buttonType="secondary"
                title={t("term:exportSettings")}
                onClick={() => {
                  pastePropertyToObject(["EXPORT_SETTINGS"]);
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
