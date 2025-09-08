export function mapToUnitRange(value: number): number {
    if (value < 0) {
        return 0;
    } else if (value > 255) {
        return 1;
    } else {
        return value / 255;
    }
}