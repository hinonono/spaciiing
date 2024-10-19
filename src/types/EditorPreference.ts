export interface EditorPreference {
  spacing?: number;
  magicObjects: MagicObjects;
  lorem: string; //預設寫英文
  iconFrame: IconFrame;
}

interface IconFrame {
  innerFrame: number;
  outerFrame: number;
}

interface MagicObjects {
  noteId: string; //這些必須是固定有值的，這樣才可以判斷是否記憶了該物件（也不用費心處理值可能是undefined的問題）
  tagId: string;
  sectionId: string;
}
