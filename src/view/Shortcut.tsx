import React, { useRef, useState } from "react";
import { TitleBar, FigmaButton } from "../components";
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
  CreateSectionModal,
  ColorToLabelModal
} from "../components/modalComponents";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";
import {
  ShortcutAction,
  MessageShortcutGenerateMagicalObjectMember,
} from "../types/Messages/MessageShortcut";
import { createAutoLayoutIndividually, ShortcutButtonConfig, ShortcutSectionColor } from "../module-frontend/shortcutFronEnd";
import * as pluginConfig from "../pluginConfig.json";
import { SvgNote } from "../assets/icons";
import SvgTag from "../assets/icons/SvgTag";
import SvgSection from "../assets/icons/SvgSection";
import { exportArrowStyle, importArrowStyle } from "../module-frontend/arrowCreatorFrontEnd";

const Shortcut: React.FC = () => {
  const { t, i18n } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const appContext = useAppContext();

  // icon
  const [showIconModal, setShowIconModal] = useState(false);
  const handleOpenIconModal = () => setShowIconModal(true);
  const handleCloseIconModal = () => setShowIconModal(false);

  // section
  const [showSectionModal, setShowSectionModal] = useState(false);
  const handleOpenSectionModal = () => setShowSectionModal(true);
  const handleCloseSectionModal = () => setShowSectionModal(false);

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
  const [showSpiltTextModal, setShowSpiltTextModal] = useState(false);
  const handleOpenSpiltTextModal = () => setShowSpiltTextModal(true)
  const handleCloseSpiltTextModal = () => setShowSpiltTextModal(false);

  // Find and replace in selection for text
  const [showFindAndReplaceModal, setShowFindAndReplaceModal] = useState(false);
  const handleOpenFindAndReplaceModal = () => setShowFindAndReplaceModal(true);
  const handleCloseFindAndReplaceModal = () =>
    setShowFindAndReplaceModal(false);

  // 顏色至文字彈窗
  const [showColorToLabelModal, setShowColorToLabelModal] = useState(false);
  const handleOpenColorToLabelModal = () => setShowColorToLabelModal(true)
  const handleCloseColorToLabelModal = () => setShowColorToLabelModal(false);

  const applyShortcut = (action: ShortcutAction, isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
        appContext.setFreeUserDelayModalConfig({
          show: true,
          initialTime: pluginConfig.freeUserWaitingTime,
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
      lang: i18n.language
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

  const renderShortcutSection = (title: string, buttons: ShortcutButtonConfig[], color: ShortcutSectionColor, buttonRenderMethod: "Common" | "MagicObject", hasTopMargin: boolean, rightItem?: React.ReactNode) => (
    <div className={`shortcut-section ${color} ${hasTopMargin ? "mt-xsmall" : ""}`}>
      <div className={`shortcut-section-header`}>
        <div className="flex align-items-center flex-justify-start font-size-xlarge text-color-primary">{title}</div>
        {rightItem}
      </div>
      <div>
        {buttonRenderMethod === "Common"
          ? renderButtons(buttons)
          : renderMagicObjectButtons(buttons)}
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
        renderShortcutSection(t("module:moduleCatalogue"), buttons, "cyan", "Common", true)
      )
    } else {
      return null;
    }
  }

  const renderArrowCreatorShortcut = () => {
    if (appContext.editorType === "figma" || appContext.editorType === "slides") {
      const buttons: ShortcutButtonConfig[] = [
        {
          title: t("module:updateArrowPosition"),
          onClick: () => applyShortcut("updateArrowPosition", false),
        },
        {
          title: t("module:exportArrowStyle"),
          onClick: () => exportArrowStyle(appContext, false),
        },
        {
          title: t("module:importArrowStyle"),
          onClick: () => fileInputRef.current?.click(),
        },
      ]

      return (
        renderShortcutSection(t("module:moduleDrawArrows"), buttons, "purple", "Common", false)
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
      {
        title: t("module:spiltText"),
        onClick: handleOpenSpiltTextModal,
      }
    ];


    return (
      renderShortcutSection(t("term:text"), buttons, "red", "Common", true)
    )
  }

  const renderMagicObjectButtons = (buttons: ShortcutButtonConfig[]) => (
    <div className="grid mt-xxxsmall">
      {buttons.map(({ id, title, onClick, disabled, svg }) => (
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

      const rightItem =
        <FigmaButton
          title={t("module:setting")}
          onClick={handleOpenMagicObjectModal}
          buttonHeight="small"
          fontSize="small"
          buttonType="grain"
          hasMargin={false}
          additionalClass={"flex-justify-end"}
        />


      return (
        renderShortcutSection(t("module:fileOrganizingObject"), buttons, "yellow", "MagicObject", true, rightItem)
      )
    } else {
      return null;
    }

  }

  // const renderColorToTextShortcut = () => {
  //   const buttons = [
  //     {
  //       title: t("module:hexValue"),
  //       id: "shortcut-color-to-label-hex",
  //       onClick: () => applyShortcut("colorToLabelHEX", false),
  //     },
  //     {
  //       title: t("module:hexValueWithTransparency"),
  //       id: "shortcut-color-to-label-hex-transparent",
  //       onClick: () => applyShortcut("colorToLabelHEXWithTransparency", false),
  //     },
  //     {
  //       title: t("module:rgbValue"),
  //       id: "shortcut-color-to-label-rgb",
  //       onClick: () => applyShortcut("colorToLabelRGB", false),
  //     },
  //     {
  //       title: t("module:rgbaValue"),
  //       id: "shortcut-color-to-label-rgba",
  //       onClick: () => applyShortcut("colorToLabelRGBA", false),
  //     },
  //   ];

  //   return (
  //     renderShortcutSection(t("module:colorValueToTextLabel"), buttons, "indigo", "Common", true)
  //   );
  // };

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
      },
      {
        title: t("module:createSection"),
        onClick: handleOpenSectionModal,
      },
      {
        title: t("module:colorToLabel"),
        onClick: handleOpenColorToLabelModal,
      }
    ];

    return (
      renderShortcutSection(t("module:generate"), buttons, "green", "Common", true)
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
      renderShortcutSection(t("term:frame"), buttons, "indigo", "Common", true)
    )
  }

  const renderImageShortcut = () => {
    const buttons: ShortcutButtonConfig[] = [
      {
        title: t("module:resizeAspectFit"),
        onClick: () => applyShortcut("resizeAspectFit", false),
      },
      {
        title: t("module:resizeAspectFill"),
        onClick: () => applyShortcut("resizeAspectFill", false),
      },
    ];

    return (
      renderShortcutSection(t("term:layer"), buttons, "blue", "Common", true)
    )
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

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
          show={showSpiltTextModal}
          handleClose={handleCloseSpiltTextModal}
        />
        <CreateSectionModal
          show={showSectionModal}
          handleClose={handleCloseSectionModal}
        />
        <ColorToLabelModal
          show={showColorToLabelModal}
          handleClose={handleCloseColorToLabelModal}
        />
      </div>
      <TitleBar
        title={t("module:moduleShortcut")}
        onClick={handleOpenExplanationModal}
      />
      <div className="content">
        <input
          type="file"
          accept=".json"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            importArrowStyle(event, appContext, false)
          }
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {/* 箭頭 */}
        {renderArrowCreatorShortcut()}
        {/* 型錄 */}
        {renderCatalogueShortcut()}
        {/* 圖層 */}
        {renderImageShortcut()}
        {/* 文字 */}
        {renderTextShortcut()}
        {/* 檔案管理物件 */}
        {renderMagicObjectShortcut()}
        {/* 生成 */}
        {renderGenerateShortcut()}
        {/* 框 */}
        {renderFrameShortcut()}
      </div>
    </div>
  );
};

export default Shortcut;
