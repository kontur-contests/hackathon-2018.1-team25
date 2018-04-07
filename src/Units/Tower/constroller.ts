import { UnitName } from '../../Store/MyasoStore';
import { UnitController } from '../UnitController';

export const towerConrtoller: UnitController<UnitName.Tower> = (index, diff, unit, store) => {
    return store;
};