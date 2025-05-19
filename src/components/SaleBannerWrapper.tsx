import React, { useEffect, useState } from "react";
import { LicenseManagement } from "../types/LicenseManagement";
import flashSaleData from "../assets/flashSale.json";
import { SalesConfig, SalesType } from "../types/SalesConfig";
import * as LicenseManagementFrontEnd from "../module-frontend/licenseManagementFrontEnd";
import SaleBanner from "./SaleBanner";
import NormalBanner from "./NormalBanner";
import { useAppContext } from "../AppProvider";
import { Spinner } from ".";


interface SaleBannerWrapperProps {
  licenseManagement: LicenseManagement;
}

const SaleBannerWrapper: React.FC<SaleBannerWrapperProps> = ({
  licenseManagement,
}) => {
  const { isVerifying } = useAppContext();

  const [config, setConfig] = useState<SalesConfig>({
    showCountdown: false,
    targetKey: "",
    startDate: "",
    endDate: "",
    messageKey: "",
    url: "",
    type: "ALL",
  });

  const [shouldShowBanner, setShouldShowBanner] = useState<
    "NONE" | "SALE" | "NORMAL"
  >("NONE");

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

  useEffect(() => {
    if (licenseManagement.tier !== "PAID") {
      setShouldShowBanner(
        LicenseManagementFrontEnd.shouldShowBanner(config, licenseManagement)
      );

      // console.log(config);
      // console.log(licenseManagement);

      // console.log("should" + shouldShowBanner);
    } else {
      // 當用戶的狀態是付費用戶時，直接不顯示Banner
      setShouldShowBanner("NONE");
    }
  }, [config, licenseManagement]);

  if (shouldShowBanner === "NONE") {
    return null;
  } else if (shouldShowBanner === "SALE") {
    return (
      <div className="banner flex flex-justify-space-between align-items-center">
        <SaleBanner
          targetDate={new Date(config.endDate)}
          messageKey={config.messageKey}
          url={config.url}
          showCountdown={config.showCountdown}
        />
      </div>
    );
  } else if (shouldShowBanner === "NORMAL") {
    if (isVerifying) {
      return <div className="banner flex flex-justify-center align-items-center"><Spinner /></div>
    } else {
      return <div className="banner flex flex-justify-space-between align-items-center"><NormalBanner /></div>;
    }
  }
};

export default SaleBannerWrapper;
