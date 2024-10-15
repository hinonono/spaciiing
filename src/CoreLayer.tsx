import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppProvider";
import { ExternalMessage } from "./types/Messages/ExternalMessage";
import { ExternalMessageUpdateVirtualProfile } from "./types/Messages/MessageVirtualProfile";
import * as licenseManagementFrontEnd from "./module-frontend/licenseManagementFrontEnd";
import SubscriptionModal from "./view/SubscriptionModal";
import TabBar from "./components/TabBar";
import { useTranslation } from "react-i18next";
import { ExternalMessageUpdatePaintStyleList as ExternalMessageUpdateStyleList } from "./types/Messages/MessageStyleIntroducer";
import { ExternalMessageLocalization } from "./types/Messages/MessageLocalization";
import { ExternalMessageLicenseManagement } from "./types/Messages/MessageLicenseManagement";
import { ExternalMessageUpdateFrame } from "./types/Messages/MessageMemorizer";
import { Module } from "./types/Module";
import {
  ExternalMessageUpdateVariableCollectionList,
  ExternalMessageUpdateVariableCollectionMode,
  ExternalMessageUpdateCustomCodeExecutionResults,
} from "./types/Messages/MessageVariableEditor";
import { ExternalMessageUpdateEditorPreference } from "./types/Messages/MessageEditorPreference";
import {
  virtualProfileHandler,
  virtualProfileWillEnd,
} from "./module-frontend/virtualProfileFrontEnd";
import {
  activeTabController,
  tabWillEndController,
} from "./module-frontend/tabController";
import {
  updateCustomCodeExecutionResults,
  UpdateVariableCollectionList,
  UpdateVariableCollectionMode,
} from "./module-frontend/variableEditorFrontEnd";

// #region Actual File Content
const CoreLayer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Module>("Spaciiing");
  const [prevTab, setPrevTab] = useState<Module | null>(null);
  const { i18n } = useTranslation();
  //
  const {
    setEditorPreference,
    setMemorizedObjectHeight,
    setMemorizedObjectName,
    setMemorizedObjectWidth,
    setVariableCollectionList,
    setvariableCollectionModes,
    setLicenseManagement,
    setCustomCodeExecutionResults,
    virtualProfileGroups,
    setVirtualProfileGroups,
    setStyleList,
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
              virtualProfileWillEnd(
                virtualProfileGroups,
                setVirtualProfileGroups
              );
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
            break;
          case "Memorizer":
            MemorizerHandler(message as ExternalMessageUpdateFrame);
            break;
          case "VariableEditor":
            if (message.mode === "UpdateVariableCollectionList") {
              UpdateVariableCollectionList(
                message as ExternalMessageUpdateVariableCollectionList,
                setVariableCollectionList
              );
            }
            if (message.mode === "UpdateVariableCollectionMode") {
              UpdateVariableCollectionMode(
                message as ExternalMessageUpdateVariableCollectionMode,
                setvariableCollectionModes
              );
            }
            if (message.mode === "UpdateCustomCodeExecutionResults") {
              updateCustomCodeExecutionResults(
                message as ExternalMessageUpdateCustomCodeExecutionResults,
                setCustomCodeExecutionResults
              );
            }
            break;
          case "Shortcut":
            break;
          case "VirtualProfile":
            virtualProfileHandler(
              message as ExternalMessageUpdateVirtualProfile,
              setVirtualProfileGroups
            );
            break;
          case "LicenseManagement":
            licenseManagementFrontEnd.licenseManagementHandler(
              message as ExternalMessageLicenseManagement,
              setLicenseManagement
            );
            break;
          case "StyleIntroducer":
            if (message.mode === "UpdateStyleList" && message.phase == "Init") {
              updateStyleListHandler(message as ExternalMessageUpdateStyleList);
            }
            break;
          case "PluginSetting":
            if (message.mode === "UpdateEditorPreference") {
              updateEditorPreferenceHandler(
                message as ExternalMessageUpdateEditorPreference
              );
            }
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
    // 處理生命週期即將結束的頁籤進行相關動作
    tabWillEndController(prevTab, activeTab);

    // 處理當前活躍中的頁籤以進行初始化
    activeTabController(activeTab);

    setPrevTab(activeTab);
  }, [activeTab]);

  // #region StyleIntroducer

  const updateEditorPreferenceHandler = (
    message: ExternalMessageUpdateEditorPreference
  ) => {
    console.log("接收了EP！");
    console.log(message.editorPreference);

    setEditorPreference(() => message.editorPreference);
  };

  const updateStyleListHandler = (message: ExternalMessageUpdateStyleList) => {
    setStyleList(message.styleList);
  };

  // #region Module Handler
  // Localization
  const localizationHandler = (message: ExternalMessageLocalization) => {
    console.log("Preferred Lang changed to" + message.lang);

    i18n.changeLanguage(message.lang);
  };

  // Variable Editor

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
