import { CYStrokeStyle } from "./CYStrokeStyle";

// 底層資料在figma檔案裡都是各自分開儲存的，但是在UI前端為了方便會統一打包在這個物件底下
// 這個物件裝的都是希望透過figma在不同用戶間同步的資料
export interface RuntimeSyncedResources {
    strokeStyles: CYStrokeStyle[];
}