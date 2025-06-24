import * as communicationUtil from "./communication";
import * as dataUtil from "./data";
import * as nodeEditUtil from "./nodeEdit";
import * as runtimeUtil from "./runtime";
import * as typeCheckUtil from "./typeCheck";

export const utils = {
  communication: communicationUtil,
  data: dataUtil,
  nodeEdit: nodeEditUtil,
  runtime: runtimeUtil,
  typeCheck: typeCheckUtil
};