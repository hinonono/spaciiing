import { VirtualProfileGroup, VirtualProfileGroupRaw } from "../types/VirtualProfile";
import { v4 as uuidv4 } from "uuid";

export const transformJsonToGroup = (data:  VirtualProfileGroupRaw): VirtualProfileGroup => {
  return {
    id: uuidv4(), // Generate a unique ID
    title: data.title,
    isCollapsed: false,
    children: data.children.map((child) => ({
      id: uuidv4(), // Generate a unique ID for each child
      title: child.title,
      content: child.content,
    })),
  };
};
