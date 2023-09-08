import * as FUND from "./fundamental-module";
import * as VAR from "./variables";
import * as SPACING from "./spacing-module";
import * as GEN from "./generate-module";
import * as LOREM from "./lorem-module";

figma.showUI(__html__, { themeColors: true });
figma.ui.resize(320, 420);

figma.ui.onmessage = (message) => {
  console.log(message);
  var mode = message.mode;

  switch (message.type) {
    case "init":
      pluginInit();
      break;
    case "getLocalization":
      getLocalization(mode);
      break;
    case "getDefaultLocalization":
      getDefaultLocalization(mode);
      break;
    case "actionApply":
      SPACING.useSpacing(message);
      break;
    case "nameCleaner":
      useNameCleaner(mode);
      break;
    case "qa":
      useQuickAction(mode);
      break;
    case "gen":
      useGenerate(mode);
      break;
    case "eq":
      useEqual(mode);
      break;
    case "lorem":
      var length = message.length;
      LOREM.makeLorem(mode, length);
      break;
    default:
      break;
  }
};

function pluginInit() {
  const storedWidth = figma.currentPage.getPluginData("remember-width");
  const storedHeight = figma.currentPage.getPluginData("remember-height");
  var preferredLang = figma.currentPage.getPluginData("preferredLang");

  const message = {
    type: "updateMemFrame",
    storedWidth: storedWidth,
    storedHeight: storedHeight,
  };

  if (preferredLang != undefined) {
    console.log("preferred Lang = " + preferredLang);
    figma.ui.postMessage({
      pluginMessage: {
        type: "initLocalization",
        localization: FUND.getLocalization(preferredLang),
        preferredLang: preferredLang,
      },
    });
  }

  // console.log("Hello from figma!");
  figma.ui.postMessage({
    pluginMessage: message,
  });
}

function getLocalization(mode: string) {
  var localization = FUND.getLocalization(mode);
  var message = {
    type: "updateLocalization",
    localization: localization,
    mode: mode,
  };

  figma.currentPage.setPluginData("preferredLang", mode);

  figma.ui.postMessage({
    pluginMessage: message,
  });
}

function getDefaultLocalization(mode: string) {
  var localization = FUND.getLocalization(mode);
  var message = {
    type: "updateDefaultLocalization",
    localization: localization,
    mode: mode,
  };

  figma.ui.postMessage({
    pluginMessage: message,
  });
}

function useEqual(mode: string) {
  // 獲得所有frame內元素
  if (figma.currentPage.selection == null) {
    return;
  }
  const parent = figma.currentPage.selection[0] as FrameNode;
  var selection = FUND.makeSelectionWhenFrame();

  if (selection != null) {
    // 將元素群組化
    var group = figma.group(selection, parent);

    if (mode == "ud") {
      var spacing = group.y;
      parent.resize(parent.width, group.height + spacing * 2);
    } else if (mode == "lr") {
      var spacing = group.x;
      parent.resize(group.width + spacing * 2, parent.height);
    } else if (mode == "all") {
      var spacingX = group.x;
      var spacingY = group.y;
      parent.resize(group.width + spacingX * 2, group.height + spacingY * 2);
    }

    // 解散群組
    figma.ungroup(group);
  }
}

function useNameCleaner(mode: string) {
  const selection = FUND.makeSelectionWhenFrame();

  if (mode == "auto-layout") {
    const newArray = [];
    if (selection != null) {
      for (const node of selection) {
        if (node.type === "FRAME") {
          if (
            node.layoutMode == "HORIZONTAL" ||
            node.layoutMode == "VERTICAL"
          ) {
            if (
              node.parent?.type != "COMPONENT" &&
              node.parent?.type != "COMPONENT_SET"
            ) {
              newArray.push(node);
            }
          }
        }
      }

      newArray.forEach((item) => {
        if (item.layoutMode == "HORIZONTAL") {
          item.name = "H Auto Layout";
        } else {
          item.name = "V Auto Layout";
        }
      });
    }

    console.log(newArray);
  } else if (mode == "image") {
    const newArray = [];
    if (selection != null) {
      for (const node of selection) {
        if (node.type === "RECTANGLE") {
          if (
            node.parent?.type != "COMPONENT" &&
            node.parent?.type != "COMPONENT_SET"
          ) {
            newArray.push(node);
          }
        }
      }

      newArray.forEach((item) => {
        if (Array.isArray(item.fills) && item.fills[0].type === "IMAGE") {
          item.name = "Image";
        }
      });
    }
  } else if (mode == "label") {
    const selectedFrame = figma.currentPage.selection[0] as FrameNode;
    const newArray = selectedFrame.findAllWithCriteria({ types: ["TEXT"] });

    newArray.forEach((item) => {
      item.name = "Label";
    });
  } else {
    return;
  }
}

function useQuickAction(mode: string) {
  switch (mode) {
    case "overlay":
      makeOverlay();
      break;
    case "newframe":
      makeNewFrame();
    case "setframew":
      setFrameW();
    case "remember":
      rememberSize();
    default:
      break;
  }
}

function setFrameW() {
  if (figma.currentPage.selection == null) {
    return;
  }

  if (figma.currentPage.selection[0] == null) {
    return;
  }

  const selectedFrame = figma.currentPage.selection[0] as FrameNode;
  const storedWidth = figma.currentPage.getPluginData("remember-width");
  console.log(storedWidth);

  if (storedWidth == undefined) {
    figma.notify("尚未設定記憶寬度");
  } else {
    selectedFrame.resize(Number(storedWidth), selectedFrame.height);
  }
}

function useGenerate(mode: string) {
  switch (mode) {
    case "typography":
      GEN.genTypography();
      break;
    case "gen-texttostyle":
      GEN.genTextToStyle();
      break;
    case "gen-color-gray-solid":
      GEN.genColorStyle(VAR.myGrayColorSolid);
      break;
    case "gen-color-gray-solid-tip":
      GEN.genTooltip(VAR.myGrayColorSolid);
      break;
    case "gen-color-gray-opacity":
      GEN.genColorStyle(VAR.myGrayColorOpacity);
      break;
    case "gen-color-gray-opacity-tip":
      GEN.genTooltip(VAR.myGrayColorOpacity);
      break;
    case "gen-color-ios-light":
      GEN.genColorStyle(VAR.myIosColorLight);
      break;
    case "gen-color-ios-dark":
      GEN.genColorStyle(VAR.myIosColorDark);
      break;
    case "gen-shadow":
      GEN.genDropShadowStyle(VAR.myEffectDropShadow);
      break;
    case "gen-shadow-tip":
      GEN.genTooltip(VAR.myEffectDropShadow);
      break;
    case "gen-text-visible":
      GEN.genTextVisible();
      break;
    default:
      figma.notify("無法對應Use Generation中的任何一種指令");
      break;
  }
}

function rememberSize() {
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === "FRAME") {
    const selectedFrame = figma.currentPage.selection[0] as FrameNode;
    figma.currentPage.setPluginData(
      "remember-width",
      String(selectedFrame.width)
    );
    figma.currentPage.setPluginData(
      "remember-height",
      String(selectedFrame.height)
    );
    figma.notify("成功記憶Frame大小！");
  } else {
    figma.notify("需要選取一個Frame!");
  }

  const storedWidth = figma.currentPage.getPluginData("remember-width");
  const storedHeight = figma.currentPage.getPluginData("remember-height");

  const message = {
    type: "updateMemFrame",
    storedWidth: storedWidth,
    storedHeight: storedHeight,
  };

  FUND.sendMessageBack(message);
}

function makeNewFrame() {
  const storedWidth = figma.currentPage.getPluginData("remember-width");
  const storedHeight = figma.currentPage.getPluginData("remember-height");
  const viewport = FUND.getUserCurrentViewVectior();

  // Create a new frame
  const newFrame = figma.createFrame();
  newFrame.x = viewport.x;
  newFrame.y = viewport.y;
  console.log(storedWidth, storedHeight);

  if (storedWidth == undefined && storedHeight == undefined) {
    newFrame.resize(375, 812);
  } else {
    newFrame.resize(Number(storedWidth), Number(storedHeight));
  }

  // Set any other properties or styles of the frame as needed

  // Add the new frame to the current page
  figma.currentPage.appendChild(newFrame);
}

function makeOverlay() {
  const storedWidth = figma.currentPage.getPluginData("remember-width");
  const storedHeight = figma.currentPage.getPluginData("remember-height");

  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === "FRAME") {
    const selectedFrame = selection[0];
    const rectangle = figma.createRectangle();

    if (storedWidth != undefined && storedHeight != undefined) {
      rectangle.resize(Number(storedWidth), Number(storedHeight));
    } else {
      rectangle.resize(375, 812);
    }

    rectangle.x = 0;
    rectangle.y = 0;
    rectangle.fills = [
      { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.5 },
    ];
    rectangle.name = "Overlay";
    rectangle.locked = true;

    selectedFrame.appendChild(rectangle);
  } else {
    // No frame selected or multiple items selected
    console.log("Please select a single frame.");
  }
}
