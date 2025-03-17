import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../AppProvider';
import Modal from '../components/Modal';
import { FigmaButton, SectionTitle, StrokeEditorView, TitleBar } from '../components';
import SegmentedControl from '../components/SegmentedControl';
import { ConnectPointPosition, ConnectPointPositionPair, SegmentType, StrokeMode } from '../types/ArrowCreator';
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
  const [startItemConnectPointPosition, setStartItemConnectPointPosition] = useState<ConnectPointPosition>(SegmentType.MiddleRight);
  const [endItemConnectPointPosition, setEndItemConnectPointPosition] = useState<ConnectPointPosition>(SegmentType.MiddleLeft);
  const [connectPointPositionPair, setConnectPointPositionPair] = useState<ConnectPointPositionPair>({ start: startItemConnectPointPosition, end: endItemConnectPointPosition });


  // 安全間距
  const [safeMargin, setSafeMargin] = useState<number>(40);
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
    color: "000000",
    opacity: 1,
    strokeWeight: 1,
    cornerRadius: 0,
    startPointCap: "NONE",
    endPointCap: "NONE",
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
            startItemConnectPointPosition={startItemConnectPointPosition}
            setStartItemConnectPointPosition={setStartItemConnectPointPosition}
            endItemConnectPointPosition={endItemConnectPointPosition}
            setEndItemConnectPointPosition={setEndItemConnectPointPosition}
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
                connectPointPositionPair,
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
