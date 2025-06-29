import { RuntimeSyncedResources } from "../RuntimeSyncedResources";
import { Message } from "./Message";

export type SyncedResourceType =
    | "strokeStyles"
    | "virtualProfiles"

export interface MessageSaveSyncedResource extends Message {
    syncedResources: RuntimeSyncedResources;
}