import { LicenseManagement } from "../LicenseManagement";
import {  Message } from "../Message";
import { ExternalMessage } from "./ExternalMessage";

export type LicenseManagementAction = "UPDATE" | "VERIFY";

// License Management 專用的基底屬性
export interface MessageLicenseManagement extends Message {
  license: LicenseManagement;
  action: LicenseManagementAction;
}

export interface ExternalMessageLicenseManagement extends ExternalMessage {
  action: LicenseManagementAction;
  license: LicenseManagement;
}
