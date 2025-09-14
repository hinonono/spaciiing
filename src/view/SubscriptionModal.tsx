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
        <h2>{t("license:chooseYourPlan")}</h2>
        <span className="note">{t("license:weUseGumroad")}</span>
        <div className="mt-xsmall">
          <SubscriptionPlanBlock plan={"monthly"} />
          <SubscriptionPlanBlock plan={"yearly"} />
        </div>
        <div id="free-trial-faq" className="mt-small">
          <div className="accordion">
            <details className="mt-xsmall">
              <summary>{t("license:supportAndSubscriptionInfo")}</summary>
              <div className="">
                <span className="note">{t("license:supportAndSubscriptionInfoAnswer")}</span>
              </div>
            </details>
            <details className="mt-xsmall">
              <summary>{t("license:howRecurringPaymentsWork")}</summary>
              <div className="">
                <span className="note">{t("license:howRecurringPaymentsWorkAnswer")}</span>
              </div>
            </details>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
