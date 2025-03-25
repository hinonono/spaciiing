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
import * as info from "../info.json";
import { pasteInstancePropertyToObject, pastePropertyToObject, resetExtractedProperties, setReferenceObject } from "../module-frontend/propertyClipboardFrontEnd";

interface PropertyClipboardProps { }

const PropertyClipboard: React.FC<PropertyClipboardProps> = () => {
  // 多語言化
  const { t } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const appContext = useAppContext();

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
      pastePropertyToObject(appContext, pasteProperties, false, pasteBehavior); // Execute the specific function
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

  const renderComponentPropertiesButton = () =>
    appContext.extractedProperties.map((item) => (
      <FigmaButton
        buttonType="secondary"
        title={`${item.propertyName}=${item.value} (from ${item.layerName})`}
        onClick={() => {
          pasteInstancePropertyToObject(
            false,
            appContext,
            [item]
          );
        }}
        buttonHeight="xlarge"
        hasTopBottomMargin={false}
      />
    ));

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
          {appContext.editorPreference.referenceObject ? (
            <div className="variable flex flex-justify-space-between align-items-center">
              <span className="text-color-primary">
                {`${appContext.editorPreference.referenceObject.name} (ID: ${appContext.editorPreference.referenceObject.id})`}
              </span>
              <FigmaButton
                buttonType="tertiary"
                title={t("module:memorize")}
                onClick={() => setReferenceObject(false, appContext)}
                buttonHeight="small"
                hasTopBottomMargin={false}
              />
            </div>
          ) : (
            <div className="variable flex flex-justify-space-between align-items-center">
              <span className="text-color-secondary">
                {t("module:selectLayerAsReference")}
              </span>
              <FigmaButton
                buttonType="tertiary"
                title={t("module:memorize")}
                onClick={() => setReferenceObject(false, appContext)}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
            </div>
          )}
          <div className="mt-xxsmall">

          </div>
        </div>
        <div className="mt-xsmall">
          <SectionTitle title={t("term:paste")} />
          {/* Nested */}
          {
            appContext.extractedProperties.length > 0 && <div className="list-view">
              <div className="list-view-header property-clipboard-header">
                <div></div>
                <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                  INSTANCE PROPERTIES
                </div>
                <div>
                  <FigmaButton
                    title={t("module:applyAll")}
                    onClick={() => {
                      pasteInstancePropertyToObject(false, appContext, appContext.extractedProperties)
                    }}
                    buttonHeight="small"
                    fontSize="small"
                    buttonType="grain"
                    hasMargin={false}
                  />
                </div>
              </div>
              <div className="padding-16 grid border-1-top">
                {renderComponentPropertiesButton()}
              </div>
            </div>
          }
          {/* 長度與寬度 */}
          <div className="list-view mt-xsmall">
            <div className="list-view-header property-clipboard-header">
              <div></div>
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {t("term:size")}
              </div>
              <div>
                <FigmaButton
                  title={t("module:applyAll")}
                  onClick={() => {
                    pastePropertyToObject(appContext, ["HEIGHT", "WIDTH"], false, pasteBehavior);
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
                  pastePropertyToObject(appContext, ["WIDTH"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:height")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["HEIGHT"], false, pasteBehavior);
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
                    pastePropertyToObject(
                      appContext,
                      [
                        "LAYER_OPACITY",
                        "LAYER_CORNER_RADIUS",
                        "LAYER_BLEND_MODE",
                      ],
                      false,
                      pasteBehavior);
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
                  pastePropertyToObject(appContext, ["LAYER_OPACITY"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:cornerRadius")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["LAYER_CORNER_RADIUS"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:blendMode")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["LAYER_BLEND_MODE"], false, pasteBehavior);
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
                    pastePropertyToObject(
                      appContext,
                      [
                        "STROKES",
                        "STROKE_ALIGN",
                        "STROKE_WEIGHT",
                        "STROKE_STYLE",
                        "STROKE_DASH",
                        "STROKE_GAP",
                        "STROKE_CAP",
                        "STROKE_JOIN",
                        "STROKE_MITER_LIMIT",
                      ], false, pasteBehavior);
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
                  pastePropertyToObject(appContext, ["STROKES"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:position")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["STROKE_ALIGN"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:strokeWeight")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["STROKE_WEIGHT"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:strokeStyle")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["STROKE_STYLE"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:strokeDash")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["STROKE_DASH"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:strokeGap")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["STROKE_GAP"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:dashCap")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["STROKE_CAP"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:join")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["STROKE_JOIN"], false, pasteBehavior);
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("term:miterAngle")}
                onClick={() => {
                  pastePropertyToObject(appContext, ["STROKE_MITER_LIMIT"], false, pasteBehavior);
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
                  pastePropertyToObject(appContext, ["EXPORT_SETTINGS"], false, pasteBehavior);
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
