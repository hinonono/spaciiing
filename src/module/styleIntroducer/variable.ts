import { AliasResources, MessageStyleIntroducer, PreviewResources, StyleForm, StyleMode } from "../../types/Messages/MessageStyleIntroducer";
import { utils } from "../utils";
import * as styledTextSegments from "../styledTextSegments";
import * as typeChecking from "../typeChecking";
import { CatalogueLocalizationResources } from "../../types/CatalogueLocalization";
import { CatalogueKit } from "../catalogue";
import { semanticTokens } from "../tokens";
import { CYAliasVariable } from "../../types/CYAliasVariable";

export async function applyStyleIntroducer(
    message: MessageStyleIntroducer
) {
    const { styleSelection, styleMode, form, lang } = message;

    if (!styleSelection) { throw new Error("styleSelection is required"); }
    const { title, scopes } = styleSelection;

    await utils.editor.loadFont([
        semanticTokens.fontFamily.regular,
        semanticTokens.fontFamily.semiBold
    ]);

    const lr: CatalogueLocalizationResources = CatalogueKit.localizer.createLocalizationResource(lang);

    const localVariables = await getLocalVariables(styleMode);
    const selectedVariables = await getSelectedVariables(scopes, localVariables);
    const modeNames = await getModeNames(selectedVariables);

    const libraryVariables = await getLibraryVariables();

    const explanationItems = await createExplanationItemsHandler(
        form,
        styleMode,
        semanticTokens.fontFamily.regular,
        libraryVariables,
        localVariables,
        selectedVariables,
        modeNames,
    )
    if (explanationItems.length === 0) { throw new Error("Termination due to explanationItems length is 0."); }

    const wrapperTitle = title == "" ? lr.term["variable"] : title
    const titleSecondary = lr.module["moduleCatalogue"];
    const explanationWrapper = await CatalogueKit.wrapper.create(
        lr,
        form,
        explanationItems,
        wrapperTitle,
        titleSecondary,
        semanticTokens.fontFamily.semiBold,
        modeNames
    )

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

async function getLibraryVariables(): Promise<LibraryVariable[]> {
    let libraryVariables: LibraryVariable[] = [];

    let collections: LibraryVariableCollection[] = [];

    // Try to get available collections
    try {
        collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    } catch (error) {
        console.error("Failed to get available library collections:", error);
        return libraryVariables; // Return empty if no collections are available
    }

    for (const collection of collections) {
        try {
            const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection.key);
            libraryVariables.push(...variables);
        } catch (error) {
            console.warn(`Skipping collection "${collection.name}" due to error:`, error);
            // Continue to next collection
        }
    }

    return libraryVariables;
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
    libraryVariables: LibraryVariable[],
    localVariables: Variable[],
    selectedVariables: Variable[],
    modeNames: string[],
): Promise<FrameNode[]> {
    if (styleMode === "COLOR") {
        const items = await createItemColor(
            form,
            styleMode,
            fontName,
            libraryVariables,
            localVariables,
            selectedVariables,
            modeNames,
        );
        return items;

    } else if (styleMode === "FLOAT") {
        const items = await createItemNumber(
            form,
            styleMode,
            fontName,
            libraryVariables,
            localVariables,
            selectedVariables,
            modeNames,
        );
        return items;

    } else if (styleMode === "STRING") {
        const items = await createItemString(
            form,
            styleMode,
            fontName,
            libraryVariables,
            localVariables,
            selectedVariables,
            modeNames,
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
    libraryVariables: LibraryVariable[],
    localVariables: Variable[],
    selectedVariables: Variable[],
    modeNames: string[],
    resolveValueFn: (value: VariableValue) => Promise<T | null>,
    previewKey: "colors" | "numbers" | "strings",
): Promise<FrameNode[]> {
    const explanationItems: FrameNode[] = [];

    for (const variable of selectedVariables) {
        // V38: 使用自製格式進行邏輯優化
        // 這個陣列記錄了單一Variable在各個模式下的索引Variable
        const cyAliasVariables: (CYAliasVariable | null)[] = [];

        // ❌以下兩行即將刪除
        // const aliasName: (string | undefined)[] = [];
        // const aliasVariableIds: (string | undefined)[] = [];

        const values: (T | null)[] = [];

        for (const [_, value] of Object.entries(variable.valuesByMode)) {
            if (!typeChecking.isVariableAliasType(value)) {
                // 如果Varaible的值並非索引其他Variable，設定為null
                cyAliasVariables.push(null);

                // ❌以下兩行即將刪除
                // aliasName.push(undefined);
                // aliasVariableIds.push(undefined);
            } else {
                const findLocalResult = localVariables.find((v) => v.id === value.id);
                // 在library variables裡頭叫做key，但內容大致上等同於id，可是還多了一些奇怪的字，所以用「包含」邏輯來找
                const findLibraryResult = libraryVariables.find((v) => value.id.includes(v.key));

                if (findLocalResult) {
                    // 尋找指定的variables連結的是否是本地variables

                    // ❌以下兩行即將刪除
                    // aliasName.push(findLocalResult.name);
                    // aliasVariableIds.push(findLocalResult.id);

                    // V38：新版邏輯
                    const resolvedValue = await resolveValueFn(value);
                    if (resolvedValue !== null) {
                        cyAliasVariables.push({
                            name: findLocalResult.name,
                            id: findLocalResult.id,
                            value: resolvedValue as VariableValue // ✅ Safe because you've checked null
                        });
                    } else {
                        throw new Error("The founded variable cannot resolve to actual value.");
                    }


                } else if (findLibraryResult) {
                    // 尋找指定的variables連結的是否是library variables

                    // ❌以下兩行即將刪除
                    // aliasName.push(findLibraryResult.name);
                    // aliasVariableIds.push(findLibraryResult.key);

                    // V38：新版邏輯
                    const resolvedValue = await resolveValueFn(value);
                    if (resolvedValue !== null) {
                        cyAliasVariables.push({
                            name: findLibraryResult.name,
                            id: findLibraryResult.key,
                            value: resolvedValue as VariableValue // ✅ Safe because you've checked null
                        });
                    } else {
                        throw new Error("The founded variable cannot resolve to actual value.");
                    }
                } else {
                    throw new Error(`Termination due to aliasVariable being null or not found in both local and library variables.`);
                }
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
            // aliasNames: aliasName,
            variableModes: modeNames,
            // aliasVariableIds: aliasVariableIds,
            cyAliasVariables: cyAliasVariables,
        };

        const explanationItem = CatalogueKit.explanationItemKit.main.createExplanationItem(
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

        //V32: 去除對前端設定中的example file url 的依賴
        styledTextSegments.writeCatalogueItemId(variable.id, explanationItem.id);


        explanationItems.push(explanationItem);
    }

    return explanationItems;
}

async function createItemColor(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    libraryVariables: LibraryVariable[],
    localVariables: Variable[],
    selectedVariables: Variable[],
    modeNames: string[],
): Promise<FrameNode[]> {
    return createGenericItem<RGBA>(
        form,
        styleMode,
        fontName,
        libraryVariables,
        localVariables,
        selectedVariables,
        modeNames,
        CatalogueKit.valueResolver.resolveRGBA,
        "colors",
        // isCatalogueItemLinkFeatureAvailable
    );
}

async function createItemNumber(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    libraryVariables: LibraryVariable[],
    localVariables: Variable[],
    selectedVariables: Variable[],
    modeNames: string[],
): Promise<FrameNode[]> {
    return createGenericItem<number>(
        form,
        styleMode,
        fontName,
        libraryVariables,
        localVariables,
        selectedVariables,
        modeNames,
        CatalogueKit.valueResolver.resolveNum,
        "numbers",
        // isCatalogueItemLinkFeatureAvailable
    );
}

async function createItemString(
    form: StyleForm,
    styleMode: StyleMode,
    fontName: FontName,
    libraryVariables: LibraryVariable[],
    localVariables: Variable[],
    selectedVariables: Variable[],
    modeNames: string[],
): Promise<FrameNode[]> {
    return createGenericItem<string>(
        form,
        styleMode,
        fontName,
        libraryVariables,
        localVariables,
        selectedVariables,
        modeNames,
        CatalogueKit.valueResolver.resolveString,
        "strings",
    );
}

