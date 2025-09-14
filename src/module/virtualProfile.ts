import {
  VirtualProfileGroup,
} from "./../types/VirtualProfile";

import {
  ExternalMessageUpdateVirtualProfile,
  MessageVirtualProfile,
  MessageVirtualProfileSingleValue,
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
  }
}


function initVirtualProfileGroups() {
  const newVpdata = figma.root.getPluginData(utils.dataKeys.VIRTUAL_PROFILE_GROUPS);
  let vpg: VirtualProfileGroup[] = [];


  if (newVpdata === "") {
    // Save vp as a JSON string
    figma.root.setPluginData(utils.dataKeys.VIRTUAL_PROFILE_GROUPS, JSON.stringify(vpg));

    const message: ExternalMessageUpdateVirtualProfile = {
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

async function applyVirtualProfileValueToTextNode(
  message: MessageVirtualProfileSingleValue
) {
  const selection = utils.editor.getCurrentSelection();

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

      textNode.setPluginData(utils.dataKeys.VIRTUAL_PROFILE_OBJECT, JSON.stringify(vp));
    }

    figma.notify(`✅ Text nodes updated successfully.`);
  } catch (error) {
    figma.notify("❌ Failed to load font.");
  }
}
