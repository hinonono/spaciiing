import React, { useEffect, useState } from "react";
import SaleBanner from "./SaleBanner";
import { LicenseManagement } from "../types/LicenseManagement";
import flashSaleData from "../assets/flashSale.json";
import { SalesConfig, SalesType } from "../types/SalesConfig";
import * as LicenseManagementFrontEnd from "../module-frontend/licenseManagementFrontEnd";

interface SaleBannerWrapperProps {
  licenseManagement: LicenseManagement;
}

const SaleBannerWrapper: React.FC<SaleBannerWrapperProps> = ({
  licenseManagement,
}) => {
  const [config, setConfig] = useState<SalesConfig>({
    showCountdown: false,
    targetKey: "",
    startDate: "",
    endDate: "",
    messageKey: "",
    url: "",
    type: "ALL",
  });

  useEffect(() => {
    // Assuming configData is a valid JSON object as defined in the config.json file
    setConfig({
      targetKey: flashSaleData.targetKey,
      startDate: flashSaleData.startDate,
      endDate: flashSaleData.endDate,
      messageKey: flashSaleData.messageKey,
      url: flashSaleData.url,
      type: flashSaleData.type as SalesType,
      showCountdown: flashSaleData.showCountdown,
    });
  }, []);

  const shouldShowBanner = LicenseManagementFrontEnd.shouldShowBanner(
    config,
    licenseManagement
  );

  console.log("License Management", licenseManagement.licenseKey);

  return shouldShowBanner ? (
    <SaleBanner
      targetDate={new Date(config.endDate)}
      messageKey={config.messageKey}
      url={config.url}
      showCountdown={config.showCountdown}
    />
  ) : null;
};

export default SaleBannerWrapper;
