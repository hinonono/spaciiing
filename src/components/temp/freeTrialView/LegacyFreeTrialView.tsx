import React from "react";
import FigmaButton from "../../FigmaButton";
import { useTranslation } from "react-i18next";
import * as paymentsUtil from "../../../module-frontend/paymentsUtil";
import FreeTrialGraph from "../../FreeTrialGraph";

interface LegacyFreeTrialViewProps {}

const LegacyFreeTrialView: React.FC<LegacyFreeTrialViewProps> = () => {
  const { t } = useTranslation(["license", "term"]);

  return (
    <div className="free-trial-modal">
      <h2>{t("license:trySevenDaysFree")}</h2>
      <p className="text-color-secondary cta-message">
        {t("license:unleashYourProductivity")}
      </p>
      <div className="mt-xsmall">
        <FigmaButton
          buttonType="special"
          title={t("license:tryItFree")}
          onClick={() => {
            paymentsUtil.navigateToCheckOutPage("monthly");
          }}
        />
        <p className="mt-xxxsmall text-center text-color-tertiary">
          7 days free, then $4.99 / mo.
        </p>
      </div>
      <FreeTrialGraph />
    </div>
  );
};

export default LegacyFreeTrialView;
