import { useAppContext } from "../AppProvider";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { Message } from "../types/Messages/Message";
import { ExternalMessageLocalization } from "../types/Messages/MessageLocalization";
import { ExternalMessageUpdateFrame } from "../types/Messages/MessageMemorizer";
import { ExternalMessageUpdateVirtualProfile } from "../types/Messages/MessageVirtualProfile";
import { localizationHandler } from "./localizationFrontEnd";
import { memorizerHandler } from "./memorizerFrontEnd";
import { variableEditorHandler } from "./variableEditorFrontEnd";
import {
  virtualProfileHandler,
  virtualProfileWillEnd,
} from "./virtualProfileFrontEnd";
import { ExternalMessageLicenseManagement } from "../types/Messages/MessageLicenseManagement";
import { licenseManagementHandler } from "./licenseManagementFrontEnd";
import { styleIntroducerHandler } from "./styleIntroducerFrontEnd";
import { pluginSettingHandler } from "./pluginSetting";

export function messageController(message: Message) {
  switch (message.phase) {
    case "WillEnd":
      messageWillEndController(message);
      break;
    default:
      messageActualController(message);
      break;
  }
}

function messageActualController(message: Message) {
  const { module } = message;
  const { setLicenseManagement } = useAppContext();

  switch (module) {
    case "Init":
      // Handle Init case
      break;
    case "Localization":
      localizationHandler(message as ExternalMessageLocalization);
      break;
    case "Spaciiing":
      // Handle Spaciiing case
      break;
    case "Memorizer":
      memorizerHandler(message as ExternalMessageUpdateFrame);
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
      variableEditorHandler(message);
      break;
    case "VirtualProfile":
      virtualProfileHandler(message as ExternalMessageUpdateVirtualProfile);
      break;
    case "SelectionFilter":
      // Handle SelectionFilter case
      break;
    case "PluginSetting":
      pluginSettingHandler(message);
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
      styleIntroducerHandler(message);
      break;
    default:
      // Handle unknown case
      break;
  }
}

function messageWillEndController(message: ExternalMessage) {
  if (message.phase !== "WillEnd") {
    throw new Error("Unexpected message phase");
  }

  const { module } = message;
  const { virtualProfileGroups } = useAppContext();

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
    case "Memorizer":
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
      virtualProfileWillEnd(virtualProfileGroups);
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
