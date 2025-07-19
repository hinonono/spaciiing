import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../AppProvider';
import Modal from '../components/Modal';
import { CYCheckbox, FigmaButton, SectionTitle, TitleBar } from '../components';
import SegmentedControl from '../components/SegmentedControl';
import { ConnectPointPosition, RectSegmentType, StrokeMode } from '../types/ArrowCreator';
import { applyArrowCreator, defaultOffset, defaultStroke } from '../module-frontend/arrowCreatorFrontEnd';
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
  const appContext = useAppContext();
  const { t } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  // 連接點
  const [sourceItemConnectPointPosition, setSourceItemConnectPointPosition] = useState<ConnectPointPosition>(RectSegmentType.MR);
  const [targetItemConnectPointPosition, setTargetItemConnectPointPosition] = useState<ConnectPointPosition>(RectSegmentType.ML);

  // 安全間距
  const [safeMargin, setSafeMargin] = useState<number>(defaultOffset);
  const handleSafeMarginChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    const numberValue = Number(value);

    if (!isNaN(numberValue)) {
      setSafeMargin(numberValue);
      setSafeMarginFieldNote("");
    } else {
      setSafeMarginFieldNote(t("module:invalidNumberInput"));
    }
  };
  const [safeMarginFieldNote, setSafeMarginFieldNote] = useState<string>("");

  // 是否建立註解框
  const [createAnnotationBox, setCreateAnnotationBox] = useState(false);
  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setCreateAnnotationBox(event.target.checked);
  };

  // 筆畫模式
  const [strokeMode, setStrokeMode] = useState<StrokeMode>(appContext.runtimeSyncedResources.strokeStyles.length > 0 ? "style" : "freeform");
  useEffect(() => {
    if (strokeMode === "freeform") {

      setStroke(defaultStroke)
    }
    console.log(stroke)
  }, [strokeMode])

  // 排列方向
  const [direction, setDirection] = useState<Direction>("horizontal");
  useEffect(() => {
    if (direction === "horizontal") {
      setSourceItemConnectPointPosition(RectSegmentType.MR);
      setTargetItemConnectPointPosition(RectSegmentType.ML);
    } else if (direction === "vertical") {
      setSourceItemConnectPointPosition(RectSegmentType.BC);
      setTargetItemConnectPointPosition(RectSegmentType.TC);
    }
  }, [direction])

  // 筆畫本體
  const [stroke, setStroke] = useState<CYStroke>(defaultStroke);


  // 筆畫編輯彈窗
  const [showStrokeEditModal, setShowStrokeEditModal] = useState(false);
  const handleOpenSrokeEditModal = (existingStyleName: string | undefined, existingStyleId: string | undefined) => {
    if (existingStyleName) {
      setExistingStyleName(existingStyleName);
    }

    if (existingStyleId) {
      setExistingStyleId(existingStyleId)
    }

    setShowStrokeEditModal(true)
  };
  const handleCloseStrokeEditModal = () => {
    if (existingStyleName) {
      setExistingStyleName(undefined);
    }

    if (existingStyleId) {
      setExistingStyleId(undefined)
    }

    setShowStrokeEditModal(false)
  };
  const [strokeModalMode, setStrokeModalMode] = useState<"create" | "edit">("create");

  const renderEditorBasedOnStrokeMode = () => {
    if (strokeMode === "freeform") {
      return (
        <StrokeEditor
          editingStroke={stroke}
          setEditingStroke={setStroke}
          handleOpenStrokeEditModal={handleOpenSrokeEditModal}
          setStrokeModalMode={setStrokeModalMode}
        />
      );
    } else {
      return (
        <StrokeStyleSelector
          setEditStroke={setStroke}
          handleOpenStrokeEditModal={handleOpenSrokeEditModal}
          setStrokeModalMode={setStrokeModalMode}
        />
      );
    }
  }

  const [existingStyleName, setExistingStyleName] = useState<string | undefined>();
  const [existingStyleId, setExistingStyleId] = useState<string | undefined>();

  return (
    <div>
      <div>
        <Modal
          show={showExplanationModal}
          handleClose={handleCloseExplanationModal}
        >
          <div>
            <h3>{t("module:moduleDrawArrows")}</h3>
            <p>{t("module:moduleDrawArrowsDesc")}</p>
          </div>
        </Modal>
        <StrokeEditModal
          show={showStrokeEditModal}
          handleClose={handleCloseStrokeEditModal}
          stroke={stroke}
          setStroke={setStroke}
          mode={strokeModalMode}
          existingStyleName={existingStyleName}
          setExistingStyleName={setExistingStyleName}
          existingStyleId={existingStyleId}
        />
        <TitleBar
          title={t("module:moduleDrawArrows")}
          onClick={handleOpenExplanationModal}
        />
      </div>
      <div className="content">
        {/* 方向 */}
        <div>
          <SectionTitle title={t("term:direction")} />
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
          <SectionTitle title={t("module:connectPoint")} />
          <ConnectPointSelectorView
            direction={direction}
            sourceItemConnectPointPosition={sourceItemConnectPointPosition}
            setSourceItemConnectPointPosition={setSourceItemConnectPointPosition}
            targetItemConnectPointPosition={targetItemConnectPointPosition}
            setTargetItemConnectPointPosition={setTargetItemConnectPointPosition}
          />
        </div>
        {/* 間隔距離 */}
        <div className="mt-xsmall">
          <SectionTitle title={t("module:offset")} />
          <div className="flex">
            <textarea
              className="textarea"
              rows={1}
              value={safeMargin}
              onChange={handleSafeMarginChange}
              placeholder={t("module:customValueNumbersOnly")}
            />
            {[8, 16, 32].map((num) =>
              <div className='ml-xxxsmall'>
                <FigmaButton
                  buttonType="tertiary"
                  title={`${num}`}
                  onClick={() => setSafeMargin(num)}
                  hasTopBottomMargin={false}
                />
              </div>
            )}
          </div>
          {safeMarginFieldNote && (
            <span className="note error">{safeMarginFieldNote}</span>
          )}
        </div>
        {/* 筆畫模式 */}
        <div className='mt-xsmall'>
          <SectionTitle title={t("term:stroke")} />
          <SegmentedControl
            inputName="stroke-style"
            value={strokeMode}
            onChange={(newMode: string) => {
              setStrokeMode(newMode as StrokeMode);
            }}
          >
            <SegmentedControl.Option
              value="freeform"
              label={t("module:freeform")}
            />
            <SegmentedControl.Option
              value="style"
              label={`${t("term:style")} (${appContext.runtimeSyncedResources.strokeStyles.length})`}
            />
          </SegmentedControl>
          {renderEditorBasedOnStrokeMode()}
        </div>
        {/* 按鈕 */}
        <div className="mt-xsmall">
          <div className="cy-checkbox-group">
            <CYCheckbox
              label={t("module:createAnnotationBox")}
              checked={createAnnotationBox}
              onChange={handleCheckboxChange}
            />
          </div>
          <FigmaButton
            title={t("module:execute")}
            onClick={() => {
              applyArrowCreator(
                false,
                appContext,
                safeMargin,
                {
                  start: sourceItemConnectPointPosition,
                  end: targetItemConnectPointPosition
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

