import {
  CustomVariableCodeBool,
  CustomVariableCodeColor,
  CustomVariableCodeString,
  CustomVariableCodeNumber,
} from "../types/CustomVariableCode";
import {
  MessageVariableEditor,
  MessageGetAvailableCollectionMode,
  MessageVariableEditorExecuteCode,
  ExternalMessageUpdateCustomCodeExecutionResults,
  ExternalMessageUpdateVariableCollectionList,
  ExternalMessageUpdateVariableCollectionMode,
} from "../types/Messages/MessageVariableEditor";
import * as util from "./util";
import { utils } from "./utils";

export function reception(message: MessageVariableEditor) {
  if (message.phase == undefined) {
    console.log("沒有設定訊息的phase !");
    return;
  }

  if (message.phase == "Init") {
    initVariableEditor();
  }

  if (message.phase == "Actual") {
    switch (message.intent) {
      case "getAvailableMode":
        handleGetAvailableModeList(
          message as MessageGetAvailableCollectionMode
        );
        break;
      case "executeCode":
        executeCode(message as MessageVariableEditorExecuteCode);
        break;
      default:
        break;
    }
  }
}

async function handleVariableCreation<
  T extends
    | CustomVariableCodeNumber
    | CustomVariableCodeString
    | CustomVariableCodeBool
    | CustomVariableCodeColor
>(
  parsedCode: T[],
  collection: VariableCollection,
  message: MessageVariableEditorExecuteCode,
  existingVariables: Variable[]
) {
  const executionResults: Array<string> = [];

  for (const item of parsedCode) {
    console.log(item);

    if (existingVariables.some((v) => v.name === item.name)) {
      executionResults.push(
        `❌ Variable with name "${item.name}" already exists. Skipping creation.`
      );
      continue;
    }

    const result = await createVariable(item, collection, message);
    executionResults.push(result);
  }

  updateVariableCollectionListMessage();
  returnExecutionResults(executionResults);
}

async function createVariable(
  item:
    | CustomVariableCodeNumber
    | CustomVariableCodeString
    | CustomVariableCodeBool
    | CustomVariableCodeColor,
  collection: VariableCollection,
  message: MessageVariableEditorExecuteCode
): Promise<string> {
  let value: string | number | boolean | RGB | RGBA | null = item.value;

  if (message.variableResolvedDataType === "COLOR") {
    value = util.parseColorToRgba(item.value as string, 1);
    if (!value) {
      return `❌ Invalid color format for variable "${item.name}". Skipping creation.`;
    }
  }

  try {
    const variable = figma.variables.createVariable(
      item.name,
      collection,
      message.variableResolvedDataType
    );

    variable.scopes = getScopesForVariable(message);

    if (message.variableMode === "") {
      return `❌ Error creating variable due to no mode selected.`;
    }

    const modeId = collection.modes[0].modeId;
    variable.setValueForMode(modeId, value);

    return `✅ Variable with name "${item.name}" created successfully.`;
  } catch (error) {
    console.error(
      `❌ Error creating variable with name "${item.name}":`,
      error
    );
    return (
      `❌ Error creating variable with name "${item.name}":` + String(error)
    );
  }
}

function getScopesForVariable(
  message: MessageVariableEditorExecuteCode
): VariableScope[] {
  if (message.variableScope.includes("ALL_SCOPES")) {
    return ["ALL_SCOPES"];
  }

  if (message.variableScope.includes("ALL_FILLS")) {
    return message.variableScope.filter(
      (scope) => !["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"].includes(scope)
    );
  }

  return message.variableResolvedDataType !== "BOOLEAN"
    ? message.variableScope
    : [];
}

function returnExecutionResults(results: Array<string>) {
  const message: ExternalMessageUpdateCustomCodeExecutionResults = {
    results: results,
    module: "VariableEditor",
    phase: "Actual",
    direction: "Outer",
    mode: "UpdateCustomCodeExecutionResults",
  };
  utils.communication.sendMessageBack(message);
}

async function updateVariableCollectionListMessage() {
  // 取得可用的collection名單
  const collectionList = await getAvailableCollectionList();
  // Extract only the id and name properties
  const simplifiedCollectionList = collectionList.map((collection) => ({
    id: collection.id,
    name: collection.name,
  }));

  const message: ExternalMessageUpdateVariableCollectionList = {
    collections: simplifiedCollectionList,
    module: "VariableEditor",
    direction: "Outer",
    phase: "Actual",
    mode: "UpdateVariableCollectionList",
  };

  utils.communication.sendMessageBack(message);
}

async function findExistingVariables(ids: string[]): Promise<Variable[]> {
  // Fetch existing variables in the collection
  const existingVariablesId = ids;
  const existingVariables: Variable[] = [];
  existingVariablesId.forEach(async (item) => {
    const tempVar = await figma.variables.getVariableByIdAsync(item);
    if (tempVar) {
      existingVariables.push(tempVar);
    }
  });

  return existingVariables;
}

async function executeCode(message: MessageVariableEditorExecuteCode) {
  let parsedCode;
  let collection;
  if (message.code == "") {
    figma.notify("❌ The content of custom code must not be empty.");
    return;
  }
  if (
    message.variableCollectionId == "" ||
    message.variableCollectionId == "new"
  ) {
    if (message.newCollectionName != undefined) {
      collection = figma.variables.createVariableCollection(
        message.newCollectionName
      );
    } else {
      collection = figma.variables.createVariableCollection("New Collection");
    }
  } else {
    collection = await figma.variables.getVariableCollectionByIdAsync(
      message.variableCollectionId
    );
    if (collection == null) {
      figma.notify(
        "❌ Cannot find corresponding variable collection by ID provided."
      );
      return;
    }
  }

  const existingVariables = await findExistingVariables(collection.variableIds);

  interface FlattenedVariable {
    name: string;
    value: string | number | boolean;
    opacity?: number;
  }

  type NestedVariable = {
    [key: string]: NestedVariable | FlattenedVariable;
  };

  /**
   * Recursively flattens a nested variable object into an array of flattened variables.
   * Each flattened variable includes its full path as the name.
   *
   * @param obj - The nested variable object to flatten.
   * @param parentKey - The parent key to prepend to each variable's key.
   * @returns An array of flattened variables.
   */
  const flattenVariables = (
    obj: NestedVariable,
    parentKey = ""
  ): FlattenedVariable[] => {
    // Object.keys(obj) returns an array of the object's own enumerable property names.
    // reduce is used to iterate over each key in the array and accumulate the results into a single array.
    return Object.keys(obj).reduce<FlattenedVariable[]>((acc, key) => {
      // Construct the new key by appending the current key to the parent key, separated by a slash.
      const newKey = parentKey ? `${parentKey}/${key}` : key;
      const value = obj[key];

      // If the value is an object and does not contain a 'value' property, it means it's a nested object.
      // Recursively flatten the nested object and append the results to the accumulator.
      if (typeof value === "object" && !("value" in value)) {
        acc.push(...flattenVariables(value as NestedVariable, newKey));
      } else {
        // If the value is not a nested object, add it to the accumulator with the constructed key as its name.
        acc.push({ ...(value as FlattenedVariable), name: newKey });
      }

      // Return the accumulator for the next iteration.
      return acc;
    }, []);
  };

  const flattenedCode = flattenVariables(
    JSON.parse(message.code) as NestedVariable
  );

  switch (message.variableResolvedDataType) {
    case "BOOLEAN":
      parsedCode = flattenedCode as CustomVariableCodeBool[];
      await handleVariableCreation(
        parsedCode,
        collection,
        message,
        existingVariables
      );
      break;
    case "COLOR":
      parsedCode = flattenedCode as CustomVariableCodeColor[];
      await handleVariableCreation(
        parsedCode,
        collection,
        message,
        existingVariables
      );
      break;
    case "FLOAT":
      parsedCode = flattenedCode as CustomVariableCodeNumber[];
      await handleVariableCreation(
        parsedCode,
        collection,
        message,
        existingVariables
      );
      break;
    case "STRING":
      parsedCode = flattenedCode as CustomVariableCodeString[];
      await handleVariableCreation(
        parsedCode,
        collection,
        message,
        existingVariables
      );
      break;
    default:
      figma.notify("❌ Unsupported data type");
      break;
  }
}

async function handleGetAvailableModeList(
  message: MessageGetAvailableCollectionMode
) {
  const modes = await getAvailableModeList(message.id);
  const messageToSent: ExternalMessageUpdateVariableCollectionMode = {
    modes: modes,
    module: "VariableEditor",
    direction: "Outer",
    phase: "Actual",
    mode: "UpdateVariableCollectionMode",
  };
  utils.communication.sendMessageBack(messageToSent);
}

async function initVariableEditor() {
  // console.log("❇️🥹Init Variable Editor");

  updateVariableCollectionListMessage();
}

// 取得可用的變數集合名單
async function getAvailableCollectionList(): Promise<VariableCollection[]> {
  // Fetch all variable collections in the document
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  return collections;
}

// 取得可用的Mode名單
async function getAvailableModeList(
  collectionId: string
): Promise<{ modeId: string; name: string }[]> {
  // Fetch the variable collection by ID
  const collection = await figma.variables.getVariableCollectionByIdAsync(
    collectionId
  );
  if (!collection) {
    throw new Error(`Collection with ID ${collectionId} not found`);
  }

  // Return the modes in the collection
  return collection.modes;
}
