import {
  CustomVariableCodeBool,
  CustomVariableCodeColor,
  CustomVariableCodeString,
  CustomVariableCodeNumber,
} from "../types/CustomVariableCode";
import {
  ExternalMessageUpdateCustomCodeExecutionResults,
  ExternalMessageUpdateVariableCollectionList,
  ExternalMessageUpdateVariableCollectionMode,
  MessageGetAvailableCollectionMode,
  MessageVariableEditor,
  MessageVariableEditorExecuteCode,
} from "../types/Message";
import * as util from "./util";

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

  // Do other things
}

function isCustomVariableCodeColor(
  variable:
    | CustomVariableCodeNumber
    | CustomVariableCodeString
    | CustomVariableCodeBool
    | CustomVariableCodeColor
): variable is CustomVariableCodeColor {
  return "opacity" in variable && typeof variable.opacity === "number";
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
  // 儲存執行時產生的log文字
  const executionResults: Array<string> = [];

  for (const item of parsedCode) {
    // Check if the variable already exists
    const existingVariable = existingVariables.find(
      (v: Variable) => v.name === item.name
    );

    let value: string | number | boolean | RGB | RGBA | null = item.value;
    if (message.dataType === "COLOR") {
      // 檢查傳入的型別以縮減範圍，存取opacity屬性
      if (isCustomVariableCodeColor(item)) {
        value = util.hexToRgba(item.value, item.opacity);
      }
    }

    if (existingVariable) {
      // Handle the case where the variable already exists
      executionResults.push(
        `❌ Variable with name "${item.name}" already exists. Skipping creation.`
      );
    } else {
      try {
        // Create a new variable if it doesn't already exist
        const variable = figma.variables.createVariable(
          item.name,
          collection,
          message.dataType
        );

        if (message.scope.includes("ALL_SCOPES")) {
          variable.scopes = ["ALL_SCOPES"];
        } else if (message.scope.includes("ALL_FILLS")) {
          // Remove "FRAME_FILL", "SHAPE_FILL", and "TEXT_FILL" from message.scope
          variable.scopes = message.scope.filter(
            (scope) =>
              !["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"].includes(scope)
          );
        } else {
          variable.scopes = message.scope;
        }

        if (message.mode != "") {
          if (value != null) {
            variable.setValueForMode(message.mode, value);
          } else {
            executionResults.push(
              `❌ Execute error when creation ${item.name} due to null value.`
            );
          }
        } else {
          if (value != null) {
            const modeId = collection.modes[0].modeId;
            variable.setValueForMode(modeId, value);
          } else {
            executionResults.push(
              `❌ Execute error when creation ${item.name} due to null value.`
            );
          }
        }

        executionResults.push(
          `✅ Variable with name "${item.name}" created successfully.`
        );
      } catch (error) {
        executionResults.push(
          `❌ Error creating variable with name "${item.name}":` + String(error)
        );
        console.error(
          `❌ Error creating variable with name "${item.name}":`,
          error
        );
      }
    }
  }

  updateVariableCollectionListMessage();
  returnExecutionResults(executionResults);
}

function returnExecutionResults(results: Array<string>) {
  const message: ExternalMessageUpdateCustomCodeExecutionResults = {
    results: results,
    module: "VariableEditor",
    phase: "Actual",
    direction: "Outer",
    mode: "UpdateCustomCodeExecutionResults",
  };
  util.sendMessageBack(message);
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

  util.sendMessageBack(message);
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
  if (message.destination == "" || message.destination == "new") {
    if (message.newCollectionName != undefined) {
      collection = figma.variables.createVariableCollection(
        message.newCollectionName
      );
    } else {
      collection = figma.variables.createVariableCollection("New Collection");
    }
  } else {
    collection = await figma.variables.getVariableCollectionByIdAsync(
      message.destination
    );
    if (collection == null) {
      figma.notify(
        "❌ Cannot find correspoding variable collection by ID provided."
      );
      return;
    }
  }

  const existingVariables = await findExistingVariables(collection.variableIds);

  switch (message.dataType) {
    case "BOOLEAN":
      parsedCode = JSON.parse(message.code) as CustomVariableCodeBool[];
      await handleVariableCreation(
        parsedCode,
        collection,
        message,
        existingVariables
      );
      break;
    case "COLOR":
      parsedCode = JSON.parse(message.code) as CustomVariableCodeColor[];
      await handleVariableCreation(
        parsedCode,
        collection,
        message,
        existingVariables
      );
      break;
    case "FLOAT":
      parsedCode = JSON.parse(message.code) as CustomVariableCodeNumber[];
      await handleVariableCreation(
        parsedCode,
        collection,
        message,
        existingVariables
      );
      break;
    case "STRING":
      parsedCode = JSON.parse(message.code) as CustomVariableCodeString[];
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
  util.sendMessageBack(messageToSent);
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
