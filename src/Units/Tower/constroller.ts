import { UnitName } from '../../Store/MyasoStore';
import { getAngleRelativeToOrigin } from '../../utils/getAngleRelativeToOrigin';
import { UnitController } from '../UnitController';

export const towerConrtoller: UnitController<UnitName.Tower> = (index, diff, unit, store) => {
    unit.weaponRotation = getAngleRelativeToOrigin(store.hoverPosition);
    unit.weaponName = store.weapon;
    return store;
};