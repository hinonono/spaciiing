import React, { useEffect, useState } from "react";
import { TitleBar, SectionTitle, FigmaButton } from "../components";
import {
  ExternalMessageUpdateCustomSpacing,
  MessageSpaciiing,
  SpacingMode,
} from "../types/Message";
import { useAppContext } from "../AppProvider";
import { SvgHorizontal, SvgVertical } from "../assets/icons";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";

const SpaciiingView: React.FC = () => {
  const { t } = useTranslation(["module"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const { lastCustomSpacing, setLastCustomSpacing } = useAppContext();
  // const [customValue, setCustomValue] = useState<string>("");
  const [mode, setMode] = useState<SpacingMode>("vertical");
  const [multiply, setMultiply] = useState<number>(1);
  const [space, setSpace] = useState<string | number>(0);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIsChecked(event.target.checked);
  };

  const handleCustomValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setLastCustomSpacing(event.target.value);
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
    setLastCustomSpacing(spacing);
  };

  const applySpacing = () => {
    let spacing = "0";
    let useCustomValue = false;

    if (space === "custom") {
      spacing = lastCustomSpacing === "" ? "0" : lastCustomSpacing;
      useCustomValue = lastCustomSpacing === "" ? false : true;
    } else {
      spacing = String(Number(space) * multiply);
    }

    const message: MessageSpaciiing = {
      module: "Spaciiing",
      mode,
      spacing,
      useCustomValue,
      addAutolayout: isChecked,
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
                    checked={multiply === value}
                    onChange={() => setMultiply(value)}
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
              {[0, 8, 16, 20, 24, 32, "custom"].map((value) => (
                <React.Fragment key={value}>
                  <input
                    type="radio"
                    name="sp-space"
                    id={`default_Option${value}`}
                    value={value}
                    checked={space === value}
                    onChange={() => setSpace(value)}
                  />
                  <label
                    className="sp-c-space"
                    htmlFor={`default_Option${value}`}
                  >
                    {typeof value === "string" ? value : value * multiply}
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
                    value={lastCustomSpacing}
                    onChange={handleCustomValueChange}
                    placeholder="Custom Value. Numbers only."
                  />
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
