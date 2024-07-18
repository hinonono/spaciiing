import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppProvider";
import {
  ExternalMessage,
  ExternalMessageUpdateCustomSpacing,
  ExternalMessageUpdateFrame,
  ExternalMessageLicenseManagement,
  ExternalMessageUpdateMagicalObject,
  ExternalMessageUpdateVariableCollectionList,
  ExternalMessageUpdateVariableCollectionMode,
  ExternalMessageUpdateVirtualProfile,
  Message,
  MessageShortcutUpdateMagicalObject,
  MessageVirtualProfileWholeObject,
  ModuleType,
  ExternalMessageUpdateCustomCodeExecutionResults,
  ExternalMessageLocalization,
} from "./types/Message";

import * as licenseManagementFrontEnd from "./module-frontend/licenseManagementFrontEnd";
import SubscriptionModal from "./view/SubscriptionModal";
import TabBar from "./components/TabBar";
import { useTranslation } from "react-i18next";

// #region Actual File Content
const CoreLayer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ModuleType>("Spaciiing");
  const [prevTab, setPrevTab] = useState<ModuleType | null>(null);
  const { i18n } = useTranslation();
  //
  const {
    setLastCustomSpacing,
    setMemorizedObjectHeight,
    setMemorizedObjectName,
    setMemorizedObjectWidth,
    setVariableCollectionList,
    setvariableCollectionModes,
    setMagicalObject,
    magicalObject,
    setLicenseManagement,
    setCustomCodeExecutionResults,
    virtualProfileGroups,
    setVirtualProfileGroups,
  } = useAppContext();

  // #region Handle External Message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.pluginMessage) {
        const message = event.data.pluginMessage
          .pluginMessage as ExternalMessage;

        if (message.phase == "WillEnd") {
          // Do
          switch (message.module) {
            case "VirtualProfile":
              virtualProfileWillEnd();
              break;
            default:
              break;
          }
        }

        switch (message.module) {
          case "Localization":
            localizationHandler(message as ExternalMessageLocalization);
            break;
          case "Spaciiing":
            SpaciiingHandler(message as ExternalMessageUpdateCustomSpacing);
            break;
          case "Memorizer":
            MemorizerHandler(message as ExternalMessageUpdateFrame);
            break;
          case "VariableEditor":
            if (message.mode === "UpdateVariableCollectionList") {
              UpdateVariableCollectionList(
                message as ExternalMessageUpdateVariableCollectionList
              );
            }
            if (message.mode === "UpdateVariableCollectionMode") {
              UpdateVariableCollectionMode(
                message as ExternalMessageUpdateVariableCollectionMode
              );
            }
            if (message.mode === "UpdateCustomCodeExecutionResults") {
              updateCustomCodeExecutionResults(
                message as ExternalMessageUpdateCustomCodeExecutionResults
              );
            }
            break;
          case "Shortcut":
            magicalObjectHandler(message as ExternalMessageUpdateMagicalObject);
            break;
          case "VirtualProfile":
            virtualProfileHandler(
              message as ExternalMessageUpdateVirtualProfile
            );
            break;
          case "LicenseManagement":
            licenseManagementFrontEnd.licenseManagementHandler(
              message as ExternalMessageLicenseManagement,
              setLicenseManagement
            );
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // #region WillEnd
  useEffect(() => {
    if (prevTab === "VirtualProfile" && activeTab !== "VirtualProfile") {
      // Call virtualProfileWillEnd only when switching away from VirtualProfile
      virtualProfileWillEnd();
    }

    if (prevTab === "Shortcut" && activeTab !== "Shortcut") {
      // Call virtualProfileWillEnd only when switching away from VirtualProfile
      shortcutWillEnd();
    }

    if (prevTab === "VariableEditor" && activeTab !== "VariableEditor") {
      variableEditorWillEnd();
    }

    switch (activeTab) {
      case "VariableEditor":
        initVariableEditor();
        break;
      case "Shortcut":
        initShortcut();
        break;
      case "VirtualProfile":
        initVirtualProfile();
        break;
      default:
        break;
    }

    // Update prevTab to the current activeTab after handling the effect
    setPrevTab(activeTab);
  }, [activeTab]);

  // #region Module Handler
  // Localization
  const localizationHandler = (message: ExternalMessageLocalization) => {
    console.log("Preferred Lang changed to" + message.lang);

    i18n.changeLanguage(message.lang);
  };

  // Shortcut
  const initShortcut = () => {
    const message: Message = {
      module: "Shortcut",
      phase: "Init",
      direction: "Inner",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  const shortcutWillEnd = () => {
    const message: MessageShortcutUpdateMagicalObject = {
      magicalObject: magicalObject,
      action: "updateMagicalObject",
      module: "Shortcut",
      direction: "Inner",
      phase: "WillEnd",
    };
    setMagicalObject(magicalObject);
    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  // Magical Object
  const magicalObjectHandler = (
    message: ExternalMessageUpdateMagicalObject
  ) => {
    setMagicalObject(message.magicalObject);
  };

  // Virtual Profile
  const initVirtualProfile = () => {
    const message: Message = {
      module: "VirtualProfile",
      phase: "Init",
      direction: "Inner",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  const virtualProfileHandler = (
    message: ExternalMessageUpdateVirtualProfile
  ) => {
    console.log("VirtualProfileHandler");
    console.log(message.virtualProfile);

    // setVirtualProfile(message.virtualProfile);

    if (message.virtualProfileGroups) {
      console.log("VirtualProfileHandler GROUPS");
      console.log(message.virtualProfileGroups);
      setVirtualProfileGroups(message.virtualProfileGroups);
    }
  };

  const virtualProfileWillEnd = () => {
    const message: MessageVirtualProfileWholeObject = {
      module: "VirtualProfile",
      phase: "WillEnd",
      direction: "Inner",
      // virtualProfile: virtualProfile,
      virtualProfileGroups: virtualProfileGroups,
    };
    // setVirtualProfile(virtualProfile);
    setVirtualProfileGroups(virtualProfileGroups);

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  // Variable Editor
  const initVariableEditor = () => {
    const message: Message = {
      module: "VariableEditor",
      phase: "Init",
      direction: "Inner",
    };

    parent.postMessage(
      {
        pluginMessage: message,
      },
      "*"
    );
  };

  const UpdateVariableCollectionList = (
    message: ExternalMessageUpdateVariableCollectionList
  ) => {
    setVariableCollectionList(message.collections);
  };

  const UpdateVariableCollectionMode = (
    message: ExternalMessageUpdateVariableCollectionMode
  ) => {
    setvariableCollectionModes(message.modes);
  };

  const updateCustomCodeExecutionResults = (
    message: ExternalMessageUpdateCustomCodeExecutionResults
  ) => {
    setCustomCodeExecutionResults(message.results);
  };

  const variableEditorWillEnd = () => {
    setCustomCodeExecutionResults([]);
  };

  // Spaciiing
  const SpaciiingHandler = (message: ExternalMessageUpdateCustomSpacing) => {
    const spacing = message.spacing;
    setLastCustomSpacing(spacing);
  };

  const MemorizerHandler = (message: ExternalMessageUpdateFrame) => {
    switch (message.mode) {
      case "UpdateFrameToMemorizedSize":
        if (
          message.memorizedObjectHeight == undefined ||
          message.memorizedObjectWidth == undefined
        ) {
          return;
        }
        updateMemorizedObjectSize(
          message.memorizedObjectWidth,
          message.memorizedObjectHeight
        );
        break;
      case "UpdateMemorizedName":
        if (message.memorizedName == undefined) {
          return;
        }
        updateMemorizedName(message.memorizedName);
        break;
      default:
        break;
    }
  };

  const updateMemorizedObjectSize = (width: string, height: string) => {
    if (width !== "") {
      setMemorizedObjectWidth(Number(width));
    }

    if (height !== "") {
      setMemorizedObjectHeight(Number(height));
    }
  };

  const updateMemorizedName = (name: string) => {
    setMemorizedObjectName(name);
  };

  // #region JSX Elements
  return (
    <div className="App">
      <SubscriptionModal />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default CoreLayer;
