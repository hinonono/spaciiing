import React from "react";
import FreeTrialGraph from "../../FreeTrialGraph";
import SubscriptionPlanBlock from "../../SubscriptionPlanBlock";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../AppProvider";

interface NewFreeTrialViewProps { }

const NewFreeTrialView: React.FC<NewFreeTrialViewProps> = () => {
  const { editorPreference } = useAppContext();
  const { t } = useTranslation(["license", "term"]);

  return (
    <div className="free-trial-modal">
      <h2>{t("license:upgradeToSkipWaiting")}</h2>
      {/* Plan block */}
      <div className="mt-xsmall">
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
      <span className="note mt-xxsmall">{t("license:noHiddenFees")}</span>
      <div id="free-trial-faq" className="mt-small">
        <h3>{t("license:freeTrialWorks")}</h3>
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
  );
};

export default NewFreeTrialView;
