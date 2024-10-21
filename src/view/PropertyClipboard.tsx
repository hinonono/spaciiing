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
  const { licenseManagement, setShowCTSubscribe } = useAppContext();
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
      module: "Memorizer",
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

  const locateReferenceObject = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }
  };

  // 貼上指定的屬性至所選擇的物件
  const pastePropertyToObject = (
    property: PropertyClipboardSupportedProperty
  ) => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }
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
          <div className="flex variable-list flex flex-justify-center align-items-center">
            <div>
              <span className="note">{t("module:nothingInsideClipboard")}</span>
            </div>
          </div>
          <div className="variable flex flex-justify-center align-items-center">
            <span className="text-primary">{"Layer Name"}</span>
          </div>
          <div className="grid mt-xxsmall">
            <FigmaButton
              buttonType="secondary"
              title={"Locate"}
              onClick={locateReferenceObject}
              buttonHeight="xlarge"
              hasTopBottomMargin={false}
            />
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
                    pastePropertyToObject("ALL_SIZE");
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
                  pastePropertyToObject("WIDTH");
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Height"}
                onClick={() => {
                  pastePropertyToObject("HEIGHT");
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
                  onClick={() => {}}
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
                onClick={() => {}}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Opacity"}
                onClick={() => {}}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Position"}
                onClick={() => {}}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Weight"}
                onClick={() => {}}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Stroke Style"}
                onClick={() => {}}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Dash"}
                onClick={() => {}}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Gap"}
                onClick={() => {}}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Dash Cap"}
                onClick={() => {}}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Join"}
                onClick={() => {}}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={"Miter Angle"}
                onClick={() => {}}
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
