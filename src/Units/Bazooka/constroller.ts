import { getUnitsInRectangle } from '../../Store/getters/getUnitsInRectangle';
import { shootUnits } from '../../Store/modificators/shootUnits';
import { UnitName } from '../../Store/MyasoStore';
import { blow } from '../../utils/blow';
import { getAngleRelativeToOrigin } from '../../utils/getAngleRelativeToOrigin';
import { getPointRelativeToOriginByAngleAndDistance } from '../../utils/getPointRelativeToOriginByAngleAndDistance';
import { hasRectanglesIntersection } from '../../utils/hasRectanglesIntersection';
import { isInMirrorQuardant } from '../../utils/isInMirrorQuardant';
import { UnitController } from '../UnitController';

const BAZOOKA_DAMAGE = 5;

export const bazookaConrtoller: UnitController<UnitName.Bazooka> = (index, diff, unit, store) => {
    const {
        destination,
    } = unit;

    const positionDiff = {
        x: destination.x - unit.x,
        y: destination.y - unit.y,
    };

    const rotation = getAngleRelativeToOrigin(positionDiff);


    const nextPositionOffset = getPointRelativeToOriginByAngleAndDistance(diff / 20, rotation);
    const nextPosition = {
        x: unit.x + nextPositionOffset.x,
        y: unit.y + nextPositionOffset.y,
    };

    const nextPositionRect = {
        x: nextPosition.x - 0.5,
        y: nextPosition.y - 0.5,
        width: 1,
        height: 1,
    };

    const isOnTarget = isInMirrorQuardant(unit, nextPosition, destination)
        || hasRectanglesIntersection(nextPositionRect, {
            x: destination.x - 1,
            y: destination.y - 1,
            width: 2,
            height: 2,
        });
    if (isOnTarget) {
        const blowingArea = {
            x: nextPosition.x - 3,
            y: nextPosition.y - 3,
            width: 6,
            height: 6,
        };

        const intersections = getUnitsInRectangle(store, blowingArea)
            .filter((targetUnit) => targetUnit !== unit && targetUnit.name !== UnitName.Tower);

        shootUnits(intersections, BAZOOKA_DAMAGE);
        unit.death = true;

        blow(blowingArea);

        return store;
    } else {
        unit.x = nextPosition.x;
        unit.y = nextPosition.y;
    }

    return store;
};