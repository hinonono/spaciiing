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
  MessageVirtualProfileWholeObject,
} from "../types/Messages/MessageVirtualProfile";
import { Message } from "../types/Messages/Message";
import { AppContextType } from "../AppProvider";

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
  const { setVirtualProfileGroups } = appContext;

  if (message.virtualProfileGroups) {
    console.log("VirtualProfileHandler GROUPS");
    console.log(message.virtualProfileGroups);
    setVirtualProfileGroups(message.virtualProfileGroups);
  }
}

export function virtualProfileWillEnd(
  virtualProfileGroups: VirtualProfileGroup[],
  appContext: AppContextType
) {
  const { setVirtualProfileGroups } = appContext;
  const message: MessageVirtualProfileWholeObject = {
    module: "VirtualProfile",
    phase: "WillEnd",
    direction: "Inner",
    virtualProfileGroups: virtualProfileGroups,
  };
  setVirtualProfileGroups(virtualProfileGroups);

  parent.postMessage(
    {
      pluginMessage: message,
    },
    "*"
  );
}
