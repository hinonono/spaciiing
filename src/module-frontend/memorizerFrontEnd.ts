import { useAppContext } from "../AppProvider";
import { ExternalMessageUpdateFrame } from "../types/Messages/MessageMemorizer";

export const memorizerHandler = (message: ExternalMessageUpdateFrame) => {
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
        message.memorizedObjectHeight
      );
      break;
    case "UpdateMemorizedName":
      if (message.memorizedName == undefined) {
        return;
      }
      updateMemorizedName(message.memorizedName);
      break;
    default:
      break;
  }
};

const updateMemorizedObjectSize = (width: string, height: string) => {
  const { setMemorizedObjectWidth, setMemorizedObjectHeight } = useAppContext();

  if (width !== "") {
    setMemorizedObjectWidth(Number(width));
  }

  if (height !== "") {
    setMemorizedObjectHeight(Number(height));
  }
};

const updateMemorizedName = (name: string) => {
  const { setMemorizedObjectName } = useAppContext();
  
  setMemorizedObjectName(name);
};
