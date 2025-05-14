import { LicenseManagement } from "../types/LicenseManagement";
import { ExternalMessageLicenseManagement, MessageLicenseManagement } from "../types/Messages/MessageLicenseManagement";
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
