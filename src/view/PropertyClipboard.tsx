import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../AppProvider";
import { FigmaButton, ListViewHeader, SectionTitle, TitleBar } from "../components";
import Modal from "../components/Modal";
import { PropertyClipboardSupportedProperty } from "../types/PropertClipboard";
import {
  PasteBehavior,
} from "../types/Messages/MessagePropertyClipboard";
import { pasteInstancePropertyToObject, pastePropertyToObject, PropertyClipboardCategory, propertyClipboardOptions, setReferenceObject, } from "../module-frontend/propertyClipboardFrontEnd";

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
        title={
          t("module:instancePropertiesBtn")
            .replace("$PROPERTY_NAME$", item.propertyName)
            .replace("$VALUE$", item.value.toString())
            .replace("$LAYER_NAME$", item.layerName)
        }
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
          {appContext.referenceObject.id != "" ? (
            <div className="variable flex flex-justify-space-between align-items-center">
              <span className="text-color-primary">
                {`${appContext.referenceObject.name} (ID: ${appContext.referenceObject.id})`}
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
          <div className="mt-xxsmall"></div>
        </div>
        <div className="mt-xsmall">
          <SectionTitle title={t("term:paste")} />
          {/* Nested */}
          {
            appContext.extractedProperties.length > 0 && <div className="list-view">
              <ListViewHeader
                additionalClass={"property-clipboard-header"}
                title={t("module:instanceProperties")}
                rightItem={
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
                }
              />
              <div className="padding-16 grid border-1-top">
                {renderComponentPropertiesButton()}
              </div>
            </div>
          }
          {Object.entries(propertyClipboardOptions).map(([key, group]) => {
            // Skip rendering "text" group if the reference layer is not of type TEXT
            if (key === "typography" && appContext.referenceObject.layerType !== "TEXT") {
              return null;
            }

            const castedGroup = group as PropertyClipboardCategory;

            return (
              <div
                className={`list-view ${key !== "size" || appContext.extractedProperties.length > 0 ? "mt-xsmall" : ""
                  }`}
              >
                <ListViewHeader
                  additionalClass={"property-clipboard-header"}
                  title={t(castedGroup.titleKey)}
                  rightItem={
                    castedGroup.applyAllKeys.length > 0 && <FigmaButton
                      title={t("module:applyAll")}
                      onClick={() => {
                        castedGroup.useModal ?
                          openModalWithProperties(castedGroup.applyAllKeys) : pastePropertyToObject(appContext, castedGroup.applyAllKeys, false, pasteBehavior);
                      }}
                      buttonHeight="small"
                      fontSize="small"
                      buttonType="grain"
                      hasMargin={false}
                      disabled={appContext.referenceObject.id === "" ? true : false}
                    />
                  }
                />
                <div className="padding-16 grid border-1-top">
                  {castedGroup.items.map((i) => (
                    <FigmaButton
                      buttonType="secondary"
                      title={t(i.lableKey)}
                      onClick={() => {
                        i.useModal ?
                          openModalWithProperties(i.keys) : pastePropertyToObject(appContext, i.keys, false, pasteBehavior);
                      }}
                      buttonHeight="xlarge"
                      hasTopBottomMargin={false}
                      disabled={appContext.referenceObject.id === "" ? true : false}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyClipboard;
