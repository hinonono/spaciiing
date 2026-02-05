import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppProvider';
import Modal from '../Modal';
import { FigmaButton, SectionTitle } from '..';
import { checkProFeatureAccessibleForUser } from '../../module-frontend/utilFrontEnd';
import * as pluginConfig from "../../pluginConfig.json";
import { ShortcutAction } from '../../types/Messages/MessageShortcut';

interface ColorToLabelModalProps {
  show: boolean;
  handleClose: () => void;
}

const ColorToLabelModal: React.FC<ColorToLabelModalProps> = ({ show, handleClose }: ColorToLabelModalProps) => {
  const { t, i18n } = useTranslation(["module"]);
  const {
    licenseManagement,
    setFreeUserDelayModalConfig
  } = useAppContext();

  const [outputFormat, setOutputFormat] = useState<ShortcutAction>("colorToLabelHEX")

  const colorToLabel = (
    action: ShortcutAction,
    isRealCall = false
  ) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: pluginConfig.freeUserWaitingTime,
          onProceed: () => colorToLabel(action, true),
        });
        return;
      }
    }

    const message = {
      module: "Shortcut",
      action: action,
      direction: "Inner",
      phase: "Actual",
      lang: i18n.language
    };

    parent.postMessage({ pluginMessage: message, }, "*");
  };

  return (
    <Modal show={show} handleClose={handleClose}>
      <h3>{t("module:colorToLabel")}</h3>
      <p className="mb-small font-size-large">{t("module:colorToLabelDesc")}</p>
      <div>
        <SectionTitle title={t("module:outputFormat")} />
        <select
          name="color-to-label-output-format"
          className="custom-select"
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value as ShortcutAction)}
        >
          <option key="HEX" value="colorToLabelHEX">{t("module:hexValue")}</option>
          <option key="HEX_WITH_TRANSPARENCY" value="colorToLabelHEXWithTransparency">{t("module:hexValueWithTransparency")}</option>
          <option key="RGB" value="colorToLabelRGB">{t("module:rgbValue")}</option>
          <option key="RGBA" value="colorToLabelRGBA">{t("module:rgbaValue")}</option>
        </select>
      </div>
      <div className="mt-xxsmall">
        <FigmaButton
          title={t("module:apply")}
          onClick={() => { colorToLabel(outputFormat, false); }}
          hasTopBottomMargin={false}
        />
      </div>
    </Modal>
  );
};

export default ColorToLabelModal;
