import { LicenseManagement } from "../types/LicenseManagement";
import { Dimension, MessageAspectRatio } from "../types/Message";

export const applyAspectRatio = (
  widthRatio: number,
  heightRatio: number,
  isCustom: boolean,
  lockedDimension: Dimension
) => {
  const message: MessageAspectRatio = {
    lockedDimension: lockedDimension,
    module: "AspectRatioHelper",
    phase: "Actual",
    direction: "Inner",
    isCustomAspectRatio: isCustom,
    widthRatio: widthRatio,
    heightRatio: heightRatio,
  };
  parent.postMessage(
    {
      pluginMessage: message,
    },
    "*"
  );
};

export const checkProFeatureAccessibleForUser = (
  license: LicenseManagement
): boolean => {
  const isDevelopment = process.env.REACT_APP_ENV === "development";
  if (license.isLicenseActive == false && isDevelopment == false) {
    return false;
  } else {
    return true;
  }
};

export const resolveContextMenuPos = (
  x: number,
  y: number,
  outerContainerRect: DOMRect
): { left: number; top: number } => {
  let menuX = x - outerContainerRect.left;
  let menuY = y - outerContainerRect.top;

  if (x + 120 > outerContainerRect.width) {
    menuX = x - outerContainerRect.left - 120;
  }

  return {
    left: menuX,
    top: menuY,
  };
};
