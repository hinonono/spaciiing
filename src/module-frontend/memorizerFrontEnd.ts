import { AppContextType } from "../AppProvider";
import { ExternalMessageUpdateFrame } from "../types/Messages/MessageMemorizer";

export const memorizerHandler = (
  message: ExternalMessageUpdateFrame,
  appContext: AppContextType
) => {
  switch (message.mode) {
    case "UpdateFrameToMemorizedSize":
      if (
        message.memorizedObjectHeight == undefined ||
        message.memorizedObjectWidth == undefined
      ) {
        return;
      }
      updateMemorizedObjectSize(
        message.memorizedObjectWidth,
        message.memorizedObjectHeight,
        appContext
      );
      break;
    case "UpdateMemorizedName":
      if (message.memorizedName == undefined) {
        return;
      }
      updateMemorizedName(message.memorizedName, appContext);
      break;
    default:
      break;
  }
};

const updateMemorizedObjectSize = (
  width: string,
  height: string,
  appContext: AppContextType
) => {
  const { setMemorizedObjectWidth, setMemorizedObjectHeight } = appContext;

  if (width !== "") {
    setMemorizedObjectWidth(Number(width));
  }

  if (height !== "") {
    setMemorizedObjectHeight(Number(height));
  }
};

const updateMemorizedName = (name: string, appContext: AppContextType) => {
  const { setMemorizedObjectName } = appContext;

  setMemorizedObjectName(name);
};
