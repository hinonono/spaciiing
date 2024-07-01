import React, { useState } from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import {
  MessageShortcutGenerateMagicalObjectMember,
  ShortcutAction,
} from "../types/Message";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import {
  DesignStatusTagModal,
  FindAndReplaceModal,
  FramerModal,
  IconTemplateModal,
  LoremIpsumModal,
  NoteModal,
  TitleSectionModal,
} from "../components/modalComponents";

const Shortcut: React.FC = () => {
  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const { magicalObject, licenseManagement, setShowCTSubscribe } =
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

  // 備忘錄
  const [showNoteModal, setShowNoteModal] = useState(false);
  const handleOpenNoteModal = () => setShowNoteModal(true);
  const handleCloseNoteModal = () => setShowNoteModal(false);

  // 設計狀態標籤
  const [showDesignStatusTagModal, setShowDesignStatusTagModal] =
    useState(false);
  const handleOpenDesignStatusTagModal = () =>
    setShowDesignStatusTagModal(true);
  const handleCloseDesignStatusTagModal = () =>
    setShowDesignStatusTagModal(false);

  // 標題區塊
  const [showTitleSectionModal, setShowTitleSectionModal] = useState(false);
  const handleOpenTitleSectionModal = () => setShowTitleSectionModal(true);
  const handleCloseTitleSectionModal = () => setShowTitleSectionModal(false);

  // Find and replace in selection for text
  const [showFindAndReplaceModal, setShowFindAndReplaceModal] = useState(false);
  const handleOpenFindAndReplaceModal = () => setShowFindAndReplaceModal(true);
  const handleCloseFindAndReplaceModal = () =>
    setShowFindAndReplaceModal(false);

  const applyShortcut = (action: ShortcutAction) => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";

    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
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
          componentId: magicalObject.noteId,
        } as MessageShortcutGenerateMagicalObjectMember);
        break;
      case "generateDesignStatusTag":
        Object.assign(message, {
          member: "designStatusTag",
          componentId: magicalObject.designStatusTagId,
        } as MessageShortcutGenerateMagicalObjectMember);
        break;
      case "generateTitleSection":
        Object.assign(message, {
          member: "titleSection",
          componentId: magicalObject.titleSectionId,
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
            <h3>Shortcut</h3>
            <p>
              A comprehensive collection of various shortcut that will fasten
              your workflow.
            </p>
            <h4>Generate HEX or RGB text label</h4>
            <p>
              To generate HEX or RGB value text label, you need to select layers
              that has fill color.
            </p>
            <h4>Generate Note, Design status tag, Title section</h4>
            <p>
              To generate Note, Design status tag or Title section, you need to
              copy the template component into your file, then use the
              "Memorize" button with in setting window. After object is
              memorized, you can start generate these component instance by
              selecting one or multiple frames, then click generate button. The
              current date will be automatically fill in to the component by
              default.
            </p>
          </div>
        </Modal>
        <NoteModal
          showNoteModal={showNoteModal}
          handleCloseNoteModal={handleCloseNoteModal}
        />
        <DesignStatusTagModal
          showDesignStatusTagModal={showDesignStatusTagModal}
          handleCloseDesignStatusTagModal={handleCloseDesignStatusTagModal}
        />
        <TitleSectionModal
          showTitleSectionModal={showTitleSectionModal}
          handleCloseTitleSectionModal={handleCloseTitleSectionModal}
        />
        <IconTemplateModal
          showIconModal={showIconModal}
          handleCloseIconModal={handleCloseIconModal}
        />
        <FramerModal
          showFramerModal={showFramerModal}
          handleCloseFramerModal={handleCloseFramerModal}
        />
        <FindAndReplaceModal
          showFindAndReplaceModal={showFindAndReplaceModal}
          handleCloseFindAndReplaceModal={handleCloseFindAndReplaceModal}
        />
        <LoremIpsumModal
          show={showLoremModal}
          handleClose={handleCloseLoremModal}
        />
      </div>
      <TitleBar
        title="Shortcut"
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
        <div>
          <SectionTitle title={"Frame"} />
          <FigmaButton
            buttonType="secondary"
            title={"Generate shadow overlay to frame"}
            id={"shortcut-overlay"}
            onClick={() => {
              applyShortcut("makeFrameOverlay");
            }}
          />
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={"Text"} />
          <FigmaButton
            buttonType="secondary"
            title={"Find and Replace in selection"}
            id={"shortcut-find-and-replace-in-selection"}
            onClick={handleOpenFindAndReplaceModal}
          />
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={"Generate"} />
          <FigmaButton
            buttonType="secondary"
            title={"Hex value text"}
            id={"shortcut-color-to-label-hex"}
            onClick={() => {
              applyShortcut("colorToLabelHEX");
            }}
          />
          <FigmaButton
            buttonType="secondary"
            title={"RGB value text"}
            id={"shortcut-color-to-label-rgb"}
            onClick={() => {
              applyShortcut("colorToLabelRGB");
            }}
          />
          <FigmaButton
            buttonType="secondary"
            title={"RGBA value text"}
            id={"shortcut-color-to-label-rgba"}
            onClick={() => {
              applyShortcut("colorToLabelRGBA");
            }}
          />
          <FigmaButton
            buttonType="secondary"
            title={"Lorem ipsum text"}
            id={"shortcut-generate-lorem-ipsum-text"}
            onClick={handleOpenLoremModal}
          />
          <FigmaButton
            buttonType="secondary"
            title={"Text style from selection"}
            id={"shortcut-generate-text-style-from-selection"}
            onClick={() => {
              applyShortcut("convertSelectionToTextStyles");
            }}
          />
          <div className="grid">
            <FigmaButton
              buttonType="secondary"
              title={"Note"}
              id={"shortcut-generate-note"}
              onClick={() => {
                applyShortcut("generateNote");
              }}
              disabled={magicalObject.noteId == "" ? true : false}
            />
            <FigmaButton
              buttonType="tertiary"
              title={"Setting"}
              id={"shortcut-generate-note-setting"}
              onClick={handleOpenNoteModal}
            />
          </div>
          <div className="grid">
            <FigmaButton
              buttonType="secondary"
              title={"Design status tag"}
              id={"shortcut-generate-design-status-tag"}
              onClick={() => {
                applyShortcut("generateDesignStatusTag");
              }}
              disabled={magicalObject.designStatusTagId == "" ? true : false}
            />
            <FigmaButton
              buttonType="tertiary"
              title={"Setting"}
              id={"shortcut-generate-design-status-tag-setting"}
              onClick={handleOpenDesignStatusTagModal}
            />
          </div>
          <div className="grid">
            <FigmaButton
              buttonType="secondary"
              title={"Title Section"}
              id={"shortcut-generate-title-section"}
              onClick={() => {
                applyShortcut("generateTitleSection");
              }}
              disabled={magicalObject.titleSectionId == "" ? true : false}
            />
            <FigmaButton
              buttonType="tertiary"
              title={"Setting"}
              id={"shortcut-generate-section-title-setting"}
              onClick={handleOpenTitleSectionModal}
            />
          </div>

          <FigmaButton
            buttonType="secondary"
            title={"Icon template"}
            id={"shortcut-generate-icon-template"}
            onClick={handleOpenIconModal}
          />
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={"Elements inside frame"} />
          <FigmaButton
            buttonType="secondary"
            title={"Align to frame edge"}
            id={"shortcut-framer"}
            onClick={handleOpenFramerModal}
          />
        </div>
      </div>
    </div>
  );
};

export default Shortcut;
