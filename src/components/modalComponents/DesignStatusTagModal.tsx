import React from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import {
  MessageShortcutUpdateMagicalObjectSingle,
  ShortcutAction,
} from "../../types/Message";
import { useTranslation } from "react-i18next";

interface DesignStatusTagModalProps {
  showDesignStatusTagModal: boolean;
  handleCloseDesignStatusTagModal: () => void;
}

const DesignStatusTagModal: React.FC<DesignStatusTagModalProps> = ({
  showDesignStatusTagModal,
  handleCloseDesignStatusTagModal,
}) => {
  const { t } = useTranslation(["module"]);
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
        <h3>{t("module:designStatusTagSetting")}</h3>
        {magicalObject.designStatusTagId == "" ? (
          <span className="note">
            {t("module:designStatusTagHasNotBeenMemorized")}
          </span>
        ) : (
          <span className="note">
            {t("module:objectIsMemorizedWithId")}
            {magicalObject.designStatusTagId}
          </span>
        )}
        <FigmaButton
          buttonType="secondary"
          title={t("module:memorizeDesignStatusTag")}
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
