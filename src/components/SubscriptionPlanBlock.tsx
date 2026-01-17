import React from "react";
import FigmaButton from "./FigmaButton";
import { SvgExternalLink } from "../assets/icons";
import * as paymentsUtil from "../module-frontend/paymentsUtil";
import { useTranslation } from "react-i18next";
import info from "../pluginConfig.json";

interface SubscriptionPlanBlockProps {
  plan: "monthly" | "yearly";
}

const SubscriptionPlanBlock: React.FC<SubscriptionPlanBlockProps> = ({
  plan,
}) => {
  const { t } = useTranslation(["license", "term"]);

  const renderPriceDesc = () => {
    return <>
      <span className="note note-large plan-title-secondary">
        {plan === "monthly" ? t("license:monthlyPriceDesc").replace(
          "$MONTHLY_PRICE$",
          "US$" + info.price.monthly
        ) : t("license:yearlyPriceDesc").replace(
          "$YEARLY_PRICE$",
          "US$" + info.price.yearly
        )}
      </span>
    </>
  }

  const getSvgColor = () => {
    return plan === "monthly" ? "var(--figma-color-text)" : "black"
  }

  return (
    <div
      className={`subscription-plan-block ${plan} mt-xxsmall`}
      onClick={() => paymentsUtil.navigateToCheckOutPage(plan)}
    >
      <div className="width-100">
        <span className={"plan-title"}>
          {plan === "monthly" ? t("license:monthly") : t("license:yearly")}
        </span>
        {renderPriceDesc()}
      </div>
      <div className="icon-20">
        <SvgExternalLink color={getSvgColor()} />
      </div>
    </div>
  );
};

export default SubscriptionPlanBlock;
