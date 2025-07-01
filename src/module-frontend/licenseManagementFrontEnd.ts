import {
  LicenseManagement,
  LicenseResponse,
  LicenseResponseError,
  LicenseResponseSuccess,
} from "./../types/LicenseManagement";
import { utils } from "../module/utils";

import * as paymentsUtil from "./paymentsUtil";
import { SalesConfig } from "../types/SalesConfig";
import {
  ExternalMessageLicenseManagement,
  MessageLicenseManagement,
} from "../types/Messages/MessageLicenseManagement";
import { AppContextType } from "../AppProvider";

export const licenseManagementHandler = (
  message: ExternalMessageLicenseManagement,
  setLicenseManagement: React.Dispatch<React.SetStateAction<LicenseManagement>>,
  appContext: AppContextType
) => {
  switch (message.action) {
    case "VERIFY":
      licenseVerifyHandler(message.license, setLicenseManagement, appContext);
      break;
    case "UPDATE":
      break;
    default:
      break;
  }
};

const verifyLicense = async (licenseKey: string): Promise<LicenseResponse> => {
  try {
    const response = await paymentsUtil.verifyLicenseKey(licenseKey);
    return response as LicenseResponse;
  } catch (error) {
    console.error("License validation failed due to unknown error:", error);
    throw new Error("License validation failed");
  }
};

export const handleSubscriptionStatus = (
  response: LicenseResponseSuccess,
  newLicense: LicenseManagement
): LicenseManagement => {
  const {
    subscription_ended_at,
    subscription_cancelled_at,
    subscription_failed_at,
  } = response;

  // Check if all subscription-related dates are null
  if (
    subscription_ended_at === null &&
    subscription_cancelled_at === null &&
    subscription_failed_at === null
  ) {
    // Paid tier process
    newLicense.tier = "PAID";
    newLicense.isLicenseActive = true;
    if (response.purchase.recurrence) {
      newLicense.recurrence = response.purchase.recurrence;
    }
    console.log("License is successfully verified.");
    return newLicense;
  }

  // Check if any of the subscription-related dates have passed or are not null
  if (
    (subscription_ended_at && hasDatePassed(subscription_ended_at)) ||
    (subscription_cancelled_at && hasDatePassed(subscription_cancelled_at)) ||
    (subscription_failed_at && hasDatePassed(subscription_failed_at))
  ) {
    // Free tier process
    newLicense.tier = "FREE";
    newLicense.isLicenseActive = false;
    console.log(
      "License is invalid due to end of subscription, cancelled, or payment failed."
    );
  } else {
    // Paid tier process
    newLicense.tier = "PAID";
    newLicense.isLicenseActive = true;
    if (response.purchase.recurrence) {
      newLicense.recurrence = response.purchase.recurrence;
    }
    console.log("License is successfully verified.");
  }

  return newLicense;
};

export const eraseLicense = (
  setLicenseManagement: React.Dispatch<React.SetStateAction<LicenseManagement>>
) => {
  const resetedLicense: LicenseManagement = {
    tier: "FREE",
    isLicenseActive: false,
    licenseKey: "",
    sessionExpiredAt: "",
    recurrence: "",
  };

  const message: MessageLicenseManagement = {
    license: resetedLicense,
    module: "LicenseManagement",
    phase: "Actual",
    direction: "Inner",
    action: "UPDATE",
  };
  parent.postMessage(
    {
      pluginMessage: message,
    },
    "*"
  );
  setLicenseManagement(resetedLicense);
};

const licenseVerifyHandler = async (
  license: LicenseManagement,
  setLicenseManagement: React.Dispatch<React.SetStateAction<LicenseManagement>>,
  appContext: AppContextType
) => {
  let newLicense = { ...license };
  const expiredAt = utils.data.convertUTCStringToDate(license.sessionExpiredAt);

  // console.log("Is old date:", oldDate);

  appContext.setIsVerifying(true);

  if (expiredAt <= new Date()) {
    const newExpiredTime = utils.data.addHours(new Date(), 3).toUTCString();
    newLicense.sessionExpiredAt = newExpiredTime;

    // 過期
    if (license.tier === "PAID" || license.tier === "UNKNOWN") {
      // 付費
      if (license.licenseKey) {
        try {
          const response: LicenseResponse = await verifyLicense(
            license.licenseKey
          );
          if (response.success) {
            // 修正這裡
            newLicense = handleSubscriptionStatus(
              response as LicenseResponseSuccess,
              newLicense
            );
          } else {
            newLicense.tier = "FREE";
            newLicense.isLicenseActive = false;
            console.log((response as LicenseResponseError).message);
          }
        } catch {
          newLicense.tier = "UNKNOWN";
          newLicense.isLicenseActive = false;
        }
      } else {
        newLicense.tier = "UNKNOWN";
        newLicense.isLicenseActive = false;
        console.error("License validation failed due to empty license key.");
      }
    } else {
      // 免費
      newLicense.tier = "FREE";
      newLicense.isLicenseActive = false;
    }
  }

  appContext.setIsVerifying(false);

  const message: MessageLicenseManagement = {
    license: newLicense,
    module: "LicenseManagement",
    phase: "Actual",
    direction: "Inner",
    action: "UPDATE",
  };
  parent.postMessage({ pluginMessage: message, }, "*");
  setLicenseManagement(newLicense);
};

// Function to check if a date string has passed today's date
export function hasDatePassed(dateString: string) {
  if (!dateString) {
    return false; // If dateString is null or undefined, it has not passed.
  }
  const date = new Date(dateString);
  return date < new Date();
}

/**
 * Determines whether to show a banner based on the given configuration and license management.
 *
 * @param config - The sales configuration containing start date, end date, type, and optional target key.
 * @param licenseManagement - The license management containing the license key.
 * @returns true if the current date is within the specified range and the conditions based on config.type are met, otherwise false.
 */
export function shouldShowBanner(
  config: SalesConfig,
  licenseManagement: LicenseManagement
): "NONE" | "NORMAL" | "SALE" {
  // Return false if the license tier is "PAID"
  if (licenseManagement.tier === "PAID") {
    return "NONE";
  }

  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  const currentTime = new Date();

  // Check if the current date is within the specified date range
  const isWithinDateRange = currentTime >= startDate && currentTime <= endDate;

  if (isWithinDateRange) {
    if (config.type === "ALL") {
      return "SALE";
    } else if (config.type === "SPECIFIC_KEY") {
      // Check if the config type is "SPECIFIC_KEY"
      // Return "SALE" if the license key matches the target key
      // Return "NORMAL" if the license key does not match the target key
      return licenseManagement.licenseKey === config.targetKey
        ? "SALE"
        : "NORMAL";
    }
  }

  // Return false if the date is not within range or conditions are not met
  return "NORMAL";
}
