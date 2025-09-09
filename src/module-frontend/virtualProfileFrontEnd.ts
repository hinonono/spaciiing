import {
  SupportedPresetVirtualProfileCategory,
  VirtualProfileGroup,
  VirtualProfileGroupRaw,
} from "../types/VirtualProfile";
import { v4 as uuidv4 } from "uuid";

import { SupportedLangCode } from "../types/Localization";
import { VPPreset } from "../assets/virtual-profile";
import {
  ExternalMessageUpdateVirtualProfile,
} from "../types/Messages/MessageVirtualProfile";
import { Message } from "../types/Messages/Message";
import { AppContextType } from "../AppProvider";
import { MessageSaveSyncedResource } from "../types/Messages/MessageSaveSyncedResource";

function getPreset(
  dataType: SupportedPresetVirtualProfileCategory,
  lang: SupportedLangCode
): VirtualProfileGroupRaw {

  const preset = VPPreset[lang];
  return preset[dataType];
};

export const transformJsonToGroup = (
  dataType: SupportedPresetVirtualProfileCategory,
  langCode: SupportedLangCode
): VirtualProfileGroup => {
  const data = getPreset(dataType, langCode);

  return {
    id: uuidv4(), // Generate a unique ID
    title: data.title,
    isCollapsed: false,
    children: data.children.map((child) => ({
      id: uuidv4(), // Generate a unique ID for each child
      title: child.title,
      content: child.content,
    })),
  };
};

export function initVirtualProfile() {
  const message: Message = {
    module: "VirtualProfile",
    phase: "Init",
    direction: "Inner",
  };

  parent.postMessage(
    {
      pluginMessage: message,
    },
    "*"
  );
}

export function virtualProfileHandler(
  message: ExternalMessageUpdateVirtualProfile,
  appContext: AppContextType
) {
  const { setRuntimeSyncedResources } = appContext;

  if (message.virtualProfileGroups) {
    const { virtualProfileGroups } = message;
    setRuntimeSyncedResources((prev) => ({
      ...prev,
      virtualProfiles: virtualProfileGroups,
    }));
  }
}

export function virtualProfileWillEnd(
  virtualProfileGroups: VirtualProfileGroup[],
  appContext: AppContextType
) {
  const { runtimeSyncedResources, setRuntimeSyncedResources } = appContext;
  setRuntimeSyncedResources((prev) => ({
    ...prev,
    virtualProfiles: virtualProfileGroups,
  }));

  const message: MessageSaveSyncedResource = {
    shouldSaveSyncedReources: true,
    shouldSaveSyncedReourcesType: "virtualProfiles",
    syncedResources: runtimeSyncedResources,
    module: "General",
    phase: "Actual",
    direction: "Inner"
  }

  parent.postMessage({ pluginMessage: message, }, "*");
}
