figma.showUI(__html__, { themeColors: true})
figma.ui.resize(280, 800);

figma.ui.onmessage = message => {
  if(message.type === 'actionApply'){
    // 調整spacing
    var obj = [];
    obj = obj.concat(figma.currentPage.selection);

    if (obj.length < 2) {
      figma.notify("❌ Please select at least two layers.");
    } else {
      if(message.mode == "vertical"){
        // 上下模式
        obj.sort(compareWithY);
  
        for (let i = 0; i < obj.length; i++) {
          if(i == obj.length - 1){
            return;
          } else {
            obj[i+1].y = parseInt(obj[i].y) + parseInt(obj[i].height) + parseInt(message.spacing);
          }
        };
        figma.notify("😇 Set spacing successfully !");
      } else if(message.mode == "horizontal"){
        // 左右模式
        obj.sort(compareWithX);
  
        for (let i = 0; i < obj.length; i++) {
          if(i == obj.length - 1){
            return;
          } else {
            obj[i+1].x = parseInt(obj[i].x) + parseInt(obj[i].width) + parseInt(message.spacing);
          }
        };
        figma.notify("😇 Set spacing successfully !");
      }
    }
  } else if(message.type === 'actionExit'){
    figma.closePlugin();
  }

  function compareWithX(a, b) {
    if ( a.x < b.x ){
      return -1;
    }
    if ( a.x > b.x ){
      return 1;
    }
    return 0;
  }

  function compareWithY(a, b) {
    if ( a.y < b.y ){
      return -1;
    }
    if ( a.y > b.y ){
      return 1;
    }
    return 0;
  }
};