import { AliasResources, MessageStyleIntroducer, PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import * as util from "../util"

import * as CLVar from "../catalogue/catalogueVariable";
import * as CLItemLink from "../catalogue/catalogueItemLink"
import * as CLExplanationItem from "../catalogue/catalogueExplanationItem"
import * as CLExplanationWrapper from "../catalogue/catalogueExplanationWrapper";

import * as styledTextSegments from "../styledTextSegments";
import * as typeChecking from "../typeChecking";
import { CatalogueLocalizationResources } from "../../types/CatalogueLocalization";
import { createCatalogueLocalizationResource } from "../catalogue/catalogueLocalization";

export async function applyStyleIntroducerForVariable(
    message: MessageStyleIntroducer
) {
    const { styleSelection, styleMode, form, lang } = message;

    if (!styleSelection) { throw new Error("styleSelection is required"); }
    const { title, scopes } = styleSelection;
    const viewport = util.getCurrentViewport();
    const isCatalogueItemLinkFeatureAvailable = CLItemLink.checkCatalogueItemLinkFeatureAvailability();

    const fontNameRegular = { family: "Inter", style: "Regular" };
    const fontNameSemi = { family: "Inter", style: "Semi Bold" };
    const fontsToLoad = [fontNameRegular, fontNameSemi];
    await Promise.all(fontsToLoad.map((font) => figma.loadFontAsync(font)));

    const lr: CatalogueLocalizationResources = createCatalogueLocalizationResource(lang);

    const localVariables = await getLocalVariables(styleMode);
    const selectedVariables = await getSelectedVariables(scopes, localVariables);
    const modeNames = await getModeNames(selectedVariables);

    const explanationItems = await createExplanationItemsHandler(
        form,
        styleMode,
        fontNameRegular,
        localVariables,
        selectedVariables,
        modeNames,
        isCatalogueItemLinkFeatureAvailable
    )
    if (explanationItems.length === 0) { throw new Error("Termination due to explanationItems length is 0."); }

    const wrapperTitle = title == "" ? "Variables" : title
    const titleSecondary = "Catalogue";
    const explanationWrapper = CLExplanationWrapper.createExplanationWrapper(
        lr,
        form,
        explanationItems,
        wrapperTitle,
        titleSecondary,
        fontNameSemi,
        isCatalogueItemLinkFeatureAvailable.availability,
        modeNames
    )

    CLExplanationWrapper.setUpWrapper(explanationWrapper, viewport);

    figma.currentPage.appendChild(explanationWrapper);
    figma.currentPage.selection = [explanationWrapper];
}

async function getLocalVariables(styleMode: StyleMode) {
    let localVariables;
    switch (styleMode) {
        case "COLOR":
            localVariables = await figma.variables.getLocalVariablesAsync("COLOR");
            break;
        case "FLOAT":
            localVariables = await figma.variables.getLocalVariablesAsync("FLOAT");
            break;
        case "STRING":
            localVariables = await figma.variables.getLocalVariablesAsync("STRING");
            break;
        default:
            throw new Error("Invalid style type");
    }
    if (!localVariables) { throw new Error("Termination due to styleList is undefined."); }

    return localVariables;
}

async function getSelectedVariables(scopes: string[], localVariables: Variable[]) {
    const selectedVariables = localVariables.filter((variable) =>
        scopes.includes(variable.id)
    );

    return selectedVariables;
}

async function getModeNames(selectedVariables: Variable[]) {
    const variableCollectionId = selectedVariables[selectedVariables.length - 1].variableCollectionId;

    const variableCollection = await figma.variables.getVariableCollectionByIdAsync(variableCollectionId);
    if (!variableCollection) { throw new Error("Termination due to variableCollection is null."); }

    const modeNames = variableCollection.modes.map((mode) => mode.name);

    return modeNames
}

async function createExplanationItemsHandler(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    localVariables: Variable[],
    selectedVariables: Variable[],
    modeNames: string[],
    isCatalogueItemLinkFeatureAvailable: {
        availability: boolean;
        url: string | null;
    }
): Promise<FrameNode[]> {
    if (styleMode === "COLOR") {
        const items = await createItemColor(
            form,
            styleMode,
            fontName,
            localVariables,
            selectedVariables,
            modeNames,
            isCatalogueItemLinkFeatureAvailable
        );
        return items;

    } else if (styleMode === "FLOAT") {
        const items = await createItemNumber(
            form,
            styleMode,
            fontName,
            localVariables,
            selectedVariables,
            modeNames,
            isCatalogueItemLinkFeatureAvailable
        );
        return items;

    } else if (styleMode === "STRING") {
        const items = await createItemString(
            form,
            styleMode,
            fontName,
            localVariables,
            selectedVariables,
            modeNames,
            isCatalogueItemLinkFeatureAvailable
        );
        return items;

    } else {
        throw new Error(`${styleMode} is not supported on VARIABLE type.`)
    }
}

async function createGenericItem<T>(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    localVariables: Variable[],
    selectedVariables: Variable[],
    modeNames: string[],
    resolveValueFn: (value: VariableValue) => Promise<T | null>,
    previewKey: "colors" | "numbers" | "strings",
    isCatalogueItemLinkFeatureAvailable: {
        availability: boolean;
        url: string | null;
    }
): Promise<FrameNode[]> {
    const explanationItems: FrameNode[] = [];

    for (const variable of selectedVariables) {
        const aliasName: (string | undefined)[] = [];
        const aliasVariableIds: (string | undefined)[] = [];
        const values: (T | null)[] = [];

        for (const [_, value] of Object.entries(variable.valuesByMode)) {
            if (!typeChecking.isVariableAliasType(value)) {
                aliasName.push(undefined);
                aliasVariableIds.push(undefined);
            } else {
                const aliasVariable = localVariables.find((v) => v.id === value.id);
                if (!aliasVariable) {
                    throw new Error("Termination due to aliasVariable is null.");
                }
                aliasName.push(aliasVariable.name);
                aliasVariableIds.push(aliasVariable.id);
            }

            const resolvedValue = await resolveValueFn(value);
            values.push(resolvedValue);
        }

        const filteredValues = values.filter((v): v is T => v !== null);

        const { id, description, name } = variable;
        const title = name.split("/").pop() || "";

        let previewResources: PreviewResources | null;
        if (styleMode === "COLOR") {
            previewResources = {
                colors: {
                    type: "SOLID",
                    opacity: 1,
                    colors: filteredValues as RGBA[],
                }
            }
        } else {
            previewResources = {
                [previewKey]: filteredValues
            } as PreviewResources;
        }


        const aliasResources: AliasResources = {
            aliasNames: aliasName,
            variableModes: modeNames,
            aliasVariableIds: aliasVariableIds
        };

        const explanationItem = CLExplanationItem.createExplanationItem(
            form,
            styleMode,
            id,
            title,
            description,
            fontName,
            previewResources,
            aliasResources,
        );

        explanationItem.primaryAxisSizingMode = "AUTO";
        explanationItem.counterAxisSizingMode = "AUTO";

        if (isCatalogueItemLinkFeatureAvailable.availability && isCatalogueItemLinkFeatureAvailable.url) {
            const url = styledTextSegments.generateFigmaUrlWithNodeId(isCatalogueItemLinkFeatureAvailable.url, explanationItem.id);
            styledTextSegments.writeCatalogueItemUrlToRoot(variable.id, url);
        }

        explanationItems.push(explanationItem);
    }

    return explanationItems;
}

async function createItemColor(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    localVariables: Variable[],
    selectedVariables: Variable[],
    modeNames: string[],
    isCatalogueItemLinkFeatureAvailable: {
        availability: boolean;
        url: string | null;
    }
): Promise<FrameNode[]> {
    return createGenericItem<RGBA>(
        form,
        styleMode,
        fontName,
        localVariables,
        selectedVariables,
        modeNames,
        CLVar.resolveToActualRgbaValue,
        "colors",
        isCatalogueItemLinkFeatureAvailable
    );
}

async function createItemNumber(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    localVariables: Variable[],
    selectedVariables: Variable[],
    modeNames: string[],
    isCatalogueItemLinkFeatureAvailable: {
        availability: boolean;
        url: string | null;
    }
): Promise<FrameNode[]> {
    return createGenericItem<number>(
        form,
        styleMode,
        fontName,
        localVariables,
        selectedVariables,
        modeNames,
        CLVar.resolveToActualNumberValue,
        "numbers",
        isCatalogueItemLinkFeatureAvailable
    );
}

async function createItemString(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    localVariables: Variable[],
    selectedVariables: Variable[],
    modeNames: string[],
    isCatalogueItemLinkFeatureAvailable: {
        availability: boolean;
        url: string | null;
    }
): Promise<FrameNode[]> {
    return createGenericItem<string>(
        form,
        styleMode,
        fontName,
        localVariables,
        selectedVariables,
        modeNames,
        CLVar.resolveToActualStringValue,
        "strings",
        isCatalogueItemLinkFeatureAvailable
    );
}

