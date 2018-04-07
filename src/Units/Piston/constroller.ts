import { UnitName } from '../../Store/MyasoStore';
import { getAngleRelativeToOrigin } from '../../utils/getAngleRelativeToOrigin';
import { getPointRelativeToOriginByAngleAndDistance } from '../../utils/getPointRelativeToOriginByAngleAndDistance';
import { UnitController } from '../UnitController';

export const pistonConrtoller: UnitController<UnitName.Piston> = (index, diff, unit, store) => {
    const {
        destination,
    } = unit;

    const positionDiff = {
        x: destination.x - unit.x,
        y: destination.y - unit.y,
    };

    const rotation = getAngleRelativeToOrigin(positionDiff);


    const nextPosition = getPointRelativeToOriginByAngleAndDistance(diff / 20, rotation);

    unit.x = unit.x + nextPosition.x;
    unit.y = unit.y + nextPosition.y;

    return store;
};