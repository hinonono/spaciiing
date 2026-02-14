import React from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../AppProvider";
import FigmaButton from "./FigmaButton";

interface NormalBannerProps { }

const NormalBanner: React.FC<NormalBannerProps> = () => {
  const { t } = useTranslation(["license", "term"]);
  const { setShowCTSubscribe } = useAppContext();

  return (
    <div className="banner flex flex-justify-space-between align-items-center">
      <div className="frame-group">
        <div className="message-primary">{t("license:upgradeToSkipWaiting")}</div>
      </div>
      <FigmaButton
        title={t("license:upgrade")}
        buttonType={"special"}
        buttonHeight={"small"}
        onClick={() => setShowCTSubscribe(true)}
      />
    </div>
  );
};

export default NormalBanner;
