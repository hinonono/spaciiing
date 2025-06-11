import React from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../AppProvider";
import info from "../info.json"

interface NormalBannerProps { }

const NormalBanner: React.FC<NormalBannerProps> = () => {
  const { t } = useTranslation(["license", "term"]);
  const { setShowCTSubscribe } = useAppContext();

  return (
    <>
      <div className="frame-group">
        <div className="message-primary">{t("license:upgradeToSkipWaiting")}</div>
        <div className="message-secondary">{t("license:youNeedToWait").replace("$WAIT_TIME$", info.freeUserWaitingTime.toString())}</div>
      </div>
      <button
        className="button button--special"
        onClick={() => setShowCTSubscribe(true)}
      >
        {t("license:upgrade")}
      </button>
    </>
  );
};

export default NormalBanner;
