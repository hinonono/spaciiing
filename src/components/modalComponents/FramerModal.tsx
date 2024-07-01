import React, { useState } from "react";
import { SvgVertical, SvgHorizontal } from "../../assets/icons";
import FigmaButton from "../FigmaButton";
import Modal from "../Modal";
import { MessageFramer, FramerMode } from "../../types/Message";
import { useAppContext } from "../../AppProvider";

interface FramerModalProps {
  showFramerModal: boolean;
  handleCloseFramerModal: () => void;
}

const FramerModal: React.FC<FramerModalProps> = ({
  showFramerModal,
  handleCloseFramerModal,
}) => {
  const { licenseManagement, setShowCTSubscribe } = useAppContext();

  const [selectedFramerMode, setSelectedFramerMode] = useState("topAndBottom");
  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedFramerMode(event.target.value);
  };

  const applyFramer = () => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";

    if (licenseManagement.isLicenseActive == false && isDevelopment == false) {
      setShowCTSubscribe(true);
      return;
    }

    const message: MessageFramer = {
      mode: selectedFramerMode as FramerMode,
      module: "Framer",
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
    <Modal show={showFramerModal} handleClose={handleCloseFramerModal}>
      <div>
        <div>
          <div className="section-title">Mode</div>
          <div className="custom-segmented-control">
            <input
              type="radio"
              name="eq-mode"
              id="eq_Option1"
              value="topAndBottom"
              checked={selectedFramerMode === "topAndBottom"}
              onChange={handleChange}
            />
            <label htmlFor="eq_Option1">
              <div className="icon-20">
                <SvgVertical color="var(--figma-color-text)" />
              </div>
              Top and Bottom
            </label>
            <input
              type="radio"
              name="eq-mode"
              id="eq_Option2"
              value="leftAndRight"
              checked={selectedFramerMode === "leftAndRight"}
              onChange={handleChange}
            />
            <label htmlFor="eq_Option2">
              <div className="icon-20">
                <SvgHorizontal color="var(--figma-color-text)" />
              </div>
              Left and Right
            </label>
            <input
              type="radio"
              name="eq-mode"
              id="eq_Option3"
              value="all"
              checked={selectedFramerMode === "all"}
              onChange={handleChange}
            />
            <label htmlFor="eq_Option3">All</label>
          </div>
        </div>
        <div className="mt-xxsmall"></div>
        <FigmaButton title={"Apply"} id={"eq-apply"} onClick={applyFramer} />
      </div>
    </Modal>
  );
};

export default FramerModal;
