import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../AppProvider';
import Modal from '../components/Modal';
import { FigmaButton, SectionTitle, TitleBar } from '../components';
import SegmentedControl from '../components/SegmentedControl';
import { ConnectPointPosition, StrokeMode } from '../types/ArrowCreator';
import { applyArrowCreator } from '../module-frontend/arrowCreatorFrontEnd';
import ConnectPointSelectorView from '../components/ConnectPointSelectorView';


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
  const [startItemConnectPointPosition, setStartItemConnectPointPosition] = useState<ConnectPointPosition>("centerRight");
  const [endItemConnectPointPosition, setEndItemConnectPointPosition] = useState<ConnectPointPosition>("centerLeft");

  // 安全間距
  const [safeMargin, setSafeMargin] = useState<number>(0);
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
        <div>
          <SectionTitle title={"Connect point"} />
          <ConnectPointSelectorView
            startItemConnectPointPosition={startItemConnectPointPosition}
            setStartItemConnectPointPosition={setStartItemConnectPointPosition}
            endItemConnectPointPosition={endItemConnectPointPosition}
            setEndItemConnectPointPosition={setEndItemConnectPointPosition}
          />
          <div className="width-100">
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
        </div>
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
        </div>
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
            onClick={applyArrowCreator}
          />
        </div>
      </div>
    </div>
  );
};

export default ArrowCreator;
