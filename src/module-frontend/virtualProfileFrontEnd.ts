import {
  SupportedPresetVirtualProfileCategory,
  VirtualProfileGroup,
  VirtualProfileGroupRaw,
} from "../types/VirtualProfile";
import { v4 as uuidv4 } from "uuid";

import { SupportedLangCode } from "../types/Localization";
import {
  enUS_vpdata_book,
  enUS_vpdata_creditCard,
  enUS_vpdata_flight,
  enUS_vpdata_movie,
  enUS_vpdata_personal,
  enUS_vpdata_product,
  enUS_vpdata_stock,
} from "../assets/virtual-profile/en-US";

import {
  jaJP_vpdata_book,
  jaJP_vpdata_creditCard,
  jaJP_vpdata_flight,
  jaJP_vpdata_movie,
  jaJP_vpdata_personal,
  jaJP_vpdata_product,
  jaJP_vpdata_stock,
} from "../assets/virtual-profile/ja-JP";

import {
  zhTW_vpdata_book,
  zhTW_vpdata_creditCard,
  zhTW_vpdata_flight,
  zhTW_vpdata_movie,
  zhTW_vpdata_personal,
  zhTW_vpdata_product,
  zhTW_vpdata_stock,
} from "../assets/virtual-profile/zh-TW";

import {
  zhCN_vpdata_book,
  zhCN_vpdata_creditCard,
  zhCN_vpdata_flight,
  zhCN_vpdata_movie,
  zhCN_vpdata_personal,
  zhCN_vpdata_product,
  zhCN_vpdata_stock,
} from "../assets/virtual-profile/zh-CN";
import {
  ExternalMessageUpdateVirtualProfile,
  MessageVirtualProfileWholeObject,
} from "../types/Messages/MessageVirtualProfile";
import { Message } from "../types/Messages/Message";

const getCorrespondingJson = (
  dataType: SupportedPresetVirtualProfileCategory,
  langCode: SupportedLangCode
): VirtualProfileGroupRaw | undefined => {
  if (langCode === "jaJP") {
    switch (dataType) {
      case "BOOK":
        return jaJP_vpdata_book;
      case "CREDIT_CARD":
        return jaJP_vpdata_creditCard;
      case "FLIGHT":
        return jaJP_vpdata_flight;
      case "MOVIE":
        return jaJP_vpdata_movie;
      case "PERSONAL":
        return jaJP_vpdata_personal;
      case "PRODUCT":
        return jaJP_vpdata_product;
      case "STOCK":
        return jaJP_vpdata_stock;
      default:
        break;
    }
  } else if (langCode === "zhTW") {
    switch (dataType) {
      case "BOOK":
        return zhTW_vpdata_book;
      case "CREDIT_CARD":
        return zhTW_vpdata_creditCard;
      case "FLIGHT":
        return zhTW_vpdata_flight;
      case "MOVIE":
        return zhTW_vpdata_movie;
      case "PERSONAL":
        return zhTW_vpdata_personal;
      case "PRODUCT":
        return zhTW_vpdata_product;
      case "STOCK":
        return zhTW_vpdata_stock;
      default:
        break;
    }
  } else if (langCode === "zhCN") {
    switch (dataType) {
      case "BOOK":
        return zhCN_vpdata_book;
      case "CREDIT_CARD":
        return zhCN_vpdata_creditCard;
      case "FLIGHT":
        return zhCN_vpdata_flight;
      case "MOVIE":
        return zhCN_vpdata_movie;
      case "PERSONAL":
        return zhCN_vpdata_personal;
      case "PRODUCT":
        return zhCN_vpdata_product;
      case "STOCK":
        return zhCN_vpdata_stock;
      default:
        break;
    }
  } else {
    // Default Fallback to enUS
    switch (dataType) {
      case "BOOK":
        return enUS_vpdata_book;
      case "CREDIT_CARD":
        return enUS_vpdata_creditCard;
      case "FLIGHT":
        return enUS_vpdata_flight;
      case "MOVIE":
        return enUS_vpdata_movie;
      case "PERSONAL":
        return enUS_vpdata_personal;
      case "PRODUCT":
        return enUS_vpdata_product;
      case "STOCK":
        return enUS_vpdata_stock;
      default:
        break;
    }
  }
};

export const transformJsonToGroup = (
  dataType: SupportedPresetVirtualProfileCategory,
  langCode: SupportedLangCode
): VirtualProfileGroup | undefined => {
  const data = getCorrespondingJson(dataType, langCode);
  if (!data) {
    return;
  }

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
  setVirtualProfileGroups: React.Dispatch<
    React.SetStateAction<VirtualProfileGroup[]>
  >
) {
  if (message.virtualProfileGroups) {
    console.log("VirtualProfileHandler GROUPS");
    console.log(message.virtualProfileGroups);
    setVirtualProfileGroups(message.virtualProfileGroups);
  }
}

export function virtualProfileWillEnd(
  virtualProfileGroups: VirtualProfileGroup[],
  setVirtualProfileGroups: React.Dispatch<
    React.SetStateAction<VirtualProfileGroup[]>
  >
) {
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
