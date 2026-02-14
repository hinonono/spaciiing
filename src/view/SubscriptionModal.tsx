import React, { useState } from "react";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import { useTranslation } from "react-i18next";
import SubscriptionPlanBlock from "../components/SubscriptionPlanBlock";
import SegmentedControl from "../components/SegmentedControl";
import { ChargeType } from "../types/LicenseManagement";

const SubscriptionModal: React.FC = () => {
  const { showCTSubscribe, setShowCTSubscribe } = useAppContext();
  const { t } = useTranslation(["license", "term"]);

  const [showingPlan, setShowingPlan] = useState<ChargeType>("MONTHLY");

  const handleCloseCTSubscribe = () => {
    setShowCTSubscribe(false);
  };

  const handleShowingPlanChange = (newPlan: string) => {
    if (newPlan === "MONTHLY") {
      setShowingPlan("MONTHLY");
    } else {
      setShowingPlan("YEARLY");
    }
  }

  const renderPlanBlock = () => {
    if (showingPlan === "MONTHLY") {
      return <SubscriptionPlanBlock plan={"MONTHLY"} />;
    } else {
      return <SubscriptionPlanBlock plan={"YEARLY"} />;
    }
  }

  return (
    <Modal show={showCTSubscribe} handleClose={handleCloseCTSubscribe}>
      <div className="free-trial-modal">
        <h2>{t("license:chooseYourPlan")}</h2>
        <span className="note">{t("license:weUseGumroad")}</span>
        <div className="mt-xsmall">
          <SegmentedControl
            inputName="showing-plan"
            value={showingPlan}
            onChange={handleShowingPlanChange}
          >
            <SegmentedControl.Option
              value="monthly"
              label="license:monthly"
            />
            <SegmentedControl.Option
              value="yearly"
              label="license:yearly"
            />
          </SegmentedControl>
        </div>
        <div className="mt-xsmall">{renderPlanBlock()}</div>
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
