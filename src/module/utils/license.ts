import { utils } from ".";
import { LicenseManagement, UserTier } from "../../types/LicenseManagement";

export async function getUserTier(): Promise<UserTier> {
    // 檢查用戶的Client Storage是否有儲存license key
    const rawLicenseData = await figma.clientStorage.getAsync(utils.dataKeys.LICENSE_MANAGEMENT);
    let decoded: LicenseManagement | undefined = undefined;

    if (rawLicenseData) {
        try {
            // 有License Data
            decoded = JSON.parse(rawLicenseData) as LicenseManagement;
            return decoded.tier;
        } catch (error) {
            throw new Error("Error parsing License.")
        }
    } else {
        return "FREE";
    }
}