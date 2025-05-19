import React from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../AppProvider";

interface NormalBannerProps { }

const NormalBanner: React.FC<NormalBannerProps> = () => {
  const { t } = useTranslation(["license", "term"]);
  const { setShowCTSubscribe } = useAppContext();

  return (
    <>
      <div className="frame-group">
        <div className="message-primary">{t("license:upgradeToSkipWaiting")}</div>
      </div>
      <button
        className="button button--special"
        onClick={() => setShowCTSubscribe(true)}
      >
        {t("license:seeAllPlans")}
      </button>
    </>
  );
};

export default NormalBanner;
