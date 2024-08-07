import {
  LicenseManagement,
  LicenseResponse,
  LicenseResponseError,
  LicenseResponseSuccess,
} from "./../types/LicenseManagement";
import {
  ExternalMessageLicenseManagement,
  MessageLicenseManagement,
} from "../types/Message";
import * as util from "../module/util";
import * as paymentsUtil from "./paymentsUtil";
import { SalesConfig } from "../types/SalesConfig";

export const licenseManagementHandler = (
  message: ExternalMessageLicenseManagement,
  setLicenseManagement: React.Dispatch<React.SetStateAction<LicenseManagement>>
) => {
  switch (message.action) {
    case "VERIFY":
      licenseVerifyHandler(message.license, setLicenseManagement);
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
    if (response.recurrence) {
      newLicense.recurrence = response.recurrence;
    }
    console.log("License is successfully verified.");
    return newLicense;
  }

  // Check if any of the subscription-related dates have passed or are not null
  if (
    (subscription_ended_at && hasDatePassed(subscription_ended_at)) ||
    (subscription_cancelled_at && hasDatePassed(subscription_cancelled_at)) ||
    subscription_failed_at !== null
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
    if (response.recurrence) {
      newLicense.recurrence = response.recurrence;
    }
    console.log("License is successfully verified.");
  }

  return newLicense;
};

const licenseVerifyHandler = async (
  license: LicenseManagement,
  setLicenseManagement: React.Dispatch<React.SetStateAction<LicenseManagement>>
) => {
  let newLicense = { ...license };
  const oldDate = util.convertUTCStringToDate(license.sessionExpiredAt);

  // console.log("Is old date:", oldDate);

  if (oldDate <= new Date()) {
    const newExpiredTime = util.addHours(new Date(), 3).toUTCString();
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

  const message: MessageLicenseManagement = {
    license: newLicense,
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
): boolean {
  // Return false if the license tier is "PAID"
  if (licenseManagement.tier === "PAID") {
    return false;
  }

  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  const currentTime = new Date();

  // Check if the current date is within the specified date range
  const isWithinDateRange = currentTime >= startDate && currentTime <= endDate;

  if (isWithinDateRange) {
    if (config.type === "ALL") {
      return true; // Always return true for "ALL" type
    } else if (config.type === "SPECIFIC_KEY") {
      // Check if the config type is "SPECIFIC_KEY"
      // Return true if the license key matches the target key
      return licenseManagement.licenseKey === config.targetKey;
    }
  }

  // Return false if the date is not within range or conditions are not met
  return false;
}
