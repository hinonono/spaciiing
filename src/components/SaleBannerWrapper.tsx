import React, { useEffect, useState } from "react";
import { LicenseManagement } from "../types/LicenseManagement";
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

  const [shouldShowBanner, setShouldShowBanner] = useState<
    "NONE" | "SALE" | "NORMAL"
  >("NONE");

  useEffect(() => {
    if (licenseManagement.tier !== "PAID") {
      setShouldShowBanner("NORMAL");
    } else {
      // 當用戶的狀態是付費用戶時，直接不顯示Banner
      setShouldShowBanner("NONE");
    }
  }, [licenseManagement]);

  useEffect(() => { }, [isVerifying])

  if (shouldShowBanner === "NONE") {
    return null;
  } else if (shouldShowBanner === "NORMAL") {
    if (isVerifying) {
      return <div className="banner flex flex-justify-center align-items-center"><Spinner /></div>
    } else {
      return <div className="banner flex flex-justify-space-between align-items-center"><NormalBanner /></div>;
    }
  }
};

export default SaleBannerWrapper;
