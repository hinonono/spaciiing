import {
  VirtualProfile,
  VirtualProfileChild,
  VirtualProfileGroup,
} from "./../types/VirtualProfile";
import * as util from "./util";
import {
  ExternalMessageUpdateVirtualProfile,
  MessageVirtualProfile,
  MessageVirtualProfileSingleValue,
  MessageVirtualProfileWholeObject,
  VirtualProfileSingleValue,
} from "../types/Messages/MessageVirtualProfile";
import { utils } from "./utils";

export function reception(message: MessageVirtualProfile) {
  if (message.phase == undefined) {
    console.log("沒有設定訊息的phase !");
    return;
  }

  if (message.phase == "Init") {
    // initVirtualProfile();
    initVirtualProfileGroups();
  }

  if (message.phase == "Actual") {
    applyVirtualProfileValueToTextNode(
      message as MessageVirtualProfileSingleValue
    );
  }

  if (message.phase == "WillEnd") {
    virtualProfileWillEnd(message as MessageVirtualProfileWholeObject);
  }
}

// Function to create the vpg structure
function ConvertOldVpToNew(oldVpdata: VirtualProfile) {
  const personalKeys = [
    "nickname",
    "age",
    "gender",
    "birthday",
    "email",
    "landlineNum",
    "phoneNum",
    "country",
    "city",
    "address",
    "userId",
    "jobTitle",
    "industry",
    "companyName",
    "companyAddress",
    "companyPhoneNum",
  ];

  const financialKeys = ["cardNum", "expirationDate", "cvv", "cardNetwork"];
  const customKeys = ["custom1", "custom2", "custom3"];

  const createChildren = (
    keys: (keyof VirtualProfile)[]
  ): VirtualProfileChild[] =>
    keys.map((key) => ({
      id: util.generateUUID(),
      title: key,
      content: oldVpdata[key] || "",
    }));

  return [
    {
      id: util.generateUUID(),
      title: "Personal",
      children: createChildren(personalKeys as (keyof VirtualProfile)[]),
      isCollapsed: false,
    },
    {
      id: util.generateUUID(),
      title: "Personal",
      children: createChildren(financialKeys as (keyof VirtualProfile)[]),
      isCollapsed: false,
    },
    {
      id: util.generateUUID(),
      title: "Other",
      children: createChildren(customKeys as (keyof VirtualProfile)[]),
      isCollapsed: false,
    },
  ];
}

function initVirtualProfileGroups() {
  const pluginDataKey = "virtual-profile-groups";
  const newVpdata = figma.root.getPluginData(pluginDataKey);

  const oldVpData = figma.root.getPluginData("virtual-profile");

  let vpg: VirtualProfileGroup[];

  // console.log("Plugin Data");
  // console.log(data);

  const vp: VirtualProfile = {
    name: "John Doe",
    nickname: "Johnny",
    gender: "Male",
    birthday: "1990/01/01",
    email: "johndoe@example.com",
    cardNum: "1234-5678-9012-3456",
    landlineNum: "555-1234",
    phoneNum: "555-987-6543",
    address: "123 Main St, Anytown, USA",
    companyName: "Doe Industries",
    companyAddress: "456 Industrial Way, Suite 100, Anytown, USA",
    companyPhoneNum: "555-1122",
    custom1: "Custom Field 1",
    custom2: "Custom Field 2",
    custom3: "Custom Field 3",
    age: "20",
    country: "Country",
    city: "City",
    expirationDate: "1990/01/01",
    cvv: "000",
    cardNetwork: "MasterCard",
    username: "@johnniedoe123",
    userId: "0000-1234-5678",
    jobTitle: "Designer",
    industry: "Art & Design",
  };

  if (newVpdata === "") {
    // 未設置過virtual profile
    if (oldVpData === "") {
      vpg = [
        {
          id: util.generateUUID(),
          title: "Category Name",
          children: [
            {
              content: "Value",
              id: util.generateUUID(),
              title: "Title",
            },
          ],
          isCollapsed: false,
        },
      ];
    } else {
      // 針對曾經設置過舊版VP的用戶進行資料轉換
      const oldVp = JSON.parse(oldVpData) as VirtualProfile;
      vpg = ConvertOldVpToNew(oldVp);

      // 轉換完成後清空舊的
      figma.root.setPluginData("virtual-profile", "");
    }

    // Save vp as a JSON string
    figma.root.setPluginData(pluginDataKey, JSON.stringify(vpg));

    const message: ExternalMessageUpdateVirtualProfile = {
      virtualProfile: vp,
      virtualProfileGroups: vpg,
      module: "VirtualProfile",
      direction: "Outer",
      phase: "Init",
    };

    utils.communication.sendMessageBack(message);
  } else {
    // 有設置virtual profile
    const vpg = JSON.parse(newVpdata) as VirtualProfileGroup[];

    const message: ExternalMessageUpdateVirtualProfile = {
      virtualProfileGroups: vpg,
      module: "VirtualProfile",
      direction: "Outer",
      phase: "Init",
    };

    utils.communication.sendMessageBack(message);
  }
}

function virtualProfileWillEnd(message: MessageVirtualProfileWholeObject) {
  console.log("🔴 virtualProfileWillEnd");

  if (message.virtualProfileGroups) {
    // Save vp as a JSON string
    figma.root.setPluginData(
      "virtual-profile-groups",
      JSON.stringify(message.virtualProfileGroups)
    );
    // 清空舊的
    figma.root.setPluginData("virtual-profile", "");
  }
}

async function applyVirtualProfileValueToTextNode(
  message: MessageVirtualProfileSingleValue
) {
  const selection = util.getCurrentSelection();

  if (selection.length === 0) {
    figma.notify("❌ Please select at least one text layer.");
    return;
  }

  const textNodes = selection.filter(
    (node) => node.type === "TEXT"
  ) as TextNode[];

  if (textNodes.length === 0) {
    figma.notify("❌ No text layers selected.");
    return;
  }

  if (message.virtualProfileValue === "") {
    figma.notify("❌ Value cannot be blank.");
    return;
  }

  try {
    for (const textNode of textNodes) {
      await figma.loadFontAsync(textNode.fontName as FontName);
      textNode.characters = message.virtualProfileValue;

      const vp: VirtualProfileSingleValue = {
        virtualProfileKey: message.virtualProfileKey,
        virtualProfileValue: message.virtualProfileValue,
      };

      textNode.setPluginData("virtual-profile-object", JSON.stringify(vp));
    }

    figma.notify(`✅ Text nodes updated successfully.`);
  } catch (error) {
    figma.notify("❌ Failed to load font.");
  }
}
