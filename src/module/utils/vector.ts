import { Coordinates } from "../../types/General";

export function removeDuplicateCoordinatesFromPath(path: Coordinates[]) {
    // Remove consecutive duplicate coordinates
    const uniquePath = path.filter((coord, index, arr) =>
        index === 0 || coord.x !== arr[index - 1].x || coord.y !== arr[index - 1].y
    );
    return uniquePath;
}

export function calcMidpoint(path: Coordinates[]): Coordinates {
    if (path.length === 0) { throw new Error("Path cannot be empty"); }

    const midIndex = Math.floor(path.length / 2);

    if (path.length % 2 === 1) {
        // Odd number of points, return the middle one
        return path[midIndex];
    } else {
        // Even number of points, calculate the midpoint between two middle points
        const point1 = path[midIndex - 1];
        const point2 = path[midIndex];
        return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2,
        };
    }
}