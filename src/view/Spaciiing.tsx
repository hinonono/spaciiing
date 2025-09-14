import React, { useEffect, useState } from "react";
import { TitleBar, SectionTitle, FigmaButton, Chip } from "../components";
import { useAppContext } from "../AppProvider";
import { SvgGrid, SvgHorizontal, SvgVertical } from "../assets/icons";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";
import { SpacingMode, } from "../types/Messages/MessageSpaciiing";
import SegmentedControl from "../components/SegmentedControl";
import CYCheckbox from "../components/CYCheckbox";
import { applySpacing } from "../module-frontend/spaciiingFrontEnd";

const SpaciiingView: React.FC = () => {
  const { t } = useTranslation(["module", "term"]);

  // 2025-07-20 新版UI
  // 紀錄使用者目前選中的間距按鈕是哪一個
  const [activeOption, setActiveOption] = useState<string>("16");

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const appContext = useAppContext();

  // 水平或垂直模式
  const [mode, setMode] = useState<SpacingMode>("vertical");

  // 現在啟用中的間距值
  const [activeSpacing, setActiveSpacing] = useState<number>(Number(activeOption));
  // 紀錄使用者輸入的間距值
  const [inputedSpacing, setInputedSpacing] = useState<number>(0);

  // 格線
  const [columnFieldNote, setColumnFieldNote] = useState("");
  const [column, setColumn] = useState<number>(2);
  const handleColumnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const n = Number(event.target.value);

    if (!isNaN(n)) {
      if (n < 2) {
        setColumnFieldNote(t("module:shouldLargeThanTwo"));
      } else {
        setColumn(n);
        setColumnFieldNote("");
      }
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIsChecked(event.target.checked);
  };

  const handleCustomValueChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    const numberValue = Number(value);

    if (!isNaN(numberValue)) {
      appContext.setEditorPreference((prevPreference) => ({
        ...prevPreference,
        spacing: numberValue,
      }));
      setInputedSpacing(numberValue);
      setActiveSpacing(numberValue);
    }
  };

  useEffect(() => {
    if (appContext.editorPreference.spacing) {
      setInputedSpacing(appContext.editorPreference.spacing);
    }
  }, [appContext.editorPreference]);

  const defaultSpacingOptions = [0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 96, 112, 128, 160];

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
        {/* 模式 */}
        <div>
          <SectionTitle title={t("module:mode")} />
          <SegmentedControl
            inputName="mode"
            value={mode}
            onChange={(newMode: string) => {
              setMode(newMode as SpacingMode);
            }}
          >
            <SegmentedControl.Option
              value="vertical"
              label="module:vertical"
              icon={<SvgVertical color="var(--figma-color-text)" />}
            />
            <SegmentedControl.Option
              value="horizontal"
              label="module:horizontal"
              icon={<SvgHorizontal color="var(--figma-color-text)" />}
            />
            <SegmentedControl.Option
              value="grid"
              label="module:grid"
              icon={<SvgGrid color="var(--figma-color-text)" />}
            />
          </SegmentedControl>
        </div>
        {/* 格線專用UI */}
        {mode === "grid" && (
          <div className="mt-xxsmall">
            <div>
              <div>
                <SectionTitle title={t("term:column")} />
                <textarea
                  className="textarea font-size-xlarge"
                  rows={1}
                  value={column}
                  onChange={handleColumnChange}
                  placeholder={t("module:customValueNumbersOnly")}
                />
                {columnFieldNote && (
                  <span className="note error">{columnFieldNote}</span>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:spacingValue")} />
          <div className="cy-checkbox-group spacing-option-set border-1-cy-border-light padding-16 hide-scrollbar-vertical">
            <div className="spacing-option-numbers">
              {defaultSpacingOptions.map((num) =>
                <Chip
                  label={num.toString()}
                  onClick={() => {
                    setActiveOption(num.toString());
                    setActiveSpacing(num);
                  }}
                  highlighted={activeOption === num.toString() ? true : false}
                />
              )}
              <button
                className={`button chip spacing-option-custom ${activeOption === "custom" ? "highlighted" : ""}`}
                onClick={() => {
                  setActiveOption("custom");
                  setActiveSpacing(inputedSpacing);
                }}
              >
                <span>{t("term:custom")}</span>
                <input
                  className="cy-input"
                  type="text"
                  value={inputedSpacing}
                  onChange={handleCustomValueChangeInput}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="cy-checkbox-group mt-xsmall">
          <CYCheckbox
            label={t("module:addAutoLayoutAfterApply")}
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>
        <FigmaButton
          title={t("module:execute")}
          id={"sp-apply"}
          onClick={() => {
            applySpacing(
              appContext,
              false,
              activeSpacing,
              mode,
              isChecked,
              column
            )
          }}
        />
      </div>
    </div>
  );
};

export default SpaciiingView;
