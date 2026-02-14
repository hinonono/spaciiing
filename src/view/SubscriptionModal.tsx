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
  const [billingPeriod, setBillingPeriod] = useState<ChargeType>("YEARLY");

  const handleClose = () => {
    setShowCTSubscribe(false);
  };

  const handleBillingPeriodChange = (value: string) => {
    setBillingPeriod(value === "MONTHLY" ? "MONTHLY" : "YEARLY");
  };

  return (
    <Modal show={showCTSubscribe} handleClose={handleClose}>
      <div className="free-trial-modal">
        <h2>{t("license:chooseYourPlan")}</h2>
        <span className="note">{t("license:weUseGumroad")}</span>

        <div className="mt-xsmall">
          <SegmentedControl
            inputName="billing-period"
            value={billingPeriod}
            onChange={handleBillingPeriodChange}
          >
            <SegmentedControl.Option value="MONTHLY" label="license:monthly" />
            <SegmentedControl.Option value="YEARLY" label="license:yearly" />
          </SegmentedControl>
        </div>
        <div className="mt-xsmall">
          <SubscriptionPlanBlock plan={billingPeriod} />
        </div>

        <div id="free-trial-faq" className="mt-small">
          <div className="accordion">
            <details>
              <summary>{t("license:supportAndSubscriptionInfo")}</summary>
              <span className="note mt-xsmall">{t("license:supportAndSubscriptionInfoAnswer")}</span>
            </details>
            <details>
              <summary>{t("license:howRecurringPaymentsWork")}</summary>
              <span className="note mt-xsmall">{t("license:howRecurringPaymentsWorkAnswer")}</span>
            </details>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
