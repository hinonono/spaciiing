import { AppContextType } from './../AppProvider';
import { ExternalMessage } from "../types/Messages/ExternalMessage";
import { ExternalMessageShowNestedComponentProperties, ExternalMessageUpdateReferenceObject, MessagePropertyClipboard, PasteBehavior } from "../types/Messages/MessagePropertyClipboard";
import { ComponentPropertiesFrontEnd, PropertyClipboardSupportedProperty, ReferenceObject } from "../types/PropertClipboard";
import { checkProFeatureAccessibleForUser } from './utilFrontEnd';
import * as pluginConfig from "../pluginConfig.json";

export function propertyClipboardHandler(message: ExternalMessage, context: AppContextType) {
    if (message.mode && message.mode === "ShowExtractedProperties") {
        const castedMessage = message as ExternalMessageShowNestedComponentProperties
        showExtractedPropertiesHandler(castedMessage.extractedProperties, context)
    } else if (message.mode && message.mode === "UpdateReferenceObject") {
        const castedMessage = message as ExternalMessageUpdateReferenceObject
        setReferenceObjectHandler(castedMessage.referenceObject, context)
    }
}

function setReferenceObjectHandler(referenceObject: ReferenceObject, context: AppContextType) {
    context.setReferenceObject(referenceObject);
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
                initialTime: pluginConfig.freeUserWaitingTime,
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
    pasteBehavior: PasteBehavior,
) {
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime,
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
        referenceObject: appContext.referenceObject
    };

    parent.postMessage({ pluginMessage: message, }, "*");
};

export function pasteInstancePropertyToObject(
    isRealCall: boolean,
    appContext: AppContextType,
    properties: ComponentPropertiesFrontEnd[],
) {
    if (!isRealCall) {
        if (!checkProFeatureAccessibleForUser(appContext.licenseManagement)) {
            appContext.setFreeUserDelayModalConfig({
                show: true,
                initialTime: pluginConfig.freeUserWaitingTime,
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
        instanceProperty: properties,
        referenceObject: appContext.referenceObject
    };

    parent.postMessage({ pluginMessage: message, }, "*");
};

interface PropertyClipboardOption {
    lableKey: string,
    keys: PropertyClipboardSupportedProperty[],
    useModal: boolean
}

export interface PropertyClipboardCategory {
    titleKey: string
    applyAllKeys: PropertyClipboardSupportedProperty[]
    useModal: boolean
    items: PropertyClipboardOption[]
}

interface PropertyClipboardOptions {
    size: PropertyClipboardCategory;
    appearance: PropertyClipboardCategory;
    typography: PropertyClipboardCategory;
    autoLayout: PropertyClipboardCategory;
    fill: PropertyClipboardCategory;
    stroke: PropertyClipboardCategory;
    effect: PropertyClipboardCategory;
    other: PropertyClipboardCategory;
}

const strokeOptions: PropertyClipboardOption[] = [
    {
        lableKey: "term:color",
        keys: ["STROKES"],
        useModal: false
    },
    {
        lableKey: "term:position",
        keys: ["STROKE_ALIGN"],
        useModal: false
    },
    {
        lableKey: "term:strokeWeight",
        keys: ["STROKE_WEIGHT"],
        useModal: false
    },
    {
        lableKey: "term:strokeStyle",
        keys: ["STROKE_STYLE"],
        useModal: false
    },
    {
        lableKey: "term:strokeDash",
        keys: ["STROKE_DASH"],
        useModal: false
    },
    {
        lableKey: "term:strokeGap",
        keys: ["STROKE_GAP"],
        useModal: false
    },
    {
        lableKey: "term:dashCap",
        keys: ["STROKE_CAP"],
        useModal: false
    },
    {
        lableKey: "term:join",
        keys: ["STROKE_JOIN"],
        useModal: false
    },
    {
        lableKey: "term:miterAngle",
        keys: ["STROKE_MITER_LIMIT"],
        useModal: false
    },
];

const effectOptions: PropertyClipboardOption[] = [
    {
        lableKey: "term:innerShadow",
        keys: ["EFFECT_INNER_SHADOW"],
        useModal: true,
    },
    {
        lableKey: "term:dropShadow",
        keys: ["EFFECT_DROP_SHADOW"],
        useModal: true,
    },
    {
        lableKey: "term:layerBlur",
        keys: ["EFFECT_LAYER_BLUR"],
        useModal: true,
    },
    {
        lableKey: "term:backgroundBlur",
        keys: ["EFFECT_BACKGROUND_BLUR"],
        useModal: true,
    },
    // {
    //     lableKey: "term:noise",
    //     keys: ["EFFECT_NOISE"],
    //     useModal: true,
    // },
    // {
    //     lableKey: "term:texture",
    //     keys: ["EFFECT_TEXTURE"],
    //     useModal: true,
    // },
];

const fillOptions: PropertyClipboardOption[] = [
    {
        lableKey: "term:solidFill",
        keys: ["FILL_SOLID"],
        useModal: true,
    },
    {
        lableKey: "term:gradientFill",
        keys: ["FILL_GRADIENT"],
        useModal: true,
    },
    {
        lableKey: "term:imageFill",
        keys: ["FILL_IMAGE"],
        useModal: true,
    },
    {
        lableKey: "term:videoFill",
        keys: ["FILL_VIDEO"],
        useModal: true,
    },
];

const appearanceOptions: PropertyClipboardOption[] = [
    {
        lableKey: "term:opacity",
        keys: ["LAYER_OPACITY"],
        useModal: false,
    },
    {
        lableKey: "term:cornerRadius",
        keys: ["LAYER_CORNER_RADIUS"],
        useModal: false,
    },
    {
        lableKey: "term:blendMode",
        keys: ["LAYER_BLEND_MODE"],
        useModal: false,
    },
];

const otherOptions: PropertyClipboardOption[] = [
    {
        lableKey: "term:exportSettings",
        keys: ["EXPORT_SETTINGS"],
        useModal: true,
    }
];

const sizeOptions: PropertyClipboardOption[] = [
    {
        lableKey: "term:width",
        keys: ["WIDTH"],
        useModal: false,
    },
    {
        lableKey: "term:height",
        keys: ["HEIGHT"],
        useModal: false,
    }
];

const typographyOptions: PropertyClipboardOption[] = [
    {
        lableKey: "term:fontName",
        keys: ["FONT_NAME"],
        useModal: false
    },
    {
        lableKey: "term:fontSize",
        keys: ["FONT_SIZE"],
        useModal: false
    },
    {
        lableKey: "term:lineHeight",
        keys: ["LINE_HEIGHT"],
        useModal: false
    },
    {
        lableKey: "term:letterSpacing",
        keys: ["LETTER_SPACING"],
        useModal: false
    },
    {
        lableKey: "term:alignment",
        keys: ["ALIGNMENT"],
        useModal: false
    }
]

const autolayoutOptions: PropertyClipboardOption[] = [
    {
        lableKey: "term:layoutMode",
        keys: ["LAYOUT_MODE"],
        useModal: false
    },
    {
        lableKey: "term:autoLayoutAlignment",
        keys: ["AUTOLAYOUT_ALIGNMENT"],
        useModal: false
    },
    {
        lableKey: "term:autoLayoutGap",
        keys: ["AUTOLAYOUT_GAP"],
        useModal: false
    },
    {
        lableKey: "term:autoLayoutPaddingHorizontal",
        keys: ["AUTOLAYOUT_PADDING_HORITONTAL"],
        useModal: false
    },
    {
        lableKey: "term:autoLayoutPaddingVertical",
        keys: ["AUTOLAYOUT_PADDING_VERTICAL"],
        useModal: false
    },
    {
        lableKey: "term:autoLayoutClipContent",
        keys: ["AUTOLAYOUT_CLIP_CONTENT"],
        useModal: false
    },
]


export const propertyClipboardOptions: PropertyClipboardOptions = {
    size: {
        titleKey: "term:size",
        applyAllKeys: ["WIDTH_AND_HEIGHT"],
        useModal: false,
        items: sizeOptions
    },
    appearance: {
        titleKey: "term:appearance",
        applyAllKeys: [
            "LAYER_OPACITY",
            "LAYER_CORNER_RADIUS",
            "LAYER_BLEND_MODE",
        ],
        useModal: false,
        items: appearanceOptions
    },
    typography: {
        titleKey: "term:typography",
        applyAllKeys: [
            "FONT_NAME",
            "FONT_SIZE",
            "LINE_HEIGHT",
            "LETTER_SPACING",
            "ALIGNMENT"
        ],
        useModal: false,
        items: typographyOptions
    },
    autoLayout: {
        titleKey: "term:autoLayout",
        applyAllKeys: [
            "LAYOUT_MODE",
            "AUTOLAYOUT_ALIGNMENT",
            "AUTOLAYOUT_GAP",
            "AUTOLAYOUT_PADDING_HORITONTAL",
            "AUTOLAYOUT_PADDING_VERTICAL",
            "AUTOLAYOUT_CLIP_CONTENT"
        ],
        useModal: false,
        items: autolayoutOptions,
    },
    fill: {
        titleKey: "term:allFills",
        applyAllKeys: ["FILL_ALL"],
        useModal: true,
        items: fillOptions
    },
    stroke: {
        titleKey: "term:stroke",
        applyAllKeys: [
            "STROKES",
            "STROKE_ALIGN",
            "STROKE_WEIGHT",
            "STROKE_STYLE",
            "STROKE_DASH",
            "STROKE_GAP",
            "STROKE_CAP",
            "STROKE_JOIN",
            "STROKE_MITER_LIMIT",
        ],
        useModal: false,
        items: strokeOptions
    },
    effect: {
        titleKey: "term:effect",
        applyAllKeys: ["EFFECT_ALL"],
        useModal: true,
        items: effectOptions
    },
    other: {
        titleKey: "term:others",
        applyAllKeys: [],
        useModal: false,
        items: otherOptions
    }
}