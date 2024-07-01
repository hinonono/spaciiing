// src/react-i18next.d.ts
import "react-i18next";

declare module "react-i18next" {
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: "translation";
    // custom resources type
    resources: {
      translation: typeof import("./locales/en/translation.json");
    };
  }
}
