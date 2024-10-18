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

interface LoremIpsumModalProps {
  show: boolean;
  handleClose: () => void;
}

const LoremIpsumModal: React.FC<LoremIpsumModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation(["module"]);
  const {
    licenseManagement,
    setShowCTSubscribe,
    editorPreference,
    setEditorPreference,
  } = useAppContext();

  // const [lang, setLang] = useState<LoremSupportedLang>("en");
  const [length, setLength] = useState<LoremLength>("short");

  const generateLorem = (length: LoremLength) => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageLoremGenerator = {
      module: "LoremGenerator",
      length,
      direction: "Inner",
      phase: "Actual",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  const handleLoremChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorPreference((prevPreference) => ({
      ...prevPreference,
      lorem: event.target.value,
    }));
  };

  return (
    <Modal show={show} handleClose={handleClose}>
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:text")} />
        <textarea
          className="textarea font-size-xlarge"
          rows={1}
          value={editorPreference.lorem}
          onChange={handleLoremChange}
          placeholder={t("module:text")}
        />
      </div>
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:length")} />
        <SegmentedControl
          inputName="length"
          value={length}
          onChange={(newLength) => setLength(newLength as LoremLength)}
        >
          <SegmentedControl.Option label="module:short" value="short" />
          <SegmentedControl.Option label="module:medium" value="medium" />
          <SegmentedControl.Option label="module:long" value="long" />
        </SegmentedControl>
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
