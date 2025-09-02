import { RuntimeSyncedResources } from "../RuntimeSyncedResources";
import { ExternalMessage } from "./ExternalMessage";

export interface ExternalMessageUpdateRuntimeSyncedResources extends ExternalMessage {
  runtimeSyncedResources: RuntimeSyncedResources;
}