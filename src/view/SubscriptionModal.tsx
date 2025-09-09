import React from "react";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import FreeTrialGraph from "../components/FreeTrialGraph";
import SubscriptionPlanBlock from "../components/SubscriptionPlanBlock";

const SubscriptionModal: React.FC = () => {
  const { showCTSubscribe, setShowCTSubscribe } = useAppContext();
  const { t } = useTranslation(["license", "term"]);

  const handleCloseCTSubscribe = () => {
    setShowCTSubscribe(false);
  };

  return (
    <Modal show={showCTSubscribe} handleClose={handleCloseCTSubscribe}>
      <div className="free-trial-modal">
        <h2>{t("license:upgradeToSkipWaiting")}</h2>
        <div className="mt-xsmall">
          <SubscriptionPlanBlock
            plan={"monthly"}
            additionalClass={["subscription-background", "pro"]}
          />
        </div>
        <div id="free-trial-faq" className="mt-small">
          <h3>{t("license:freeTrialWorks")}</h3>
          <span className="note mt-xxsmall">{t("license:noHiddenFees")}</span>
          <div className="mt-xxsmall"></div>
          <FreeTrialGraph />
          <div className="accordion">
            <details className="mt-xsmall">
              <summary>{t("license:supportAndSubscriptionInfo")}</summary>
              <div className="padding-16">
                <p>{t("license:supportAndSubscriptionInfoAnswer")}</p>
              </div>
            </details>
            <details className="mt-xsmall">
              <summary>{t("license:howRecurringPaymentsWork")}</summary>
              <div className="padding-16">
                <p>{t("license:howRecurringPaymentsWorkAnswer")}{t("license:noHiddenFees")}</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
