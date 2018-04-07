import { UnitName } from '../../Store/MyasoStore';
import { UnitController } from '../UnitController';

export const zombieConrtoller: UnitController<UnitName.Zombie> = (index, diff, unit, store) => {
    console.log(index, diff, store);

    unit.x += 0.01;

    return store;
};