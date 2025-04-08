import * as typeChecking from "../typeChecking";

export async function resolveToActualRgbaValue(
    value: any
): Promise<RGBA | null> {
    if (typeChecking.isVariableAliasType(value)) {
        // Fetch the aliased variable
        const aliasVariable = await figma.variables.getVariableByIdAsync(value.id);
        if (!aliasVariable) {
            console.warn(`Alias variable with ID ${value.id} not found.`);
            return null;
        }

        // Resolve the actual value from the first mode
        const firstModeValue = Object.values(aliasVariable.valuesByMode)[0];
        if (!firstModeValue) {
            console.warn(`Alias variable ${aliasVariable.name} has no valid modes.`);
            return null;
        }

        // Recursively resolve the first mode value without modifying aliasNames further
        return await resolveToActualRgbaValue(firstModeValue);
    } else if (typeChecking.isRGBType(value) || typeChecking.isRGBAType(value)) {
        // Normalize RGB to RGBA or return RGBA directly
        return typeChecking.isRGBType(value) ? { ...value, a: 1 } : value;
    } else {
        console.warn(`Unexpected value type encountered: ${JSON.stringify(value)}`);
        return null;
    }
}

export async function resolveToActualNumberValue(
    value: any
): Promise<number | null> {
    if (typeChecking.isVariableAliasType(value)) {
        // Fetch the aliased variable
        const aliasVariable = await figma.variables.getVariableByIdAsync(value.id);
        if (!aliasVariable) {
            console.warn(`Alias variable with ID ${value.id} not found.`);
            return null;
        }

        // Resolve the actual value from the first mode
        const firstModeValue = Object.values(aliasVariable.valuesByMode)[0];
        if (!firstModeValue) {
            console.warn(`Alias variable ${aliasVariable.name} has no valid modes.`);
            return null;
        }

        // Recursively resolve the first mode value without modifying aliasNames further
        return await resolveToActualNumberValue(firstModeValue);
    } else if (typeChecking.isFloatType(value)) {
        return value;
    } else {
        console.warn(`Unexpected value type encountered: ${JSON.stringify(value)}`);
        return null;
    }
}

export async function resolveToActualStringValue(
    value: any
): Promise<string | null> {
    if (typeChecking.isVariableAliasType(value)) {
        // Fetch the aliased variable
        const aliasVariable = await figma.variables.getVariableByIdAsync(value.id);
        if (!aliasVariable) {
            console.warn(`Alias variable with ID ${value.id} not found.`);
            return null;
        }

        // Resolve the actual value from the first mode
        const firstModeValue = Object.values(aliasVariable.valuesByMode)[0];
        if (!firstModeValue) {
            console.warn(`Alias variable ${aliasVariable.name} has no valid modes.`);
            return null;
        }

        // Recursively resolve the first mode value without modifying aliasNames further
        return await resolveToActualStringValue(firstModeValue);
    } else if (typeChecking.isStringType(value)) {
        return value;
    } else {
        console.warn(`Unexpected value type encountered: ${JSON.stringify(value)}`);
        return null;
    }
}