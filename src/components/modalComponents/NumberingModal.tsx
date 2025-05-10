import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppProvider';
import { checkProFeatureAccessibleForUser, isStringNumber } from '../../module-frontend/utilFrontEnd';
import { ShortcutAction, MessageShortcutFindAndReplace, MessageShortcutNumbering, NumberingForm } from '../../types/Messages/MessageShortcut';
import FigmaButton from '../FigmaButton';
import Modal from '../Modal';
import SectionTitle from '../SectionTitle';
import * as info from "../../info.json";
import { applyNumbering } from '../../module-frontend/shortcutFronEnd';

interface NumberingModalProps {
  show: boolean;
  handleClose: () => void;
}

const NumberingModal: React.FC<NumberingModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation(["module"]);
  const appContext = useAppContext();

  const [form, setForm] = useState<NumberingForm>("NUMBER");
  const [startFrom, setStartFrom] = useState(1);



  const handleFormChange = (event: { target: { value: string } }) => {
    const selectedForm = event.target.value as NumberingForm;
    setForm(selectedForm)
  };

  const handleStartFromChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (isStringNumber(event.target.value)) {

      setStartFrom(Number(event.target.value));
    }

  };

  return (
    <Modal
      show={show}
      handleClose={handleClose}
    >
      <h3>{t("module:numberingTextLayers")}</h3>
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:numberingForm")} />
        <select
          className="custom-select"
          value={form}
          onChange={handleFormChange}
        >
          <option value="NUMBER">1, 2, 3</option>
          <option value="ALPHABETIC_UPPERCASE">A, B, C</option>
          <option value="ALPHABETIC_LOWERCASE">a, b, c</option>
        </select>
      </div>
      {
        form === "NUMBER" && <div className="mt-xxsmall">
          <SectionTitle title={t("module:startFrom")} />
          <div className="width-100">
            <textarea
              className="textarea"
              rows={1}
              value={startFrom}
              onChange={handleStartFromChange}
              placeholder={t("module:customValueNumbersOnly")}
            />
          </div>
        </div>
      }
      <div className="mt-xsmall">
        <FigmaButton
          title={t("module:apply")}
          onClick={() => {
            applyNumbering(appContext, form, startFrom, false);
          }}
        />
      </div>
    </Modal>
  );
};

export default NumberingModal;
