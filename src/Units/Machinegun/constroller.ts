import { getUnitsInRectangle } from '../../Store/getters/getUnitsInRectangle';
import { shootUnits } from '../../Store/modificators/shootUnits';
import { UnitName } from '../../Store/MyasoStore';
import { getAngleRelativeToOrigin } from '../../utils/getAngleRelativeToOrigin';
import { getPointRelativeToOriginByAngleAndDistance } from '../../utils/getPointRelativeToOriginByAngleAndDistance';
import { hasRectanglesIntersection } from '../../utils/hasRectanglesIntersection';
import { isInMirrorQuardant } from '../../utils/isInMirrorQuardant';
import { UnitController } from '../UnitController';

const PISTON_DAMAGE = 2;

export const machinegunConrtoller: UnitController<UnitName.Machinegun> = (index, diff, unit, store) => {
    const {
        destination,
    } = unit;

    const positionDiff = {
        x: destination.x - unit.x,
        y: destination.y - unit.y,
    };

    const rotation = getAngleRelativeToOrigin(positionDiff);


    const nextPositionOffset = getPointRelativeToOriginByAngleAndDistance(diff / 10, rotation);
    const nextPosition = {
        x: unit.x + nextPositionOffset.x,
        y: unit.y + nextPositionOffset.y,
    }

    const nextPositionRect = {
        x: nextPosition.x - 0.5,
        y: nextPosition.y - 0.5,
        width: 1,
        height: 1,
    };

    const intersections = getUnitsInRectangle(store, nextPositionRect)
        .filter((targetUnit) => targetUnit !== unit && targetUnit.name !== UnitName.Tower);
    if (intersections.length) {
        shootUnits(intersections, PISTON_DAMAGE);
    }

    const isOnTarget = isInMirrorQuardant(unit, nextPosition, destination)
        || hasRectanglesIntersection(nextPositionRect, {
            x: destination.x - 1,
            y: destination.y - 1,
            width: 2,
            height: 2,
        });
    if (isOnTarget) {
        shootUnits(intersections, PISTON_DAMAGE);
        unit.death = true;

        return store;
    } else {
        unit.x = nextPosition.x;
        unit.y = nextPosition.y;
    }

    return store;
};