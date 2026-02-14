// 管理Plugin的授權狀態
export type UserTier = "FREE" | "PAID" | "UNKNOWN";
export type ChargeType = "MONTHLY" | "YEARLY";
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
  purchase: {
    recurrence: string;
    [key: string]: unknown; // Allow additional properties with unknown type within purchase
  };
}

export interface LicenseResponseError {
  success: false;
  message: string;
  [key: string]: unknown; // Allow additional properties with unknown type
}

export type LicenseResponse = LicenseResponseSuccess | LicenseResponseError;
