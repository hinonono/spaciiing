import React from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";
import { MagicalObjectMembers } from "../../types/MagicalObject";
import {
  ShortcutAction,
  MessageShortcutUpdateMagicalObjectSingle,
} from "../../types/Messages/MessageShortcut";

interface MagicObjectModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
}

const MagicObjectModal: React.FC<MagicObjectModalProps> = ({
  showModal,
  handleCloseModal,
}) => {
  const { t } = useTranslation(["module"]);
  const {
    // magicalObject,
    licenseManagement,
    setShowCTSubscribe,
    editorPreference,
  } = useAppContext();

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
      shouldSaveEditorPreference: true,
      editorPreference: editorPreference,
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  return (
    <Modal show={showModal} handleClose={handleCloseModal}>
      <h3>{t("module:fileOrganizingObjectSetting")}</h3>
      <div>
        <h4>{t("module:note")}</h4>
        {editorPreference.magicObjects.noteId == "" ? (
          <span className="note">{t("module:noteHasNotBeenMemorized")}</span>
        ) : (
          <span className="note">
            {t("module:objectIsMemorizedWithId")}{" "}
            {editorPreference.magicObjects.noteId}
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
        {editorPreference.magicObjects.tagId == "" ? (
          <span className="note">
            {t("module:designStatusTagHasNotBeenMemorized")}
          </span>
        ) : (
          <span className="note">
            {t("module:objectIsMemorizedWithId")}
            {editorPreference.magicObjects.tagId}
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
        {editorPreference.magicObjects.sectionId == "" ? (
          <span className="note">
            {t("module:titleSectionHasNotBeenMemorized")}
          </span>
        ) : (
          <span className="note">
            {t("module:objectIsMemorizedWithId")}{" "}
            {editorPreference.magicObjects.sectionId}
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

export default MagicObjectModal;