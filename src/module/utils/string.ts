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