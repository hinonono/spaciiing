export interface EditorPreference {
  spacing?: number;
  magicObjects: MagicObjects;
}

interface MagicObjects {
  noteId: string; //這些必須是固定有值的，這樣才可以判斷是否記憶了該物件（也不用費心處理值可能是undefined的問題）
  tagId: string;
  sectionId: string;
}
