import { useAppContext } from "../AppProvider";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { Message } from "../types/Messages/Message";
import { virtualProfileWillEnd } from "./virtualProfileFrontEnd";

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
