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

  // Determine plan type and get corresponding values
  const isYearly = plan === "YEARLY";
  const planLabel = isYearly ? t("license:yearly") : t("license:monthly");
  const price = isYearly ? info.price.yearly : info.price.monthly;
  const priceKey = isYearly ? "license:yearlyPriceDesc" : "license:monthlyPriceDesc";
  const priceToken = isYearly ? "$YEARLY_PRICE$" : "$MONTHLY_PRICE$";
  const priceDescription = t(priceKey).replace(priceToken, price);

  const handleUpgradeClick = () => {
    paymentsUtil.navigateToCheckOutPage(plan);
  };

  // List of subscription benefits
  const benefits = [
    "accessOver10ProTools",
    "noOperationDelay",
    "removeBranding",
    "allFutureUpdates",
    "prioritySupport",
  ];

  return (
    <div className={`subscription-plan-block ${plan} mt-xxsmall`}>
      {/* Plan header with title and price */}
      <div className="width-100 flex flex-justify-space-between align-items-center">
        <div>
          <span className="plan-title">{planLabel}</span>
          <span className="note note-large plan-title-secondary">
            US${priceDescription}
          </span>
        </div>
      </div>

      {/* Plan details and benefits */}
      <div className="width-100">
        <div className="mt-xxsmall">
          <FigmaButton
            title={t("license:upgrade")}
            buttonType="special"
            onClick={handleUpgradeClick}
          />
          <hr />
          <ul>
            {benefits.map((benefit) => (
              <li key={benefit}>{t(`license:${benefit}`)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanBlock;
