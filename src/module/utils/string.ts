export const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Formats a number to two decimal places if it has decimals;
 * otherwise, returns the number as a string without any decimal places.
 *
 * @param {number} value - The number to format.
 * @returns {string} - The formatted number as a string. If the number is an integer,
 * it is returned without any decimal places. If it has decimals, it is formatted to two decimal places.
 */
export function formatNumberToDecimals(
    value: number,
    decimal: number = 0
): string {
    if (Math.floor(value) === value) {
        return value.toString(); // If the value is an integer, return it as is
    } else {
        return value.toFixed(decimal); // If the value has decimals, format to 2 decimal places
    }
}

/**
 * Get alphapet for nubering purpose.
 * @param index 
 * @param uppercase 
 * @returns 
 */
export function getAlphabet(index: number, uppercase: boolean): string {
    const base = 'a'.charCodeAt(0);
    let result = '';
    index += 0; // Always start from 0 for alphabetic sequences
    while (index >= 0) {
        result = String.fromCharCode(base + (index % 26)) + result;
        index = Math.floor(index / 26) - 1;
    }
    return uppercase ? result.toUpperCase() : result;
}

export function getHanziNumber(index: number, digitMap: string[], unitMap: string[], options?: { omitLeadingOneAtTen?: boolean }): string {
    const number = index + 1;
    const digits = number.toString().split("").reverse();
    let result = "";

    for (let i = digits.length - 1; i >= 0; i--) {
        const digit = parseInt(digits[i]);
        const isMostSignificant = i === digits.length - 1;
        const isTensPlace = i === 1;

        // Omit leading "壹" for "拾" when number is exactly 10~19
        const omitOne = options?.omitLeadingOneAtTen === true &&
            isMostSignificant &&
            isTensPlace &&
            digit === 1;

        if (digit === 0) continue;
        result += (omitOne ? "" : digitMap[digit]) + (unitMap[i] || "");
    }

    return result;
}

export function getComplexHanziNumber(index: number): string {
    const complexDigits = ["", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
    const complexUnits = ["", "拾", "佰", "仟", "萬"];
    return getHanziNumber(index, complexDigits, complexUnits, { omitLeadingOneAtTen: true });
}

export function getSimpleHanziNumber(index: number): string {
    const simpleDigits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const simpleUnits = ["", "十", "百", "千", "萬"];
    return getHanziNumber(index, simpleDigits, simpleUnits, { omitLeadingOneAtTen: true });
}

export function capitalizeFirstLetter(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}