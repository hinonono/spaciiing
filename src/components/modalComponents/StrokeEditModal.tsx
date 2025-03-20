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
import * as info from "../../info.json";

interface StrokeEditModalProps {
  show: boolean;
  handleClose: () => void;
  stroke: CYStroke
  setStroke: React.Dispatch<React.SetStateAction<CYStroke>>,
  mode: "create" | "edit",
  existingStyleName?: string;
  setExistingStyleName?: React.Dispatch<React.SetStateAction<string | undefined>>,
  existingStyleId?: string;
}

const StrokeEditModal: React.FC<StrokeEditModalProps> = ({
  show,
  handleClose,
  stroke,
  setStroke,
  mode,
  existingStyleName,
  setExistingStyleName,
  existingStyleId
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
    event.preventDefault();
  };

  const handleExistingStyleNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (setExistingStyleName) {
      setExistingStyleName(event.target.value);
      event.preventDefault();
    }
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
  }, [editorPreference]); // Run when `editorPreference` updates

  const [savingPreference, setSavingPreference] = useState(false);

  const saveNewStrokeStyle = (isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: info.freeUserWaitingTime,
          onProceed: () => saveNewStrokeStyle(true),
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

  const saveEditedStrokeStyle = (isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: info.freeUserWaitingTime,
          onProceed: () => saveEditedStrokeStyle(true),
        });
        return;
      }
    }

    if (!existingStyleId) {
      console.error("No existing style ID provided.");
      return;
    }

    if (!existingStyleName) {
      console.error(`Param "existingStyleName" is required for saving style.`)
      return;
    }

    setSavingPreference(true); // Set flag to indicate saving is in progress
    setEditorPreference((prev) => {
      const updatedStrokeStyles = prev.strokeStyles.map((style) =>
        style.id === existingStyleId
          ? { ...style, name: existingStyleName, style: stroke } // Update name & style
          : style
      );

      return { ...prev, strokeStyles: updatedStrokeStyles };
    });

    console.log("Stroke style updated successfully.");
  };

  const renderModalButton = () => {
    if (mode === "create") {
      return (
        <FigmaButton
          title={t("module:save")}
          onClick={saveNewStrokeStyle} // No need to call handleClose() here
        />
      )
    } else {
      return (
        <FigmaButton
          title={t("module:save")}
          onClick={saveEditedStrokeStyle} // No need to call handleClose() here
        />
      )
    }
  }

  const renderNameTextArea = () => {
    if (mode === "create") {
      return <textarea
        className="textarea textarea-height-fit-content"
        rows={1}
        value={styleName}
        onChange={handleStyleNameChange}
      />
    } else {
      if (existingStyleName || existingStyleName === "") {
        return <textarea
          className="textarea textarea-height-fit-content"
          rows={1}
          value={existingStyleName}
          onChange={handleExistingStyleNameChange}
        />
      } else {
        return null;
      }
    }
  }


  return (
    <Modal show={show} handleClose={handleClose}>
      <div className="mt-xxsmall">
        <h3>{mode === "create" ? t("module:newStrokeStyle") : t("editStrokeStyle")}</h3>
      </div>
      <div className="mt-xsmall">
        <div>
          <SectionTitle title={t("module:name")} titleType="secondary" />
          <div className="width-100">
            {renderNameTextArea()}
          </div>
        </div>
        <div className="mt-xxsmall"></div>
        <StrokeEditorView editingStroke={stroke} setEditingStroke={setStroke} />
      </div>
      <div className="mt-xsmall">
        {renderModalButton()}
      </div>
    </Modal>
  );
};

export default StrokeEditModal;
