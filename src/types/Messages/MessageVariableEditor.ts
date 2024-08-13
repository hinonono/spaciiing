import { Message } from "../Message";

// Variable Editor專用的基底屬性
type VariableEditorIntent = "executeCode" | "getAvailableMode";

export interface MessageVariableEditor extends Message {
  intent: VariableEditorIntent;
}

export interface MessageVariableEditorExecuteCode
  extends MessageVariableEditor {
  variableResolvedDataType: VariableResolvedDataType;
  variableCollectionId: string;
  code: string;
  variableScope: VariableScope[];
  variableMode: string;
  newCollectionName?: string;
}

export interface MessageGetAvailableCollectionMode
  extends MessageVariableEditor {
  id: string;
}
