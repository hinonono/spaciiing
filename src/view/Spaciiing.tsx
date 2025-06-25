import React, { useEffect, useState } from "react";
import { TitleBar, SectionTitle, FigmaButton } from "../components";
import { useAppContext } from "../AppProvider";
import { SvgGrid, SvgHorizontal, SvgVertical } from "../assets/icons";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";
import { SpacingMode, } from "../types/Messages/MessageSpaciiing";
import SegmentedControl from "../components/SegmentedControl";
import CYCheckbox from "../components/CYCheckbox";
import { applySpacing } from "../module-frontend/spaciiingFrontEnd";

const SpacingValue: {
  nameKey: string;
  value: number | string;
  translatable: boolean;
}[] = [
    { nameKey: "0", value: 0, translatable: false },
    { nameKey: "8", value: 8, translatable: false },
    { nameKey: "16", value: 16, translatable: false },
    { nameKey: "20", value: 20, translatable: false },
    { nameKey: "24", value: 24, translatable: false },
    { nameKey: "32", value: 32, translatable: false },
    { nameKey: "term:custom", value: "custom", translatable: true },
  ];

const SpaciiingView: React.FC = () => {
  const { t } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  const appContext = useAppContext();

  // 水平或垂直模式
  const [mode, setMode] = useState<SpacingMode>("vertical");

  // 倍率
  const [multiplier, setMultiplier] = useState<number>(1);

  // 間距值
  const [space, setSpace] = useState<string | number>(0);
  const [enteredCustomSpacing, setEnteredCustomSpacing] = useState<number>(0);

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
      appContext.setEditorPreference((prevPreference) => ({
        ...prevPreference,
        spacing: numberValue,
      }));
      setEnteredCustomSpacing(numberValue);

      setCustomSpacingFieldNote("");
    } else {
      setCustomSpacingFieldNote(t("module:invalidNumberInput"));
    }
  };

  const multipliers = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (appContext.editorPreference.spacing) {
      setEnteredCustomSpacing(appContext.editorPreference.spacing);
    }
  }, [appContext.editorPreference]);

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
        {/* 倍率 */}
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:multiplySpacingBy")} />
          <div className="flex flex-row">
            <SegmentedControl
              inputName="multiply"
              value={String(multiplier)}
              onChange={(newMultiplier) => {
                setMultiplier(Number(newMultiplier));
              }}
            >
              {multipliers.map((singleMultiplier) => (
                <SegmentedControl.Option
                  value={String(singleMultiplier)}
                  label={String(singleMultiplier)}
                  translatable={false}
                />
              ))}
            </SegmentedControl>
          </div>
        </div>
        {/* 間距值 */}
        <div className="mt-xxsmall">
          <SectionTitle title={t("module:spacingValue")} />
          <div className="flex flex-row">
            <SegmentedControl
              inputName="prevalue"
              value={String(space)}
              onChange={(newSpace) => {
                if (!isNaN(Number(newSpace))) {
                  setSpace(Number(newSpace));
                } else {
                  setSpace(newSpace);
                }
              }}
            >
              {SpacingValue.map((item) => (
                <SegmentedControl.Option
                  value={String(item.value)}
                  label={
                    typeof item.value === "string"
                      ? String(item.nameKey)
                      : String(item.value * multiplier)
                  }
                  translatable={item.translatable}
                />
              ))}
            </SegmentedControl>
            {space === "custom" && (
              <div className="width-100">
                <div className="width-100 mt-xxsmall">
                  <textarea
                    id="sp-space-custom"
                    className="textarea"
                    rows={1}
                    value={enteredCustomSpacing}
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
              space,
              enteredCustomSpacing,
              multiplier,
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
