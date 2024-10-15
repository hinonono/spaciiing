import { useTranslation } from "react-i18next";
import { ExternalMessageLocalization } from "../types/Messages/MessageLocalization";

export const localizationHandler = (message: ExternalMessageLocalization) => {
  const { i18n } = useTranslation();

  i18n.changeLanguage(message.lang);
};
