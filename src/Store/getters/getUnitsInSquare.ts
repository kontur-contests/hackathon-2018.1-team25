import { hasRectanglesIntersection } from '../../utils/hasRectanglesIntersection';
import { MyasoStore, PointCoordinates, Size, Unit, UnitName } from '../MyasoStore';

export function getUnitsInSquare({
                                     units,
                                 }: MyasoStore,
                                 nextSquare: PointCoordinates & Size): Unit<UnitName>[] {
    return units
        .filter((unit) => hasRectanglesIntersection(nextSquare, unit));
}
