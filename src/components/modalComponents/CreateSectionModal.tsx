import React, { useState } from "react";
import SectionTitle from "../SectionTitle";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import * as pluginConfig from "../../pluginConfig.json";
import { MessageCreateSection } from "../../types/Messages/MessageShortcut";
import SegmentedControl from "../SegmentedControl";
import {
  checkProFeatureAccessibleForUser,
  isStringNumber,
} from "../../module-frontend/utilFrontEnd";

interface CreateSectionModalProps {
  show: boolean;
  handleClose: () => void;
}

const CreateSectionModal: React.FC<CreateSectionModalProps> = ({
  show,
  handleClose,
}) => {
  const { t } = useTranslation(["module", "term"]);
  const {
    licenseManagement,
    setFreeUserDelayModalConfig
  } = useAppContext();

  const createSection = (padding: number, isRealCall = false) => {
    if (!isRealCall) {
      if (!checkProFeatureAccessibleForUser(licenseManagement)) {
        setFreeUserDelayModalConfig({
          show: true,
          initialTime: pluginConfig.freeUserWaitingTime,
          onProceed: () => createSection(length, true),
        });
        return;
      }
    }

    const message: MessageCreateSection = {
      module: "Shortcut",
      action: "createSection",
      padding: padding,
      phase: "Actual",
      direction: "Inner"
    };

    parent.postMessage({ pluginMessage: message, }, "*");
  };

  // 新版：無論設定的尺寸，使用內側框與外側框來定義要產生的Icon
  const [activeLabel, setActiveLabel] = useState("medium");
  const [padding, setPadding] = useState<number>(128);

  const handleActiveLabelChange = (newActiveLabel: string) => {
    console.log(newActiveLabel);
    setActiveLabel(newActiveLabel);
    switch (newActiveLabel) {
      case "small":
        setPadding(64);
        break;
      case "medium":
        setPadding(128);
        break;
      case "large":
        setPadding(192);
        break;
      case "custom":
        break;
      default:
        break;
    }
  };

  const [customPaddingLabel, setCustomPaddingLabel] = useState("128");
  const [customFrameFieldNote, setCustomFrameFieldNote] = useState("");

  const handleCustomPaddingLabelChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (isStringNumber(event.target.value)) {
      setPadding(Number(event.target.value));
      setCustomPaddingLabel(event.target.value);
      setCustomFrameFieldNote("");
    } else {
      setCustomFrameFieldNote(t("module:invalidNumberInput"));
    }
  };

  return (
    <Modal show={show} handleClose={handleClose}>
      <h3>{t("module:createSection")}</h3>
      <p className="mb-small font-size-large">{t("module:createSectionDesc")}</p>
      <div>
        <SectionTitle title={t("term:padding")} />
        <SegmentedControl
          inputName="section-size"
          value={activeLabel}
          onChange={handleActiveLabelChange}
        >
          <SegmentedControl.Option
            value="small"
            label="term:small"
          />
          <SegmentedControl.Option
            value="medium"
            label="term:medium"
          />
          <SegmentedControl.Option
            value="large"
            label="term:large"
          />
          <SegmentedControl.Option
            value="custom"
            label="term:custom"
          />
        </SegmentedControl>
      </div>
      {activeLabel === "custom" && (
        <div className="mt-xxsmall">
          <div>
            <textarea
              className="textarea font-size-xlarge"
              rows={1}
              value={customPaddingLabel}
              onChange={handleCustomPaddingLabelChange}
              placeholder={t("module:customValueNumbersOnly")}
            />
          </div>
          {customFrameFieldNote && (
            <span className="note error">{customFrameFieldNote}</span>
          )}
        </div>
      )}
      <div className="mt-xxsmall">
        <FigmaButton
          title={t("module:apply")}
          id={"shortcut-apply-generate-icon-template"}
          onClick={() => {
            createSection(padding, false);
          }}
          hasTopBottomMargin={false}
        />
      </div>
    </Modal>
  );
};

export default CreateSectionModal;
