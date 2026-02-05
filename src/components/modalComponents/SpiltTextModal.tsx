import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppProvider';
import { SpiltType } from '../../types/Messages/MessageShortcut';
import FigmaButton from '../FigmaButton';
import Modal from '../Modal';
import SectionTitle from '../SectionTitle';
import { applySpiltText } from '../../module-frontend/shortcutFronEnd';

interface SpiltTextModalProps {
  show: boolean;
  handleClose: () => void;
}

const SpiltTextModal: React.FC<SpiltTextModalProps> = ({
  show,
  handleClose,
}) => {
  const { t, i18n } = useTranslation(["module", "term"]);
  const appContext = useAppContext();

  const [spiltType, setSpiltType] = useState<SpiltType>("SPACE")
  const handleSpiltTypeChange = (event: { target: { value: string } }) => {
    const selectedSpiltType = event.target.value as SpiltType;
    setSpiltType(selectedSpiltType)
  };

  const [spiltSymbol, setSpiltSymbol] = useState("");
  const handleSpiltSymbolChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSpiltSymbol(event.target.value);
  };

  return (
    <Modal
      show={show}
      handleClose={handleClose}
    >
      <h3>{t("module:spiltText")}</h3>
      <p className="mb-small font-size-large">{t("module:spiltTextDesc")}</p>
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:spiltBasedOn")} />
        <select
          className="custom-select"
          value={spiltType} // current language
          onChange={handleSpiltTypeChange}
        >
          <option value="SPACE">{t("module:space")}</option>
          <option value="LINE_BREAK">{t("module:lineBreak")}</option>
          <option value="CUSTOM">{t("term:custom")}</option>
        </select>
        {spiltType === "CUSTOM" && <>
          <div className="mt-xxsmall"></div>
          <textarea
            className="textarea"
            rows={1}
            value={spiltSymbol}
            onChange={handleSpiltSymbolChange}
            placeholder={t("module:spiltBasedOn")}
          />
        </>}
      </div>
      <div className="mt-xxsmall">
        <FigmaButton
          title={t("module:apply")}
          onClick={() => {
            applySpiltText(appContext, spiltType, spiltSymbol, false);
          }}
          hasTopBottomMargin={false}
        />
      </div>
    </Modal>
  );
};

export default SpiltTextModal;
