import { StyleListItemFrontEnd, NestedStructure } from "../types/General";

export const buildNestedStructure = (
  data: StyleListItemFrontEnd[]
): NestedStructure => {
  const root: NestedStructure = {};

  data.forEach(({ id, name }) => {
    const parts = name.split("/").map((part) => part.trim());
    let currentLevel = root;

    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        currentLevel[part] =
          index === parts.length - 1 ? { id } : { children: {} };
      }
      currentLevel = currentLevel[part].children as NestedStructure;
    });
  });

  return root;
};
