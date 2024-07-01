import React from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import {
  MessageShortcutUpdateMagicalObjectSingle,
  ShortcutAction,
} from "../../types/Message";

interface DesignStatusTagModalProps {
  showDesignStatusTagModal: boolean;
  handleCloseDesignStatusTagModal: () => void;
}

const DesignStatusTagModal: React.FC<DesignStatusTagModalProps> = ({
  showDesignStatusTagModal,
  handleCloseDesignStatusTagModal,
}) => {
  const { magicalObject, licenseManagement, setShowCTSubscribe } =
    useAppContext();

  const applyMemorizeDesignStatusTag = (action: ShortcutAction) => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";
    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }
    if (action != "memorizeDesignStatusTag") {
      return;
    }
    const message: MessageShortcutUpdateMagicalObjectSingle = {
      module: "Shortcut",
      action: action,
      direction: "Inner",
      phase: "Actual",
      member: "designStatusTag",
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
      show={showDesignStatusTagModal}
      handleClose={handleCloseDesignStatusTagModal}
    >
      <div>
        <h3>Design Status Tag Setting</h3>
        {magicalObject.designStatusTagId == "" ? (
          <span className="note">
            The design status tag component has not been memorized. Please use
            the button below to memorize it.
          </span>
        ) : (
          <span className="note">
            Object is memorized with id: {magicalObject.designStatusTagId}.
          </span>
        )}
        <FigmaButton
          buttonType="secondary"
          title={"Memorize design status tag"}
          id={"shortcut-memorize-design-status-tag"}
          onClick={() => {
            applyMemorizeDesignStatusTag("memorizeDesignStatusTag");
          }}
        />
      </div>
    </Modal>
  );
};

export default DesignStatusTagModal;
