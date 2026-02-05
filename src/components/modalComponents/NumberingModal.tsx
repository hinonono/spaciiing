import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppProvider';
import { isStringNumber } from '../../module-frontend/utilFrontEnd';
import { NumberingForm } from '../../types/Messages/MessageShortcut';
import FigmaButton from '../FigmaButton';
import Modal from '../Modal';
import SectionTitle from '../SectionTitle';
import { applyNumbering } from '../../module-frontend/shortcutFronEnd';
import { Direction } from '../../types/General';

interface NumberingModalProps {
  show: boolean;
  handleClose: () => void;
}

const NumberingModal: React.FC<NumberingModalProps> = ({
  show,
  handleClose,
}) => {
  const { t, i18n } = useTranslation(["module", "term"]);
  const appContext = useAppContext();

  const [direction, setDirection] = useState<Direction>("vertical");
  const [form, setForm] = useState<NumberingForm>("NUMBER");
  const [startFrom, setStartFrom] = useState(1);

  const handleDirectionChange = (event: { target: { value: string } }) => {
    const selectedDirection = event.target.value as Direction;
    setDirection(selectedDirection)
  };

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
      <p className="mb-small font-size-large">{t("module:numberingTextLayersDesc")}</p>
      <div className="mt-xxsmall">
        <SectionTitle title={t("term:direction")} />
        <select
          className="custom-select"
          value={direction}
          onChange={handleDirectionChange}
        >
          <option value="vertical">{t("module:ltrTtb")}</option>
          <option value="horizontal">{t("module:ttbLtr")}</option>
        </select>
      </div>
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
          {i18n.language === "zhTW" &&
            <>
              <option value="ZHTW_SIMPLE_HANZI">一, 二, 三</option>
              <option value="ZHTW_COMPLEX_HANZI">壹, 貳, 參</option>
            </>
          }
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
      <div className="mt-xxsmall">
        <FigmaButton
          title={t("module:apply")}
          onClick={() => {
            applyNumbering(appContext, direction, form, startFrom, false);
          }}
          hasTopBottomMargin={false}
        />
      </div>
    </Modal>
  );
};

export default NumberingModal;
