import React, { useState } from "react";
import SectionTitle from "../SectionTitle";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";
import { MessageShortcut } from "../../types/Messages/MessageShortcut";

interface CatalogueSettingModalProps {
  show: boolean;
  handleClose: () => void;
}

const CatalogueSettingModal: React.FC<CatalogueSettingModalProps> = ({
  show,
  handleClose
}) => {
  const { t } = useTranslation(["module"]);
  const {
    licenseManagement,
    setShowCTSubscribe,
    editorPreference,
    setEditorPreference,
  } = useAppContext();

  // const [length, setLength] = useState<LoremLength>("short");
  const [shouldSavePreference, setShouldSavePreference] = useState(false);

  const updateExampleFileUrl = () => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageShortcut = {
      module: "Shortcut",
      direction: "Inner",
      phase: "Actual",
      shouldSaveEditorPreference: shouldSavePreference,
      editorPreference: editorPreference,
      action: "updateExampleFileUrl"
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );

    handleClose();
  };

  const handleFileUrlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (shouldSavePreference == false) {
      setShouldSavePreference(true);
    }
    setEditorPreference((prevPreference) => ({
      ...prevPreference,
      exampleFileUrl: event.target.value,
    }));
  };

  return (
    <Modal show={show} handleClose={handleClose}>
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:text")} />
        <textarea
          className="textarea"
          rows={5}
          value={editorPreference.exampleFileUrl}
          onChange={handleFileUrlChange}
          placeholder={t("module:text")}
        />
      </div>

      <div className="mt-xxsmall"></div>
      <FigmaButton
        title={t("module:generate")}
        onClick={updateExampleFileUrl}
      />
    </Modal>
  );
};

export default CatalogueSettingModal;
