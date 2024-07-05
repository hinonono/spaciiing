import { LicenseManagement } from "./../types/LicenseManagement";
import {
  ExternalMessageLicenseManagement,
  MessageLicenseManagement,
} from "../types/Message";
import * as util from "../module/util";
import * as paymentsUtil from "./paymentsUtil";

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

const licenseVerifyHandler = async (
  license: LicenseManagement,
  setLicenseManagement: React.Dispatch<React.SetStateAction<LicenseManagement>>
) => {
  const newLicense = license;
  const oldDate = util.convertUTCStringToDate(license.sessionExpiredAt);

  if (oldDate <= new Date()) {
    // 過期

    // 檢查用戶類型
    if (license.tier == "PAID" || license.tier == "UNKNOWN") {
      // 付費

      if (license.licenseKey != "") {
        // 執行API驗證
        try {
          const response = await paymentsUtil.verifyLicenseKey(
            license.licenseKey
          );

          if (response.success == true) {
            // 檢查用戶是否取消訂閱、已結束訂閱、或付款失敗
            if (
              response.subscription_ended_at != null ||
              response.subscription_cancelled_at != null ||
              response.subscription_failed_at != null
            ) {
              newLicense.tier = "FREE";
              newLicense.isLicenseActive = false;
              console.log(
                "License is invalid due to end of subscription, cancelled or payment failed."
              );
            } else {
              newLicense.tier = "PAID";
              newLicense.isLicenseActive = true;
              if (response.recurrence) {
                newLicense.recurrence = response.recurrence;
              }
              console.log("License is successfully verified.");
            }
          } else {
            newLicense.tier = "FREE";
            newLicense.isLicenseActive = false;
            console.log("Invalid license.");
          }
        } catch (error) {
          newLicense.tier = "UNKNOWN";
          newLicense.isLicenseActive = false;
          console.error(
            "License validation failed due to unknown error:" + error
          );
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

    const newExpiredTime = util.addHours(oldDate, 6).toUTCString();
    newLicense.sessionExpiredAt = newExpiredTime;

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
  } else {
    // 沒有過期
    const newLicense = license;
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
  }
};
