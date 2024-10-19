import React, { useState, useEffect } from "react";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import SectionTitle from "../SectionTitle";
import { useAppContext } from "../../AppProvider";
import { useTranslation } from "react-i18next";
import {
  checkProFeatureAccessibleForUser,
  isStringNumber,
} from "../../module-frontend/utilFrontEnd";
import {
  ShortcutAction,
  MessageShortcutGenerateIconTemplate,
} from "../../types/Messages/MessageShortcut";
import SegmentedControl from "../SegmentedControl";

interface IconTemplateModalProps {
  showIconModal: boolean;
  handleCloseIconModal: () => void;
}

const IconTemplateModal: React.FC<IconTemplateModalProps> = ({
  showIconModal,
  handleCloseIconModal,
}) => {
  const { t } = useTranslation(["module"]);
  const {
    licenseManagement,
    setShowCTSubscribe,
    editorPreference,
    setEditorPreference,
  } = useAppContext();

  const [quantity, setQuantity] = useState("1");

  // 新版：無論設定的尺寸，使用內側框與外側框來定義要產生的Icon
  const [tempIconSize, setTempIconSize] = useState("24");

  const [innerFrame, setInnerFrame] = useState(20);
  const [outerFrame, setOuterFrame] = useState(24);

  const [customInnerFrame, setCustomInnerFrame] = useState("20");
  const [customOuterFrame, setCustomOuterFrame] = useState("24");

  const [customFrameFieldNote, setCustomFrameFieldNote] = useState("");

  const [isPreferenceUpdated, setIsPreferenceUpdated] = useState(false);

  const handleCustomValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setQuantity(event.target.value);
  };

  const handleIconSizeOptionChange = (newTempIconSize: string) => {
    console.log(newTempIconSize);
    switch (newTempIconSize) {
      case "24":
        setInnerFrame(20);
        setOuterFrame(24);
        setTempIconSize("24");
        break;
      case "48":
        setInnerFrame(40);
        setOuterFrame(48);
        setTempIconSize("48");
        break;
      case "custom":
        setTempIconSize("custom");
        break;
      default:
        setInnerFrame(20);
        setOuterFrame(24);
        setTempIconSize("24");
        break;
    }
  };

  const applyGenerateIconTemplate = (action: ShortcutAction) => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }

    if (action !== "generateIconTemplate") {
      return;
    }

    if (tempIconSize === "custom") {
      setInnerFrame(Number(customInnerFrame));
      setOuterFrame(Number(customOuterFrame));

      setEditorPreference((prevPreference) => {
        const updatedPreference = {
          ...prevPreference,
          iconFrame: {
            innerFrame: innerFrame,
            outerFrame: outerFrame,
          },
        };
        setIsPreferenceUpdated(true);
        return updatedPreference;
      });
    } else {
      setIsPreferenceUpdated(true);
    }
  };

  useEffect(() => {
    if (isPreferenceUpdated) {
      const message: MessageShortcutGenerateIconTemplate = {
        module: "Shortcut",
        action: "generateIconTemplate",
        direction: "Inner",
        phase: "Actual",
        innerFrame: innerFrame,
        outerFrame: outerFrame,
        quantity: Number(quantity),
        shouldSaveEditorPreference: true,
        editorPreference: editorPreference,
      };

      parent.postMessage(
        {
          pluginMessage: message,
        },
        "*"
      );

      setIsPreferenceUpdated(false);
    }
  }, [isPreferenceUpdated, editorPreference, innerFrame, outerFrame, quantity]);

  const handleCustomInnerFrameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (isStringNumber(event.target.value)) {
      setInnerFrame(Number(event.target.value));
      setCustomInnerFrame(event.target.value);
      setCustomFrameFieldNote("");
    } else {
      setCustomFrameFieldNote(t("module:invalidNumberInput"));
    }
  };

  const handleCustomOuterFrameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (isStringNumber(event.target.value)) {
      setOuterFrame(Number(event.target.value));
      setCustomOuterFrame(event.target.value);
      setCustomFrameFieldNote("");
    } else {
      setCustomFrameFieldNote(t("module:invalidNumberInput"));
    }
  };

  return (
    <Modal show={showIconModal} handleClose={handleCloseIconModal}>
      <div>
        <SectionTitle title={t("module:size")} />
        <SegmentedControl
          inputName="icon-size"
          value={tempIconSize}
          onChange={handleIconSizeOptionChange}
        >
          <SegmentedControl.Option
            value="24"
            label="24px"
            translatable={false}
          />
          <SegmentedControl.Option
            value="48"
            label="48px"
            translatable={false}
          />
          <SegmentedControl.Option value="custom" label="term:custom" />
        </SegmentedControl>
      </div>
      {tempIconSize === "custom" && (
        <div className="mt-xxsmall">
          <div className="grid">
            <div>
              <SectionTitle title={t("module:innerFrame")} />
              <textarea
                className="textarea font-size-xlarge"
                rows={1}
                value={customInnerFrame}
                onChange={handleCustomInnerFrameChange}
                placeholder={t("module:customValueNumbersOnly")}
              />
            </div>
            <div>
              <SectionTitle title={t("module:outerFrame")} />
              <textarea
                className="textarea font-size-xlarge"
                rows={1}
                value={customOuterFrame}
                onChange={handleCustomOuterFrameChange}
                placeholder={t("module:customValueNumbersOnly")}
              />
            </div>
          </div>
          {customFrameFieldNote && (
            <span className="note error">{customFrameFieldNote}</span>
          )}
        </div>
      )}
      <div className="mt-xxsmall">
        <SectionTitle title={t("module:quantity")} />
        <div className="width-100 mt-xxsmall">
          <textarea
            className="textarea font-size-xlarge"
            rows={1}
            value={quantity}
            onChange={handleCustomValueChange}
            placeholder={t("module:howManyIconsToBeGenerated")}
          />
        </div>
      </div>
      <div className="mt-xxsmall">
        <FigmaButton
          title={t("module:apply")}
          id={"shortcut-apply-generate-icon-template"}
          onClick={() => {
            applyGenerateIconTemplate("generateIconTemplate");
          }}
        />
      </div>
    </Modal>
  );
};

export default IconTemplateModal;
