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
      case "setDefaultLocalization":
        defaultLocalization = receivedMessage[1];
        break;
      case "initCustomSpacing":
        var value = receivedMessage[1];
        updateCustomSpacing(value);
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

function updateCustomSpacing(value) {
  // 當用戶之前已有自定義間距時，載入自定義間距
  document.getElementById("sp-space-custom").value = value;
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
  var useCustomValue;

  if (select_space == "custom") {
    //自訂間距
    const customValue = document.getElementById("sp-space-custom").value;
    if (customValue == "") {
      spacing = "0";
    } else {
      spacing = customValue;
      useCustomValue = "true";
    }
  } else {
    spacing = select_space * select_multiply;
    useCustomValue = "false";
  }

  parent.postMessage(
    {
      pluginMessage: {
        type: "actionApply",
        mode,
        spacing,
        useCustomValue,
      },
    },
    "*"
  );
}
