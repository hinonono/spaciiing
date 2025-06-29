import { RuntimeSyncedResources } from "../RuntimeSyncedResources";
import { Message } from "./Message";

export type SyncedResourceType =
    | "strokeStyles"
    | "catalogueReferenceFileURL"

export interface MessageSaveSyncedResource extends Message {
    syncedResources: RuntimeSyncedResources;
}