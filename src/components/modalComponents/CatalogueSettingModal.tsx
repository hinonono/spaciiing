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
    setFreeUserDelayModalConfig,
  } = useAppContext();

  // const [length, setLength] = useState<LoremLength>("short");
  const [shouldSavePreference, setShouldSavePreference] = useState(false);

  const updateExampleFileUrl = (isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: 30, // Adjust the delay time as needed
          onProceed: () => updateExampleFileUrl(true), // Retry with `isRealCall = true`
        });
        return;
      }
    }
  
    const message: MessageShortcut = {
      module: "Shortcut",
      direction: "Inner",
      phase: "Actual",
      shouldSaveEditorPreference: shouldSavePreference,
      editorPreference: editorPreference,
      action: "updateExampleFileUrl",
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
      <h3>{t("module:catalogueSetting")}</h3>
      <div>
        <h4>{t("module:crossCatalogueIndex")}</h4>
        <span className="note">
          {t("module:crossCatalogueIndexDesc")}
        </span>
        <div className="mt-xxsmall">
          <textarea
            className="textarea"
            rows={5}
            value={editorPreference.exampleFileUrl}
            onChange={handleFileUrlChange}
            placeholder={t("module:text")}
          />
        </div>
      </div>

      <div className="mt-xxsmall"></div>
      <FigmaButton
        title={t("module:save")}
        onClick={updateExampleFileUrl}
      />
    </Modal>
  );
};

export default CatalogueSettingModal;
