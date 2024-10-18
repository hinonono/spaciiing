import { i18n } from "i18next";
import { ExternalMessageLocalization } from "../types/Messages/MessageLocalization";

export const localizationHandler = (
  message: ExternalMessageLocalization,
  i18n: i18n
) => {
  i18n.changeLanguage(message.lang);
};
