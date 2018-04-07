import { PointCoordinates } from '../Store/MyasoStore';
import { degreesToRadians } from './degreesToRadians';

export function getPointRelativeToOriginByAngleAndDistance(distance: number,
                                                           angle: number): PointCoordinates {
    const radians = degreesToRadians(angle);

    return {
        x: distance * Math.cos(radians),
        y: distance * Math.sin(radians),
    };
}
