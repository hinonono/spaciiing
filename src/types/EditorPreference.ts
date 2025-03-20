import { CYStrokeStyle } from "./CYStrokeStyle";

export interface EditorPreference {
  spacing?: number;
  magicObjects: MagicObjects;
  lorem: string; //預設寫英文
  iconFrame: IconFrame;
  referenceObject?: ReferenceObject;
  exampleFileUrl?: string; //用戶填入的，目前的設計檔案的網址，用於型錄的相關物件索引連結
  strokeStyles: CYStrokeStyle[]
}

interface IconFrame {
  innerFrame: number;
  outerFrame: number;
}

interface ReferenceObject {
  name: string;
  id: string;
}

interface MagicObjects {
  noteId: string; //這些必須是固定有值的，這樣才可以判斷是否記憶了該物件（也不用費心處理值可能是undefined的問題）
  tagId: string;
  sectionId: string;
}
