import { AppContextType } from "../AppProvider";
import { StyleListItemFrontEnd, NestedStructure } from "../types/General";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { MessageStyleIntroducer } from "../types/Messages/MessageStyleIntroducer";
import { ExternalMessageUpdatePaintStyleList as ExternalMessageUpdateStyleList } from "../types/Messages/MessageStyleIntroducer";

export const buildNestedStructure = (
  data: StyleListItemFrontEnd[]
): { structure: NestedStructure | null; errorPath?: string } => {
  // Return type can be either NestedStructure or null
  const root: NestedStructure = {};

  try {
    data.forEach(({ id, name }) => {
      const parts = name.split("/").map((part) => part.trim());
      let currentLevel = root;

      parts.forEach((part, index) => {
        // Check if the current part exists in the current level of the structure
        if (!currentLevel[part]) {
          // If it's the last part, assign an object with the 'id'
          // Otherwise, create a new level for further nesting
          currentLevel[part] =
            index === parts.length - 1 ? { id } : { children: {} };
        } else if (index === parts.length - 1 && currentLevel[part].id) {
          // Capture the error path when a duplicate is detected
          throw new Error(
            `Duplicate path: ${parts.slice(0, index + 1).join("/")}`
          );
        }

        // Move to the next level in the structure
        currentLevel = currentLevel[part].children as NestedStructure;
      });
    });

    return { structure: root };
  } catch (error: unknown) {
    console.error(
      "An error occurred while building the nested structure:",
      error
    );

    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return { structure: null, errorPath: errorMessage }; // Return the error message
  }
};

export function initStyleIntroducer() {
  const message: MessageStyleIntroducer = {
    styleSelection: undefined,
    form: "STYLE",
    styleMode: "COLOR",
    module: "StyleIntroducer",
    phase: "Init",
  };

  parent.postMessage(
    {
      pluginMessage: message,
    },
    "*"
  );
}

export function styleIntroducerHandler(
  message: ExternalMessage,
  appContext: AppContextType
) {
  if (message.mode === "UpdateStyleList" && message.phase == "Init") {
    updateStyleListHandler(
      message as ExternalMessageUpdateStyleList,
      appContext
    );
  }
}

const updateStyleListHandler = (
  message: ExternalMessageUpdateStyleList,
  appContext: AppContextType
) => {
  const { setStyleList } = appContext;
  setStyleList(message.styleList);
};
