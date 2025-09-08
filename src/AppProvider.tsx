import React, { createContext, useContext, useState, ReactNode } from "react";
import { VirtualProfileGroup } from "./types/VirtualProfile";
import { LicenseManagement } from "./types/LicenseManagement";
import { StyleListItemFrontEnd } from "./types/General";
import {
  ExternalVariableCollection,
  ExternalVariableMode,
} from "./types/Messages/MessageVariableEditor";
import { EditorPreference } from "./types/EditorPreference";
import { FreeUserDelayModalConfig } from "./types/FreeUserDelayModalConfig";
import { EditorType } from "./types/EditorType";
import * as pluginConfig from "./pluginConfig.json";
import { ComponentPropertiesFrontEnd, ReferenceObject } from "./types/PropertClipboard";
import { defaultEp } from "./assets/const/editorPreference";
import { defaultRuntimeSyncedResources } from "./assets/const/runtimeSyncedResource";
import { RuntimeSyncedResources } from "./types/RuntimeSyncedResources";

// #region Definition
export interface AppContextType {
  // V20：新的editor preference物件，統一管理相關的偏好值
  editorPreference: EditorPreference;
  setEditorPreference: React.Dispatch<React.SetStateAction<EditorPreference>>;

  // V32: 統一管理前端中需要透過figma，在不同用戶間同步的資料
  runtimeSyncedResources: RuntimeSyncedResources;
  setRuntimeSyncedResources: React.Dispatch<React.SetStateAction<RuntimeSyncedResources>>;

  // 判斷用戶在哪個模式下開啟了plugin
  editorType: EditorType;
  setEditorType: React.Dispatch<React.SetStateAction<EditorType>>;

  // 判斷目前視窗是否為最小化狀態
  isWindowMinimized: boolean;
  setIsWindowMinimized: React.Dispatch<React.SetStateAction<boolean>>;

  triggeredCommand: string;
  setTriggeredCommand: React.Dispatch<React.SetStateAction<string>>;

  variableCollectionList: ExternalVariableCollection[];
  setVariableCollectionList: React.Dispatch<
    React.SetStateAction<ExternalVariableCollection[]>
  >;
  variableCollectionModes: ExternalVariableMode[];
  setvariableCollectionModes: React.Dispatch<
    React.SetStateAction<ExternalVariableMode[]>
  >;

  // Property Clipboard
  referenceObject: ReferenceObject;
  setReferenceObject: React.Dispatch<React.SetStateAction<ReferenceObject>>;
  extractedProperties: ComponentPropertiesFrontEnd[];
  setExtractedProperties: React.Dispatch<React.SetStateAction<ComponentPropertiesFrontEnd[]>>;

  // 其他
  licenseManagement: LicenseManagement;
  setLicenseManagement: React.Dispatch<React.SetStateAction<LicenseManagement>>;
  isVerifying: boolean;
  setIsVerifying: React.Dispatch<React.SetStateAction<boolean>>;

  showCTSubscribe: boolean;
  setShowCTSubscribe: React.Dispatch<React.SetStateAction<boolean>>;
  showActivateModal: boolean;
  setShowActivateModal: React.Dispatch<React.SetStateAction<boolean>>;

  // 呼叫免費用戶需要等待秒數Modal
  freeUserDelayModalConfig: FreeUserDelayModalConfig;
  setFreeUserDelayModalConfig: React.Dispatch<React.SetStateAction<FreeUserDelayModalConfig>>;


  customCodeExecutionResults: string[];
  setCustomCodeExecutionResults: React.Dispatch<React.SetStateAction<string[]>>;
  styleList: StyleListItemFrontEnd[];
  setStyleList: React.Dispatch<React.SetStateAction<StyleListItemFrontEnd[]>>;
}

// Create a context with an initial undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Define the props for the provider component
interface AppProviderProps {
  children: ReactNode;
}

const lm: LicenseManagement = {
  tier: "FREE",
  recurrence: "",
  isLicenseActive: false,
  licenseKey: "",
  sessionExpiredAt: "",
};

// Provider component
export const AppProvider = ({ children }: AppProviderProps) => {
  // #region useState
  // 訂閱呼籲用
  const [showCTSubscribe, setShowCTSubscribe] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [freeUserDelayModalConfig, setFreeUserDelayModalConfig] = useState<FreeUserDelayModalConfig>({ show: false, initialTime: pluginConfig.freeUserWaitingTime, onProceed: () => { } });
  const [isVerifying, setIsVerifying] = useState(true);

  // V20：Editor Preference整合
  const [editorPreference, setEditorPreference] = useState<EditorPreference>(defaultEp);
  // V32: Runtime synced resources
  const [runtimeSyncedResources, setRuntimeSyncedResources] = useState<RuntimeSyncedResources>(defaultRuntimeSyncedResources);


  // 判斷用戶在哪個模式下開啟了plugin
  const [editorType, setEditorType] = useState<EditorType>("figma");
  const [triggeredCommand, setTriggeredCommand] = useState("");

  // 模組用

  const [variableCollectionList, setVariableCollectionList] = useState<
    ExternalVariableCollection[]
  >([]);
  const [variableCollectionModes, setvariableCollectionModes] = useState<
    ExternalVariableMode[]
  >([]);
  const [styleList, setStyleList] = useState<StyleListItemFrontEnd[]>([]);

  const [extractedProperties, setExtractedProperties] = useState<ComponentPropertiesFrontEnd[]>([]);

  const [licenseManagement, setLicenseManagement] =
    useState<LicenseManagement>(lm);

  const [customCodeExecutionResults, setCustomCodeExecutionResults] = useState<
    string[]
  >([]);

  const [referenceObject, setReferenceObject] = useState<ReferenceObject>({
    name: "",
    id: "",
    layerType: ""
  });

  const [isWindowMinimized, setIsWindowMinimized] = useState(false);

  // #region JSX elements
  return (
    <AppContext.Provider
      value={{
        isWindowMinimized,
        setIsWindowMinimized,
        editorPreference,
        setEditorPreference,
        runtimeSyncedResources,
        setRuntimeSyncedResources,
        variableCollectionList,
        setVariableCollectionList,
        variableCollectionModes,
        setvariableCollectionModes,
        licenseManagement,
        setLicenseManagement,
        showCTSubscribe,
        setShowCTSubscribe,
        freeUserDelayModalConfig,
        setFreeUserDelayModalConfig,
        showActivateModal,
        setShowActivateModal,
        customCodeExecutionResults,
        setCustomCodeExecutionResults,
        styleList,
        setStyleList,
        editorType,
        setEditorType,
        triggeredCommand,
        setTriggeredCommand,
        extractedProperties,
        setExtractedProperties,
        referenceObject,
        setReferenceObject,
        isVerifying,
        setIsVerifying,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
