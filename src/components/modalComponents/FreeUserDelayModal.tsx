import React, { useState, useEffect } from "react";
import { useAppContext } from "../../AppProvider";
import Modal from '../Modal';
import { useTranslation } from "react-i18next";
import FigmaButton from "../FigmaButton";
import SubscriptionPlanBlock from "../SubscriptionPlanBlock";
import { SvgSkip } from "../../assets/icons";

interface FreeUserDelayModalProps {
}

const FreeUserDelayModal: React.FC<FreeUserDelayModalProps> = () => {
  const { freeUserDelayModalConfig, setFreeUserDelayModalConfig, editorPreference } = useAppContext();
  const { t } = useTranslation(["module", "license", "term"]);

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
        <h2>{t("license:upgradeToSkipWaiting")}</h2>
        <div>
          <span className="note note-large special">
            {t("license:youSaved")
              .replace("$SAVED_CLICKS$", `${editorPreference.savedClicks}`)
              .replace("$SAVED_MIN$", `${editorPreference.savedClicks / 20}`)
            }
          </span>
        </div>
        <div className="mt-xsmall">
          <SubscriptionPlanBlock
            plan={"monthly"}
            additionalClass={["subscription-background", "pro"]}
          />
        </div>
        <div className="mt-xsmall flex align-items-center">
          <span className="note mr-xxsmall">{t("license:freeUsersNeedToWait").replace("$TIME_REMAINING$", timeRemaining.toString())}</span>
          <FigmaButton
            buttonType="tertiary"
            title={t("module:skip")}
            onClick={handleProceedButtonClicked}
            buttonHeight="medium"
            hasTopBottomMargin={true}
            disabled={!canProceed}
            svgPosition="right"
            svg={<SvgSkip color={canProceed ? "var(--figma-color-text)" : `var(--figma-color-text-disabled)`} />}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FreeUserDelayModal;
