import React from "react";
import FreeTrialGraph from "../../FreeTrialGraph";
import SubscriptionPlanBlock from "../../SubscriptionPlanBlock";
import { useTranslation } from "react-i18next";

interface NewFreeTrialViewProps {}

const NewFreeTrialView: React.FC<NewFreeTrialViewProps> = () => {
  const { t } = useTranslation(["license", "term"]);

  return (
    <div className="free-trial-modal">
      <h2>{t("license:trySevenDaysFree")}</h2>
      {/* Plan block */}
      <div>
        <SubscriptionPlanBlock
          plan={"yearly"}
          additionalClass={["subscription-block", "subscription-block-yearly"]}
        />
      </div>
      <div className="mt-xxsmall">
        <SubscriptionPlanBlock
          plan={"monthly"}
          additionalClass={["subscription-block"]}
        />
      </div>
      <span className="note mt-xxxsmall">{t("license:noHiddenFees")}</span>
      <div id="free-trial-faq" className="mt-xsmall">
        <h3>{t("license:freeTrialWorks")}</h3>
        <FreeTrialGraph />
        <h3 className="mt-xsmall">{t("license:supportAndSubscriptionInfo")}</h3>
        <p>{t("license:supportAndSubscriptionInfoAnswer")}</p>
        <h3 className="mt-xsmall">{t("license:howRecurringPaymentsWork")}</h3>
        <p>
          {t("license:howRecurringPaymentsWorkAnswer")}
          {t("license:noHiddenFees")}
        </p>
      </div>
    </div>
  );
};

export default NewFreeTrialView;
