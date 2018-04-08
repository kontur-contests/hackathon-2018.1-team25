import { UnitName } from './Store/MyasoStore';
import { bazookaConrtoller } from './Units/Bazooka/constroller';
import { bubbleConrtoller } from './Units/Bubble/constroller';
import { machinegunConrtoller } from './Units/Machinegun/constroller';
import { pistonConrtoller } from './Units/Piston/constroller';
import { pooConrtoller } from './Units/Poo/constroller';
import { towerConrtoller } from './Units/Tower/constroller';
import { UnitController } from './Units/UnitController';
import { zombieConrtoller } from './Units/Zombie/constroller';

export const UnitControllers: {
    [key in UnitName]: UnitController<key>;
} = {
    [UnitName.Zombie]: zombieConrtoller,
    [UnitName.Poo]: pooConrtoller,
    [UnitName.Bubble]: bubbleConrtoller,
    [UnitName.Tower]: towerConrtoller,
    [UnitName.Piston]: pistonConrtoller,
    [UnitName.Bazooka]: bazookaConrtoller,
    [UnitName.Machinegun]: machinegunConrtoller,
};
