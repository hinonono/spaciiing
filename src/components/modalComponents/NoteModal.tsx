import React from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import {
  MessageShortcutUpdateMagicalObjectSingle,
  ShortcutAction,
} from "../../types/Message";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";
import { MagicalObjectMembers } from "../../types/MagicalObject";

interface NoteModalProps {
  showNoteModal: boolean;
  handleCloseNoteModal: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({
  showNoteModal,
  handleCloseNoteModal,
}) => {
  const { t } = useTranslation(["module"]);
  const { magicalObject, licenseManagement, setShowCTSubscribe } =
    useAppContext();

  const applyMemorize = (
    action: ShortcutAction,
    member: MagicalObjectMembers
  ) => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }
    const validActions = [
      "memorizeNote",
      "memorizeDesignStatusTag",
      "memorizeTitleSection",
    ];
    if (!validActions.includes(action)) {
      return;
    }

    const message: MessageShortcutUpdateMagicalObjectSingle = {
      module: "Shortcut",
      action: action,
      direction: "Inner",
      phase: "Actual",
      member: member,
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
      <h3>{t("module:fileOrganizingObjectSetting")}</h3>
      <div>
        <h4>{t("module:note")}</h4>
        {magicalObject.noteId == "" ? (
          <span className="note">{t("module:noteHasNotBeenMemorized")}</span>
        ) : (
          <span className="note">
            {t("module:objectIsMemorizedWithId")} {magicalObject.noteId}
          </span>
        )}
        <FigmaButton
          buttonType="secondary"
          title={t("module:memorize")}
          id={"shortcut-memorize-note"}
          onClick={() => {
            applyMemorize("memorizeNote", "note");
          }}
        />
      </div>
      <div className="mt-small">
        <h4>{t("module:designStatusTag")}</h4>
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
          title={t("module:memorize")}
          id={"shortcut-memorize-design-status-tag"}
          onClick={() => {
            applyMemorize("memorizeDesignStatusTag", "designStatusTag");
          }}
        />
      </div>
      <div className="mt-small">
        <h4>{t("module:titleSection")}</h4>
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
          title={t("module:memorize")}
          id={"shortcut-memorize-title-section"}
          onClick={() => {
            applyMemorize("memorizeTitleSection", "titleSection");
          }}
        />
      </div>
    </Modal>
  );
};

export default NoteModal;
