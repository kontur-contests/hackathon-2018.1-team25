import { PointCoordinates } from '../Store/MyasoStore';
import { radiansToDegres } from './radiansToDegrees';


export function getAngleRelativeToOrigin({ x, y }: PointCoordinates): number {
    const tan = y / x;
    const relativeRotation = radiansToDegres(Math.atan(tan));

    const deviation = x > 0
        ? y > 0
            ? 0
            : 360
        : 180;

    return deviation + relativeRotation;
}
