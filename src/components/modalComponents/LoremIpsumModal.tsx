import React, { useState } from "react";
import SectionTitle from "../SectionTitle";
import FigmaButton from "../FigmaButton";
import {
  LoremLength,
  LoremSupportedLang,
  MessageLoremGenerator,
} from "../../types/Message";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";

interface LoremIpsumModalProps {
  show: boolean;
  handleClose: () => void;
}

const LoremIpsumModal: React.FC<LoremIpsumModalProps> = ({
  show,
  handleClose,
}) => {
  const { licenseManagement, setShowCTSubscribe } = useAppContext();

  const [lang, setLang] = useState<LoremSupportedLang>("en");
  const [length, setLength] = useState<LoremLength>("short");

  const generateLorem = (lang: LoremSupportedLang, length: LoremLength) => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";
    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageLoremGenerator = {
      module: "LoremGenerator",
      lang,
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

  return (
    <Modal show={show} handleClose={handleClose}>
      <div className="mt-xxsmall">
        <SectionTitle title="Language" />
        <select
          name="lang"
          className="custom-select"
          id="lang_select"
          value={lang}
          onChange={(e) => setLang(e.target.value as LoremSupportedLang)}
        >
          <option value="en">English</option>
          <option value="zh-tw">繁體中文</option>
        </select>
      </div>
      <div className="mt-xxsmall">
        <SectionTitle title="Length" />
        <select
          name="length"
          className="custom-select"
          id="length_select"
          value={length}
          onChange={(e) => setLength(e.target.value as LoremLength)}
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>
      <div className="mt-xxsmall"></div>
      <FigmaButton
        title={"Generate"}
        id={"lorem-apply"}
        onClick={() => {
          generateLorem(lang, length);
        }}
      />
    </Modal>
  );
};

export default LoremIpsumModal;
