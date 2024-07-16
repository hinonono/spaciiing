import {
  ExternalMessageUpdateVirtualProfile,
  MessageVirtualProfile,
  MessageVirtualProfileSingleValue,
  MessageVirtualProfileWholeObject,
  VirtualProfileSingleValue,
} from "../types/Message";
import { VirtualProfile, VirtualProfileGroup } from "../types/VirtualProfile";
import * as util from "./util";

export function reception(message: MessageVirtualProfile) {
  if (message.phase == undefined) {
    console.log("沒有設定訊息的phase !");
    return;
  }

  if (message.phase == "Init") {
    initVirtualProfile();
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

function initVirtualProfile() {
  const pluginDataKey = "virtual-profile";
  const data = figma.root.getPluginData(pluginDataKey);
  console.log("Plugin Data");
  console.log(data);

  if (data === "") {
    // 未設置過virtual profile
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

    // Save vp as a JSON string
    figma.root.setPluginData(pluginDataKey, JSON.stringify(vp));

    const message: ExternalMessageUpdateVirtualProfile = {
      virtualProfile: vp,
      module: "VirtualProfile",
      direction: "Outer",
      phase: "Init",
    };

    util.sendMessageBack(message);
  } else {
    // 有設置virtual profile
    const vp = JSON.parse(data) as VirtualProfile;

    const message: ExternalMessageUpdateVirtualProfile = {
      virtualProfile: vp,
      module: "VirtualProfile",
      direction: "Outer",
      phase: "Init",
    };

    util.sendMessageBack(message);
  }
}

function initVirtualProfileGroups() {
  const pluginDataKey = "virtual-profile-groups";
  const data = figma.root.getPluginData(pluginDataKey);
  console.log("Plugin Data");
  console.log(data);

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

  if (data === "") {
    // 未設置過virtual profile
    const vpg: VirtualProfileGroup[] = [
      {
        id: "e26c63a2-1657-4f88-8d6d-bd0e36b6f179",
        title: "Title 1",
        children: [
          {
            id: "5c3a8d98-8cd1-4a89-bf4d-69b3d6c28c9e",
            content: "Content 1-1",
            title: "content title",
          },
        ],
        isCollapsed: false,
      },
      {
        id: "d1a3c6f4-23b8-44b9-9f17-61e5d9257e18",
        title: "Title 2",
        children: [
          {
            id: "e16e81c2-d929-4687-9a7e-74d260214f1b",
            content: "Content 2-1",
            title: "content title",
          },
        ],
        isCollapsed: false,
      },
    ];

    // Save vp as a JSON string
    figma.root.setPluginData(pluginDataKey, JSON.stringify(vpg));

    const message: ExternalMessageUpdateVirtualProfile = {
      virtualProfile: vp,
      virtualProfileGroups: vpg,
      module: "VirtualProfile",
      direction: "Outer",
      phase: "Init",
    };

    util.sendMessageBack(message);
  } else {
    // 有設置virtual profile
    const vpg = JSON.parse(data) as VirtualProfileGroup[];

    const message: ExternalMessageUpdateVirtualProfile = {
      virtualProfile: vp,
      virtualProfileGroups: vpg,
      module: "VirtualProfile",
      direction: "Outer",
      phase: "Init",
    };

    util.sendMessageBack(message);
  }
}

function virtualProfileWillEnd(message: MessageVirtualProfileWholeObject) {
  const pluginDataKey = "virtual-profile";
  const vp = message.virtualProfile;

  console.log("🔴 virtualProfileWillEnd");
  console.log(vp);

  // Save vp as a JSON string
  figma.root.setPluginData(pluginDataKey, JSON.stringify(vp));

  if (message.virtualProfileGroups) {
    console.log("🔴");
    console.log(message.virtualProfileGroups);

    // Save vp as a JSON string
    figma.root.setPluginData(
      "virtual-profile-groups",
      JSON.stringify(message.virtualProfileGroups)
    );
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
