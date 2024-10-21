import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../AppProvider";
import { FigmaButton, SectionTitle, TitleBar } from "../components";
import Modal from "../components/Modal";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";

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
  const memorizeSelectedObject = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }
  };

  const locateReferenceObject = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }
  };

  // 貼上指定的屬性至所選擇的物件
  const pastePropertyToSelectedObject = () => {
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
          <SectionTitle title={"Copy property from"} />
          <div className="flex variable-list border-1 flex flex-justify-center align-items-center">
            <div>
              <span className="note">{t("module:nothingInsideClipboard")}</span>
            </div>
          </div>
        </div>
        {/* 長度與寬度 */}
        <div className="list-view mt-xsmall">
          <div className="list-view-header property-clipboard-header">
            <div></div>
            <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
              {"Dimension"}
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
              title={"Width"}
              onClick={() => {}}
              buttonHeight="xlarge"
              hasTopBottomMargin={false}
            />
            <FigmaButton
              buttonType="secondary"
              title={"Height"}
              onClick={() => {}}
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
  );
};

export default PropertyClipboard;
