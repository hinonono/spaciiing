import React from "react";
import FigmaButton from "./FigmaButton";
import { SvgExternalLink } from "../assets/icons";
import * as paymentsUtil from "../module-frontend/paymentsUtil";
import { useTranslation } from "react-i18next";
import info from "../pluginConfig.json";

interface SubscriptionPlanBlockProps {
  plan: "monthly" | "yearly";
  additionalClass?: string[];
}

const SubscriptionPlanBlock: React.FC<SubscriptionPlanBlockProps> = ({
  plan,
  additionalClass,
}) => {
  const { t } = useTranslation(["license", "term"]);

  const renderPriceDesc = () => {
    return plan === "monthly" ? (
      <span className="note note-large">
        {t("license:monthlyPriceDesc").replace(
          "$MONTHLY_PRICE$",
          "US$" + info.price.monthly
        )}
      </span>
    ) : (
      <span className="note note-large">
        {t("license:yearlyPriceDesc").replace(
          "$YEARLY_PRICE$",
          "US$" + info.price.yearly
        )}
      </span>
    )
  }

  return (
    <div
      className={`border-radius-xxxlarge padding-16 flex align-items-center ${additionalClass?.join(" ") || ""
        }`}
      onClick={() => paymentsUtil.navigateToPurchasePage()}
      style={{ cursor: "pointer" }}
    >
      <div className="width-100">
        <span className={"subscription-plan-title mt-xxsmall"}>
          {plan === "monthly" ? t("license:monthly") : t("license:yearly")}
        </span>
        {renderPriceDesc()}
      </div>
      <div className="icon-20">
        <SvgExternalLink color="var(--figma-color-text)" />
      </div>
    </div>
  );
};

export default SubscriptionPlanBlock;
