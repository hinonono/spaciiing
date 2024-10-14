export interface EditorPreference {
  spacing?: number;
  magicObjects: MagicObjects;
}

interface MagicObjects {
  noteId: string;
  tagId: string;
  sectionId: string;
}
