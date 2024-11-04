import React from "react";
import FigmaButton from "./FigmaButton";
import { SvgExternalLink } from "../assets/icons";
import * as paymentsUtil from "../module-frontend/paymentsUtil";
import { useTranslation } from "react-i18next";
import info from "../info.json";

interface SubscriptionPlanBlockProps {
  plan: "monthly" | "yearly";
  additionalClass?: string[];
}

const SubscriptionPlanBlock: React.FC<SubscriptionPlanBlockProps> = ({
  plan,
  additionalClass,
}) => {
  const { t } = useTranslation(["license", "term"]);

  return (
    <div
      className={`border-1 border-radius-large padding-16 ${
        additionalClass?.join(" ") || ""
      }`}
    >
      {plan === "yearly" && (
        <div className="badge">
          {t("license:savePercent").replace("$PERCENT$", "20%")}
        </div>
      )}
      <span
        className={`subscription-plan-title ${
          plan === "yearly" && "mt-xxsmall"
        }`}
      >
        {plan === "monthly" ? t("license:monthly") : t("license:yearly")}
      </span>
      {plan === "monthly" ? (
        <span className="note note-xlarge">
          {t("license:monthlyPriceDesc").replace(
            "$MONTHLY_PRICE$",
            "US$" + info.price.monthly
          )}
        </span>
      ) : (
        <span className="note note-xlarge">
          {t("license:yearlyPriceDesc").replace(
            "$YEARLY_PRICE$",
            "US$" + info.price.yearlyAvg
          )}
        </span>
      )}
      <div className="mt-xsmall"></div>
      {plan === "monthly" ? (
        <FigmaButton
          buttonType="secondary"
          title={t("license:tryItFree")}
          onClick={() => {
            paymentsUtil.navigateToCheckOutPage("monthly");
          }}
          svgPosition={"right"}
          hasTopBottomMargin={false}
          svg={<SvgExternalLink color="var(--figma-color-text)" />}
        />
      ) : (
        <FigmaButton
          buttonType="special"
          title={t("license:tryItFree")}
          onClick={() => {
            paymentsUtil.navigateToCheckOutPage("yearly");
          }}
          svgPosition={"right"}
          hasTopBottomMargin={false}
          svg={<SvgExternalLink color="white" />}
        />
      )}
    </div>
  );
};

export default SubscriptionPlanBlock;
