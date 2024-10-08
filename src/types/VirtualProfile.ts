export interface VirtualProfile {
  // 基本資料
  name: string;
  nickname: string;
  age: string;
  gender: string;
  birthday: string;
  email: string;
  landlineNum: string;
  phoneNum: string;

  // 居住地址
  country: string;
  city: string;
  address: string;

  // 金融卡
  cardNum: string;
  expirationDate: string;
  cvv: string;
  cardNetwork: string;

  // 數位身份
  username: string;
  userId: string;

  // 職業與公司
  jobTitle: string;
  industry: string;
  companyName: string;
  companyAddress: string;
  companyPhoneNum: string;

  // 自訂欄位
  custom1: string;
  custom2: string;
  custom3: string;
}

interface BasicRow {
  id: string;
  title: string;
}

export interface VirtualProfileChild extends BasicRow {
  content: string;
}

export interface VirtualProfileGroup extends BasicRow {
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

export type SupportedPresetVirtualProfileCategory =
  | "BOOK"
  | "CREDIT_CARD"
  | "FLIGHT"
  | "MOVIE"
  | "PERSONAL"
  | "PRODUCT"
  | "STOCK";
