import React from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";
import { MagicObjectMembers } from "../../types/MagicObject";
import {
  ShortcutAction,
  MessageShortcutUpdateMagicalObjectSingle,
} from "../../types/Messages/MessageShortcut";
import * as info from "../../info.json";

interface MagicObjectModalProps {
  show: boolean;
  handleClose: () => void;
}

const MagicObjectModal: React.FC<MagicObjectModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation(["module"]);
  const {
    // magicalObject,
    licenseManagement,
    editorPreference,
    setFreeUserDelayModalConfig
  } = useAppContext();

  const applyMemorize = (
    action: ShortcutAction,
    member: MagicObjectMembers,
    isRealCall = false
  ) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: info.freeUserWaitingTime,
          onProceed: () => applyMemorize(action, member, true),
        });
        return;
      }
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

    parent.postMessage({ pluginMessage: message, }, "*");
  };

  return (
    <Modal show={show} handleClose={handleClose}>
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
