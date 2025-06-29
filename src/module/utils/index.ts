import * as colorUtil from "./color";
import * as communicationUtil from "./communication";
import * as dataUtil from "./data";
import * as editorUtil from "./editor";
import * as mathUtil from "./math";
import * as nodeUtil from "./node";
import * as runtimeUtil from "./runtime";
import * as serviceUtil from "./service";
import * as stringUtil from "./string";
import * as typeCheckUtil from "./typeCheck";
import * as vectorUtil from "./vector";
import { dataKeys } from "./dataKeys";

export const utils = {
  color: colorUtil,
  communication: communicationUtil,
  data: dataUtil,
  editor: editorUtil,
  math: mathUtil,
  node: nodeUtil,
  runtime: runtimeUtil,
  service: serviceUtil,
  string: stringUtil,
  typeCheck: typeCheckUtil,
  vector: vectorUtil,
  dataKeys: dataKeys,
};