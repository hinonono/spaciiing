import React from "react";
import FreeTrialGraph from "../../FreeTrialGraph";
import SubscriptionPlanBlock from "../../SubscriptionPlanBlock";
import { useTranslation } from "react-i18next";
import info from "../../../info.json"

interface NewFreeTrialViewProps { }

const NewFreeTrialView: React.FC<NewFreeTrialViewProps> = () => {
  const { t } = useTranslation(["license", "term"]);

  return (
    <div className="free-trial-modal">
      <h2>{t("license:upgradeToSkipWaiting")}</h2>
      <span className="note">{t("license:freeUsersNeedToWait").replace("$TIME_REMAINING$", info.freeUserWaitingTime.toString())}</span>
      {/* Plan block */}
      <div className="mt-xsmall">
        <SubscriptionPlanBlock
          plan={"monthly"}
          additionalClass={["subscription-block", "subscription-block-emphasize"]}
        />
      </div>
      <span className="note mt-xxsmall">{t("license:noHiddenFees")}</span>
      <div id="free-trial-faq" className="mt-small">
        <h3>{t("license:freeTrialWorks")}</h3>
        <FreeTrialGraph />
        <h3 className="mt-small">{t("license:supportAndSubscriptionInfo")}</h3>
        <p>{t("license:supportAndSubscriptionInfoAnswer")}</p>
        <h3 className="mt-small">{t("license:howRecurringPaymentsWork")}</h3>
        <p>
          {t("license:howRecurringPaymentsWorkAnswer")}
          {t("license:noHiddenFees")}
        </p>
      </div>
    </div>
  );
};

export default NewFreeTrialView;
