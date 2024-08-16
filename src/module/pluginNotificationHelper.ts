// import {
//   FigmaNotificationMessage,
//   FigmaNotificationMessageRole,
// } from "../types/FigmaNotificationMessage";
// import {
//   noti_enUS_data,
//   noti_jaJP_data,
//   noti_zhCN_data,
//   noti_zhTW_data,
// } from "../assets/locales";

// const noti_enUS: FigmaNotificationMessage = noti_enUS_data;
// const noti_jaJP: FigmaNotificationMessage = noti_jaJP_data;
// const noti_zhCN: FigmaNotificationMessage = noti_zhCN_data;
// const noti_zhTW: FigmaNotificationMessage = noti_zhTW_data;

// // Helper function to select the correct notifications object based on language code
// function getNotificationsByLang(
//   langCode: string
// ): FigmaNotificationMessage | undefined {
//   switch (langCode) {
//     case "enUS":
//       return noti_enUS;
//     case "jaJP":
//       return noti_jaJP;
//     case "zhCN":
//       return noti_zhCN;
//     case "zhTW":
//       return noti_zhTW;
//     default:
//       return undefined;
//   }
// }

// export function notify(
//   key: string,
//   langCode: string,
//   role: FigmaNotificationMessageRole
// ) {
//   const notifications = getNotificationsByLang(langCode);
//   if (!notifications) {
//     figma.notify(`Language code ${langCode} is not supported.`);
//     return;
//   }

//   const message = notifications[key];
//   let emoji = "";
//   switch (role) {
//     case "SUCCESS":
//       emoji = "✅";
//       break;
//     case "WARNING":
//       emoji = "⚠️";
//       break;
//     case "ERROR":
//       emoji = "❌";
//       break;
//     default:
//       break;
//   }
  
//   if (message) {
//     figma.notify(`${emoji} ${message}`);
//   } else {
//     figma.notify(`Notification key ${key} not found.`);
//   }
// }
