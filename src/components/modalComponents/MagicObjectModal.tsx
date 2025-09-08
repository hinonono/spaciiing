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
import * as pluginConfig from "../../pluginConfig.json";
import { SvgNote } from "../../assets/icons";
import SvgTag from "../../assets/icons/SvgTag";
import SvgSection from "../../assets/icons/SvgSection";

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
          initialTime: pluginConfig.freeUserWaitingTime,
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

  const magicObjectsUiInfo = [
    {
      svg: <SvgNote />,
      title: t("module:note"),
      checkingId: editorPreference.magicObjects.noteId,
      onclick: () => { applyMemorize("memorizeNote", "note"); }
    },
    {
      svg: <SvgTag />,
      title: t("module:designStatusTag"),
      checkingId: editorPreference.magicObjects.tagId,
      onclick: () => { applyMemorize("memorizeDesignStatusTag", "designStatusTag"); }
    },
    {
      svg: <SvgSection />,
      title: t("module:titleSection"),
      checkingId: editorPreference.magicObjects.sectionId,
      onclick: () => { applyMemorize("memorizeTitleSection", "titleSection"); }
    }
  ]

  return (
    <Modal show={show} handleClose={handleClose}>
      <h3>{t("module:fileOrganizingObject")}</h3>
      <p>You can download these objects <a href="https://www.figma.com/@hsiehcy">here</a> for free.</p>
      {magicObjectsUiInfo.map((info, index) =>
        <div className={`${index > 0 && "mt-small"}`}>
          <h4 className="flex align-items-center"><div className="icon-24">{info.svg}</div>{info.title}</h4>
          <div className="variable flex flex-justify-space-between align-items-center">
            {info.checkingId == "" ? (
              <span className="note mr-xxxsmall">{t("module:objectIsNotMemorized")}</span>
            ) : (
              <span className="note mr-xxxsmall">
                {t("module:objectIsMemorizedWithId").replace("$LAYER_ID$", info.checkingId)}
              </span>
            )}
            <FigmaButton
              buttonType="tertiary"
              buttonHeight="small"
              hasTopBottomMargin={false}
              title={t("module:memorize")}
              onClick={info.onclick}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MagicObjectModal;
