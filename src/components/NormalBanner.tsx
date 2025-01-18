import React from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../AppProvider";

interface NormalBannerProps {}

const NormalBanner: React.FC<NormalBannerProps> = () => {
  const { t } = useTranslation(["license", "term"]);
  const { setShowCTSubscribe } = useAppContext();

  return (
    <div className="banner flex flex-justify-spacebetween align-items-center">
      <div className="frame-group">
        <div className="message-primary">{t("license:upgradeToSkipWaiting")}</div>
        {/* <div className="note message-secondary mt-xxxsmall">
          {t("license:monthlyPriceDesc").replace(
            "$MONTHLY_PRICE$",
            "$" + info.price.monthly
          )}
        </div> */}
      </div>
      <button
        className="button button--special"
        onClick={() => setShowCTSubscribe(true)}
      >
        {t("term:learnMore")}
      </button>
    </div>
  );
};

export default NormalBanner;
