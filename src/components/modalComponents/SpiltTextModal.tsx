import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppProvider';
import { isStringNumber } from '../../module-frontend/utilFrontEnd';
import { NumberingForm } from '../../types/Messages/MessageShortcut';
import FigmaButton from '../FigmaButton';
import Modal from '../Modal';
import SectionTitle from '../SectionTitle';
import { applyNumbering, applySpiltText } from '../../module-frontend/shortcutFronEnd';
import { Direction } from '../../types/General';

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
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:spiltBasedOn")} />
        <textarea
          className="textarea font-size-xlarge"
          rows={1}
          value={spiltSymbol}
          onChange={handleSpiltSymbolChange}
          placeholder={t("module:spiltBasedOn")}
        />
      </div>
      <div className="mt-xsmall">
        <FigmaButton
          title={t("module:apply")}
          onClick={() => {
            applySpiltText(appContext, spiltSymbol, false);
          }}
        />
      </div>
    </Modal>
  );
};

export default SpiltTextModal;
