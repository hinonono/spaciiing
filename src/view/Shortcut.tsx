import React, { useState } from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import {
  FindAndReplaceModal,
  FramerModal,
  IconTemplateModal,
  LoremIpsumModal,
  MagicObjectModal,
  UnifyTextModal,
} from "../components/modalComponents";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import {
  ShortcutAction,
  MessageShortcutGenerateMagicalObjectMember,
} from "../types/Messages/MessageShortcut";
import { createAutoLayoutIndividually } from "../module-frontend/shortcutFronEnd";

const Shortcut: React.FC = () => {
  const { t } = useTranslation(["module"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const { licenseManagement, setShowCTSubscribe, editorPreference } =
    useAppContext();

  // icon
  const [showIconModal, setShowIconModal] = useState(false);
  const handleOpenIconModal = () => setShowIconModal(true);
  const handleCloseIconModal = () => setShowIconModal(false);

  // lorem ipsum
  const [showLoremModal, setShowLoremModal] = useState(false);
  const handleOpenLoremModal = () => setShowLoremModal(true);
  const handleCloseLoremModal = () => setShowLoremModal(false);

  // Framer功能
  const [showFramerModal, setShowFramerModal] = useState(false);
  const handleOpenFramerModal = () => setShowFramerModal(true);
  const handleCloseFramerModal = () => setShowFramerModal(false);

  // 神奇物件彈窗
  const [showMagicObjectModal, setShowMagicObjectModal] = useState(false);
  const handleOpenMagicObjectModal = () => setShowMagicObjectModal(true);
  const handleCloseMagicObjectModal = () => setShowMagicObjectModal(false);

  // 統一文字彈窗
  const [showUnifyTextModal, setShowUnifyTextModal] = useState(false);
  const handleOpenUnifyTextModal = () => setShowUnifyTextModal(true);
  const handleCloseUnifyTextModal = () => setShowUnifyTextModal(false);

  // Find and replace in selection for text
  const [showFindAndReplaceModal, setShowFindAndReplaceModal] = useState(false);
  const handleOpenFindAndReplaceModal = () => setShowFindAndReplaceModal(true);
  const handleCloseFindAndReplaceModal = () =>
    setShowFindAndReplaceModal(false);

  const applyShortcut = (action: ShortcutAction) => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    const message = {
      module: "Shortcut",
      action: action,
      direction: "Inner",
      phase: "Actual",
    };

    switch (action) {
      case "generateNote":
        Object.assign(message, {
          member: "note",
          componentId: editorPreference.magicObjects.noteId,
        } as MessageShortcutGenerateMagicalObjectMember);
        break;
      case "generateDesignStatusTag":
        Object.assign(message, {
          member: "designStatusTag",
          componentId: editorPreference.magicObjects.tagId,
        } as MessageShortcutGenerateMagicalObjectMember);
        break;
      case "generateTitleSection":
        Object.assign(message, {
          member: "titleSection",
          componentId: editorPreference.magicObjects.sectionId,
        } as MessageShortcutGenerateMagicalObjectMember);
        break;
      default:
        break;
    }

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  return (
    <div>
      <div>
        <Modal
          show={showExplanationModal}
          handleClose={handleCloseExplanationModal}
        >
          <div>
            <h3>{t("module:moduleShortcut")}</h3>
            <p>{t("module:moduleShortcutDesc")}</p>
            <h4>{t("module:generateHEXorRGB")}</h4>
            <p>{t("module:generateHEXorRGBDesc")}</p>
            <h4>{t("module:generateNoteDesignStatusTag")}</h4>
            <p>{t("module:generateNoteDesignStatusTagDesc")}</p>
          </div>
        </Modal>
        <UnifyTextModal
          show={showUnifyTextModal}
          handleClose={handleCloseUnifyTextModal}
        />
        <MagicObjectModal
          show={showMagicObjectModal}
          handleClose={handleCloseMagicObjectModal}
        />
        <IconTemplateModal
          show={showIconModal}
          handleClose={handleCloseIconModal}
        />
        <FramerModal
          show={showFramerModal}
          handleClose={handleCloseFramerModal}
        />
        <FindAndReplaceModal
          show={showFindAndReplaceModal}
          handleClose={handleCloseFindAndReplaceModal}
        />
        <LoremIpsumModal
          show={showLoremModal}
          handleClose={handleCloseLoremModal}
        />
      </div>
      <TitleBar
        title={t("module:moduleShortcut")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        <div>
          {/* 框 */}
          <div className="list-view mt-xsmall">
            <div className="list-view-header flex flex-justify-center">
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {t("module:frame")}
              </div>
            </div>
            <div className="padding-16 grid border-1-top">
              <FigmaButton
                buttonType="secondary"
                title={t("module:createShadowOverlay")}
                id={"shortcut-overlay"}
                onClick={() => {
                  applyShortcut("makeFrameOverlay");
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("module:alignToFrameEdge")}
                id={"shortcut-framer"}
                onClick={handleOpenFramerModal}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
            </div>
          </div>
          {/* 文字 */}
          <div className="list-view mt-xsmall">
            <div className="list-view-header flex flex-justify-center">
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {t("module:text")}
              </div>
            </div>
            <div className="padding-16 grid border-1-top">
              <FigmaButton
                buttonType="secondary"
                title={t("module:findAndReplace")}
                onClick={handleOpenFindAndReplaceModal}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("module:createTextStyleFromSelection")}
                onClick={() => {
                  applyShortcut("convertSelectionToTextStyles");
                }}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
              <FigmaButton
                buttonType="secondary"
                title={t("module:unifyText")}
                onClick={handleOpenUnifyTextModal}
                buttonHeight="xlarge"
                hasTopBottomMargin={false}
              />
            </div>
          </div>
          {/* 生成 */}
          <div className="list-view mt-xsmall">
            <div className="list-view-header flex flex-justify-center">
              <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
                {t("module:generate")}
              </div>
            </div>
            <div className="padding-16 border-1-top">
              <SectionTitle
                title={t("module:fileOrganizingObject")}
                actionTitle={t("module:setting")}
                action={handleOpenMagicObjectModal}
              />
              <div className="grid mt-xxxsmall">
                <FigmaButton
                  buttonType="secondary"
                  title={t("module:note")}
                  id={"shortcut-generate-note"}
                  onClick={() => {
                    applyShortcut("generateNote");
                  }}
                  disabled={
                    editorPreference.magicObjects.noteId == "" ? true : false
                  }
                  buttonHeight="xlarge"
                  hasTopBottomMargin={false}
                />
                <FigmaButton
                  buttonType="secondary"
                  title={t("module:designStatusTag")}
                  id={"shortcut-generate-design-status-tag"}
                  onClick={() => {
                    applyShortcut("generateDesignStatusTag");
                  }}
                  disabled={
                    editorPreference.magicObjects.tagId == "" ? true : false
                  }
                  buttonHeight="xlarge"
                  hasTopBottomMargin={false}
                />
                <FigmaButton
                  buttonType="secondary"
                  title={t("module:titleSection")}
                  id={"shortcut-generate-title-section"}
                  onClick={() => {
                    applyShortcut("generateTitleSection");
                  }}
                  disabled={
                    editorPreference.magicObjects.sectionId == "" ? true : false
                  }
                  buttonHeight="xlarge"
                  hasTopBottomMargin={false}
                />
              </div>
              <div className="mt-xsmall"></div>
              <SectionTitle title={t("module:colorValueToTextLabel")} />
              <div className="grid mt-xxxsmall">
                <FigmaButton
                  buttonType="secondary"
                  title={t("module:hexValue")}
                  id={"shortcut-color-to-label-hex"}
                  onClick={() => {
                    applyShortcut("colorToLabelHEX");
                  }}
                  buttonHeight="xlarge"
                  hasTopBottomMargin={false}
                />
                <FigmaButton
                  buttonType="secondary"
                  title={t("module:hexValueWithTransparency")}
                  id={"shortcut-color-to-label-hex-transparent"}
                  onClick={() => {
                    applyShortcut("colorToLabelHEXWithTransparency");
                  }}
                  buttonHeight="xlarge"
                  hasTopBottomMargin={false}
                />
                <FigmaButton
                  buttonType="secondary"
                  title={t("module:rgbValue")}
                  id={"shortcut-color-to-label-rgb"}
                  onClick={() => {
                    applyShortcut("colorToLabelRGB");
                  }}
                  buttonHeight="xlarge"
                  hasTopBottomMargin={false}
                />
                <FigmaButton
                  buttonType="secondary"
                  title={t("module:rgbaValue")}
                  id={"shortcut-color-to-label-rgba"}
                  onClick={() => {
                    applyShortcut("colorToLabelRGBA");
                  }}
                  buttonHeight="xlarge"
                  hasTopBottomMargin={false}
                />
              </div>
              <div className="mt-xsmall"></div>
              <SectionTitle title={t("module:other")} />
              <div className="grid mt-xxxsmall">
                <FigmaButton
                  buttonType="secondary"
                  title={t("module:loremIpsumText")}
                  onClick={handleOpenLoremModal}
                  buttonHeight="xlarge"
                  hasTopBottomMargin={false}
                />
                <FigmaButton
                  buttonType="secondary"
                  title={t("module:createAutoLayoutIndividually")}
                  onClick={createAutoLayoutIndividually}
                  buttonHeight="xlarge"
                  hasTopBottomMargin={false}
                />
                <FigmaButton
                  buttonType="secondary"
                  title={t("module:iconTemplate")}
                  onClick={handleOpenIconModal}
                  buttonHeight="xlarge"
                  hasTopBottomMargin={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shortcut;
