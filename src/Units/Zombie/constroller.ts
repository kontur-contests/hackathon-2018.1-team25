import { getUnitsInRectangle } from '../../Store/getters/getUnitsInRectangle';
import { shootUnits } from '../../Store/modificators/shootUnits';
import { UnitName } from '../../Store/MyasoStore';
import { getAngleRelativeToOrigin } from '../../utils/getAngleRelativeToOrigin';
import { getPointRelativeToOriginByAngleAndDistance } from '../../utils/getPointRelativeToOriginByAngleAndDistance';
import { isInMirrorQuardant } from '../../utils/isInMirrorQuardant';
import { UnitController } from '../UnitController';

const SHOOT_INTERVAL = 3000;
const DAMAGE = 1;


export const zombieConrtoller: UnitController<UnitName.Zombie> = (index, diff, unit, store) => {
    const rotation = getAngleRelativeToOrigin(unit) + 180;
    const nextPosition = getPointRelativeToOriginByAngleAndDistance(diff / 200, rotation);

    unit.rotation = rotation;

    const nextPoint = {
        x: unit.x + nextPosition.x,
        y: unit.y + nextPosition.y,
    };

    const intersected = getUnitsInRectangle(store, {
        x: nextPoint.x,
        y: nextPoint.y,
        width: unit.width,
        height: unit.height,
    })
        .filter((intersectedUnit) => intersectedUnit !== unit)
        .filter(({ intersection }) => !intersection);

    // Также обрабатываем, ситуацию, когда зомби перепрыгивает башню из-за большого diff
    if (intersected.length === 0 && !isInMirrorQuardant(unit, nextPoint)) {
        // Если не пересекаемся ни с чем - просто идем вперед
        unit.x = nextPoint.x;
        unit.y = nextPoint.y;
    } else {
        // Если следующая позиция пересекается с башней - грызем ее
        const now = Date.now();
        if (now - unit.lastShootTime > SHOOT_INTERVAL) {
            unit.lastShootTime = now;

            shootUnits(intersected, DAMAGE);
        }
    }

    return store;
};