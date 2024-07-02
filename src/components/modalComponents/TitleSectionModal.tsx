import React from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import {
  MessageShortcutUpdateMagicalObjectSingle,
  ShortcutAction,
} from "../../types/Message";
import { useTranslation } from "react-i18next";

interface TitleSectionModalProps {
  showTitleSectionModal: boolean;
  handleCloseTitleSectionModal: () => void;
}

const TitleSectionModal: React.FC<TitleSectionModalProps> = ({
  showTitleSectionModal,
  handleCloseTitleSectionModal,
}) => {
  const { t } = useTranslation(["module"]);
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
        <h3>{t("module:titleSectionSetting")}</h3>
        {magicalObject.titleSectionId == "" ? (
          <span className="note">
            {t("module:titleSectionHasNotBeenMemorized")}
          </span>
        ) : (
          <span className="note">
            {t("module:objectIsMemorizedWithId")} {magicalObject.titleSectionId}
          </span>
        )}
        <FigmaButton
          buttonType="secondary"
          title={t("module:memorizeTitleSection")}
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
