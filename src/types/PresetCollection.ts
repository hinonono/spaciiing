// Collection基底屬性
export interface BaseCollection {
  brand: string;
  name: string;
}

// Layout guide
export interface LayoutGridCollection extends BaseCollection {
  members: (RowsColsLayoutGrid | GridLayoutGrid)[];
}

// 字級
export interface TypographyCollection extends BaseCollection {
  members: CustomTypography[];
}

interface CustomTypography {
  name: string;
  description: string;
  fontSize: number;
  fontWeight: string;
}

// 效果
export interface EffectCollection extends BaseCollection {
  members: CustomEffect[];
}

interface CustomEffect {
  name: string;
  description: string;
  effects: Effect[];
}

// 色彩
interface CustomColor {
  name: string;
  color: ColorShades;
  description: string;
}

interface ColorShades {
  light: RGBA;
  dark: RGBA;
}

export type ColorType = "light" | "dark" | "none";
export interface ColorCollection extends BaseCollection {
  members: CustomColor[];
}

export type CollectionExplanationable =
  | ColorCollection
  | EffectCollection
  | TypographyCollection
  | NumberCollection;

// 數值
export interface NumberCollection extends BaseCollection {
  members: CustomNumber[];
}

interface CustomNumber {
  name: string;
  value: number;
  description: string;
}
