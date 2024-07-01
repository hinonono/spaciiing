import React from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import {
  MessageShortcutUpdateMagicalObjectSingle,
  ShortcutAction,
} from "../../types/Message";

interface TitleSectionModalProps {
  showTitleSectionModal: boolean;
  handleCloseTitleSectionModal: () => void;
}

const TitleSectionModal: React.FC<TitleSectionModalProps> = ({
  showTitleSectionModal,
  handleCloseTitleSectionModal,
}) => {
  const { magicalObject, licenseManagement, setShowCTSubscribe } =
    useAppContext();

  const applyMemorizeTitleSection = (action: ShortcutAction) => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";
    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }
    if (action != "memorizeTitleSection") {
      return;
    }
    const message: MessageShortcutUpdateMagicalObjectSingle = {
      module: "Shortcut",
      action: action,
      direction: "Inner",
      phase: "Actual",
      member: "titleSection",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  return (
    <Modal
      show={showTitleSectionModal}
      handleClose={handleCloseTitleSectionModal}
    >
      <div>
        <h3>Title Section Setting</h3>
        {magicalObject.titleSectionId == "" ? (
          <span className="note">
            The title section component has not been memorized. Please use the
            button below to memorize it.
          </span>
        ) : (
          <span className="note">
            Object is memorized with id: {magicalObject.titleSectionId}.
          </span>
        )}
        <FigmaButton
          buttonType="secondary"
          title={"Memorize title section"}
          id={"shortcut-memorize-title-section"}
          onClick={() => {
            applyMemorizeTitleSection("memorizeTitleSection");
          }}
        />
      </div>
    </Modal>
  );
};

export default TitleSectionModal;
