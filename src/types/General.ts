export interface PaintStyleFrontEnd {
  id: string;
  name: string;
}

export interface CustomCheckboxGroupOption {
  name: string;
  nameKey?: string;
  indented: boolean;
  indentLevel: number;
}

export type NestedStructure = {
  [key: string]: {
    id?: string;
    children?: NestedStructure;
  };
};

export interface StyleSelection {
  title: string;
  scopes: string[];
}
