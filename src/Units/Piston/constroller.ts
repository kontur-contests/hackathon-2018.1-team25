import { UnitName } from '../../Store/MyasoStore';
import { UnitController } from '../UnitController';

export const pistonConrtoller: UnitController<UnitName.Piston> = (index, diff, unit, store) => {
    return store;
};