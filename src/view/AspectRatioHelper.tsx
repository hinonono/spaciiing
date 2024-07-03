import React, { useState } from "react";
import { useAppContext } from "../AppProvider";
import { FigmaButton, SectionTitle, TitleBar } from "../components";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";
import { SvgVertical, SvgHorizontal, SvgAR16to9, SvgAR9to16, SvgAR4to3, SvgAR3to4, SvgAR3to2, SvgAR2to3, SvgAR1to1 } from "../assets/icons";
import { Dimension } from "../types/Message";
import {
  checkProFeatureAccessibleForUser,
  applyAspectRatio,
} from "../module-frontend/utilFrontEnd";

interface AspectRatioHelperProps {}
type AspectRatioOptions =
  | "16:9"
  | "9:16"
  | "4:3"
  | "3:4"
  | "3:2"
  | "2:3"
  | "1:1"
  | "custom";

const AspectRatioHelper: React.FC<AspectRatioHelperProps> = () => {
  const { licenseManagement, setShowCTSubscribe } = useAppContext();
  const { t } = useTranslation(["module", "term"]);

  // 功能說明彈窗
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const handleOpenExplanationModal = () => setShowExplanationModal(true);
  const handleCloseExplanationModal = () => setShowExplanationModal(false);

  // 功能
  const [lockedDimension, setLockedDimension] = useState<Dimension>("width");
  const [widthCustomRatio, setWidthCustomRatio] = useState(0);
  const handleWidthCustomRatioChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setWidthCustomRatio(Number(event.target.value));
  };

  const [heightCustomRatio, setHeightCustomRatio] = useState(0);
  const handleHeightCustomRatioChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setHeightCustomRatio(Number(event.target.value));
  };

  const aspectRatioOptionsUI: {
    name: AspectRatioOptions;
    svg: React.JSX.Element;
    width: number;
    height: number;
    nameKey: string;
  }[] = [
    {
      name: "16:9",
      svg: <SvgAR16to9 color="var(--figma-color-text)" />,
      width: 16,
      height: 9,
      nameKey: "module:aspectRatio_16_9",
    },
    {
      name: "9:16",
      svg: <SvgAR9to16 color="var(--figma-color-text)" />,
      width: 9,
      height: 16,
      nameKey: "module:aspectRatio_9_16",
    },
    {
      name: "4:3",
      svg: <SvgAR4to3 color="var(--figma-color-text)" />,
      width: 4,
      height: 3,
      nameKey: "module:aspectRatio_4_3",
    },
    {
      name: "3:4",
      svg: <SvgAR3to4 color="var(--figma-color-text)" />,
      width: 3,
      height: 4,
      nameKey: "module:aspectRatio_3_4",
    },
    {
      name: "3:2",
      svg: <SvgAR3to2 color="var(--figma-color-text)" />,
      width: 3,
      height: 2,
      nameKey: "module:aspectRatio_3_2",
    },
    {
      name: "2:3",
      svg: <SvgAR2to3 color="var(--figma-color-text)" />,
      width: 2,
      height: 3,
      nameKey: "module:aspectRatio_2_3",
    },
    {
      name: "1:1",
      svg: <SvgAR1to1 color="var(--figma-color-text)" />,
      width: 1,
      height: 1,
      nameKey: "module:aspectRatio_1_1",
    },
  ];

  const applyAspectRatioHandler = (
    widthRatio: number,
    heightRatio: number,
    isCustom: boolean
  ) => {
    if (!checkProFeatureAccessibleForUser(licenseManagement)) {
      setShowCTSubscribe(true);
      return;
    }
    applyAspectRatio(widthRatio, heightRatio, isCustom, lockedDimension);
  };

  return (
    <div>
      <Modal
        show={showExplanationModal}
        handleClose={handleCloseExplanationModal}
      >
        <div>
          <h3>{t("module:moduleAspectRatioHelper")}</h3>
          <p>
            {t("module:moduleAspectRatioHelperDesc")}
          </p>
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
        isProFeature={true}
      />
      <div className="content">
        <div>
          <SectionTitle title={t("module:lockDimension")} />
          <div className="flex flex-row">
            <div className="custom-segmented-control">
              <input
                type="radio"
                name="aspect-lock-dimension"
                id="mode_width"
                value="width"
                checked={lockedDimension === "width"}
                onChange={() => setLockedDimension("width")}
              />
              <label htmlFor="mode_width">
                <div className="icon-24">
                  <SvgHorizontal color="var(--figma-color-text)" />
                </div>
                {t("module:width")}
              </label>
              <input
                type="radio"
                name="aspect-lock-dimension"
                id="mode_height"
                value="height"
                checked={lockedDimension === "height"}
                onChange={() => setLockedDimension("height")}
              />
              <label htmlFor="mode_height">
                <div className="icon-24">
                  <SvgVertical color="var(--figma-color-text)" />
                </div>
                {t("module:height")}
              </label>
            </div>
          </div>
        </div>
        <div className="mt-xsmall">
          <SectionTitle title={t("module:presetAspectRatio")} />
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
                  applyAspectRatioHandler(option.width, option.height, false);
                }}
                hasTopBottomMargin={false}
              />
            ))}
          </div>
        </div>
        <div className="mt-xsmall">
          <SectionTitle title={t("term:custom")} />
          <div className="border-1 padding-16 border-radius-large">
            <div className="grid">
              <div>
                <SectionTitle title={t("module:widthRatio")} />
                <textarea
                  className="textarea font-size-xlarge"
                  rows={1}
                  value={widthCustomRatio}
                  onChange={handleWidthCustomRatioChange}
                  placeholder={t("module:customValueNumbersOnly")}
                />
              </div>
              <div>
                <SectionTitle title={t("module:heightRatio")} />
                <textarea
                  className="textarea font-size-xlarge"
                  rows={1}
                  value={heightCustomRatio}
                  onChange={handleHeightCustomRatioChange}
                  placeholder={t("module:customValueNumbersOnly")}
                />
              </div>
            </div>
            <div className="mt-xxsmall">
              <FigmaButton
                buttonType="secondary"
                title={t("module:apply")}
                onClick={() => {
                  applyAspectRatioHandler(
                    widthCustomRatio,
                    heightCustomRatio,
                    true
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
