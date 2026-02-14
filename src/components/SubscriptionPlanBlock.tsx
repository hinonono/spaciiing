import React from "react";
import * as paymentsUtil from "../module-frontend/paymentsUtil";
import { useTranslation } from "react-i18next";
import info from "../pluginConfig.json";
import { FigmaButton } from ".";
import { ChargeType } from "../types/LicenseManagement";

interface SubscriptionPlanBlockProps {
  plan: ChargeType;
}

const SubscriptionPlanBlock: React.FC<SubscriptionPlanBlockProps> = ({
  plan,
}) => {
  const { t } = useTranslation(["license", "term"]);

  const isYearly = plan === "YEARLY";
  const planLabel = isYearly ? t("license:yearly") : t("license:monthly");
  const priceKey = isYearly ? "license:yearlyPriceDesc" : "license:monthlyPriceDesc";
  const price = isYearly ? info.price.yearly : info.price.monthly;
  const priceDescription = t(priceKey).replace("$PRICE_PLACEHOLDER$", `US$${price}`);

  const handleUpgradeClick = () => {
    paymentsUtil.navigateToCheckOutPage(plan);
  };

  return (
    <div className={`subscription-plan-block ${plan} mt-xxsmall`}>
      <div className="width-100 flex flex-justify-space-between align-items-center">
        <div>
          <span className="plan-title">{planLabel}</span>
          <span className="note note-large plan-title-secondary">
            {priceDescription}
          </span>
        </div>
      </div>
      <div className="width-100">
        <div className="mt-xxsmall">
          <FigmaButton
            title={t("license:upgrade")}
            buttonType="special"
            onClick={handleUpgradeClick}
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
    </div>
  );
};

export default SubscriptionPlanBlock;
