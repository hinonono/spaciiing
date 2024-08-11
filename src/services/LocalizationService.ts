import { getPreferredLang } from "../module/localization";

export class LocalizationService {
  static async getLanguageCode() {
    try {
      return await getPreferredLang();
    } catch (error) {
      console.error(error);
      return "enUS"; // or some default value
    }
  }
}
