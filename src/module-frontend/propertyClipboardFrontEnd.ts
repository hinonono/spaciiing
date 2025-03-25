import { AppContextType } from './../AppProvider';
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { ExternalMessageShowNestedComponentProperties, MessagePropertyClipboard, PasteBehavior } from "../types/Messages/MessagePropertyClipboard";
import { ComponentPropertiesFrontEnd, PropertyClipboardSupportedProperty } from "../types/PropertClipboard";
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

// 記憶所選取的物件作為參考目標
export function setReferenceObject(isRealCall: boolean, appContext: AppContextType) {

    // Reset extracted properties
    appContext.setExtractedProperties([]);

    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: info.freeUserWaitingTime,
                onProceed: () => setReferenceObject(true, appContext), // Re-invoke with the real call
            });
            return;
        }
    }

    // The real logic for setting the reference object
    const message: MessagePropertyClipboard = {
        action: "setReferenceObject",
        module: "PropertyClipboard",
        phase: "Actual",
        direction: "Inner",
    };
    parent.postMessage({ pluginMessage: message, }, "*");
};

// 貼上指定的屬性至所選擇的物件
export function pastePropertyToObject(
    appContext: AppContextType,
    property: PropertyClipboardSupportedProperty[],
    isRealCall: boolean,
    pasteBehavior: PasteBehavior
) {
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: info.freeUserWaitingTime,
                onProceed: () => pastePropertyToObject(appContext, property, true, pasteBehavior), // Re-invoke with the real call
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
        property: property,
        behavior: pasteBehavior,
    };

    parent.postMessage({ pluginMessage: message, }, "*");
};

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
        action: "pasteInstancePropertyToObject",
        module: "PropertyClipboard",
        phase: "Actual",
        direction: "Inner",
        instanceProperty: properties
    };

    parent.postMessage({ pluginMessage: message, }, "*");
};