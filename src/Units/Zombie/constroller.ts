import { UnitName } from '../../Store/MyasoStore';
import { getAngleRelativeToOrigin } from '../../utils/getAngleRelativeToOrigin';
import { getPointRelativeToOriginByAngleAndDistance } from '../../utils/getPointRelativeToOriginByAngleAndDistance';
import { UnitController } from '../UnitController';

export const zombieConrtoller: UnitController<UnitName.Zombie> = (index, diff, unit, store) => {
    const rotation = getAngleRelativeToOrigin(unit) + 180;
    const nextPosition = getPointRelativeToOriginByAngleAndDistance(diff / 200, rotation);

    unit.rotation = rotation;

    const nextPoint = {
        x: unit.x + nextPosition.x,
        y: unit.y + nextPosition.y,
    };

    unit.x = nextPoint.x;
    unit.y = nextPoint.y;

    return store;
};