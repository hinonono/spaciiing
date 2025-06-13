import * as typeChecking from "../typeChecking";

/**
 * Generic helper to recursively resolve a value to its actual (non-alias) form.
 * This supports values that may be aliases to other variable values, and uses the
 * provided functions to check, convert, and recursively resolve values of a specific type.
 *
 * @template T - The final resolved value type (e.g., RGBA, number, string).
 * @param value - The value to resolve. May be a direct value or a variable alias.
 * @param isTargetType - A function to check if the value is of the expected type.
 * @param convertToTargetType - A function to convert the value to the desired type if needed.
 * @param recursiveResolver - The same function passed recursively to resolve alias references.
 * @returns A Promise resolving to the final value of type T or null if resolution fails.
 */
async function resolveToActualValue<T>(
    value: any,
    isTargetType: (v: any) => boolean,
    convertToTargetType: (v: any) => T,
    recursiveResolver: (v: any) => Promise<T | null>
): Promise<T | null> {
    if (typeChecking.isVariableAliasType(value)) {
        const aliasVariable = await figma.variables.getVariableByIdAsync(value.id);
        if (!aliasVariable) {
            console.warn(`Alias variable with ID ${value.id} not found.`);
            return null;
        }

        const firstModeValue = Object.values(aliasVariable.valuesByMode)[0];
        if (!firstModeValue) {
            console.warn(`Alias variable ${aliasVariable.name} has no valid modes.`);
            return null;
        }

        return await recursiveResolver(firstModeValue);
    } else if (isTargetType(value)) {
        return convertToTargetType(value);
    } else {
        console.warn(`Unexpected value type encountered: ${JSON.stringify(value)}`);
        return null;
    }
}

export async function resolveToActualRgbaValue(value: any): Promise<RGBA | null> {
    return resolveToActualValue<RGBA>(
        value,
        (v) => typeChecking.isRGBType(v) || typeChecking.isRGBAType(v),
        (v) => typeChecking.isRGBType(v) ? { ...v, a: 1 } : v,
        resolveToActualRgbaValue
    );
}

export async function resolveToActualNumberValue(value: any): Promise<number | null> {
    return resolveToActualValue<number>(
        value,
        typeChecking.isFloatType,
        (v) => v,
        resolveToActualNumberValue
    );
}

export async function resolveToActualStringValue(value: any): Promise<string | null> {
    return resolveToActualValue<string>(
        value,
        typeChecking.isStringType,
        (v) => v,
        resolveToActualStringValue
    );
}