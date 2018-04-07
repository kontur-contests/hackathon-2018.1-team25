import { UnitName } from '../../Store/MyasoStore';
import { UnitController } from '../UnitController';

export const pistonConrtoller: UnitController<UnitName.Piston> = (index, diff, unit, store) => {
    unit.x += 0.1;
    return store;
};