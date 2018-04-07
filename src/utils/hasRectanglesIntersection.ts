import { PointCoordinates, Size } from '../Store/MyasoStore';
import { hasSlicesIntersections } from './hasSlicesIntersections';

export function hasRectanglesIntersection(firstSquare: PointCoordinates & Size,
                                          secondSquare: PointCoordinates & Size): boolean {
    const firstXEnd = firstSquare.x + firstSquare.width;
    const firstYEnd = firstSquare.y + firstSquare.height;

    const secondXEnd = secondSquare.x + secondSquare.width;
    const secondYEnd = secondSquare.y + secondSquare.height;

    return hasSlicesIntersections(
        {start: firstSquare.x, end: firstXEnd},
        {start: secondSquare.x, end: secondXEnd},
    ) && hasSlicesIntersections(
        {start: firstSquare.y, end: firstYEnd},
        {start: secondSquare.y, end: secondYEnd},
    );
}