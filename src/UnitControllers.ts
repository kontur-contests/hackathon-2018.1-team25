import { UnitName } from './Store/MyasoStore';
import { towerConrtoller } from './Units/Tower/constroller';
import { UnitController } from './Units/UnitController';
import { zombieConrtoller } from './Units/Zombie/constroller';

export const UnitControllers: {
    [key in UnitName]: UnitController<key>;
} = {
    [UnitName.Zombie]: zombieConrtoller,
    [UnitName.Tower]: towerConrtoller,
};
