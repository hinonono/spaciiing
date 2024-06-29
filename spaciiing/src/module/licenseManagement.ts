import { LicenseManagement } from "../types/LicenseManagement";
import {
  ExternalMessageLicenseManagement,
  MessageLicenseManagement,
} from "../types/Message";
import * as util from "./util";

export async function initLicenseCheck() {
  // 檢查用戶的Client Storage是否有儲存license key
  const STORAGE_KEY = "license-management";
  const licenseData = await figma.clientStorage.getAsync(STORAGE_KEY);

  if (licenseData) {
    // 有License Data
    const license = JSON.parse(licenseData) as LicenseManagement;
    const message: ExternalMessageLicenseManagement = {
      action: "VERIFY",
      license: license,
      module: "LicenseManagement",
      phase: "Init",
      direction: "Outer",
    };
    util.sendMessageBack(message);
  } else {
    // 沒有License Data
    const expiredTime = util.addHours(new Date(), 3).toUTCString();
    const license: LicenseManagement = {
      tier: "FREE",
      recurrence: "",
      isLicenseActive: false,
      licenseKey: "",
      sessionExpiredAt: expiredTime,
    };
    await figma.clientStorage.setAsync(STORAGE_KEY, JSON.stringify(license));
  }

  // if (licenseData) {
  //   // 有License Data
  //   const license = JSON.parse(licenseData) as LicenseManagement;
  //   console.log("✅有License Data");
  //   console.log(license);

  //   //
  //   // 臨時的License Data，待會要存進去
  //   const newLicense = license;

  //   //
  //   // 檢查License 是否過期
  //   const oldDate = util.convertUTCStringToDate(license.sessionExpiredAt);

  //   if (oldDate <= new Date()) {
  //     //
  //     // 檢查會員等級
  //     if (license.tier == "PAID") {
  //       if (license.licenseKey != "") {
  //         // 執行API驗證
  //         //   try {
  //         //     const response = await paymentsUtil.verifyLicenseKey(
  //         //       license.licenseKey
  //         //     );
  //         //     if (response.success) {
  //         //       license.tier = "PAID";
  //         //       console.log("License is successfully verified.");
  //         //     }
  //         //   } catch (error) {
  //         //     license.tier = "UNKNOWN";
  //         //     console.error(
  //         //       "License validation failed due to unknown error:" + error
  //         //     );
  //         //   }

  //       } else {
  //         license.tier = "UNKNOWN";
  //         console.error("License validation failed due to empty license key.");
  //       }
  //     }
  //   }

  //   const newExpiredTime = util.addHours(oldDate, 6).toUTCString();
  //   newLicense.sessionExpiredAt = newExpiredTime;
  //   //
  //   // 儲存
  //   const message: ExternalMessageLicenseManagement = {
  //     action: "UPDATE",
  //     license: newLicense,
  //     module: "LicenseManagement",
  //     phase: "Init",
  //     direction: "Outer",
  //   };

  //   await figma.clientStorage.setAsync(STORAGE_KEY, JSON.stringify(newLicense));
  //   util.sendMessageBack(message);

  //   console.log("✅更新後的License Data");
  //   console.log(newLicense);
  // } else {
  //   console.log("❌沒有License Data");

  //   const expiredTime = util.addHours(new Date(), 3).toUTCString();
  //   const license: LicenseManagement = {
  //     tier: "FREE",
  //     isLicenseActive: false,
  //     licenseKey: "",
  //     sessionExpiredAt: expiredTime,
  //   };
  //   const message: ExternalMessageLicenseManagement = {
  //     action: "UPDATE",
  //     license: license,
  //     module: "LicenseManagement",
  //     phase: "Init",
  //     direction: "Outer",
  //   };

  //   await figma.clientStorage.setAsync(STORAGE_KEY, JSON.stringify(license));
  //   util.sendMessageBack(message);
  // }
}

export async function reception(message: MessageLicenseManagement) {
  if (message.action == "UPDATE") {
    setLicenseToLocalStorage(message.license);
  }
}

async function setLicenseToLocalStorage(license: LicenseManagement) {
  const STORAGE_KEY = "license-management";
  await figma.clientStorage.setAsync(STORAGE_KEY, JSON.stringify(license));
}
