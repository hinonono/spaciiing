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

  if (licenseManagement.tier === "PAID") {
    return null;
  }

  return (
    isVerifying ? <div className="banner flex flex-justify-center align-items-center"><Spinner /></div> : <div className="banner flex flex-justify-space-between align-items-center"><NormalBanner /></div>
  );
};

export default SaleBannerWrapper;
