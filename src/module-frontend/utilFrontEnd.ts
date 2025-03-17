import { Dimension } from "../types/General";
import { LicenseManagement } from "../types/LicenseManagement";
import { MessageAspectRatio } from "../types/Messages/MessageAspectRatio";

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
  const menuY = y - outerContainerRect.top;

  if (x + 120 > outerContainerRect.width) {
    menuX = x - outerContainerRect.left - 120;
  }

  return {
    left: menuX,
    top: menuY,
  };
};

export const isStringNumber = (str: string): boolean => {
  return !isNaN(Number(str));
};

export const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const hexValue = hex.replace("#", "");
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);

  return {
    r,
    g,
    b,
  };
}
