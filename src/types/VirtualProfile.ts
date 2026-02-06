interface BasicRow {
  id: string;
  title: string;
}

export interface VirtualProfileChild extends BasicRow {
  content: string;
}

export interface VirtualProfileGroup extends BasicRow {
  color: VirtualProfileGroupColor;
  children: VirtualProfileChild[];
  isCollapsed: boolean;
}

export interface VirtualProfileChildRaw {
  content: string;
  title: string;
}

export interface VirtualProfileGroupRaw {
  children: VirtualProfileChildRaw[];
  title: string;
}

export type VirtualProfileGroupColor =
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "cyan"
  | "indigo"
  | "purple"
  | "gray"

export type SupportedPresetVirtualProfileCategory =
  | "BOOK"
  | "CREDIT_CARD"
  | "FLIGHT"
  | "MOVIE"
  | "PERSONAL"
  | "PRODUCT"
  | "STOCK"
  | "FLOW";


export interface VirtualProfileCategoryAndKey {
  category: SupportedPresetVirtualProfileCategory;
  key: string;
}