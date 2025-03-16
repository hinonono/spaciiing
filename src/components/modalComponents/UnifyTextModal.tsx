import React, { useState } from "react";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import Modal from "../Modal";
import FigmaButton from "../FigmaButton";
import SectionTitle from "../SectionTitle";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";
import { MessageUnifyText } from "../../types/Messages/MessageShortcut";

interface UnifyTextModalProps {
  show: boolean;
  handleClose: () => void;
}

const UnifyTextModal: React.FC<UnifyTextModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation(["module"]);
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
          initialTime: 30, // Adjust the delay time as needed
          onProceed: () => unifyText(true), // Retry with `isRealCall = true`
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
  
    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  return (
    <Modal show={show} handleClose={handleClose}>
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:text")} />
        <textarea
          className="textarea"
          rows={5}
          value={targetTextContent}
          onChange={handleTargetTextContentChange}
          placeholder={t("module:text")}
        />
      </div>
      <div className="mt-xxsmall">
        <FigmaButton title={t("module:execute")} onClick={() => unifyText(false)} />
      </div>
    </Modal>
  );
};

export default UnifyTextModal;
