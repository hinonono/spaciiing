import React, { useState } from "react";
import { TitleBar, FigmaButton, ListViewHeader } from "../components";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import {
  FindAndReplaceModal,
  FramerModal,
  IconTemplateModal,
  LoremIpsumModal,
  MagicObjectModal,
  NumberingModal,
  SpiltTextModal,
  UnifyTextModal,
} from "../components/modalComponents";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import {
  ShortcutAction,
  MessageShortcutGenerateMagicalObjectMember,
} from "../types/Messages/MessageShortcut";
import { createAutoLayoutIndividually, ShortcutButtonConfig } from "../module-frontend/shortcutFronEnd";
import * as info from "../info.json";
import { SvgNote } from "../assets/icons";
import SvgTag from "../assets/icons/SvgTag";
import SvgSection from "../assets/icons/SvgSection";

const Shortcut: React.FC = () => {
  const { t } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const appContext = useAppContext();

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

  // 文字圖層編號彈窗
  const [showNumberingModal, setShowNumberingModal] = useState(false);
  const handleOpenNumberingModal = () => setShowNumberingModal(true);
  const handleCloseNumberingModal = () => setShowNumberingModal(false);

  // 文字分割彈窗
  const [spiltTextModal, setSpiltTextModal] = useState(false);
  const handleOpenSpiltTextModal = () => setSpiltTextModal(true)
  const handleCloseSpiltTextModal = () => setSpiltTextModal(false);

  // Find and replace in selection for text
  const [showFindAndReplaceModal, setShowFindAndReplaceModal] = useState(false);
  const handleOpenFindAndReplaceModal = () => setShowFindAndReplaceModal(true);
  const handleCloseFindAndReplaceModal = () =>
    setShowFindAndReplaceModal(false);

  const applyShortcut = (action: ShortcutAction, isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
        appContext.setFreeUserDelayModalConfig({
          show: true,
          initialTime: info.freeUserWaitingTime,
          onProceed: () => applyShortcut(action, true), // Retry with isRealCall = true
        });
        return;
      }
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
          componentId: appContext.editorPreference.magicObjects.noteId,
        } as MessageShortcutGenerateMagicalObjectMember);
        break;
      case "generateDesignStatusTag":
        Object.assign(message, {
          member: "designStatusTag",
          componentId: appContext.editorPreference.magicObjects.tagId,
        } as MessageShortcutGenerateMagicalObjectMember);
        break;
      case "generateTitleSection":
        Object.assign(message, {
          member: "titleSection",
          componentId: appContext.editorPreference.magicObjects.sectionId,
        } as MessageShortcutGenerateMagicalObjectMember);
        break;
      default:
        break;
    }

    parent.postMessage({ pluginMessage: message, }, "*");
  };

  const renderButtons = (buttons: ShortcutButtonConfig[]) => (
    <div className="grid mt-xxxsmall">
      {buttons.map(({ id, title, onClick, disabled }, i) => (
        <FigmaButton
          key={id || i}
          id={id}
          buttonType="secondary"
          title={title}
          onClick={onClick}
          disabled={disabled}
          buttonHeight="xlarge"
          hasTopBottomMargin={false}
        />
      ))}
    </div>
  );

  const renderShortcutSection = (title: string, buttons: ShortcutButtonConfig[]) => (
    <div className="list-view mt-xsmall">
      <ListViewHeader title={title} additionalClass="property-clipboard-header" />
      <div className="padding-16 border-1-top">
        {renderButtons(buttons)}
      </div>
    </div>
  );

  const renderCatalogueShortcut = () => {
    if (appContext.editorType === "figma") {
      const buttons: ShortcutButtonConfig[] = [
        {
          title: t("module:updateCatalogueDescBackToFigma"),
          onClick: () => applyShortcut("updateCatalogueDescBackToFigma", false),
        },
      ]

      return (
        renderShortcutSection(t("module:moduleCatalogue"), buttons)
      )
    } else {
      return null;
    }
  }

  const renderArrowCreatorShortcut = () => {
    if (appContext.editorType === "figma") {
      const buttons: ShortcutButtonConfig[] = [
        {
          title: t("module:updateArrowPosition"),
          onClick: () => applyShortcut("updateArrowPosition", false),
        },
      ]

      return (
        renderShortcutSection(t("module:moduleDrawArrows"), buttons)
      )
    } else {
      return null;
    }
  }

  const renderTextShortcut = () => {
    const buttons: ShortcutButtonConfig[] = [
      {
        title: t("module:findAndReplace"),
        onClick: handleOpenFindAndReplaceModal,
      },
      ...(appContext.editorType === "figma"
        ? [{
          title: t("module:createTextStyleFromSelection"),
          onClick: () => applyShortcut("convertSelectionToTextStyles", false),
        }]
        : []),
      {
        title: t("module:unifyText"),
        onClick: handleOpenUnifyTextModal,
      },
      {
        title: t("module:numberingTextLayers"),
        onClick: handleOpenNumberingModal,
      },
      // {
      //   title: t("module:spiltText"),
      //   onClick: handleOpenSpiltTextModal,
      // }
    ];


    return (
      renderShortcutSection(t("term:text"), buttons)
    )
  }

  const renderMagicObjectButtons = (buttons: ShortcutButtonConfig[]) => (
    <div className="grid mt-xxxsmall">
      {buttons.map(({ id, title, onClick, disabled, svg }, i) => (
        <div className="flex">
          <button
            id={id}
            onClick={onClick}
            disabled={disabled}
            className="button-reset magic-object-button"
          >
            <div className="icon-48">{svg}</div>
            <span>{title}</span>
          </button>
        </div>
      ))}
    </div>
  );

  const renderMagicObjectShortcut = () => {
    if (appContext.editorType === "figma") {
      const buttons: ShortcutButtonConfig[] = [
        {
          title: t("module:note"),
          id: "shortcut-generate-note",
          onClick: () => applyShortcut("generateNote", false),
          disabled: appContext.editorPreference.magicObjects.noteId === "",
          svg: <SvgNote />
        },
        {
          title: t("module:designStatusTag"),
          id: "shortcut-generate-design-status-tag",
          onClick: () => applyShortcut("generateDesignStatusTag", false),
          disabled: appContext.editorPreference.magicObjects.tagId === "",
          svg: <SvgTag />
        },
        {
          title: t("module:titleSection"),
          id: "shortcut-generate-title-section",
          onClick: () => applyShortcut("generateTitleSection", false),
          disabled: appContext.editorPreference.magicObjects.sectionId === "",
          svg: <SvgSection />
        },
      ];


      return (
        <div className="list-view mt-xsmall">
          <ListViewHeader title={t("module:fileOrganizingObject")} additionalClass="property-clipboard-header" />
          <div className="padding-16 border-1-top">
            {renderMagicObjectButtons(buttons)}
          </div>
        </div>
      )
    } else {
      return null;
    }

  }

  const renderColorToTextShortcut = () => {
    const buttons = [
      {
        title: t("module:hexValue"),
        id: "shortcut-color-to-label-hex",
        onClick: () => applyShortcut("colorToLabelHEX", false),
      },
      {
        title: t("module:hexValueWithTransparency"),
        id: "shortcut-color-to-label-hex-transparent",
        onClick: () => applyShortcut("colorToLabelHEXWithTransparency", false),
      },
      {
        title: t("module:rgbValue"),
        id: "shortcut-color-to-label-rgb",
        onClick: () => applyShortcut("colorToLabelRGB", false),
      },
      {
        title: t("module:rgbaValue"),
        id: "shortcut-color-to-label-rgba",
        onClick: () => applyShortcut("colorToLabelRGBA", false),
      },
    ];

    return (
      renderShortcutSection(t("module:colorValueToTextLabel"), buttons)
    );
  };

  const renderGenerateShortcut = () => {
    const buttons: ShortcutButtonConfig[] = [
      {
        title: t("module:loremIpsumText"),
        onClick: handleOpenLoremModal,
      },
      {
        title: t("module:createAutoLayoutIndividually"),
        onClick: () => createAutoLayoutIndividually(appContext, false),
      },
      {
        title: t("module:iconTemplate"),
        onClick: handleOpenIconModal,
      }
    ];

    return (
      renderShortcutSection(t("module:generate"), buttons)
    )
  }

  const renderFrameShortcut = () => {
    const buttons: ShortcutButtonConfig[] = [
      {
        title: t("module:createShadowOverlay"),
        onClick: () => applyShortcut("makeFrameOverlay", false),
      },
      {
        title: t("module:alignToFrameEdge"),
        onClick: () => handleOpenFramerModal,
      },
    ];

    return (

      renderShortcutSection(t("term:frame"), buttons)
    )
  }

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
        <NumberingModal
          show={showNumberingModal}
          handleClose={handleCloseNumberingModal}
        />
        <SpiltTextModal
          show={spiltTextModal}
          handleClose={handleCloseSpiltTextModal}
        />
      </div>
      <TitleBar
        title={t("module:moduleShortcut")}
        onClick={handleOpenExplanationModal}
        isProFeature={true}
        rightItem={
          <FigmaButton
            title={t("module:setting")}
            onClick={handleOpenMagicObjectModal}
            buttonHeight="small"
            fontSize="small"
            buttonType="grain"
            hasMargin={false}
          />
        }
      />
      <div className="content">
        {/* 箭頭 */}
        {renderArrowCreatorShortcut()}
        {/* 型錄 */}
        {renderCatalogueShortcut()}
        {/* 文字 */}
        {renderTextShortcut()}
        {/* 檔案管理物件 */}
        {renderMagicObjectShortcut()}
        {/* 顏色數值至文字標籤 */}
        {renderColorToTextShortcut()}
        {/* 生成 */}
        {renderGenerateShortcut()}
        {/* 框 */}
        {renderFrameShortcut()}
      </div>
    </div>
  );
};

export default Shortcut;
