figma.showUI(__html__, { themeColors: true, /* other options */ })
figma.ui.resize(320, 320);

figma.ui.onmessage = message => {
  figma.closePlugin();
};