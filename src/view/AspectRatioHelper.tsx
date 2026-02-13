import React, { useState } from "react";
import { useAppContext } from "../AppProvider";
import { FigmaButton, IconButton, ListViewHeader, SectionTitle, TitleBar } from "../components";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";
import {
  SvgVertical,
  SvgHorizontal,
  SvgSwitch,
} from "../assets/icons";
import { Dimension } from "../types/General";
import {
  isStringNumber,
} from "../module-frontend/utilFrontEnd";
import SegmentedControl from "../components/SegmentedControl";
import { applyAspectRatioHandler, aspectRatioOptionsUI } from "../module-frontend/aspectRatioHelperFrontEnd";

interface AspectRatioHelperProps { }


const AspectRatioHelper: React.FC<AspectRatioHelperProps> = () => {
  const appContext = useAppContext();
  const { t } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  // 功能
  const [lockedDimension, setLockedDimension] = useState<Dimension>("width");
  const [widthCustomRatio, setWidthCustomRatio] = useState(1);
  const handleWidthCustomRatioChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newRatio = event.target.value
    if (isStringNumber(newRatio)) {
      setWidthCustomRatio(Number(newRatio));
    }
  };

  const [heightCustomRatio, setHeightCustomRatio] = useState(1);
  const handleHeightCustomRatioChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newRatio = event.target.value
    if (isStringNumber(newRatio)) {
      setHeightCustomRatio(Number(newRatio));
    }
  };

  const onSwitchClick = () => {
    const oldWidthRatio = widthCustomRatio;
    const oldHeightRatio = heightCustomRatio;

    setWidthCustomRatio(oldHeightRatio);
    setHeightCustomRatio(oldWidthRatio);
  }

  return (
    <div>
      <Modal
        show={showExplanationModal}
        handleClose={handleCloseExplanationModal}
      >
        <div>
          <h3>{t("module:moduleAspectRatioHelper")}</h3>
          <p>{t("module:moduleAspectRatioHelperDesc")}</p>
          <h4>{t("module:commonlyUsedAspectRatio")}</h4>
          <ul>
            {aspectRatioOptionsUI.map((option) => (
              <li key={option.name}>
                [{option.name}] {t(option.nameKey)}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
      <TitleBar
        title={t("module:moduleAspectRatioHelper")}
        onClick={handleOpenExplanationModal}
      />
      <div className="content">
        <div>
          <SectionTitle title={t("module:adjustDimension")} />
          <div className="flex flex-row">
            <SegmentedControl
              inputName="dimension"
              value={lockedDimension}
              onChange={(newDimension) =>
                setLockedDimension(newDimension as Dimension)
              }
            >
              <SegmentedControl.Option
                value="height"
                label="term:width"
                icon={<SvgHorizontal color="var(--figma-color-text)" />}
              />
              <SegmentedControl.Option
                value="width"
                label="term:height"
                icon={<SvgVertical color="var(--figma-color-text)" />}
              />
            </SegmentedControl>
          </div>
        </div>
        <div className="mt-xsmall">
          <div className="list-view mt-xsmall">
            <ListViewHeader title={t("module:presetAspectRatio")} additionalClass="property-clipboard-header" />
            <div className="padding-16 border-1-top">
              <div className="grid mt-xxxsmall">
                {aspectRatioOptionsUI.map((option) => (
                  <FigmaButton
                    key={option.name}
                    buttonType="secondary"
                    title={option.name}
                    fontSize="xlarge"
                    svg={option.svg}
                    buttonHeight="xlarge"
                    onClick={() => {
                      applyAspectRatioHandler(
                        appContext,
                        option.width,
                        option.height,
                        false,
                        lockedDimension,
                        false
                      );
                    }}
                    hasTopBottomMargin={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-xsmall">
          <SectionTitle title={t("term:custom")} />
          <div className="border-1 padding-16 border-radius-large">
            <div className="custom-ratio-block">
              <SectionTitle title={t("module:widthRatio")} />
              <div></div>
              <SectionTitle title={t("module:heightRatio")} />
            </div>
            <div className="custom-ratio-block">
              <textarea
                className="textarea font-size-xlarge"
                rows={1}
                value={widthCustomRatio}
                onChange={handleWidthCustomRatioChange}
                placeholder={t("module:customValueNumbersOnly")}
              />
              <IconButton
                buttonType="tertiary"
                iconSize="20"
                svg={<SvgSwitch color="var(--figma-color-text)" />}
                onClick={onSwitchClick}
                buttonHeight="small"
                hasTopBottomMargin={false}
              />
              <textarea
                className="textarea font-size-xlarge"
                rows={1}
                value={heightCustomRatio}
                onChange={handleHeightCustomRatioChange}
                placeholder={t("module:customValueNumbersOnly")}
              />
            </div>
            <div className="mt-xxsmall">
              <FigmaButton
                buttonType="secondary"
                title={t("module:apply")}
                onClick={() => {
                  applyAspectRatioHandler(
                    appContext,
                    widthCustomRatio,
                    heightCustomRatio,
                    true,
                    lockedDimension,
                    false
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AspectRatioHelper;
