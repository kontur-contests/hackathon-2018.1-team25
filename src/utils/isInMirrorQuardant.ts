import { PointCoordinates } from '../Store/MyasoStore';

export function isInMirrorQuardant(firstPoint: PointCoordinates,
                                   secondPoint: PointCoordinates,
                                   center: PointCoordinates = {x: 0, y: 0}): boolean {
    const firstRelativeToCenter = {
        x: firstPoint.x - center.x,
        y: firstPoint.y - center.y,
    };
    const secondRelativeToCenter = {
        x: secondPoint.x - center.x,
        y: secondPoint.y - center.y,
    };

    return firstRelativeToCenter.x > 0 !== secondRelativeToCenter.x > 0
        && firstRelativeToCenter.y > 0 !== secondRelativeToCenter.y > 0;
}