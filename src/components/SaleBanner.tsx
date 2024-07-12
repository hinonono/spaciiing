import React from "react";
import useCountdown from "../useCountdown";
import { useTranslation } from "react-i18next";

interface SaleBannerProps {}

const SaleBanner: React.FC<SaleBannerProps> = () => {
  const { t } = useTranslation(["license"]);
  
  const targetDate = new Date("2024-08-08T00:00:00+08:00");
  const timeLeft = useCountdown(targetDate);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  return (
    <div className="banner flex flex-jusify-spacebetween align-items-center">
      <div className="frame-group">
        <div className="flex flex-row align-items-center">
          <span className="font-size-small color--secondary">{t("license:flashSale")}</span>
          <span className="font-size-small time-left color--secondary">
            {formatTime(timeLeft.hours + timeLeft.days * 24)}:
            {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </span>
        </div>
        <div className="message-primary">{t("license:additional10percentOff")}</div>
      </div>
      <a className="text-decoration-none" href="https://hsiehchengyi.gumroad.com/l/spaciiing-pro/gpun2vz" target="_blank">
        <button className="button button--special">{t("license:subscribeNow")}</button>
      </a>
    </div>
  );
};

export default SaleBanner;
