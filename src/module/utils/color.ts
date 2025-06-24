/**
 * Converts RGB values (0-1) to a hexadecimal color string.
 *
 * @param {number} r - Red component (0 to 1).
 * @param {number} g - Green component (0 to 1).
 * @param {number} b - Blue component (0 to 1).
 * @param {boolean} [withHashTag=true] - Whether to prepend a '#' to the hex string.
 * @returns {string} Hexadecimal color string.
 */
export function rgbToHex(
    r: number,
    g: number,
    b: number,
    withHashTag: boolean = true
): string {
    // Ensure the RGB values are within the valid range
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    // Convert each component to a 2-digit hexadecimal string
    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");

    if (withHashTag) {
        // Concatenate the hex components and prepend a '#'
        return `#${hexR}${hexG}${hexB}`.toUpperCase();
    } else {
        // Concatenate the hex components and prepend a '#'
        return `${hexR}${hexG}${hexB}`.toUpperCase();
    }
}

export function rgbToHexWithTransparency(
    r: number,
    g: number,
    b: number,
    opacity: number
): string {
    // Ensure the RGB values are within the valid range
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    opacity = Math.round(opacity * 255);

    // Convert each component to a 2-digit hexadecimal string
    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");
    const hexA = opacity.toString(16).padStart(2, "0");

    // Concatenate the hex components and prepend a '#'
    return `#${hexR}${hexG}${hexB}${hexA}`;
}

/**
 * Converts RGB values (0-1) to an RGB string.
 *
 * @param {number} r - Red component (0 to 1).
 * @param {number} g - Green component (0 to 1).
 * @param {number} b - Blue component (0 to 1).
 * @returns {string} RGB color string with RGB scaled to 0-255.
 */
export function rgbToRGB255(r: number, g: number, b: number): string {
    const newR = Math.round(r * 255);
    const newG = Math.round(g * 255);
    const newB = Math.round(b * 255);

    return `rgb(${newR}, ${newG}, ${newB})`;
}

/**
 * Converts RGB values (0-1) and an alpha value (0-1) to an RGBA string.
 *
 * @param {number} r - Red component (0 to 1).
 * @param {number} g - Green component (0 to 1).
 * @param {number} b - Blue component (0 to 1).
 * @param {number} a - Alpha component (0 to 1).
 * @returns {string} RGBA color string with RGB scaled to 0-255 and alpha rounded to two decimal places.
 */
export function rgbToRGBA255(
    r: number,
    g: number,
    b: number,
    a: number
): string {
    const newR = Math.round(r * 255);
    const newG = Math.round(g * 255);
    const newB = Math.round(b * 255);
    const newA = a.toFixed(2); // Round alpha to two decimal places

    return `rgba(${newR}, ${newG}, ${newB}, ${newA})`;
}

// Utility function to convert RGBA from 0-255 range to 0-1 range
export function convertColorRange(rgba: {
    r: number;
    g: number;
    b: number;
    a: number;
}): RGBA {
    return {
        r: rgba.r / 255,
        g: rgba.g / 255,
        b: rgba.b / 255,
        a: rgba.a,
    };
}

export function hexToRgb(hex: string): RGB {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, "");

    // Parse the r, g, b values
    const bigint = parseInt(hex, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;

    return { r, g, b };
}

export function hexToRgba(hex: string, opacity: number): RGBA | null {
    // Check if opacity is within the valid range
    if (opacity < 0 || opacity > 1) {
        console.error("Opacity must be between 0 and 1.");
        return null;
    }

    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, "");

    // Parse the r, g, b values
    const bigint = parseInt(hex, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;

    // Return the RGBA value
    return { r, g, b, a: opacity };
}