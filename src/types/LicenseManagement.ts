// 管理Plugin的授權狀態
export type UserTier = "FREE" | "PAID" | "UNKNOWN";
export interface LicenseManagement {
  tier: UserTier;
  isLicenseActive: boolean;
  licenseKey: string;
  sessionExpiredAt: string;
  recurrence: string;
}

export interface LicenseResponseSuccess {
  success: true;
  subscription_ended_at: string | null;
  subscription_cancelled_at: string | null;
  subscription_failed_at: string | null;
  recurrence?: string;
  [key: string]: unknown; // Allow additional properties with unknown type
}

export interface LicenseResponseError {
  success: false;
  message: string;
  [key: string]: unknown; // Allow additional properties with unknown type
}

export type LicenseResponse = LicenseResponseSuccess | LicenseResponseError;
