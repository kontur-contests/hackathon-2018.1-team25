import { hasRectanglesIntersection } from '../../utils/hasRectanglesIntersection';
import { MyasoStore, PointCoordinates, Size, Unit, UnitName } from '../MyasoStore';

export function getUnitsInRectangle({
                                     units,
                                 }: MyasoStore,
                                    nextSquare: PointCoordinates & Size): Unit<UnitName>[] {
    return units
        .filter((unit) => hasRectanglesIntersection(nextSquare, unit));
}
