import { AppContextType } from './../AppProvider';
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { ExternalMessageShowNestedComponentProperties, MessagePropertyClipboard } from "../types/Messages/MessagePropertyClipboard";
import { ComponentPropertiesFrontEnd } from "../types/PropertClipboard";
import { checkProFeatureAccessibleForUser } from './utilFrontEnd';
import * as info from "../info.json";

export function propertyClipboardHandler(message: ExternalMessage, context: AppContextType) {
    if (message.mode && message.mode === "ShowExtractedProperties") {
        const castedMessage = message as ExternalMessageShowNestedComponentProperties
        showExtractedPropertiesHandler(castedMessage.extractedProperties, context)
    }
}

function showExtractedPropertiesHandler(extractedProperties: ComponentPropertiesFrontEnd[], context: AppContextType) {
    context.setExtractedProperties(extractedProperties);
}

export function resetExtractedProperties(context: AppContextType) {
    context.setExtractedProperties([]);
}

export function pasteInstancePropertyToObject(
    isRealCall: boolean,
    appContext: AppContextType,
    properties: ComponentPropertiesFrontEnd[]
) {
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: info.freeUserWaitingTime,
                onProceed: () => pasteInstancePropertyToObject(true, appContext, properties), // Re-invoke with the real call
            });
            return;
        }
    }

    // Real logic for pasting property to the object
    const message: MessagePropertyClipboard = {
        action: "pastePropertyToObject",
        module: "PropertyClipboard",
        phase: "Actual",
        direction: "Inner",
        instanceProperty: properties
    };

    parent.postMessage({ pluginMessage: message, }, "*");
};