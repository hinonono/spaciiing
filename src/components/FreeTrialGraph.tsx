import React from "react";
import { useTranslation } from "react-i18next";

interface FreeTrialGraphProps {}

const FreeTrialGraph: React.FC<FreeTrialGraphProps> = () => {
  const { t } = useTranslation(["license"]);

  return (
    <div className="free-trial-graph">
      <div className="vertical-step-container">
        <div className="step">
          <div className="step-icon">🔓</div>
          <div className="step-content">
            <h4>{t("license:today")}</h4>
            <p>{t("license:todayMessage")}</p>
          </div>
        </div>
        <div className="step">
          <div className="step-icon">🔔</div>
          <div className="step-content">
            <h4>{t("license:dayFive")}</h4>
            <p>{t("license:dayFiveMessage")}</p>
          </div>
        </div>
        <div className="step">
          <div className="step-icon">⭐</div>
          <div className="step-content">
            <h4>{t("license:daySeven")}</h4>
            <p>{t("license:daySevenMessage")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialGraph;
