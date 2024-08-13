import React from "react";
import { useTranslation } from "react-i18next";

interface NormalBannerProps {}

const NormalBanner: React.FC<NormalBannerProps> = () => {
  const { t } = useTranslation(["license"]);

  return (
    <div className="banner flex flex-justify-spacebetween align-items-center">
      <div className="frame-group">
        <div className="message-primary">{t("license:subscribeToUnlock")}</div>
      </div>
      <a
        className="text-decoration-none"
        href={"https://hsiehchengyi.gumroad.com/l/spaciiing-pro/"}
        target="_blank"
      >
        <button className="button button--special">
          {t("license:subscribe")}
        </button>
      </a>
    </div>
  );
};

export default NormalBanner;
