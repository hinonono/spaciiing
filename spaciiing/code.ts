figma.showUI(__html__, { themeColors: true})
figma.ui.resize(320, 320);

figma.ui.onmessage = message => {
  
  if(message.type === 'actionApply'){
    // 調整spacing
    figma.closePlugin('😀 Applied spacing successfully !');

  } else if(message.type === 'actionExit'){

    figma.closePlugin();
  }

  
};