import { Message } from "../Message";
import { VirtualProfile, VirtualProfileGroup } from "../VirtualProfile";
import { ExternalMessage } from "./ExternalMessage";

// Virtual Profile 專用的基底屬性
export interface MessageVirtualProfile extends Message {}
export interface MessageVirtualProfileSingleValue
  extends MessageVirtualProfile,
    VirtualProfileSingleValue {}

export interface MessageVirtualProfileWholeObject
  extends MessageVirtualProfile {
  virtualProfile?: VirtualProfile;
  virtualProfileGroups?: VirtualProfileGroup[];
}

export interface VirtualProfileSingleValue {
  virtualProfileKey?: string;
  virtualProfileValue: string;
}

export interface ExternalMessageUpdateVirtualProfile extends ExternalMessage {
  virtualProfile?: VirtualProfile;
  virtualProfileGroups?: VirtualProfileGroup[];
}
