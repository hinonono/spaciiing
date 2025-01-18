import React, { useState, useEffect } from "react";
import { useAppContext } from "../../AppProvider";
import Modal from '../Modal';
import { useTranslation } from "react-i18next";
import FigmaButton from "../FigmaButton";

interface FreeUserDelayModalProps {
}

const FreeUserDelayModal: React.FC<FreeUserDelayModalProps> = () => {
  const { freeUserDelayModalConfig, setFreeUserDelayModalConfig } = useAppContext();
  const { t } = useTranslation(["license", "term"]);

  //Param
  const [timeRemaining, setTimeRemaining] = useState(freeUserDelayModalConfig.initialTime);
  const [canProceed, setCanProceed] = useState(false);

  const handleCloseFreeUserDelay = () => {
    setFreeUserDelayModalConfig(prevState => ({
      ...prevState,
      show: false
    }));
  };

  useEffect(() => {
    if (freeUserDelayModalConfig.show) {
      setTimeRemaining(freeUserDelayModalConfig.initialTime);
      setCanProceed(false);

      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanProceed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup on unmount or modal close
    }
  }, [freeUserDelayModalConfig.show, freeUserDelayModalConfig.initialTime]);

  const handleProceedButtonClicked = () => {
    freeUserDelayModalConfig.onProceed();

    setFreeUserDelayModalConfig(prevState => ({
      ...prevState,
      show: false,
    }));
  }

  return (
    <Modal show={freeUserDelayModalConfig.show} handleClose={handleCloseFreeUserDelay}>
      <div className="free-trial-modal">
        <h2>Free User Delay Modal</h2>
        <span className="note mt-xxxsmall">{t("license:noHiddenFees")}</span>
        <div className="mt-xsmall">
          <h3 className="mt-xsmall">{t("license:supportAndSubscriptionInfo")}</h3>
          <p>
            {timeRemaining > 0
              ? `You need to wait ${timeRemaining} seconds before proceeding.`
              : "You can now proceed."}
          </p>
          <FigmaButton
              buttonType="secondary"
              title={"Proceed"}
              onClick={handleProceedButtonClicked}
              buttonHeight="xlarge"
              hasTopBottomMargin={true}
              disabled={!canProceed}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FreeUserDelayModal;
