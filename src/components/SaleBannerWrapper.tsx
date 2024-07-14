import React, { useEffect, useState } from "react";
import SaleBanner from "./SaleBanner";
import { LicenseManagement } from "../types/LicenseManagement";
import flashSaleData from "../assets/flashSale.json";

interface SaleBannerWrapperProps {
  licenseManagement: LicenseManagement;
}

const SaleBannerWrapper: React.FC<SaleBannerWrapperProps> = ({
  licenseManagement,
}) => {
  const [config, setConfig] = useState({
    targetKey: "",
    startDate: "",
    endDate: "",
    messageKey: "",
    url: "",
  });

  useEffect(() => {
    // Assuming configData is a valid JSON object as defined in the config.json file
    setConfig({
      targetKey: flashSaleData.targetKey,
      startDate: flashSaleData.startDate,
      endDate: flashSaleData.endDate,
      messageKey: flashSaleData.messageKey,
      url: flashSaleData.url,
    });
  }, []);

  const targetKey = config.targetKey;
  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  const currentTime = new Date();

  const shouldShowBanner =
    licenseManagement.licenseKey === targetKey &&
    currentTime >= startDate &&
    currentTime <= endDate;

  return shouldShowBanner ? (
    <SaleBanner
      targetDate={endDate}
      messageKey={config.messageKey}
      url={config.url}
    />
  ) : null;
  // return (
  //   <SaleBanner
  //     targetDate={endDate}
  //     messageKey={config.messageKey}
  //     url={config.url}
  //   />
  // );
};

export default SaleBannerWrapper;
