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
import { useTranslation } from "react-i18next";
import { checkProFeatureAccessibleForUser } from "../../module-frontend/utilFrontEnd";

interface LoremIpsumModalProps {
  show: boolean;
  handleClose: () => void;
}

const LoremIpsumModal: React.FC<LoremIpsumModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation(["module"]);
  const { licenseManagement, setShowCTSubscribe } = useAppContext();

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
          <option value="short">{t("module:short")}</option>
          <option value="medium">{t("module:medium")}</option>
          <option value="long">{t("module:long")}</option>
        </select>
      </div>
      <div className="mt-xxsmall"></div>
      <FigmaButton
        title={t("module:generate")}
        id={"lorem-apply"}
        onClick={() => {
          generateLorem(lang, length);
        }}
      />
    </Modal>
  );
};

export default LoremIpsumModal;
