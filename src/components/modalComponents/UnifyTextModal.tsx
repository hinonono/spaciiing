import React, { useState } from "react";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import Modal from "../Modal";
import FigmaButton from "../FigmaButton";
import SectionTitle from "../SectionTitle";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";
import { MessageUnifyText } from "../../types/Messages/MessageShortcut";
import * as pluginConfig from "../../pluginConfig.json";

interface UnifyTextModalProps {
  show: boolean;
  handleClose: () => void;
}

const UnifyTextModal: React.FC<UnifyTextModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation(["module", "term"]);
  const { licenseManagement, setFreeUserDelayModalConfig } = useAppContext();

  const [targetTextContent, setTargetTextContent] = useState("");
  const handleTargetTextContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTargetTextContent(event.target.value);
  };

  const unifyText = (isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: pluginConfig.freeUserWaitingTime,
          onProceed: () => unifyText(true),
        });
        return;
      }
    }

    const message: MessageUnifyText = {
      module: "Shortcut",
      direction: "Inner",
      phase: "Actual",
      targetTextContent: targetTextContent,
      action: "unifyText",
    };

    parent.postMessage({ pluginMessage: message, }, "*");
  };

  return (
    <Modal show={show} handleClose={handleClose}>
      <h3>{t("module:unifyText")}</h3>
      <p className="mb-small font-size-large">{t("module:unifyTextDesc")}</p>
      <div className="mt-xxsmall">
        <SectionTitle title={t("term:text")} />
        <textarea
          className="textarea"
          rows={5}
          value={targetTextContent}
          onChange={handleTargetTextContentChange}
          placeholder={t("term:text")}
        />
      </div>
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:specialSymbol")} />
        <span className="note">$ORIGIN$ {t("module:originalTextContent")}</span>
      </div>
      <div className="mt-xxsmall">
        <FigmaButton title={t("module:execute")} onClick={() => unifyText(false)} hasTopBottomMargin={false} />
      </div>
    </Modal>
  );
};

export default UnifyTextModal;
