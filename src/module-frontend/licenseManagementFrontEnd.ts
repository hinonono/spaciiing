import { LicenseManagement } from "./../types/LicenseManagement";
import {
  ExternalMessageLicenseManagement,
  MessageLicenseManagement,
} from "../types/Message";
import * as util from "../module/util";
import * as paymentsUtil from "./paymentsUtil";

interface LicenseResponseSuccess {
  success: true;
  subscription_ended_at: string | null;
  subscription_cancelled_at: string | null;
  subscription_failed_at: string | null;
  recurrence?: string;
  [key: string]: unknown; // Allow additional properties with unknown type
}

interface LicenseResponseError {
  success: false;
  message: string;
  [key: string]: unknown; // Allow additional properties with unknown type
}

type LicenseResponse = LicenseResponseSuccess | LicenseResponseError;

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

const handleSubscriptionStatus = (
  response: LicenseResponseSuccess,
  newLicense: LicenseManagement
): void => {
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
    return;
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
};

const licenseVerifyHandler = async (
  license: LicenseManagement,
  setLicenseManagement: React.Dispatch<React.SetStateAction<LicenseManagement>>
) => {
  const newLicense = { ...license };
  const oldDate = util.convertUTCStringToDate(license.sessionExpiredAt);

  console.log("Is old date:", oldDate <= new Date());

  if (oldDate <= new Date()) {
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
            handleSubscriptionStatus(
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

    const newExpiredTime = util.addHours(oldDate, 3).toUTCString();
    newLicense.sessionExpiredAt = newExpiredTime;
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
function hasDatePassed(dateString: string) {
  if (!dateString) {
    return false; // If dateString is null or undefined, it has not passed.
  }
  const date = new Date(dateString);
  return date < new Date();
}
