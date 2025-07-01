import { LicenseManagement } from "../types/LicenseManagement";
import { ExternalMessageLicenseManagement, MessageLicenseManagement } from "../types/Messages/MessageLicenseManagement";
import { utils } from "./utils";

export async function initLicenseCheck() {
  // 檢查用戶的Client Storage是否有儲存license key
  const rawLicenseData = await figma.clientStorage.getAsync(utils.dataKeys.LICENSE_MANAGEMENT);
  let decoded: LicenseManagement | undefined = undefined;

  if (rawLicenseData) {
    try {
      // 有License Data
      decoded = JSON.parse(rawLicenseData) as LicenseManagement;
      const message: ExternalMessageLicenseManagement = {
        action: "VERIFY",
        license: decoded,
        module: "LicenseManagement",
        phase: "Init",
        direction: "Outer",
      };
      utils.communication.sendMessageBack(message);
    } catch (error) {
      throw new Error("Error parsing License.")
    }
  } else {
    // 沒有License Data
    const expiredTime = utils.data.addHours(new Date(), 3).toUTCString();
    const license: LicenseManagement = {
      tier: "FREE",
      recurrence: "",
      isLicenseActive: false,
      licenseKey: "",
      sessionExpiredAt: expiredTime,
    };
    await figma.clientStorage.setAsync(utils.dataKeys.LICENSE_MANAGEMENT, JSON.stringify(license));

    const message: ExternalMessageLicenseManagement = {
      action: "VERIFY",
      license: license,
      module: "LicenseManagement",
      phase: "Init",
      direction: "Outer",
    };
    utils.communication.sendMessageBack(message);
  }
}

export async function reception(message: MessageLicenseManagement) {
  if (message.action == "UPDATE") {
    setLicenseToLocalStorage(message.license);
  }
}

async function setLicenseToLocalStorage(license: LicenseManagement) {
  await figma.clientStorage.setAsync(utils.dataKeys.LICENSE_MANAGEMENT, JSON.stringify(license));
}