import React, { createContext, useContext, useState, ReactNode } from "react";
import { VirtualProfile, VirtualProfileGroup } from "./types/VirtualProfile";
import { MagicalObject } from "./types/MagicalObject";
import {
  ExternalVariableCollection,
  ExternalVariableMode,
} from "./types/Message";
import { LicenseManagement } from "./types/LicenseManagement";

// #region Definition
interface AppContextType {
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
  virtualProfile: VirtualProfile;
  setVirtualProfile: React.Dispatch<React.SetStateAction<VirtualProfile>>;
  virtualProfileGroup: VirtualProfileGroup[];
  setVirtualProfileGroup: React.Dispatch<
    React.SetStateAction<VirtualProfileGroup[]>
  >;
  magicalObject: MagicalObject;
  setMagicalObject: React.Dispatch<React.SetStateAction<MagicalObject>>;
  licenseManagement: LicenseManagement;
  setLicenseManagement: React.Dispatch<React.SetStateAction<LicenseManagement>>;
  showCTSubscribe: boolean;
  setShowCTSubscribe: React.Dispatch<React.SetStateAction<boolean>>;
  showActivateModal: boolean;
  setShowActivateModal: React.Dispatch<React.SetStateAction<boolean>>;
  customCodeExecutionResults: string[];
  setCustomCodeExecutionResults: React.Dispatch<React.SetStateAction<string[]>>;
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

const vp: VirtualProfile = {
  name: "",
  nickname: "",
  gender: "",
  birthday: "",
  email: "",
  cardNum: "",
  landlineNum: "",
  phoneNum: "",
  address: "",
  companyName: "",
  companyAddress: "",
  companyPhoneNum: "",
  custom1: "",
  custom2: "",
  custom3: "",
  age: "",
  country: "",
  city: "",
  expirationDate: "",
  cvv: "",
  cardNetwork: "",
  username: "",
  userId: "",
  jobTitle: "",
  industry: "",
};

const mo: MagicalObject = {
  noteId: "",
  designStatusTagId: "",
  titleSectionId: "",
};

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

  //
  const [virtualProfile, setVirtualProfile] = useState<VirtualProfile>(vp);
  const [virtualProfileGroup, setVirtualProfileGroup] = useState<
    VirtualProfileGroup[]
  >([]);

  //
  const [magicalObject, setMagicalObject] = useState<MagicalObject>(mo);
  const [licenseManagement, setLicenseManagement] =
    useState<LicenseManagement>(lm);

  const [customCodeExecutionResults, setCustomCodeExecutionResults] = useState<
    string[]
  >([]);

  // #region JSX elements
  return (
    <AppContext.Provider
      value={{
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
        virtualProfile,
        setVirtualProfile,
        magicalObject,
        setMagicalObject,
        licenseManagement,
        setLicenseManagement,
        showCTSubscribe,
        setShowCTSubscribe,
        showActivateModal,
        setShowActivateModal,
        customCodeExecutionResults,
        setCustomCodeExecutionResults,
        virtualProfileGroup,
        setVirtualProfileGroup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
