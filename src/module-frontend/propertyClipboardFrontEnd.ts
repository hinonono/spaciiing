import { AppContextType } from "../AppProvider";
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { ExternalMessageShowNestedComponentProperties } from "../types/Messages/MessagePropertyClipboard";
import { ComponentPropertiesFrontEnd } from "../types/PropertClipboard";

export function propertyClipboardHandler(message: ExternalMessage, context: AppContextType) {
    if (message.mode && message.mode === "ShowExtractedProperties") {
        const castedMessage = message as ExternalMessageShowNestedComponentProperties
        showExtractedPropertiesHandler(castedMessage.extractedProperties, context)
    }
}

function showExtractedPropertiesHandler(extractedProperties: ComponentPropertiesFrontEnd[], context: AppContextType) {
    context.setExtractedProperties(extractedProperties);
}

function resetExtractedProperties(context: AppContextType) {
    context.setExtractedProperties([]);
}