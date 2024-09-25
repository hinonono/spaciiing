import React from "react";
import useCountdown from "../useCountdown";
import { useTranslation } from "react-i18next";

interface SaleBannerProps {
  targetDate: Date;
  messageKey: string;
  url: string;
  showCountdown: boolean;
}

const SaleBanner: React.FC<SaleBannerProps> = ({
  targetDate,
  messageKey,
  url,
  showCountdown,
}) => {
  const { t } = useTranslation(["license"]);

  const timeLeft = useCountdown(targetDate);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  const timeLeftString = `${formatTime(
    timeLeft.hours + timeLeft.days * 24
  )}:${formatTime(timeLeft.minutes)}:${formatTime(timeLeft.seconds)}`;

  const bannerMessage = t(`license:${messageKey}`);

  return (
    <div className="banner flex flex-justify-spacebetween align-items-center">
      <div className="frame-group">
        {showCountdown ? (
          <div className="flex flex-row align-items-center">
            <span className="font-size-small message-secondary">
              {t("license:endIn")} {timeLeftString}
            </span>
          </div>
        ) : (
          <div className="flex flex-row align-items-center">
            <span className="font-size-small message-secondary">
              {t("license:limitedOffer")}
            </span>
          </div>
        )}
        <div className="message-primary">{bannerMessage}</div>
        <div className="note message-secondary mt-xxxsmall">
          {t("license:validForFirstBillingCycle")}
        </div>
      </div>
      <a className="text-decoration-none" href={url} target="_blank">
        <button className="button button--special">
          <s>$4.99</s>
          <span className="ml-xxxsmall"> $2.49 / mo.</span>
        </button>
      </a>
    </div>
  );
};

export default SaleBanner;
