import React, { useState } from "react";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import Modal from "../Modal";
import FigmaButton from "../FigmaButton";
import SectionTitle from "../SectionTitle";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";
import { MessageUnifyText } from "../../types/Messages/MessageShortcut";
import StrokeEditorView from "../StrokeEditorView";
import { CYStroke } from "../../types/CYStroke";

interface StrokeEditModalProps {
  show: boolean;
  handleClose: () => void;
  stroke: CYStroke
  setStroke: React.Dispatch<React.SetStateAction<CYStroke>>,
}

const StrokeEditModal: React.FC<StrokeEditModalProps> = ({
  show,
  handleClose,
  stroke,
  setStroke
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
        <h3>New stroke style</h3>
      </div>
      <div className="mt-xsmall">
        <StrokeEditorView stroke={stroke} setStroke={setStroke} />
      </div>
      <div className="mt-xsmall">
        <FigmaButton
          title={t("module:save")}
          onClick={() => {
            handleClose();
          }} />
      </div>
    </Modal>
  );
};

export default StrokeEditModal;
