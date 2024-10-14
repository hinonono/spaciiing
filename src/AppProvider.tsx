import React, { createContext, useContext, useState, ReactNode } from "react";
import { VirtualProfileGroup } from "./types/VirtualProfile";
// import { MagicalObject } from "./types/MagicalObject";
import { LicenseManagement } from "./types/LicenseManagement";
import { StyleListItemFrontEnd } from "./types/General";
import {
  ExternalVariableCollection,
  ExternalVariableMode,
} from "./types/Messages/MessageVariableEditor";
import { EditorPreference } from "./types/EditorPreference";

// #region Definition
interface AppContextType {
  // V20：新的editor preference物件，統一管理相關的偏好值
  editorPreference: EditorPreference;
  setEditorPreference: React.Dispatch<React.SetStateAction<EditorPreference>>;

  // V20：部分舊的屬性即將統一被editor preference物件取代
  lastCustomSpacing: string;
  setLastCustomSpacing: React.Dispatch<React.SetStateAction<string>>;
  memorizedObjectWidth: number | undefined;
  setMemorizedObjectWidth: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  memorizedObjectHeight: number | undefined;
  setMemorizedObjectHeight: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  memorizedObjectName: string;
  setMemorizedObjectName: React.Dispatch<React.SetStateAction<string>>;
  variableCollectionList: ExternalVariableCollection[];
  setVariableCollectionList: React.Dispatch<
    React.SetStateAction<ExternalVariableCollection[]>
  >;
  variableCollectionModes: ExternalVariableMode[];
  setvariableCollectionModes: React.Dispatch<
    React.SetStateAction<ExternalVariableMode[]>
  >;
  virtualProfileGroups: VirtualProfileGroup[];
  setVirtualProfileGroups: React.Dispatch<
    React.SetStateAction<VirtualProfileGroup[]>
  >;
  // magicalObject: MagicalObject;
  // setMagicalObject: React.Dispatch<React.SetStateAction<MagicalObject>>;
  licenseManagement: LicenseManagement;
  setLicenseManagement: React.Dispatch<React.SetStateAction<LicenseManagement>>;
  showCTSubscribe: boolean;
  setShowCTSubscribe: React.Dispatch<React.SetStateAction<boolean>>;
  showActivateModal: boolean;
  setShowActivateModal: React.Dispatch<React.SetStateAction<boolean>>;
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

// const mo: MagicalObject = {
//   noteId: "",
//   designStatusTagId: "",
//   titleSectionId: "",
// };

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

  // V20：Editor Preference整合
  const [editorPreference, setEditorPreference] = useState<EditorPreference>({
    magicObjects: {
      noteId: "",
      tagId: "",
      sectionId: ""
    },
  });

  // 模組用
  const [lastCustomSpacing, setLastCustomSpacing] = useState<string>("");
  const [memorizedObjectWidth, setMemorizedObjectWidth] = useState<number>();
  const [memorizedObjectHeight, setMemorizedObjectHeight] = useState<number>();
  const [memorizedObjectName, setMemorizedObjectName] = useState<string>("");
  const [variableCollectionList, setVariableCollectionList] = useState<
    ExternalVariableCollection[]
  >([]);
  const [variableCollectionModes, setvariableCollectionModes] = useState<
    ExternalVariableMode[]
  >([]);
  const [styleList, setStyleList] = useState<StyleListItemFrontEnd[]>([]);
  const [virtualProfileGroups, setVirtualProfileGroups] = useState<
    VirtualProfileGroup[]
  >([]);

  //
  // const [magicalObject, setMagicalObject] = useState<MagicalObject>(mo);
  const [licenseManagement, setLicenseManagement] =
    useState<LicenseManagement>(lm);

  const [customCodeExecutionResults, setCustomCodeExecutionResults] = useState<
    string[]
  >([]);

  // #region JSX elements
  return (
    <AppContext.Provider
      value={{
        editorPreference,
        setEditorPreference,
        lastCustomSpacing,
        setLastCustomSpacing,
        memorizedObjectWidth,
        setMemorizedObjectWidth,
        memorizedObjectHeight,
        setMemorizedObjectHeight,
        memorizedObjectName,
        setMemorizedObjectName,
        variableCollectionList,
        setVariableCollectionList,
        variableCollectionModes,
        setvariableCollectionModes,
        // magicalObject,
        // setMagicalObject,
        licenseManagement,
        setLicenseManagement,
        showCTSubscribe,
        setShowCTSubscribe,
        showActivateModal,
        setShowActivateModal,
        customCodeExecutionResults,
        setCustomCodeExecutionResults,
        virtualProfileGroups,
        setVirtualProfileGroups,
        styleList,
        setStyleList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
