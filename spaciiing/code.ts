figma.showUI(__html__);
figma.ui.onmessage = message => {
  figma.closePlugin();
};