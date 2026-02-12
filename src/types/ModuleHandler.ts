import { Message } from "./Messages/Message";

//2026-02-12
//為了瘦身plugin.ts 所宣告的type
export type ModuleHandler<T extends Message = Message> = {
    execute: (message: T) => void;
    getSavedClicks?: (message: T, selectionLength: number) => number;
    shouldIncrementTime?: boolean;
};