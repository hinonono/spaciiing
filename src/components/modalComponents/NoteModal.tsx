import React from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import {
  MessageShortcutUpdateMagicalObjectSingle,
  ShortcutAction,
} from "../../types/Message";

interface NoteModalProps {
  showNoteModal: boolean;
  handleCloseNoteModal: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({
  showNoteModal,
  handleCloseNoteModal,
}) => {
  const { magicalObject, licenseManagement, setShowCTSubscribe } =
    useAppContext();

  const applyMemorizeNote = (action: ShortcutAction) => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";
    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }
    if (action != "memorizeNote") {
      return;
    }
    const message: MessageShortcutUpdateMagicalObjectSingle = {
      module: "Shortcut",
      action: action,
      direction: "Inner",
      phase: "Actual",
      member: "note",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  return (
    <Modal show={showNoteModal} handleClose={handleCloseNoteModal}>
      <div>
        <h3>Note Setting</h3>
        {magicalObject.noteId == "" ? (
          <span className="note">
            The note component has not been memorized. Please use the button
            below to memorize it.
          </span>
        ) : (
          <span className="note">
            Object is memorized with id: {magicalObject.noteId}.
          </span>
        )}
        <FigmaButton
          buttonType="secondary"
          title={"Memorize note"}
          id={"shortcut-memorize-note"}
          onClick={() => {
            applyMemorizeNote("memorizeNote");
          }}
        />
      </div>
    </Modal>
  );
};

export default NoteModal;
