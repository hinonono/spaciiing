import { Message } from "../Message";
import { NodeFilterable } from "../NodeFilterable";

// Selection Filter 專用的基底屬性
export interface AdditionalFilterOptions {
  skipLockLayers: boolean;
  skipHiddenLayers: boolean;
  findWithName: boolean;
  findCriteria: string;
}
export interface MessageSelectionFilter extends Message {
  filterScopes: NodeFilterable[];
  additionalFilterOptions: AdditionalFilterOptions;
}
