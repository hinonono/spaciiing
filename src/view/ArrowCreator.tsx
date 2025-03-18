import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../AppProvider';
import Modal from '../components/Modal';
import { FigmaButton, SectionTitle, StrokeEditorView, TitleBar } from '../components';
import SegmentedControl from '../components/SegmentedControl';
import { ConnectPointPosition, ConnectPointPositionPair, RectangleSegmentType, StrokeMode } from '../types/ArrowCreator';
import { applyArrowCreator } from '../module-frontend/arrowCreatorFrontEnd';
import { ConnectPointSelectorView } from '../components';
import { CYStroke } from '../types/CYStroke';


interface ArrowCreatorProps {

}

const ArrowCreator: React.FC<ArrowCreatorProps> = () => {
  const { licenseManagement, setFreeUserDelayModalConfig } = useAppContext();
  const { t } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  // 連接點
  const [sourceItemConnectPointPosition, setSourceItemConnectPointPosition] = useState<ConnectPointPosition>(RectangleSegmentType.MiddleRight);
  const [targetItemConnectPointPosition, setTargetItemConnectPointPosition] = useState<ConnectPointPosition>(RectangleSegmentType.MiddleLeft);

  // 安全間距
  const [safeMargin, setSafeMargin] = useState<number>(32);
  const handleSafeMarginChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    const numberValue = Number(value);

    if (!isNaN(numberValue)) {
      // setEditorPreference((prevPreference) => ({
      //   ...prevPreference,
      //   spacing: numberValue,
      // }));
      setSafeMargin(numberValue);

      setSafeMarginFieldNote("");
    } else {
      setSafeMarginFieldNote(t("module:invalidNumberInput"));
    }
  };
  const [safeMarginFieldNote, setSafeMarginFieldNote] =
    useState<string>("");

  // 是否建立註解框
  const [createAnnotationBox, setCreateAnnotationBox] = useState(false);
  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setCreateAnnotationBox(event.target.checked);
  };

  // 筆畫模式
  const [strokeMode, setStrokeMode] = useState<StrokeMode>("freeform");

  // 筆畫本體
  const [stroke, setStroke] = useState<CYStroke>({
    color: "64748B",
    opacity: 1,
    strokeWeight: 6,
    cornerRadius: 16,
    startPointCap: "NONE",
    endPointCap: "ARROW_LINES",
    dashAndGap: [0, 0],
  });

  const renderEditorBasedOnStrokeMode = () => {
    if (strokeMode === "freeform") {
      return (
        <div className="list-view mt-xsmall">
          <div className="list-view-header property-clipboard-header">
            <div></div>
            <div className="flex align-items-center flex-justify-center font-size-small text-color-primary">
            </div>
            <div>
              <FigmaButton
                title={"Save style"}
                onClick={() => {
                }}
                buttonHeight="small"
                fontSize="small"
                buttonType="grain"
                hasMargin={false}
              />
            </div>
          </div>
          <div className="padding-16 border-1-top">
            <StrokeEditorView stroke={stroke} setStroke={setStroke} />
          </div>
        </div>
      )
    } else {
      return null;
    }
  }


  return (
    <div>
      <div>
        <Modal
          show={showExplanationModal}
          handleClose={handleCloseExplanationModal}
        >
          <div>
            <h3>Draw Arrows</h3>
            <p>{t("module:moduleAspectRatioHelperDesc")}</p>
          </div>
        </Modal>
        <TitleBar
          title={"Draw Arrows"}
          onClick={handleOpenExplanationModal}
          isProFeature={true}
        />
      </div>
      <div className="content">
        {/* 連接點 */}
        <div>
          <SectionTitle title={"Connect point"} />
          <ConnectPointSelectorView
            sourceItemConnectPointPosition={sourceItemConnectPointPosition}
            setSourceItemConnectPointPosition={setSourceItemConnectPointPosition}
            targetItemConnectPointPosition={targetItemConnectPointPosition}
            setTargetItemConnectPointPosition={setTargetItemConnectPointPosition}
          />
          <div className="width-100 mt-xxsmall">
            <SectionTitle title={"Margin"} titleType="secondary" />
            <textarea
              className="textarea textarea-height-fit-content"
              rows={1}
              value={safeMargin}
              onChange={handleSafeMarginChange}
              placeholder={t("module:customValueNumbersOnly")}
            />
            {safeMarginFieldNote && (
              <span className="note error">{safeMarginFieldNote}</span>
            )}
          </div>
        </div>
        {/* 筆畫模式 */}
        <div className='mt-xsmall'>
          <SectionTitle title={"Stroke"} />
          <SegmentedControl
            inputName="mode"
            value={strokeMode}
            onChange={(newMode: string) => {
              setStrokeMode(newMode as StrokeMode);
            }}
          >
            <SegmentedControl.Option
              value="freeform"
              label="freeform"
            />
            <SegmentedControl.Option
              value="style"
              label="style"
            />
          </SegmentedControl>
          {renderEditorBasedOnStrokeMode()}
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <div className="custom-checkbox-group">
            <label className="container">
              {"Create annotation box"}
              <input
                type="checkbox"
                checked={createAnnotationBox}
                onChange={handleCheckboxChange}
              />
              <span className="checkmark"></span>
            </label>
          </div>
          <FigmaButton
            title={t("module:execute")}
            onClick={() => {
              applyArrowCreator(
                safeMargin,
                {
                  source: sourceItemConnectPointPosition,
                  target: targetItemConnectPointPosition
                },
                stroke,
                createAnnotationBox
              )
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ArrowCreator;

