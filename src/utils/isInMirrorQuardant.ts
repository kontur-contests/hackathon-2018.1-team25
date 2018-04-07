import { PointCoordinates } from '../Store/MyasoStore';

export function isInMirrorQuardant(firstPoint: PointCoordinates,
                                   secondPoint: PointCoordinates): boolean {
    return firstPoint.x > 0 !== secondPoint.x > 0
        && firstPoint.y > 0 !== secondPoint.y > 0;
}