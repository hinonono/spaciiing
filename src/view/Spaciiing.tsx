import React, { useEffect, useState } from "react";
import { TitleBar, SectionTitle, FigmaButton } from "../components";
import { useAppContext } from "../AppProvider";
import { SvgHorizontal, SvgVertical } from "../assets/icons";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";
import {
  SpacingMode,
  ExternalMessageUpdateCustomSpacing,
  MessageSpaciiing,
} from "../types/Messages/MessageSpaciiing";

const SpacingValue: {
  nameKey: string;
  value: number | string;
  translate: boolean;
}[] = [
  { nameKey: "0", value: 0, translate: false },
  { nameKey: "8", value: 8, translate: false },
  { nameKey: "16", value: 16, translate: false },
  { nameKey: "20", value: 20, translate: false },
  { nameKey: "24", value: 24, translate: false },
  { nameKey: "32", value: 32, translate: false },
  { nameKey: "term:custom", value: "custom", translate: true },
];

const SpaciiingView: React.FC = () => {
  const { t } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const {
    // lastCustomSpacing,
    // setLastCustomSpacing,
    editorPreference,
    setEditorPreference,
  } = useAppContext();

  // 水平或垂直模式
  const [mode, setMode] = useState<SpacingMode>("vertical");

  // 倍率
  const [multiplier, setMultiplier] = useState<number>(1);

  // 間距值
  const [space, setSpace] = useState<string | number>(0);
  const [enteredCustomSpacing, setEnteredCustomSpacing] = useState<number>(0);

  const [isChecked, setIsChecked] = useState(false);

  const [customSpacingFieldNote, setCustomSpacingFieldNote] =
    useState<string>("");

  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIsChecked(event.target.checked);
  };

  const handleCustomValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;

    const numberValue = Number(value);

    if (!isNaN(numberValue)) {
      // 即將刪除
      // setLastCustomSpacing(value);

      // 新版
      setEditorPreference((prevPreference) => ({
        ...prevPreference,
        spacing: numberValue,
      }));
      setEnteredCustomSpacing(numberValue);

      setCustomSpacingFieldNote("");
    } else {
      setCustomSpacingFieldNote("Invalid number input");
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.pluginMessage) {
        const value: Array<ExternalMessageUpdateCustomSpacing> = Object.values(
          event.data.pluginMessage
        );
        const message = value[0];

        updateMemorizedSpacing(message.spacing);
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const updateMemorizedSpacing = (spacing: string) => {
    // setLastCustomSpacing(spacing);

    const numberValue = Number(spacing);

    if (!isNaN(numberValue)) {
      setEditorPreference((prevPreference) => ({
        ...prevPreference,
        spacing: numberValue,
      }));
    }
  };

  const applySpacing = () => {
    let finalSpacing: number;
    let useCustomValue: boolean;

    if (typeof space === "string") {
      // 使用者選擇了自定義間距
      finalSpacing = enteredCustomSpacing;
      useCustomValue = true;
    } else {
      // 預設間距
      finalSpacing = space * multiplier;
      useCustomValue = false;
    }

    const message: MessageSpaciiing = {
      module: "Spaciiing",
      mode: mode,
      spacing: finalSpacing,
      useCustomValue: useCustomValue,
      addAutolayout: isChecked,
      direction: "Inner",
      phase: "Actual",
      shouldSaveEditorPreference: true,
      editorPreference: editorPreference,
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
          <h3>{t("module:moduleSpaciiing")}</h3>
          <p>{t("module:moduleSpaciiingDesc")}</p>
        </div>
      </Modal>
      <TitleBar title="Spaciiing" onClick={handleOpenExplanationModal} />
      <div className="content">
        <div>
          <SectionTitle title={t("module:mode")} />
          <div className="custom-segmented-control">
            <input
              type="radio"
              name="sp-mode"
              id="mode_Option1"
              value="vertical"
              checked={mode === "vertical"}
              onChange={() => setMode("vertical")}
            />
            <label htmlFor="mode_Option1">
              <div className="icon-24">
                <SvgVertical color="var(--figma-color-text)" />
              </div>
              {t("module:vertical")}
            </label>
            <input
              type="radio"
              name="sp-mode"
              id="mode_Option2"
              value="horizontal"
              checked={mode === "horizontal"}
              onChange={() => setMode("horizontal")}
            />
            <label htmlFor="mode_Option2">
              <div className="icon-24">
                <SvgHorizontal color="var(--figma-color-text)" />
              </div>
              {t("module:horizontal")}
            </label>
          </div>
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:multiplySpacingBy")} />
          <div className="flex flex-row">
            <div className="custom-segmented-control">
              {[1, 2, 3, 4, 5].map((value) => (
                <React.Fragment key={value}>
                  <input
                    type="radio"
                    name="sp-multiply"
                    id={`multiply_Option${value}`}
                    value={value}
                    checked={multiplier === value}
                    onChange={() => setMultiplier(value)}
                  />
                  <label htmlFor={`multiply_Option${value}`}>{value}</label>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:spacingValue")} />
          <div className="flex flex-row">
            <div className="custom-segmented-control">
              {SpacingValue.map((item) => (
                <React.Fragment key={item.value}>
                  <input
                    type="radio"
                    name="sp-space"
                    id={`default_Option${item.value}`}
                    value={item.value}
                    checked={space === item.value}
                    onChange={() => setSpace(item.value)}
                  />
                  <label
                    className="sp-c-space"
                    htmlFor={`default_Option${item.value}`}
                  >
                    {typeof item.value === "string"
                      ? t(item.nameKey)
                      : item.value * multiplier}
                  </label>
                </React.Fragment>
              ))}
            </div>
            {space === "custom" && (
              <div className="width-100">
                <div className="width-100 mt-xxsmall">
                  <textarea
                    id="sp-space-custom"
                    className="textarea"
                    rows={1}
                    value={editorPreference.spacing}
                    onChange={handleCustomValueChange}
                    placeholder={t("module:customValueNumbersOnly")}
                  />
                  {customSpacingFieldNote && (
                    <span className="note error">{customSpacingFieldNote}</span>
                  )}
                </div>
                <div className="mt-xxsmall">
                  <span className="note">
                    {t("module:customValueIsNotAffect")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="custom-checkbox-group mt-xsmall">
          <label className="container">
            {t("module:addAutoLayoutAfterApply")}
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <FigmaButton
          title={t("module:execute")}
          id={"sp-apply"}
          onClick={applySpacing}
        />
      </div>
    </div>
  );
};

export default SpaciiingView;
