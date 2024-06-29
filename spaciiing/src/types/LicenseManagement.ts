// 管理Plugin的授權狀態
export type UserTier = "FREE" | "PAID" | "UNKNOWN";
export interface LicenseManagement {
  tier: UserTier;
  isLicenseActive: boolean;
  licenseKey: string;
  sessionExpiredAt: string;
  recurrence: string;
}
