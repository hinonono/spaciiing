import React, { useState } from "react";
import { TitleBar, FigmaButton, SectionTitle } from "../components";
import {
  LoremLength,
  LoremSupportedLang,
  MessageLoremGenerator,
} from "../types/Message";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import { checkProFeatureAccessibleForUser } from "../module-frontend/utilFrontEnd";

const LoremGenerator: React.FC = () => {
  const { licenseManagement, setShowCTSubscribe } = useAppContext();
  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const [lang, setLang] = useState<LoremSupportedLang>("en");
  const [length, setLength] = useState<LoremLength>("short");

  const generateLorem = (lang: LoremSupportedLang, length: LoremLength) => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
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
    <div>
      <Modal
        show={showExplanationModal}
        handleClose={handleCloseExplanationModal}
      >
        <div>
          <h3>Lorem Generator</h3>
          <p>Generate lorem ipsum with different length.</p>
        </div>
      </Modal>
      <TitleBar
        title="Lorem Generator"
        onClick={handleOpenExplanationModal}
        isProFeature={true}
      />
      <div className="content">
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
      </div>
    </div>
  );
};

export default LoremGenerator;
