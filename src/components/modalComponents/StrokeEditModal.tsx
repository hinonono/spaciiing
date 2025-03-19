import React, { useEffect, useState } from "react";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import Modal from "../Modal";
import FigmaButton from "../FigmaButton";
import SectionTitle from "../SectionTitle";
import { checkProFeatureAccessibleForUser, generateUUID } from "../../module-frontend/utilFrontEnd";
import StrokeEditorView from "../StrokeEditorView";
import { CYStroke } from "../../types/CYStroke";
import { MessageSaveEditorPreference } from "../../types/Messages/MessageSaveEditorPreference";

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
  const {
    licenseManagement,
    setFreeUserDelayModalConfig,
    editorPreference,
    setEditorPreference
  } = useAppContext();

  const [styleName, setStyleName] = useState("New stroke style");
  const handleStyleNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setStyleName(event.target.value);
  };

  useEffect(() => {
    if (show) {
      const message: MessageSaveEditorPreference = {
        editorPreference: editorPreference,
        shouldSaveEditorPreference: true,
        module: "General",
        phase: "Actual"
      };

      parent.postMessage({ pluginMessage: message }, "*");

      // Close modal after saving the preference
      if (savingPreference) {
        setSavingPreference(false);
        handleClose();
      }
    }
  }, [editorPreference, show]); // Run when `editorPreference` updates

  const [savingPreference, setSavingPreference] = useState(false);

  const saveStyle = (isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: 30, // Adjust the delay time as needed
          onProceed: () => saveStyle(true), // Retry with `isRealCall = true`
        });
        return;
      }
    }

    setSavingPreference(true); // Set flag to indicate saving is in progress

    setEditorPreference((prev) => ({
      ...prev,
      strokeStyles: [...prev.strokeStyles, { name: styleName, id: generateUUID(), style: stroke }]
    }));
  };


  return (
    <Modal show={show} handleClose={handleClose}>
      <div className="mt-xxsmall">
        <h3>New stroke style</h3>
      </div>
      <div className="mt-xsmall">
        <div>
          <SectionTitle title={t("term:name")} titleType="secondary" />
          <div className="width-100">
            <textarea
              className="textarea textarea-height-fit-content"
              rows={1}
              value={styleName}
              onChange={handleStyleNameChange}
            />
          </div>
        </div>
        <StrokeEditorView stroke={stroke} setStroke={setStroke} />
      </div>
      <div className="mt-xsmall">
        <FigmaButton
          title={t("module:save")}
          onClick={saveStyle} // No need to call handleClose() here
        />
      </div>
    </Modal>
  );
};

export default StrokeEditModal;
