import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../AppProvider';
import Modal from '../components/Modal';
import { FigmaButton, SectionTitle, TitleBar } from '../components';
import SegmentedControl from '../components/SegmentedControl';
import { ConnectPointPosition, RectangleSegmentType, StrokeMode } from '../types/ArrowCreator';
import { applyArrowCreator } from '../module-frontend/arrowCreatorFrontEnd';
import ConnectPointSelectorView from '../components/arrowCreator/ConnectPointSelectorView';
import { CYStroke } from '../types/CYStroke';
import { Direction } from '../types/General';
import { SvgHorizontal, SvgVertical } from '../assets/icons';
import StrokeEditor from '../components/arrowCreator/StrokeEditor';
import StrokeStyleSelector from '../components/arrowCreator/StrokeStyleSelector';
import { StrokeEditModal } from '../components/modalComponents';


interface ArrowCreatorProps {

}

const ArrowCreator: React.FC<ArrowCreatorProps> = () => {
  const {
    licenseManagement,
    setFreeUserDelayModalConfig,
    editorPreference,
    setEditorPreference
  } = useAppContext();
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

  // 排列方向
  const [direction, setDirection] = useState<Direction>("horizontal");
  useEffect(() => {
    if (direction === "horizontal") {
      setSourceItemConnectPointPosition(RectangleSegmentType.MiddleRight);
      setTargetItemConnectPointPosition(RectangleSegmentType.MiddleLeft);
    } else if (direction === "vertical") {
      setSourceItemConnectPointPosition(RectangleSegmentType.BottomCenter);
      setTargetItemConnectPointPosition(RectangleSegmentType.TopCenter);
    }
  }, [direction])

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

  // 筆畫編輯彈窗
  const [showStrokeEditModal, setShowStrokeEditModal] = useState(false);
  const handleOpenSrokeEditModal = () => setShowStrokeEditModal(true);
  const handleCloseStrokeEditModal = () => setShowStrokeEditModal(false);

  const renderEditorBasedOnStrokeMode = () => {
    if (strokeMode === "freeform") {
      return (
        <StrokeEditor
          stroke={stroke}
          setStroke={setStroke}
          handleOpenStrokeEditModal={handleOpenSrokeEditModal}
        />
      );
    } else {
      return <StrokeStyleSelector setStroke={setStroke} />;
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
        <StrokeEditModal
          show={showStrokeEditModal}
          handleClose={handleCloseStrokeEditModal}
          stroke={stroke}
          setStroke={setStroke}
        />
        <TitleBar
          title={"Draw Arrows"}
          onClick={handleOpenExplanationModal}
          isProFeature={true}
        />
      </div>
      <div className="content">
        {/* 方向 */}
        <div>
          <SectionTitle title={"Direction"} />
          <SegmentedControl
            inputName="layout-direction"
            value={direction}
            onChange={(newDirection: string) => {
              setDirection(newDirection as Direction);
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
          </SegmentedControl>
        </div>
        {/* 連接點 */}
        <div className='mt-xsmall'>
          <SectionTitle title={"Connect point"} />
          <ConnectPointSelectorView
            direction={direction}
            sourceItemConnectPointPosition={sourceItemConnectPointPosition}
            setSourceItemConnectPointPosition={setSourceItemConnectPointPosition}
            targetItemConnectPointPosition={targetItemConnectPointPosition}
            setTargetItemConnectPointPosition={setTargetItemConnectPointPosition}
          />
          <div className="width-100 mt-xxsmall">
            <SectionTitle title={"Offset"} titleType="secondary" />
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
            inputName="stroke-style"
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
                createAnnotationBox,
                direction
              )
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ArrowCreator;

