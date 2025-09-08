import React, { useState } from "react";
import SectionTitle from "../SectionTitle";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";
import {
  LoremLength,
  MessageLoremGenerator,
} from "../../types/Messages/MessageLoremGenerator";
import SegmentedControl from "../SegmentedControl";
import * as pluginConfig from "../../pluginConfig.json";

interface LoremIpsumModalProps {
  show: boolean;
  handleClose: () => void;
}

const LoremIpsumModal: React.FC<LoremIpsumModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation(["module", "term"]);
  const {
    licenseManagement,
    setShowCTSubscribe,
    editorPreference,
    setEditorPreference,
    setFreeUserDelayModalConfig
  } = useAppContext();

  // const [lang, setLang] = useState<LoremSupportedLang>("en");
  const [length, setLength] = useState<LoremLength>("short");
  const [shouldSavePreference, setShouldSavePreference] = useState(false);

  const generateLorem = (length: LoremLength, isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: pluginConfig.freeUserWaitingTime,
          onProceed: () => generateLorem(length, true),
        });
        return;
      }
    }

    const message: MessageLoremGenerator = {
      module: "LoremGenerator",
      length,
      direction: "Inner",
      phase: "Actual",
      shouldSaveEditorPreference: shouldSavePreference,
      editorPreference: editorPreference,
    };

    parent.postMessage({ pluginMessage: message, }, "*");
  };

  const handleLoremChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (shouldSavePreference == false) {
      setShouldSavePreference(true);
    }
    setEditorPreference((prevPreference) => ({
      ...prevPreference,
      lorem: event.target.value,
    }));
  };

  return (
    <Modal show={show} handleClose={handleClose}>
      <h3>{t("module:createLoremIpsum")}</h3>
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:length")} />
        <SegmentedControl
          inputName="length"
          value={length}
          onChange={(newLength) => setLength(newLength as LoremLength)}
        >
          <SegmentedControl.Option label="term:short" value="short" />
          <SegmentedControl.Option label="term:medium" value="medium" />
          <SegmentedControl.Option label="term:long" value="long" />
        </SegmentedControl>
      </div>
      <div className="mt-xxsmall">
        <SectionTitle title={t("term:text")} />
        <textarea
          className="textarea"
          rows={5}
          value={editorPreference.lorem}
          onChange={handleLoremChange}
          placeholder={t("term:text")}
        />
      </div>

      <div className="mt-xxsmall"></div>
      <FigmaButton
        title={t("module:generate")}
        id={"lorem-apply"}
        onClick={() => {
          generateLorem(length);
        }}
      />
    </Modal>
  );
};

export default LoremIpsumModal;
