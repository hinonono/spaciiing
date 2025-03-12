import { AppContextType } from "../AppProvider";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { Message } from "../types/Messages/Message";
import { ExternalMessageLocalization } from "../types/Messages/MessageLocalization";
import { ExternalMessageUpdateVirtualProfile } from "../types/Messages/MessageVirtualProfile";
import { localizationHandler } from "./localizationFrontEnd";
import { variableEditorHandler } from "./variableEditorFrontEnd";
import {
  virtualProfileHandler,
  virtualProfileWillEnd,
} from "./virtualProfileFrontEnd";
import { ExternalMessageLicenseManagement } from "../types/Messages/MessageLicenseManagement";
import { licenseManagementHandler } from "./licenseManagementFrontEnd";
import { styleIntroducerHandler } from "./styleIntroducerFrontEnd";
import { pluginSettingHandler } from "./pluginSetting";
import { i18n } from "i18next";

export function messageController(
  message: Message,
  appContext: AppContextType,
  i18n: i18n
) {
  switch (message.phase) {
    case "WillEnd":
      messageWillEndController(message, appContext);
      break;
    default:
      messageActualController(message, appContext, i18n);
      break;
  }
}

function messageActualController(
  message: Message,
  appContext: AppContextType,
  i18n: i18n
) {
  const { module } = message;
  const { setLicenseManagement, setEditorType } = appContext;

  switch (module) {
    case "Init":
      // Handle Init case
      const castedMessage = message as ExternalMessage;
      if (castedMessage.editorType) {
        console.log(castedMessage.editorType, "vmkmvv");

        setEditorType(castedMessage.editorType);
      }

      break;
    case "Localization":
      localizationHandler(message as ExternalMessageLocalization, i18n);
      break;
    case "Spaciiing":
      // Handle Spaciiing case
      break;
    case "PropertyClipboard":
      break;
    case "Shortcut":
      break;
    case "Framer":
      // Handle Framer case
      break;
    case "LoremGenerator":
      // Handle LoremGenerator case
      break;
    case "Instantiater":
      break;
    case "Renamer":
      // Handle Renamer case
      break;
    case "VariableEditor":
      variableEditorHandler(message, appContext);
      break;
    case "VirtualProfile":
      virtualProfileHandler(
        message as ExternalMessageUpdateVirtualProfile,
        appContext
      );
      break;
    case "SelectionFilter":
      // Handle SelectionFilter case
      break;
    case "PluginSetting":
      pluginSettingHandler(message, appContext);
      break;
    case "LicenseManagement":
      licenseManagementHandler(
        message as ExternalMessageLicenseManagement,
        setLicenseManagement
      );
      break;
    case "AspectRatioHelper":
      // Handle AspectRatioHelper case
      break;
    case "Resize":
      // Handle Resize case
      break;
    case "StyleIntroducer":
      styleIntroducerHandler(message, appContext);
      break;
    default:
      // Handle unknown case
      break;
  }
}

function messageWillEndController(
  message: ExternalMessage,
  appContext: AppContextType
) {
  if (message.phase !== "WillEnd") {
    throw new Error("Unexpected message phase");
  }

  const { module } = message;
  const { virtualProfileGroups } = appContext;

  switch (module) {
    case "Init":
      // Handle Init case
      break;
    case "Localization":
      // Handle Localization case
      break;
    case "Spaciiing":
      // Handle Spaciiing case
      break;
    case "PropertyClipboard":
      // Handle Memorizer case
      break;
    case "Shortcut":
      break;
    case "Framer":
      // Handle Framer case
      break;
    case "LoremGenerator":
      // Handle LoremGenerator case
      break;
    case "Instantiater":
      break;
    case "Renamer":
      // Handle Renamer case
      break;
    case "VariableEditor":
      break;
    case "VirtualProfile":
      virtualProfileWillEnd(virtualProfileGroups, appContext);
      break;
    case "SelectionFilter":
      // Handle SelectionFilter case
      break;
    case "PluginSetting":
      // Handle PluginSetting case
      break;
    case "LicenseManagement":
      // Handle LicenseManagement case
      break;
    case "AspectRatioHelper":
      // Handle AspectRatioHelper case
      break;
    case "Resize":
      // Handle Resize case
      break;
    case "StyleIntroducer":
      break;
    default:
      // Handle unknown case
      break;
  }
}
