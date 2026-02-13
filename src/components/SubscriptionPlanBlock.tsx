import React from "react";
import * as paymentsUtil from "../module-frontend/paymentsUtil";
import { useTranslation } from "react-i18next";
import info from "../pluginConfig.json";
import { FigmaButton } from ".";

interface SubscriptionPlanBlockProps {
  plan: "monthly" | "yearly";
}

const SubscriptionPlanBlock: React.FC<SubscriptionPlanBlockProps> = ({
  plan,
}) => {
  const { t } = useTranslation(["license", "term"]);

  const renderPriceDesc = () => {
    return <>
      <div>
        <div className="mt-xxsmall">
          <FigmaButton
            title={t("license:upgrade")}
            buttonType="special"
            onClick={() => paymentsUtil.navigateToCheckOutPage(plan)}
          />
          <hr />
          <ul>
            <li>{t("license:accessOver10ProTools")}</li>
            <li>{t("license:noOperationDelay")}</li>
            <li>{t("license:removeBranding")}</li>
            <li>{t("license:allFutureUpdates")}</li>
            <li>{t("license:prioritySupport")}</li>
          </ul>
        </div>
      </div>
    </>
  }

  return (
    <div
      className={`subscription-plan-block ${plan} mt-xxsmall`}
    >
      <div className="width-100 flex flex-justify-space-between align-items-center">
        <div>
          <span className={"plan-title"}>
            {plan === "monthly" ? t("license:monthly") : t("license:yearly")}
          </span>
          <span className="note note-large plan-title-secondary">
            {plan === "monthly" ? t("license:monthlyPriceDesc").replace(
              "$MONTHLY_PRICE$",
              "US$" + info.price.monthly
            ) : t("license:yearlyPriceDesc").replace(
              "$YEARLY_PRICE$",
              "US$" + info.price.yearly
            )}
          </span>
        </div>
      </div>
      <div className="width-100">
        {renderPriceDesc()}
      </div>
    </div>
  );
};

export default SubscriptionPlanBlock;
