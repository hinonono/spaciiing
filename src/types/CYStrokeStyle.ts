import { CYStroke } from "./CYStroke";

// 用於儲存用戶自行設定的筆畫樣式，比figma原生的還多了粗細、圓角、虛線樣式等設定
export interface CYStrokeStyle {
    id: string,
    name: string,
    style: CYStroke,
}