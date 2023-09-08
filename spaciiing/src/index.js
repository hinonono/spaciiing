var localization;
var defaultLocalization;
const langDropdown = document.getElementById("langDropdown");

initPlugin();

window.onmessage = (event) => {
  if (event.data.pluginMessage) {
    // Handle the received message
    var value = Object.values(event.data.pluginMessage);
    var receivedMessage = Object.values(value[0]);
    // console.log(value2);

    switch (receivedMessage[0]) {
      case "updateMemFrame":
        var width = receivedMessage[1];
        var height = receivedMessage[2];
        uploadMemFrame(width, height);
        break;

      case "initLocalization":
        localization = receivedMessage[1];
        updateLocalization(localization);
        langDropdown.value = receivedMessage[2];
        console.log("lang Value: " + receivedMessage[2]);
        break;
      case "updateLocalization":
        localization = receivedMessage[1];
        updateLocalization(localization);
        break;
      case "updateDefaultLocalization":
        defaultLocalization = receivedMessage[1];
        break;
      default:
        break;
    }
  }
};

// selectMenu.init(); //initiates the select menu component
// disclosure.init(); //initiates the disclosure component

var space = [8, 16, 20, 24, 32];
var multiplyRadioBtns = document.getElementsByName("sp-multiply");
var spacingRadioBtns = document.getElementsByName("sp-space");
var memFrame = document.getElementById("mem-frame");

multiplyRadioBtns.forEach((item) => {
  item.addEventListener("change", function () {
    updateSpaceText(item.value);
  });
});

spacingRadioBtns.forEach((item) => {
  item.addEventListener("change", addDPBlockClass);
});

langDropdown.addEventListener("change", function (event) {
  const selectedValue = event.target.value;
  getLocalization(selectedValue);
});

document.getElementById("sp-apply").onclick = spacingApply;
document.getElementById("nc-al").onclick = function () {
  useNameCleaner("auto-layout");
};
document.getElementById("nc-img").onclick = function () {
  useNameCleaner("image");
};
document.getElementById("nc-label").onclick = function () {
  useNameCleaner("label");
};
document.getElementById("qk-overlay").onclick = function () {
  useQuickAction("overlay");
};
document.getElementById("qk-newframe").onclick = function () {
  useQuickAction("newframe");
};
document.getElementById("qk-setframew").onclick = function () {
  useQuickAction("setframew");
};
document.getElementById("qk-remember").onclick = function () {
  useQuickAction("remember");
};
document.getElementById("gen-typography").onclick = function () {
  useGenerate("typography");
};
document.getElementById("gen-texttostyle").onclick = function () {
  useGenerate("gen-texttostyle");
};
document.getElementById("gen-color-gray-solid").onclick = function () {
  useGenerate("gen-color-gray-solid");
};
document.getElementById("gen-color-gray-opacity").onclick = function () {
  useGenerate("gen-color-gray-opacity");
};
document.getElementById("gen-color-gray-solid-tip").onclick = function () {
  useGenerate("gen-color-gray-solid-tip");
};
document.getElementById("gen-color-gray-opacity-tip").onclick = function () {
  useGenerate("gen-color-gray-opacity-tip");
};
document.getElementById("gen-color-ios-light").onclick = function () {
  useGenerate("gen-color-ios-light");
};
document.getElementById("gen-color-ios-dark").onclick = function () {
  useGenerate("gen-color-ios-dark");
};
document.getElementById("gen-shadow").onclick = function () {
  useGenerate("gen-shadow");
};
document.getElementById("gen-shadow-tip").onclick = function () {
  useGenerate("gen-shadow-tip");
};
document.getElementById("gen-text-visible").onclick = function () {
  useGenerate("gen-text-visible");
};
document.getElementById("eq-apply").onclick = function () {
  useEqual();
};
document.getElementById("lorem-apply").onclick = useLorem;

function initPlugin() {
  fetchCssStyle();
  getDefaultLocalization();
  // getLocalization(langDropdown.value);

  parent.postMessage(
    {
      pluginMessage: {
        type: "init",
      },
    },
    "*"
  );
}

function getDefaultLocalization() {
  console.log("call: ui.html -> getLocalization");
  const mode = "en";

  parent.postMessage(
    {
      pluginMessage: {
        type: "getDefaultLocalization",
        mode,
      },
    },
    "*"
  );
}

function getLocalization(mode) {
  console.log("call: ui.html -> getLocalization");

  parent.postMessage(
    {
      pluginMessage: {
        type: "getLocalization",
        mode,
      },
    },
    "*"
  );
}

function updateLocalization(localization) {
  Object.keys(localization).forEach((key) => {
    // console.log("Finding with key: " + key + "and the result is: " + localization[key]);

    const elem = document.getElementById(key);
    if (elem) {
      if (localization[key] != undefined) {
        elem.textContent = localization[key];
      } else {
        elem.textContent = defaultLocalization[key];
      }
    }
  });
}

function useLorem() {
  const mode = document.querySelector('input[name="lorem-mode"]:checked').value;
  const length = document.querySelector(
    'input[name="lorem-length"]:checked'
  ).value;

  parent.postMessage(
    {
      pluginMessage: {
        type: "lorem",
        mode,
        length,
      },
    },
    "*"
  );
}

function uploadMemFrame(width, height) {
  if (width == "" || height == "") {
    memFrame.innerHTML = "現在的記憶Frame大小：未定義x未定義";
  } else {
    console.log("Frame Updated!");
    memFrame.innerHTML = "現在的記憶Frame大小：" + width + " x " + height;
  }
}

function fetchCssStyle() {
  // URL of the external CSS file
  const cssFileURL =
    "https://cdn.jsdelivr.net/npm/figma-plugin-ds@1.0.1/dist/figma-plugin-ds.css";

  // Fetch the CSS file contents
  fetch(cssFileURL)
    .then((response) => response.text())
    .then((css) => {
      // Inject the CSS contents into the <style> element
      const styleElement = document.getElementById("external-styles");
      styleElement.textContent = css;
    });
}

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;

  return true;
}

function updateSpaceText(value) {
  //依照選取的倍率更新space的文字
  const spacingRadioBtns = document.getElementsByName("sp-space");
  const space_labels = document.querySelectorAll(".sp-c-space");

  for (let i = 0; i < spacingRadioBtns.length; i++) {
    if (space_labels[i].textContent != "Custom") {
      space_labels[i].textContent = space[i] * value;
    } else {
      return;
    }
  }
}

function addDPBlockClass() {
  const spacingArea = document.getElementById("sp-space-custom");
  if (this.checked && this.value === "custom") {
    spacingArea.classList.add("dp-block");
  } else {
    spacingArea.classList.remove("dp-block");
  }
}

function spacingApply() {
  const mode = document.querySelector('input[name="sp-mode"]:checked').value;
  var select_multiply = document.querySelector(
    'input[name="sp-multiply"]:checked'
  ).value;
  var select_space = document.querySelector(
    'input[name="sp-space"]:checked'
  ).value;
  var spacing = "0";

  if (select_space == "custom") {
    //自訂間距
    const customValue = document.getElementById("sp-space-custom").value;
    if (customValue == "") {
      spacing = "8";
    } else {
      spacing = customValue;
    }
  } else {
    spacing = select_space * select_multiply;
  }

  parent.postMessage(
    {
      pluginMessage: {
        type: "actionApply",
        mode,
        spacing,
      },
    },
    "*"
  );
}

function useNameCleaner(name) {
  const mode = name;

  parent.postMessage(
    {
      pluginMessage: {
        type: "nameCleaner",
        mode,
      },
    },
    "*"
  );
}

function useQuickAction(name) {
  const mode = name;

  parent.postMessage(
    {
      pluginMessage: {
        type: "qa",
        mode,
      },
    },
    "*"
  );
}

function useEqual() {
  // const mode = name;
  const mode = document.querySelector('input[name="eq-mode"]:checked').value;
  // var spacing = "0";
  // const customValue = document.getElementById('sp-space-custom').value;

  parent.postMessage(
    {
      pluginMessage: {
        type: "eq",
        mode,
      },
    },
    "*"
  );
}

function useGenerate(name) {
  const mode = name;

  parent.postMessage(
    {
      pluginMessage: {
        type: "gen",
        mode,
      },
    },
    "*"
  );
}
